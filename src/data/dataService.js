import { subjects as initialSubjects, questions as initialQuestions } from './questions';

const generateId = (prefix = 'id') => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Internal helper for IDs
const ensureIds = (data) => {
    if (!data) return Array.isArray(data) ? [] : {};

    if (Array.isArray(data)) {
        return data
            .filter(item => item && typeof item === 'object')
            .map((item, idx) => ({
                id: item.id || `static-${idx}-${Date.now()}`,
                ...item
            }));
    }

    if (typeof data === 'object') {
        const newData = {};
        Object.keys(data).forEach(key => {
            if (Array.isArray(data[key])) {
                newData[key] = data[key]
                    .filter(item => item && typeof item === 'object')
                    .map((item, idx) => ({
                        id: item.id || `q-${key}-${idx}-${Date.now()}`,
                        ...item
                    }));
            } else {
                newData[key] = [];
            }
        });
        return newData;
    }
    return data;
};

const STORAGE_KEY_QUESTIONS = 'istiqbol_questions_v8';
const STORAGE_KEY_SUBJECTS = 'istiqbol_subjects_v6';
const STORAGE_KEY_SETTINGS = 'istiqbol_settings_v1';
const STORAGE_KEY_CAREERS = 'istiqbol_careers_v2';
const STORAGE_KEY_USERS = 'istiqbol_users';
const STORAGE_KEY_MESSAGES = 'istiqbol_messages_v1';

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

const defaultCareers = [
    { id: 'c1', title: { uz: 'Software Engineer', ru: 'Программный инженер', en: 'Software Engineer' }, icon: '💻', imageUrl: '', subjects: ['math', 'english'], category: 'IT' },
    { id: 'c2', title: { uz: 'Shifokor', ru: 'Врач', en: 'Doctor' }, icon: '🩺', imageUrl: '', subjects: ['biology', 'chemistry'], category: 'Medicine' }
];

// Initialize data in localStorage if not exists
const initializeData = () => {
    if (!localStorage.getItem(STORAGE_KEY_SUBJECTS)) {
        localStorage.setItem(STORAGE_KEY_SUBJECTS, JSON.stringify(initialSubjects));
    }
    if (!localStorage.getItem(STORAGE_KEY_QUESTIONS)) {
        localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(ensureIds(initialQuestions)));
    }
    if (!localStorage.getItem(STORAGE_KEY_SETTINGS)) {
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(defaultSettings));
    }
    if (!localStorage.getItem(STORAGE_KEY_CAREERS)) {
        localStorage.setItem(STORAGE_KEY_CAREERS, JSON.stringify(defaultCareers));
    }
};

initializeData();

// Mock API latency
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Professional API Service Layer
 */
export const api = {
    questions: {
        getAll: async () => {
            console.log('GET /api/questions');
            await delay();
            const data = localStorage.getItem(STORAGE_KEY_QUESTIONS);
            return data ? JSON.parse(data) : {};
        },
        create: async (subject, questionData) => {
            console.log(`POST /api/questions/${subject}`);
            await delay();
            const questions = await api.questions.getAll();
            const newQuestion = {
                id: generateId('q'),
                ...questionData
            };
            if (!questions[subject]) questions[subject] = [];
            questions[subject].unshift(newQuestion);
            localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(questions));
            return newQuestion;
        },
        update: async (subject, id, updatedData) => {
            console.log(`PUT /api/questions/${subject}/${id}`);
            await delay();
            const questions = await api.questions.getAll();
            if (!questions[subject]) return null;
            const idx = questions[subject].findIndex(q => q.id === id);
            if (idx === -1) return null;
            questions[subject][idx] = { ...questions[subject][idx], ...updatedData };
            localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(questions));
            return questions[subject][idx];
        },
        delete: async (subject, id) => {
            console.log(`DELETE /api/questions/${subject}/${id}`);
            await delay();
            const questions = await api.questions.getAll();
            if (!questions[subject]) return false;
            questions[subject] = questions[subject].filter(q => q.id !== id);
            localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(questions));
            return true;
        }
    },
    professions: {
        getAll: async () => {
            console.log('GET /api/professions');
            await delay();
            return JSON.parse(localStorage.getItem(STORAGE_KEY_CAREERS) || '[]');
        },
        create: async (data) => {
            console.log('POST /api/professions');
            await delay();
            const careers = await api.professions.getAll();
            const newCareer = { id: generateId('c'), ...data };
            careers.unshift(newCareer);
            localStorage.setItem(STORAGE_KEY_CAREERS, JSON.stringify(careers));
            return newCareer;
        },
        update: async (id, data) => {
            console.log(`PUT /api/professions/${id}`);
            await delay();
            const careers = await api.professions.getAll();
            const idx = careers.findIndex(c => c.id === id);
            if (idx === -1) return null;
            careers[idx] = { ...careers[idx], ...data };
            localStorage.setItem(STORAGE_KEY_CAREERS, JSON.stringify(careers));
            return careers[idx];
        },
        delete: async (id) => {
            console.log(`DELETE /api/professions/${id}`);
            await delay();
            const careers = await api.professions.getAll();
            const filtered = careers.filter(c => c.id !== id);
            localStorage.setItem(STORAGE_KEY_CAREERS, JSON.stringify(filtered));
            return true;
        }
    },
    settings: {
        get: async () => {
            await delay();
            return JSON.parse(localStorage.getItem(STORAGE_KEY_SETTINGS) || JSON.stringify(defaultSettings));
        },
        save: async (data) => {
            await delay();
            localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(data));
            return data;
        }
    }
};

// Backward compatibility (optional, but keep for now to avoid breaking other files)
export const getQuestions = () => JSON.parse(localStorage.getItem(STORAGE_KEY_QUESTIONS) || '{}');
export const getSubjects = () => JSON.parse(localStorage.getItem(STORAGE_KEY_SUBJECTS) || '[]');
export const getSettings = () => JSON.parse(localStorage.getItem(STORAGE_KEY_SETTINGS) || JSON.stringify(defaultSettings));
export const saveSettings = (data) => localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(data));
export const getCareers = () => JSON.parse(localStorage.getItem(STORAGE_KEY_CAREERS) || '[]');
export const saveCareers = (data) => localStorage.setItem(STORAGE_KEY_CAREERS, JSON.stringify(data));
export const getUsers = () => JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]');
export const saveUsers = (data) => localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(data));
export const getMessages = () => JSON.parse(localStorage.getItem(STORAGE_KEY_MESSAGES) || '[]');
export const saveMessages = (msgs) => localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(msgs));

export const addMessage = (category, content, sender = 'Anonim', extra = null) => {
    const messages = getMessages();
    const newMessage = {
        id: Date.now(),
        category,
        content,
        sender,
        extra,
        timestamp: new Date().toISOString(),
        isRead: false
    };
    messages.unshift(newMessage);
    saveMessages(messages);
    return newMessage;
};

export const getStats = () => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]');
    return {
        totalUsers: users.length,
        totalTests: 124,
        activeNow: 8,
        popularSubjects: [
            { name: 'Matematika', count: 45 },
            { name: 'Ingliz tili', count: 38 },
            { name: 'Biologiya', count: 22 }
        ]
    };
};
