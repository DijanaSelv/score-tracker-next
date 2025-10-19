import pool from "./db.js";

export async function getBoardGames() {
  const { rows } = await pool.query(
    "SELECT * FROM boardgame ORDER BY boardgameid"
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
