import data from '$lib/assets/courses.json';
import M19 from '$lib/assets/Grade_BoundariesM19.json';
import N19 from '$lib/assets/Grade_BoundariesN19.json';
import N20 from '$lib/assets/Grade_BoundariesN20.json';
import M21 from '$lib/assets/Grade_BoundariesM21.json';
import M22 from '$lib/assets/Grade_BoundariesM22.json';
import N22 from '$lib/assets/Grade_BoundariesN22.json';

const info = data['info'];
const courses = Object.keys(data).map((courseName) => ({
    name: courseName,
    description: data[courseName].description,
    short: data[courseName].short,
    assessmentModel: data[courseName].assessmentModel,
    SL: data[courseName].SLAssessments,
    HL: data[courseName].HLAssessments,
    groupNumber: data[courseName].groupNumber,
    firstAssessment: data[courseName].firstAssessment,
    lastAssessment: data[courseName].lastAssessment
}));

const b = [M19, N19, N20, M21, M22, N22];

const getTZ = (timezone, name, info) => {
    let arr = [];

    if (timezone && info) {
        timezone.forEach((tz, i) => {
            if (timezone.length === 1) {
                arr.push({ tz, name: info.short + ' TZ0', courseName: name });
            } else {
                arr.push({ tz, name: info.short + ' TZ' + (i + 1), courseName: name });
            }
        });
    }
    return arr;
};

const languageSubjects = info.group1
    .concat(info.group2)
    .filter((e) => e !== 'Literature And Performance');
const regions = info.region;
const SL = info.SLOnly;

// export const ssr = false;
export const load = (({params}) => {
    let obj;
    courses.forEach((o) => {
        if (o.short === params.name) {
            obj = o;
        }
    });
    let lastHistory = [[], [], [], []]
    let historyResults = [[], [], [], []];
	regions.forEach((r, i) => {
		b.forEach((boundary) => {
			const info = boundary['info'];
			const c = boundary['HL History ' + r];

			if (c && info) {
				let timezone = [...c.TZ];
                lastHistory[i] = getTZ(timezone, 'HL History ' + r, info);
				historyResults[i].push(...getTZ(timezone, 'HL History ' + r, info));
			}
		});
	});

	let TOK = [];
	let EE = [];
    let lastTOK;
    let lastEE;
	b.forEach((boundary) => {
		const info = boundary['info'];
		const c = boundary['Theory Of Knowledge'];
		const d = boundary['Extended Essay'];

		if (c && d && info) {
			let timezone = [...c.TZ];
			let timezone1 = [...d.TZ];

            lastTOK = getTZ(timezone, 'Theory Of Knowledge', info);
            lastEE = getTZ(timezone1, 'Extended Essay', info);
			TOK.push(...getTZ(timezone, 'Theory Of Knowledge', info));
			EE.push(...getTZ(timezone1, 'Extended Essay', info));
		}
	});

    return {
        name: obj.name,
        short: params.name,
        description: obj.description,
        firstAssessment: obj.firstAssessment,
        lastAssessment: obj.lastAssessment,
        historyResults: historyResults,
        groupNumber: obj.groupNumber,
        TOK: TOK,
        EE: EE,
        HL: obj.HL,
        SL: obj.SL,
        SLOnly: SL.includes(obj.name),
        isLanguageSubject: languageSubjects.includes(obj.name),
        isCoreSubject: obj.name === "Theory Of Knowledge" || obj.name === "Extended Essay" || obj.name === "Creativity, Activity, Service",
        lastHistory: lastHistory,
        lastTOK: lastTOK,
        lastEE: lastEE,
    }
});