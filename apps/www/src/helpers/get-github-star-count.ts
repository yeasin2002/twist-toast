const GITHUB_REPO_API = "https://api.github.com/repos/yeasin2002/twist-toast";
const STARS_REVALIDATE_SECONDS = 60 * 60 * 24;

type GitHubRepoResponse = {
  stargazers_count?: number;
};

export async function getGitHubStarCount() {
  try {
    const response = await fetch(GITHUB_REPO_API, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      next: { revalidate: STARS_REVALIDATE_SECONDS },
    });

    if (!response.ok) return null;

    const data = (await response.json()) as GitHubRepoResponse;
    return typeof data.stargazers_count === "number"
      ? data.stargazers_count
      : null;
  } catch {
    return null;
  }
}

export function formatStarCount(stars: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(stars);
}

// uses
//   const stars = await getGitHubStarCount();
//   const starsLabel = stars === null ? "0" : formatStarCount(stars);
