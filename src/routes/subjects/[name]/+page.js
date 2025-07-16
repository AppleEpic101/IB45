import { error } from '@sveltejs/kit';
import data from '$lib/assets/courses.json';
export const prerender = false;

const info = data.meta;

export const load = (({ params, url }) => {
    let subjectData;
    for (const key in data) {
        if (data[key].short === params.name) {
            subjectData = data[key];
            break;
        }
    }

    if (!subjectData) { throw error(404, 'Subject not found'); }

    const version = url.searchParams.get('syl') || subjectData.firstAssessment;
	const langQuery = url.searchParams.get('lang');
	const level = url.searchParams.get('lvl') === 'HL' ? 'HL' : 'SL';

    return {
        data: {...subjectData},
        info: info,
        version,
        langQuery,
        level
    }
});