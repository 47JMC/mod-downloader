const API_BASE_URL = "https://api.modrinth.com/v2";
const USER_AGENT = "ModDownloader/1.0";

const WORKER_URL = import.meta.env.VITE_WORKER_URL;

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

export async function searchMods(
  query: string,
  version: string,
  loader: string,
) {
  const facets = JSON.stringify([
    [`versions:${version}`],
    [`project_type:mod`],
    [`categories:${loader}`],
  ]);

  const params = new URLSearchParams({
    query,
    facets,
    limit: "20",
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

export async function getGameVersions(): Promise<string[]> {
  const response = await fetch("https://api.modrinth.com/v2/tag/game_version", {
    headers: { "User-Agent": USER_AGENT },
  });
  const data = await response.json();
  // Only return releases, not snapshots/alphas/betas
  return data
    .filter((v: { version_type: string }) => v.version_type === "release")
    .map((v: { version: string }) => v.version);
}

export async function getLoaders(): Promise<{ icon: string; name: string }[]> {
  const response = await fetch("https://api.modrinth.com/v2/tag/loader", {
    headers: { "User-Agent": USER_AGENT },
  });
  const data = await response.json();
  return data;
}

export async function getDownloadLink(
  modSlug: string,
  version: string,
  loader: string,
) {
  const params = new URLSearchParams({
    loaders: loader,
    game_versions: version,
    include_changelog: "false",
    version_type: "release",
  });

  const response = await fetch(
    `${API_BASE_URL}/project/${modSlug}/version?${params}`,
    {
      headers: { "User-Agent": USER_AGENT },
    },
  );
  const data = await response.json();

  if (!response.ok) {
    console.error("Error fetching mod version:", data);
    return { error: data.error, message: data.message };
  }

  if (data.length === 0) {
    return { error: "No compatible version found" };
  }

  return data[0].files[0].url;
}

export async function downloadModsAsZip(
  mods: Mod[],
  version: string,
  loader: string,
) {
  const res = await fetch(`${WORKER_URL}/download`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mods, version, loader }),
  });

  const blob = await res.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "mods.zip";
  a.click();
  URL.revokeObjectURL(a.href);
}
