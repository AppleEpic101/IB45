import { error } from '@sveltejs/kit';
export const prerender = false;
import data from '$lib/assets/courses.json';

const info = data.meta;
const courses = Object.keys(data).map((courseName) => ({
    name: courseName,
    description: data[courseName].description,
    short: data[courseName].short,
    assessmentModel: data[courseName].assessmentModel,
    SL: data[courseName].SLAssessments,
    HL: data[courseName].HLAssessments,
    groupNumber: data[courseName].groupNumber,
    firstAssessment: data[courseName].firstAssessment,
    lastAssessment: data[courseName].lastAssessment,
    old: data[courseName].old,
}));

const languageSubjects = info.group1
    .concat(info.group2)
    .filter((e) => e !== 'Literature And Performance');
const SL = info.SLOnly;

export const load = (({ params }) => {
    let subjectData;
    subjectData = courses.find(course => course.short === params.name);
    // console.log(subjectData);
    if (!subjectData) { throw error(404, 'Subject not found'); }
    return {
        name: subjectData.name,
        short: params.name,
        description: subjectData.description,
        firstAssessment: subjectData.firstAssessment,
        lastAssessment: subjectData.lastAssessment,
        groupNumber: subjectData.groupNumber,
        HL: subjectData.HL,
        SL: subjectData.SL,
        SLOnly: SL.includes(subjectData.name),
        isLanguageSubject: languageSubjects.includes(subjectData.name),
        isCoreSubject: ["Theory Of Knowledge", "Extended Essay", "Creativity, Activity, Service"].includes(subjectData.name),
        info: info,
        old: subjectData.old,
    }
});