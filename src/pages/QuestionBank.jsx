import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { getQuestions, getSubjects } from '../data/dataService';
import { ChevronDown, Search, BookOpen, GraduationCap } from 'lucide-react';

const AccordionItem = ({ title, children, isOpen, onClick, icon }) => (
    <div className="glass" style={{ marginBottom: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
        <button
            onClick={onClick}
            style={{
                width: '100%',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: isOpen ? 'rgba(var(--primary-rgb), 0.05)' : 'transparent',
                border: 'none',
                color: 'var(--text)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ color: 'var(--primary)', display: 'flex' }}>
                    {icon}
                </div>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', fontFamily: 'Outfit' }}>{title}</span>
            </div>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                <ChevronDown size={20} />
            </motion.div>
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                >
                    <div style={{ padding: '0 24px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

export default function QuestionBank() {
    const { t, i18n } = useTranslation();
    const [questions, setQuestions] = useState({});
    const [subjects, setSubjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openGrades, setOpenGrades] = useState({});
    const [openSubjects, setOpenSubjects] = useState({});

    useEffect(() => {
        setQuestions(getQuestions() || {});
        setSubjects(getSubjects() || []);
    }, []);

    const grades = [5, 6, 7, 8, 9, 10, 11];

    const toggleGrade = (grade) => {
        setOpenGrades(prev => ({ ...prev, [grade]: !prev[grade] }));
    };

    const toggleSubject = (grade, subjectId) => {
        const key = `${grade}-${subjectId}`;
        setOpenSubjects(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const filterQuestions = (qList) => {
        if (!searchTerm) return qList;
        const search = searchTerm.toLowerCase();
        return qList.filter(q => {
            const textUz = q.q?.uz || '';
            const textRu = q.q?.ru || '';
            const textEn = q.q?.en || '';
            return textUz.toLowerCase().includes(search) || textRu.toLowerCase().includes(search) || textEn.toLowerCase().includes(search);
        });
    };

    return (
        <div className="page" style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <p className="gradient-text" style={{ fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                    BILIMLAR OMBORI
                </p>
                <h1 style={{ fontFamily: 'Outfit', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: '24px' }}>
                    Savollar <span className="gradient-text">To'plami</span>
                </h1>

                <div className="glass" style={{ maxWidth: '600px', margin: '0 auto', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(var(--primary-rgb), 0.2)' }}>
                    <Search size={20} style={{ color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Savollardan izlash..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text)', width: '100%', padding: '12px 0', fontSize: '1rem', outline: 'none' }}
                    />
                </div>
            </div>

            {grades.map(grade => {
                const gradeQuestionsCount = subjects.reduce((acc, sub) => {
                    return acc + (questions[sub.id]?.filter(q => q.grade === grade).length || 0);
                }, 0);

                if (gradeQuestionsCount === 0 && !searchTerm) return null;

                return (
                    <AccordionItem
                        key={grade}
                        title={`${grade}-sinf (${gradeQuestionsCount} ta savol)`}
                        isOpen={openGrades[grade]}
                        onClick={() => toggleGrade(grade)}
                        icon={<GraduationCap size={24} />}
                    >
                        {subjects.map(subject => {
                            const subQuestions = (questions[subject.id] || []).filter(q => q.grade === grade);
                            const filteredSubQuestions = filterQuestions(subQuestions);

                            if (filteredSubQuestions.length === 0) return null;

                            return (
                                <div key={subject.id} style={{ marginTop: '16px' }}>
                                    <button
                                        onClick={() => toggleSubject(grade, subject.id)}
                                        style={{
                                            width: '100%',
                                            padding: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            background: 'rgba(var(--primary-rgb), 0.03)',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            borderRadius: '12px',
                                            color: 'var(--text)',
                                            cursor: 'pointer',
                                            marginBottom: '8px'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ fontSize: '1.2rem' }}>{subject.emoji}</span>
                                            <span style={{ fontWeight: 600 }}>{t(`subjects.${subject.id}`, { defaultValue: subject.name })}</span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{filteredSubQuestions.length} ta</span>
                                        </div>
                                        <ChevronDown size={16} style={{ transform: openSubjects[`${grade}-${subject.id}`] ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                                    </button>

                                    <AnimatePresence>
                                        {openSubjects[`${grade}-${subject.id}`] && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                            >
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '12px' }}>
                                                    {filteredSubQuestions.map((q, idx) => (
                                                        <div key={idx} className="glass" style={{ padding: '16px', fontSize: '0.95rem', border: '1px solid rgba(255,255,255,0.03)' }}>
                                                            <div style={{ fontWeight: 600, marginBottom: '8px' }}>
                                                                {idx + 1}. {q.q[i18n.language] || q.q.uz}
                                                            </div>
                                                            {q.type === 'test' && (
                                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', opacity: 0.8 }}>
                                                                    {(q.options[i18n.language] || q.options.uz).map((opt, oIdx) => (
                                                                        <div key={oIdx} style={{ fontSize: '0.85rem', color: oIdx === q.answer ? 'var(--success)' : 'inherit' }}>
                                                                            • {opt} {oIdx === q.answer && '✓'}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {q.type === 'input' && (
                                                                <div style={{ fontSize: '0.85rem', color: 'var(--success)' }}>
                                                                    To'g'ri javob: {(q.options[i18n.language] || q.options.uz)[0]}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </AccordionItem>
                );
            })}
        </div>
    );
}
