// Auto-generated index file for all grade question data
// Imports all grade JSON files (split into parts) and exports a unified structure

import grade5 from './questions_grade5.json';
import grade6 from './questions_grade6.json';
import grade7p1 from './questions_grade7_part1.json';
import grade7p2 from './questions_grade7_part2.json';
import grade8p1 from './questions_grade8_part1.json';
import grade8p2 from './questions_grade8_part2.json';
import grade9p1 from './questions_grade9_part1.json';
import grade9p2 from './questions_grade9_part2.json';
import grade10p1 from './questions_grade10_part1.json';
import grade10p2 from './questions_grade10_part2.json';
import grade11p1 from './questions_grade11_part1.json';
import grade11p2 from './questions_grade11_part2.json';

/**
 * Merge multiple grade part objects into a single grade object.
 * Each part has { grade, part, subjects: [...] }
 */
function mergeParts(...parts) {
    const base = parts[0];
    const allSubjects = parts.flatMap(p => p.subjects);
    return { grade: base.grade, subjects: allSubjects };
}

export const grade7 = mergeParts(grade7p1, grade7p2);
export const grade8 = mergeParts(grade8p1, grade8p2);
export const grade9 = mergeParts(grade9p1, grade9p2);
export const grade10 = mergeParts(grade10p1, grade10p2);
export const grade11 = mergeParts(grade11p1, grade11p2);

/**
 * Main questions map keyed by grade number.
 * Usage: allGrades[5].subjects → array of subjects for grade 5
 */
const allGrades = {
    5: grade5,
    6: grade6,
    7: grade7,
    8: grade8,
    9: grade9,
    10: grade10,
    11: grade11,
};

export default allGrades;

/**
 * Utility: get all subjects for a given grade number.
 * @param {number} grade
 * @returns {Array} subjects array or empty array
 */
export function getSubjectsByGrade(grade) {
    return allGrades[grade]?.subjects || [];
}

/**
 * Utility: get questions and interactive tasks for a specific grade + subject.
 * @param {number} grade
 * @param {string} subject  — must match the "subject" field in JSON exactly
 * @returns {{ questions: Array, interactive_tasks: Array } | null}
 */
export function getSubjectData(grade, subject) {
    const subjects = getSubjectsByGrade(grade);
    return subjects.find(s => s.subject === subject) || null;
}
