import corePerformance from '$lib/assets/CorePerformance.json';

export const CORE_GRADE_LABELS = ['A', 'B', 'C', 'D', 'E', 'N'];

export const EE_SUBJECT_GROUPS = [
	{ value: 'studies-language-literature', label: 'Studies in language and literature' },
	{ value: 'language-acquisition', label: 'Language acquisition' },
	{ value: 'individuals-societies', label: 'Individuals and societies' },
	{ value: 'sciences', label: 'Sciences' },
	{ value: 'mathematics', label: 'Mathematics' },
	{ value: 'arts', label: 'The arts' },
	{ value: 'interdisciplinary', label: 'Interdisciplinary' }
];

export function getCorePerformance(sessionId, type, grade, eeSubjectGroup) {
	const session = corePerformance[sessionId];
	const counts =
		type === 'ee' ? session?.ee?.[eeSubjectGroup || EE_SUBJECT_GROUPS[2].value] : session?.tok;
	if (!session || !counts) return null;

	const total = counts.reduce((sum, count) => sum + count, 0);
	const gradeIndex = CORE_GRADE_LABELS.indexOf(grade);
	const entries = CORE_GRADE_LABELS.map((label, index) => ({
		label,
		count: counts[index],
		percentage: Math.round((counts[index] / total) * 1000) / 10
	}));

	return {
		sessionName: session.name,
		total,
		entries,
		gradeShare: gradeIndex >= 0 ? entries[gradeIndex].percentage : null,
		lowerShare:
			gradeIndex >= 0
				? Math.round(
						(counts.slice(gradeIndex + 1).reduce((sum, count) => sum + count, 0) / total) * 1000
				  ) / 10
				: null,
		higherShare:
			gradeIndex >= 0
				? Math.round(
						(counts.slice(0, gradeIndex).reduce((sum, count) => sum + count, 0) / total) * 1000
				  ) / 10
				: null
	};
}

export default corePerformance;
