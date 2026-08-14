import may2024 from '$lib/assets/Bulletin.json';
import may2025 from '$lib/assets/BulletinM25.json';

const subjectNames = new Set([...Object.keys(may2024), ...Object.keys(may2025)]);

const bulletin = Object.fromEntries(
	[...subjectNames].map((name) => [
		name,
		{
			grades: [...(may2025[name]?.grades ?? []), ...(may2024[name]?.grades ?? [])]
		}
	])
);

export default bulletin;
