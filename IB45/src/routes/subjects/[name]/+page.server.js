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

export const load = (({params}) => {
    let obj;
    courses.forEach((o) => {
        if (o.short === params.name) {
            obj = o;
        }
    });
    return {
        name: obj.name,
        short: params.name,
        description: obj.description,
        firstAssessment: obj.firstAssessment,
        lastAssessment: obj.lastAssessment,
        groupNumber: obj.groupNumber,
        HL: obj.HL,
        SL: obj.SL,
        SLOnly: SL.includes(obj.name),
        isLanguageSubject: languageSubjects.includes(obj.name),
        isCoreSubject: obj.name === "Theory Of Knowledge" || obj.name === "Extended Essay" || obj.name === "Creativity, Activity, Service",
        info: info,
        old: obj.old,
    }
});