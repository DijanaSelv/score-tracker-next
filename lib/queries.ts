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
    SELECT s.date, bg.name as boardgamename, bg.slug as boardgameslug, p.name as winner, p.slug as winnerslug, s.sessionid as sessionid
    FROM session s
    JOIN boardgame bg on bg.boardgameid = s.boardgameid
    JOIN sessionplayer sp on sp.sessionid = s.sessionid
    JOIN  player p on p.playerid = sp.playerid and sp.position = 1
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
    SELECT p.name as playername, bg.slug as boardgameslug , sp.position, s.sessionid, s.date, sp.score, bg.name as boardgamename
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
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ADD STUFF */

/* BOARD GAME */

export async function addBoardGame(name: string) {
  const slug = name.toLowerCase().replace(/[\s']/g, "-");
  const { rows } = await pool.query(
    `INSERT INTO boardgame (name, slug) VALUES 
    ('${name}', '${slug}')`
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

  const sortedPLlayerScoresWithPositions = allPlayerScores
    .sort((a, b) => b.score - a.score)
    .map((playerScore, i) => ({
      id: playerScore.player.id,
      score: playerScore.score,
      position: i + 1,
    }));

  /* add the player scores */

  await Promise.all(
    sortedPLlayerScoresWithPositions.map((sessionplayer) =>
      pool.query(
        `
        INSERT INTO sessionplayer (sessionid, playerid, score, position) VALUES
        ('${sessionid}', '${sessionplayer.id}', '${sessionplayer.score}', ${sessionplayer.position})
        `
      )
    )
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
