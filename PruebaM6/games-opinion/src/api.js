const API_KEY = "f503d55618f64a779ce46943610b61c7";
const BASE_URL = `https://api.rawg.io/api/games?key=${API_KEY}`;

export async function fetchGames() {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error("Error fetching games");
  return await response.json();
}
