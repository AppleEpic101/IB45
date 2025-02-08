import { error } from '@sveltejs/kit';
export const prerender = false;
import data from '$lib/assets/courses.json';

const info = data.meta;

export const load = (({ params }) => {
    let subjectData;
    for (const key in data) {
        if (data[key].short === params.name) {
            subjectData = data[key];
            break;
        }
    }
    // console.log(subjectData);
    if (!subjectData) { throw error(404, 'Subject not found'); }
    return {
        ...subjectData,
        info: info,
       
    }
});


// name: subjectData.name,
// short: params.name,
// description: subjectData.description,
// firstAssessment: subjectData.firstAssessment,
// lastAssessment: subjectData.lastAssessment,
// groupNumber: subjectData.groupNumber,
// HL: subjectData.HL,
// SL: subjectData.SL,
// SLOnly: SL.includes(subjectData.name),
// isLanguageSubject: languageSubjects.includes(subjectData.name),
// isCoreSubject: ["Theory Of Knowledge", "Extended Essay", "Creativity, Activity, Service"].includes(subjectData.name)