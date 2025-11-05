"use server";

import pool from "./db.js";

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

export async function getBoardGameBySlug(slug: string) {
  const { rows } = await pool.query("SELECT * FROM boardgame WHERE slug = $1", [
    slug,
  ]);
  return rows[0];
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
    `SELECT sp.score, p.name
     FROM SessionPlayer sp 
     JOIN Player p on sp.playerid = p.playerid
     WHERE sp.sessionid = ${sessionId}
     ORDER BY sp.score`
  );
  return rows;
}

export async function addBoardGame(name: string) {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  const { rows } = await pool.query(
    `INSERT INTO boardgame (name, slug) VALUES 
    ('${name}', '${slug}')`
  );

  //return rows[0];
}

export async function addSession(
  boardgameid: number,
  date: Date,
  playersandscores: any[]
) {
  const newPlayers = playersandscores.filter(
    (playerrow) => playerrow.player.isNew
  );
  console.log(newPlayers);
  let addedPlayers = [];

  /* first we add the new players to the database if any */
  if (newPlayers.length) {
    const results = await Promise.all(
      newPlayers.map((newPlayer) =>
        pool.query(
          `
        INSERT INTO player (name) VALUES
        ('${newPlayer.player.name}')
        RETURNING *
        `
        )
      )
    );
    /* we take the added players because we will need their ids */
    addedPlayers = results.flatMap((res) => res.rows);
    console.log(addedPlayers, "addedplayers");
  }

  /* add the session */
  const { rows } = await pool.query(
    `INSERT INTO session (boardgameid, date) VALUES
    ('${boardgameid}', '${date.toISOString()}')
    RETURNING sessionid
    `
  );

  /* we complete the playerscore with the ids of the newly added players */
  const sessionid = rows[0].sessionid;
  const allPlayerScoresToBeAdded = playersandscores.map((playerrow) => {
    if (playerrow.player.isNew) {
      const addedPlayer = addedPlayers.find(
        (p) => p.name == playerrow.player.name
      );
      return {
        ...playerrow,
        player: { id: addedPlayer.playerid, isNew: false },
      };
    } else {
      return playerrow;
    }
  });

  /* add the player scores */

  await Promise.all(
    allPlayerScoresToBeAdded.map((sessionplayer) =>
      pool.query(
        `
        INSERT INTO sessionplayer (sessionid, playerid, score) VALUES
        ('${sessionid}', '${sessionplayer.player.id}', '${sessionplayer.score}')
        `
      )
    )
  );
}

/* Add player */
export async function addPlayer(name: string) {
  const { rows } = await pool.query(
    `
    INSERT INTO player (name) VALUES
    ('${name}')
    `
  );
}
