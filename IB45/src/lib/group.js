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
    if(awardedMark === undefined) awardedMark = 0;

    return {
        grade, 
        boundary, 
        awardedMark,
    }
}

export const constructURL = (url, short, lang, lvl) => {
    url.pathname = '/subjects/' + short;
    if(lang) url.searchParams.set('lang', lang);
    url.searchParams.set('lvl', lvl);
    return url;
}

export function calculateGradeBoundary(matchedLang, boundary, grade) {
    boundary = [];
    if (matchedLang !== undefined) {
        matchedLang.TZ.forEach((arr, i) => {
            boundary[i] = 0;
            arr.forEach((element) => {
                if (grade >= element) {
                    boundary[i]++;
                }
            });
        });
    }
    return boundary;
}

export function calculateGrade(store, matchedCourse) {
    let grade = 0;
    if (matchedCourse !== undefined) {
        matchedCourse.forEach((assessment, i) => {
            grade += (store.sliderPosition[i] / assessment.maxMarks) * assessment.weight * 100;
        });
    }
    return Math.round(grade);
}
