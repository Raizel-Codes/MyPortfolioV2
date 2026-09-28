// Reads the public "N contributions in the last year" figure from GitHub's contribution graph.
// Cached for an hour; returns null if GitHub is unreachable or the markup changes.
export async function getGithubContributions(username: string): Promise<number | null> {
  try {
    const res = await fetch(`https://github.com/users/${username}/contributions`, {
      headers: { "User-Agent": "Mozilla/5.0 (portfolio contribution counter)" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const match = html.match(/([\d,]+)\s+contributions?\s+in the last year/);
    return match ? Number(match[1].replace(/,/g, "")) : null;
  } catch {
    return null;
  }
}
