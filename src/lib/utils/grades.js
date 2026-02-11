/**
 * Calculates the final grade based on assessments, marks, and weights.
 * @param {number[]} assessments - Array of student's scores for each assessment.
 * @param {number[]} marks - Array of maximum marks for each assessment.
 * @param {number[]} weight - Array of weights for each assessment.
 * @param {string} subjectName - Name of the subject.
 * @returns {number|undefined} The calculated grade or undefined.
 */
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

/**
 * Calculates the results including grade, boundary, and awarded mark.
 * @param {object} store - Svelte store containing slider positions.
 * @param {object[]} matchedCourse - Array of assessment objects for the matched course.
 * @param {object} matchedLang - Language object containing timezone data.
 * @param {string|number} timezone - Selected timezone.
 * @returns {object} Object containing grade, boundary, and awardedMark.
 */
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
