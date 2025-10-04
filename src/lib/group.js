import courses from '$lib/assets/courses.json';
import M19 from '$lib/assets/M19.json';
import N19 from '$lib/assets/N19.json';
import N20 from '$lib/assets/N20.json';
import M21 from '$lib/assets/M21.json';
import M22 from '$lib/assets/M22.json';
import N22 from '$lib/assets/N22.json';
import M23 from '$lib/assets/M23.json';
import N23 from '$lib/assets/N23.json';
import M24 from '$lib/assets/M24.json';
import N24 from '$lib/assets/N24.json';
import M25 from '$lib/assets/M25.json';

const b = [M19, N19, N20, M21, M22, N22, M23, N23, M24, N24, M25];

export const calculateNormalResults = (grade, boundary) => {
    let mark = 0;
    boundary?.forEach((arr) => {
        if (grade >= arr) {
            mark++;
        }
    });
    return mark;
}

export const calculateCoreResults = (grade, boundary) => {
    const core = ['E', 'D', 'C', 'B', 'A'];
    let index = -1;
    boundary?.forEach((arr) => {
        if (grade >= arr) {
            index++;
        }
    });
    return core[index];
}

export const calculateGrade = (assessments, marks, weight, subjectName) => {
    if (subjectName === "Theory Of Knowledge") {
        return 2 * assessments[0] + assessments[1];
    } else if (subjectName === "Extended Essay") {
        return assessments[0];
    } else if (subjectName === "Creativity, Activity, Service") {
        return;
    } else {
        let grade = 0;
        for (let i = 0; i < marks.length; i++) {
            grade += (assessments[i] / marks[i]) * weight[i];
        }
        return Math.round(grade * 100 + 1e-10);
    }
}

export const calculateResults = (store, matchedCourse, matchedLang, timezone) => {

    // compute weighted average
    let grade = 0;
    matchedCourse?.forEach((assessment, i) => {
        grade += (store.sliderPosition[i] / assessment.maxMarks) * assessment.weight * 100;
    });
    grade = Math.round(grade);

    // use boundary data to calculate grade

    let boundary = [];
    matchedLang?.TZ?.forEach((arr, i) => {
        boundary[i] = 0;
        arr.forEach((element) => {
            if (grade >= element) {
                boundary[i]++;
            }
        });
    });

    // get result from timezone
    let awardedMark = boundary.length > 1 ? boundary[parseInt(timezone) - 1] : boundary[0];
    if (awardedMark === undefined) awardedMark = 0;

    return {
        grade,
        boundary,
        awardedMark,
    }
}

export const constructURL = (url, short, lang, lvl) => {
    url.pathname = '/subjects/' + short;
    if (lang) url.searchParams.set('lang', lang);
    url.searchParams.set('lvl', lvl);
    return url;
}

const getTZ = (name, short, timezone) => {
    let arr = [];
    timezone?.forEach((tz, i) => {
        if (tz.length > 0) {
            arr.push(
                {
                    name,
                    short,
                    timezone: timezone.length === 1 ? 0 : i + 1,
                    fullName: timezone.length === 1 ? short + ' TZ0' : short + ' TZ' + (i + 1),
                    tz,
                }
            );
        }
    });
    return arr;
}

export const getAllBoundaries = (name, lang = "none") => {
    let SL = [];
    let HL = [];

    let fullName = lang === "none" ? name : lang + " " + name;
    let oldNames = courses[name]?.oldNames;
    b.forEach(boundary => {
        SL.push(...getTZ(boundary.info.name, boundary.info.short, boundary['SL ' + fullName]?.TZ));
        if (name === "History") {
            HL.push(...getTZ(boundary.info.name, boundary.info.short, boundary['HL History Americas']?.TZ))
        } else if (name === "Theory Of Knowledge" || name === "Extended Essay") {
            SL.push(...getTZ(boundary.info.name, boundary.info.short, boundary[fullName]?.TZ));
        } else {
            HL.push(...getTZ(boundary.info.name, boundary.info.short, boundary['HL ' + fullName]?.TZ));
        }

        if (oldNames) {
            oldNames.forEach((oldName) => {
                SL.push(...getTZ(boundary.info.name, boundary.info.short, boundary['SL ' + oldName]?.TZ));
                HL.push(...getTZ(boundary.info.name, boundary.info.short, boundary['HL ' + oldName]?.TZ));

            });
        }
    });
    return {
        course: courses[name],
        SL,
        HL,
    }

}

// export function calculateGradeBoundary(matchedLang, boundary, grade) {
//     boundary = [];
//     if (matchedLang !== undefined) {
//         matchedLang.TZ.forEach((arr, i) => {
//             boundary[i] = 0;
//             arr.forEach((element) => {
//                 if (grade >= element) {
//                     boundary[i]++;
//                 }
//             });
//         });
//     }
//     return boundary;
// }

// export function calculateGrade(store, matchedCourse) {
//     let grade = 0;
//     if (matchedCourse !== undefined) {
//         matchedCourse.forEach((assessment, i) => {
//             grade += (store.sliderPosition[i] / assessment.maxMarks) * assessment.weight * 100;
//         });
//     }
//     return Math.round(grade);
// }
