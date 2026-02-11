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

/**
 * Calculates normal results based on grade and boundary.
 * @param {number} grade - The student's grade.
 * @param {number[]} boundary - Array of boundary scores.
 * @returns {number} The calculated mark.
 */
export const calculateNormalResults = (grade, boundary) => {
    let mark = 0;
    boundary?.forEach((arr) => {
        if (grade >= arr) {
            mark++;
        }
    });
    return mark;
}

/**
 * Calculates core results based on grade and boundary.
 * @param {number} grade - The student's grade.
 * @param {number[]} boundary - Array of boundary scores.
 * @returns {string} The core grade (A-E).
 */
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

/**
 * Retrieves all boundaries for a given subject and language.
 * @param {string} name - Subject name.
 * @param {string} lang - Language (default "none").
 * @returns {object} Object containing course info, SL boundaries, and HL boundaries.
 */
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
