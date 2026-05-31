const API_BASE_URL = "https://api.modrinth.com/v2";
const USER_AGENT = "ModDownloader/1.0";

export type Mod = {
  slug: string;
  title: string;
  description: string;
  categories: string[];
  downloads: number;
  icon_url: string;
  author: string;
  preset?: number;
};

export async function searchMods(query: string, version: string) {
  const facets = JSON.stringify([
    [`versions:${version}`],
    [`project_type:mod`],
  ]);

  const params = new URLSearchParams({
    query,
    facets,
  });

  const response = await fetch(`${API_BASE_URL}/search?${params}`, {
    headers: { "User-Agent": USER_AGENT },
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Error searching mods:", data);
    return { error: data.error, message: data.message };
  }

  return data;
}
