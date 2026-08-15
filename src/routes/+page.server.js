import { env } from '$env/dynamic/private';

const repository = 'AppleEpic101/IB45';

export const load = async ({ fetch }) => {
	const branch = env.CF_PAGES_BRANCH || 'dev';
	let lastUpdated = new Date().toISOString();

	try {
		const response = await fetch(
			`https://api.github.com/repos/${repository}/commits/${encodeURIComponent(branch)}`,
			{
				headers: { Accept: 'application/vnd.github+json' },
				signal: AbortSignal.timeout(3000)
			}
		);
		if (response.ok) {
			const commit = await response.json();
			lastUpdated = commit?.commit?.committer?.date || lastUpdated;
		}
	} catch {
		// The build date remains a useful automatic fallback if GitHub is unavailable.
	}

	return { lastUpdated };
};
