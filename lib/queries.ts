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

export async function getBoardGameBySlug(slug: string) {
  const { rows } = await pool.query("SELECT * FROM boardgame WHERE slug = $1", [
    slug,
  ]);
  return rows[0];
}

export async function getSessions(boardGameId: number) {
  const { rows } = await pool.query(
    "SELECT * FROM session where boardgameid = $1",
    [boardGameId]
  );
  return rows;
}

export async function getSessionDetails(sessionId: number) {
  const { rows } = await pool.query(
    `SELECT sp.score, p.name
     FROM SessionPlayer sp 
     JOIN Player p on sp.playerid = p.playerid 
     WHERE sp.sessionid = ${sessionId}`
  );
  return rows;
}

export async function addBoardGame(name: string) {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  console.log("Generated slug:", slug, name);
  const { rows } = await pool.query(
    `INSERT INTO boardgame (name, slug) VALUES 
    ('${name}', '${slug}')`
  );
  console.log("Inserted board game:", rows[0]);
  //return rows[0];
}
