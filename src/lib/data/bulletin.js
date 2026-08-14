import may2024 from '$lib/assets/Bulletin.json';
import may2025 from '$lib/assets/BulletinM25.json';
import november2024 from '$lib/assets/BulletinN24.json';
import november2025 from '$lib/assets/BulletinN25.json';

const subjectNames = new Set([
	...Object.keys(november2025),
	...Object.keys(may2025),
	...Object.keys(november2024),
	...Object.keys(may2024)
]);

const bulletin = Object.fromEntries(
	[...subjectNames].map((name) => [
		name,
		{
			grades: [
				...(november2025[name]?.grades ?? []),
				...(may2025[name]?.grades ?? []),
				...(november2024[name]?.grades ?? []),
				...(may2024[name]?.grades ?? [])
			]
		}
	])
);

export default bulletin;
