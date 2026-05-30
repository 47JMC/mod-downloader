const API_BASE_URL = "https://api.modrinth.com/v2";
const USER_AGENT = "ModDownloader/1.0";

export type Mod = {
  slug: string;
  title: string;
  description: string;
  categories: string[];
  downloads: number;
  iconUrl: string;
  author: string;
};

export async function searchMods(query: string) {
  const response = await fetch(
    `${API_BASE_URL}/search?query=${encodeURIComponent(query)}`,
    { headers: { "User-Agent": USER_AGENT } },
  );

  const data = await response.json();

  if (!response.ok) {
    console.log("Error searching mods:", data);
    return { error: data.error, message: data.message };
  }

  return data;
}
