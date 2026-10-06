// Albums Last.fm pour l'aperçu du dossier « music » du menu.
// Le résultat est mémorisé : un seul appel à l'API par build, même si le menu est rendu sur chaque page.
const LASTFM_API_KEY = "e8f7cc2bf5c0782e9f79cc243a7fe496";
const LASTFM_USER = "VaKaas";
// Image renvoyée par Last.fm quand un album n'a pas de pochette
const LASTFM_PLACEHOLDER = "2a96cbd8b46e442fc41c2b86b821562f";

export interface AlbumCover {
  title: string;
  artist: string;
  cover: string;
}

let cache: Promise<AlbumCover[]> | null = null;

async function fetchTopAlbums(period: string, want: number): Promise<AlbumCover[]> {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${LASTFM_USER}&api_key=${LASTFM_API_KEY}&period=${period}&limit=${want * 3}&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Last.fm error: ${res.status}`);
  const data = await res.json();
  return (data.topalbums?.album ?? [])
    .map((a: any) => ({
      title: a.name,
      artist: a.artist?.name ?? "",
      cover: a.image?.find((img: any) => img.size === "extralarge")?.["#text"] ?? "",
    }))
    .filter((a: AlbumCover) => a.cover && !a.cover.includes(LASTFM_PLACEHOLDER))
    .slice(0, want);
}

/**
 * Les 3 albums les plus écoutés : 30 derniers jours, sinon 12 derniers mois, sinon depuis toujours
 * (liste vide si Last.fm ne répond pas).
 */
export function getRecentAlbumCovers(): Promise<AlbumCover[]> {
  cache ??= (async () => {
    for (const period of ["1month", "12month", "overall"]) {
      const albums = await fetchTopAlbums(period, 3);
      if (albums.length >= 3) return albums;
    }
    return [];
  })().catch(() => []);
  return cache;
}
