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
