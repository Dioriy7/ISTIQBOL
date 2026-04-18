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

const STORAGE_KEY_USERS = 'istiqbol_users';
const STORAGE_KEY_CAREERS = 'istiqbol_careers_v1';
const STORAGE_KEY_MESSAGES = 'istiqbol_messages_v1';

const defaultCareers = [
    { id: 1, title: { uz: 'Software Engineer', ru: 'Программный инженер', en: 'Software Engineer' }, icon: '💻', subjects: ['math', 'english'] },
    { id: 2, title: { uz: 'Shifokor', ru: 'Врач', en: 'Doctor' }, icon: '🩺', subjects: ['biology', 'chemistry'] }
];

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
    if (!localStorage.getItem(STORAGE_KEY_CAREERS)) {
        localStorage.setItem(STORAGE_KEY_CAREERS, JSON.stringify(defaultCareers));
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

export const getUsers = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]');
};

export const saveUsers = (users) => {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
};

export const getCareers = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_CAREERS) || '[]');
};

export const saveCareers = (careers) => {
    localStorage.setItem(STORAGE_KEY_CAREERS, JSON.stringify(careers));
};

export const getMessages = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_MESSAGES) || '[]');
};

export const saveMessages = (msgs) => {
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(msgs));
};

export const getStats = () => {
    const users = getUsers();
    const questions = getQuestions();
    const careers = getCareers();

    return {
        totalUsers: users.length,
        totalTests: 124, // Mock
        activeNow: 8,    // Mock
        popularSubjects: [
            { name: 'Matematika', count: 45 },
            { name: 'Ingliz tili', count: 38 },
            { name: 'Biologiya', count: 22 }
        ]
    };
};
