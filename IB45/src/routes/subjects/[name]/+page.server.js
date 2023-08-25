import data from '$lib/assets/courses.json';
import M19 from '$lib/assets/Grade_BoundariesM19.json';
import N19 from '$lib/assets/Grade_BoundariesN19.json';
import N20 from '$lib/assets/Grade_BoundariesN20.json';
import M21 from '$lib/assets/Grade_BoundariesM21.json';
import M22 from '$lib/assets/Grade_BoundariesM22.json';
import N22 from '$lib/assets/Grade_BoundariesN22.json';

const courses = Object.keys(data).map((courseName) => ({
    name: courseName,
    description: data[courseName].description,
    short: data[courseName].short,
    assessmentModel: data[courseName].assessmentModel,
    SL: data[courseName].SLAssessments,
    HL: data[courseName].HLAssessments
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

const languageSubjects = [
    'Language A: Literature',
    'Language A: Language And Literature',
    'Language AB Initio',
    'Language B'
];
const regions = ['Africa And Middle East', 'Americas', 'Asia And Oceania', 'Europe'];
const SL = [
    'Language AB Initio',
    'Environmental Systems And Societies',
    'World Religions',
    'Literature And Performance'
];

export const ssr = false;
export const load = (({params}) => {
    let obj;
    courses.forEach((o) => {
        if (o.short === params.name) {
            obj = o;
        }
    });

    let historyResults = [[], [], [], []];
	regions.forEach((r, i) => {
		b.forEach((boundary) => {
			const info = boundary['info'];
			const c = boundary['HL History ' + r];

			if (c && info) {
				let timezone = [...c.TZ];
				historyResults[i].push(...getTZ(timezone, 'HL History ' + r, info));
			}
		});
	});

	let TOK = [];
	let EE = [];
	b.forEach((boundary) => {
		const info = boundary['info'];
		const c = boundary['Theory Of Knowledge'];
		const d = boundary['Extended Essay'];

		if (c && d && info) {
			let timezone = [...c.TZ];
			let timezone1 = [...d.TZ];

			TOK.push(...getTZ(timezone, 'Theory Of Knowledge', info));
			EE.push(...getTZ(timezone1, 'Extended Essay', info));
		}
	});

    return {
        name: obj.name,
        short: params.name,
        description: obj.description,
        historyResults: historyResults,
        TOK: TOK,
        EE: EE,
        HL: obj.HL,
        SL: obj.SL,
        SLOnly: SL.includes(obj.name),
        isLanguageSubject: languageSubjects.includes(obj.name)
    }
});