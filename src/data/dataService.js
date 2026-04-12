import { subjects as initialSubjects, questions as initialQuestions } from './questions';

const STORAGE_KEY_QUESTIONS = 'istiqbol_questions_v7';
const STORAGE_KEY_SUBJECTS = 'istiqbol_subjects_v5';
const STORAGE_KEY_SETTINGS = 'istiqbol_settings_v1';

const defaultSettings = {
    telegram: 'https://t.me/istiqbol_robot',
    instagram: 'https://instagram.com/istiqbol',
    logoUrl: '',
    about: {
        uz: "Maktab fanlari bo'yicha interaktiv testlar, AI tahlili va shaxsiy kasb tavsiyalari — hammasi bir joyda.",
        ru: "Интерактивные тесты по школьным предметам, искусственный интеллект и персональные советы по карьере — все в одном месте.",
        en: "Interactive tests on school subjects, AI analysis and personalized career recommendations — all in one place."
    }
};

// Initialize data in localStorage if not exists
const initializeData = () => {
    if (!localStorage.getItem(STORAGE_KEY_SUBJECTS)) {
        localStorage.setItem(STORAGE_KEY_SUBJECTS, JSON.stringify(initialSubjects));
    }
    if (!localStorage.getItem(STORAGE_KEY_QUESTIONS)) {
        localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(initialQuestions));
    }
    if (!localStorage.getItem(STORAGE_KEY_SETTINGS)) {
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(defaultSettings));
    }
};

initializeData();

export const getSubjects = () => {
    const data = localStorage.getItem(STORAGE_KEY_SUBJECTS);
    return data ? JSON.parse(data) : null;
};

export const getQuestions = () => {
    const data = localStorage.getItem(STORAGE_KEY_QUESTIONS);
    return data ? JSON.parse(data) : null;
};

export const saveQuestions = (questions) => {
    localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(questions));
};

export const saveSubjects = (subjects) => {
    localStorage.setItem(STORAGE_KEY_SUBJECTS, JSON.stringify(subjects));
};

export const getSettings = () => {
    const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
    return data ? JSON.parse(data) : defaultSettings;
};

export const saveSettings = (settings) => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
};
