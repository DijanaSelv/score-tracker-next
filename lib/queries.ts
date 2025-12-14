"use server";

import pool from "./db.js";

type PlayerScoreInput = {
  player: { id: number; isNew?: boolean; name: string };
  score: number;
};

/* GET STUFF  */

export async function getBoardGames() {
  const { rows } = await pool.query(
    `SELECT bg.*, COUNT (s.sessionid) AS session_count, MAX(s.date) AS last_played
    FROM boardgame bg 
    LEFT JOIN session s ON bg.boardgameid = s.boardgameid
    GROUP BY bg.boardgameid
    ORDER BY boardgameid`
  );
  return rows;
}

export async function getPlayers() {
  const { rows } = await pool.query(
    `
    SELECT * 
    FROM player
    ORDER BY name
    `
  );
  return rows;
}

export async function getAllSessions() {
  const { rows } = await pool.query(
    `
    SELECT s.date, bg.name as boardgamename, bg.slug as boardgameslug, bg.nopoints as nopoints, 
    COALESCE(
      json_agg(
        json_build_object(
          'name', p.name,
          'slug', p.slug
        )
      ) FILTER (
        WHERE sp.score > 0 
          AND sp.position = (
            SELECT MIN(position)
            FROM sessionplayer
            WHERE sessionid = s.sessionid
              AND score > 0
          )
      ), '[]'
    ) AS winners, 
       s.sessionid as sessionid
    FROM session s
    JOIN boardgame bg on bg.boardgameid = s.boardgameid
    JOIN sessionplayer sp on sp.sessionid = s.sessionid
    JOIN  player p on p.playerid = sp.playerid 
    GROUP BY s.sessionid, s.date, bg.name, bg.slug, bg.nopoints
    ORDER BY s.date DESC
    `
  );

  return rows;
}

export async function getBoardGameBySlug(slug: string) {
  const { rows } = await pool.query("SELECT * FROM boardgame WHERE slug = $1", [
    slug,
  ]);
  return rows[0];
}

export async function getPlayerDataBySlug(slug: string) {
  const { rows } = await pool.query(
    `
    SELECT p.name as playername, bg.slug as boardgameslug , sp.position, s.sessionid, s.date, sp.score, bg.name as boardgamename, bg.nopoints
    FROM player p
    LEFT JOIN sessionplayer sp on sp.playerid = p.playerid
    LEFT JOIN session s on s.sessionid = sp.sessionid
    LEFT JOIN boardgame bg on bg.boardgameid = s.boardgameid
    WHERE p.slug = '${slug}'
    ORDER BY s.date DESC
    `
  );
  return rows;
}

export async function getSessions(boardGameId: number) {
  const { rows } = await pool.query(
    "SELECT * FROM session where boardgameid = $1 ORDER BY date DESC",
    [boardGameId]
  );
  return rows;
}

export async function getSessionDetails(sessionId: number) {
  const { rows } = await pool.query(
    `SELECT sp.score, sp.position, p.name, p.slug
     FROM SessionPlayer sp 
     JOIN Player p on sp.playerid = p.playerid
     WHERE sp.sessionid = ${sessionId}
     ORDER BY sp.position`
  );
  return rows;
}

export async function getBoardGameHighScore(sessionIds: number[]) {
  const { rows } = await pool.query(
    `
    SELECT sp.score, p.name
    FROM sessionplayer sp
    JOIN Player p on sp.playerid = p.playerid
    WHERE sp.sessionid IN (${sessionIds.join(",")})
    ORDER BY sp.score DESC
    LIMIT 1 
    `
  );
  return rows[0] || null;
}

export async function getMostFrequentPlayers(sessionIds: number[]) {
  const { rows } = await pool.query(
    `
    SELECT p.name, COUNT (*) as games_played
    FROM sessionplayer sp
    JOIN Player p on sp.playerid = p.playerid
    WHERE sp.sessionid in (${sessionIds.join(",")})
    GROUP BY p.name
    ORDER BY games_played DESC
    LIMIT 1 
    `
  );

  return rows[0] || null;
}

export async function getMostTimesWon(sessionIds: number[]) {
  const { rows } = await pool.query(
    `
    SELECT p.name, COUNT (*) as games_won
    FROM sessionplayer sp
    JOIN player p on sp.playerid = p.playerid
    WHERE sp.sessionid in (${sessionIds.join(",")}) AND sp.position = 1
    GROUP BY p.name
    ORDER BY games_won DESC
    LIMIT 1
    `
  );

  return rows[0] || null;
}

export async function getPlayersStatistics() {
  const { rows } = await pool.query(
    `
    SELECT 
      p.name, 
      COUNT (*) AS times_played,
      COUNT (*) FILTER (WHERE sp.position = 1 AND sp.score > 0) AS times_won
    FROM player p
    JOIN sessionplayer sp ON sp.playerid = p.playerid
    GROUP BY p.name
    ORDER BY times_won DESC
    LIMIT 5
    `
  );

  console.log(rows[0], "players statistics rows from the query");
  return rows;
}
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ADD STUFF */

/* BOARD GAME */

export async function addBoardGame(name: string, noPoints: boolean) {
  const slug = name.toLowerCase().replace(/[\s']/g, "-");
  const { rows } = await pool.query(
    `INSERT INTO boardgame (name, slug, nopoints) VALUES ($1, $2, $3) RETURNING *`,
    [name, slug, noPoints]
  );
  //return rows[0];
}

/* PLAYER */
export async function addPlayer(name: string) {
  const { rows } = await pool.query(
    `
    INSERT INTO player (name) VALUES
    ('${name}')
    RETURNING *
    `
  );

  const playerid = Number(rows[0].playerid);

  const slug = `${rows[0].name.toLowerCase().replace(/\s+/g, "-")}-${playerid}`;

  await pool.query(
    `UPDATE player SET slug = '${slug}' 
    WHERE playerid = ${playerid}`
  );

  return { playerid, name: rows[0].name };
}

/* SESSION */
export async function addSession(
  boardgameid: number,
  date: Date,
  playersandscores: PlayerScoreInput[]
) {
  const newPlayers = playersandscores.filter((playerrow) =>
    Boolean(playerrow.player.isNew)
  );

  const addedPlayers = newPlayers.length
    ? await Promise.all(newPlayers.map((p) => addPlayer(p.player.name!)))
    : [];

  /* add the session */
  const { rows } = await pool.query(
    `INSERT INTO session (boardgameid, date) VALUES
    ('${boardgameid}', '${date.toISOString()}')
    RETURNING sessionid
    `
  );

  /* we complete the playerscore with the ids of the newly added players */
  const sessionid = rows[0].sessionid;
  const allPlayerScores = playersandscores.map((playerrow) => {
    if (playerrow.player.isNew) {
      const addedPlayer = addedPlayers.find(
        (p) => p.name == playerrow.player.name
      )!;

      return {
        ...playerrow,
        player: { id: addedPlayer.playerid, isNew: false },
      };
    } else {
      return playerrow;
    }
  });

  /* add the player scores */
  await pool.query(
    `
  INSERT INTO sessionplayer (sessionid, playerid, score, position)
  SELECT
    $1 AS sessionid,
    playerid,
    score,
    DENSE_RANK() OVER (ORDER BY score DESC) AS position
  FROM (
    SELECT
      unnest($2::int[]) AS playerid,
      unnest($3::int[]) AS score
  ) s
   ORDER BY score DESC, playerid
  `,
    [
      sessionid,
      allPlayerScores.map((p) => p.player.id),
      allPlayerScores.map((p) => p.score),
    ]
  );
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~DELETE STUFF */

export async function deleteBoardGame(id: number) {
  const { rows } = await pool.query(
    `
    DELETE FROM boardgame
    WHERE boardgame.boardgameid = '${id}'
    `
  );
}

export async function deleteSession(id: number) {
  const { rows } = await pool.query(
    `
    DELETE FROM session
    WHERE session.sessionid = '${id}'
    `
  );
}

export async function deletePlayer(id: number) {
  const { rows } = await pool.query(
    `
    DELETE FROM player
    WHERE player.playerid = '${id}'
    `
  );
}
