import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestions, getSubjects } from '../data/dataService';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle, ArrowRight, Home } from 'lucide-react';

const LETTERS = ['A', 'B', 'C', 'D'];

export default function Test({ onComplete }) {
    const { subjectId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t, i18n } = useTranslation();

    const [subjects, setSubjects] = useState([]);
    const [questions, setQuestions] = useState({});
    const [qs, setQs] = useState([]);

    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [correct, setCorrect] = useState(0);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const subjs = getSubjects();
        const questns = getQuestions();
        setSubjects(subjs);
        setQuestions(questns);

        if (subjectId && questns[subjectId]) {
            const subjectQuestions = questns[subjectId] || [];
            // Filter questions for the user's grade
            const filtered = subjectQuestions.filter(q => q.grade === parseInt(user.grade));
            // If no questions for this grade, use all (fallback)
            setQs(filtered.length > 0 ? filtered : subjectQuestions);
        }

        // Reset state on subject change
        setCurrent(0);
        setSelected(null);
        setAnswered(false);
        setInputValue('');
        setCorrect(0);
        setFinished(false);
    }, [subjectId, user, navigate]); // Removed i18n.language to prevent reset on language change

    const handleNext = () => {
        if (current + 1 >= qs.length) {
            const isLastCorrect = answered && (qs[current]?.type === 'input' ? selected === true : selected === qs[current]?.answer);
            const actualFinalScore = Math.min(100, Math.round((correct / qs.length) * 100));

            onComplete(subjectId, actualFinalScore, user.grade);

            // Save to user history
            const history = JSON.parse(localStorage.getItem(`history_${user.username}`) || '[]');
            history.unshift({
                subjectId,
                score: actualFinalScore,
                date: new Date().toISOString(),
                grade: user.grade
            });
            localStorage.setItem(`history_${user.username}`, JSON.stringify(history));

            // Force evaluate final finalScore using actualFinalScore because setFinished re-renders
            setFinished(true);
        } else {
            setCurrent(prev => prev + 1);
            setSelected(null);
            setAnswered(false);
            setInputValue('');
        }
    };

    // Auto-next logic: move to next question after 1.5s when answered
    useEffect(() => {
        if (answered && !finished) {
            const timer = setTimeout(() => {
                handleNext();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [answered, finished]);

    if (!user) return null;
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject || qs.length === 0) {
        return (
            <div className="page test-page" style={{ textAlign: 'center', paddingTop: 200 }}>
                <h2>{t('test.no_questions', { grade: user.grade, defaultValue: `Savollar topilmadi (${user.grade}-sinf uchun)` })}</h2>
                <button className="btn btn-primary" onClick={() => navigate('/subjects')}>{t('common.back', { defaultValue: 'Orqaga' })}</button>
            </div>
        );
    }

    const q = qs[current];
    const progress = ((current) / qs.length) * 100;

    const getQuestionText = (qData) => {
        if (typeof qData === 'string') return qData;
        const lang = i18n.language.split('-')[0];
        return qData[lang] || qData.uz || '';
    };
    const getOptionsList = (optionsData) => {
        if (Array.isArray(optionsData)) return optionsData;
        const lang = i18n.language.split('-')[0];
        return optionsData[lang] || optionsData.uz || [];
    };

    const handleSelect = (optIdx) => {
        if (answered) return;
        setSelected(optIdx);
        setAnswered(true);
        if (optIdx === q.answer) {
            setCorrect(prev => prev + 1);
        }
    };

    const handleInputSubmit = () => {
        if (answered || !inputValue.trim()) return;
        setAnswered(true);
        const correctAns = getOptionsList(q.options)[0] || q.textAnswer || '';
        if (inputValue.trim().toLowerCase() === correctAns.toLowerCase()) {
            setCorrect(prev => prev + 1);
            setSelected(true);
        } else {
            setSelected(false);
        }
    };


    const finalScore = finished ? Math.min(100, Math.round((correct / qs.length) * 100)) : 0;

    if (finished) {
        return (
            <div className="page test-page" style={{ textAlign: 'center' }}>
                <div className="glass" style={{ padding: '48px 40px', maxWidth: 480, margin: '0 auto' }}>
                    <div style={{
                        width: 120, height: 120, borderRadius: '50%',
                        background: `conic-gradient(${finalScore >= 60 ? '#10b981' : finalScore >= 40 ? '#f59e0b' : '#ef4444'} ${finalScore * 3.6}deg, rgba(255,255,255,0.06) 0deg)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 24px',
                        boxShadow: finalScore >= 60 ? 'var(--glow-success)' : 'none',
                    }}>
                        <div style={{
                            width: 96, height: 96, borderRadius: '50%',
                            background: 'var(--bg)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexDirection: 'column',
                        }}>
                            <span style={{ fontSize: '1.8rem', fontFamily: 'Outfit', fontWeight: 900 }}>{finalScore}%</span>
                        </div>
                    </div>

                    <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>
                        {finalScore >= 80 ? '🏆' : finalScore >= 60 ? '🎉' : finalScore >= 40 ? '💪' : '📖'}
                    </div>

                    <h2 style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 800, marginBottom: 8 }}>
                        {subject.name} — {finalScore >= 80 ? t('test.amazing', { defaultValue: 'Ajoyib!' }) : finalScore >= 60 ? t('test.good', { defaultValue: 'Yaxshi!' }) : finalScore >= 40 ? t('test.okay', { defaultValue: 'Yaxshi!' }) : t('test.study_more', { defaultValue: "O'qing!" })}
                    </h2>

                    <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>
                        {correct}/{qs.length} {t('test.answered_correctly', { defaultValue: "ta savolga to'g'ri javob berdingiz" })}
                    </p>

                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button className="btn btn-primary" onClick={() => navigate('/subjects')}>
                            <ArrowRight size={16} /> {t('common.other_subject', { defaultValue: 'Boshqa fan' })}
                        </button>
                        <button className="btn btn-outline" onClick={() => navigate('/cabinet')}>
                            {t('common.cabinet_enter', { defaultValue: 'Kabinetga kirish' })}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page test-page">
            <div className="test-header">
                <div className="test-progress-bar">
                    <div className="test-progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="test-meta">
                    <span>{subject.emoji} {t(`subjects.${subject.id}`, { defaultValue: subject.name })} ({user.grade}-sinf)</span>
                    <span>{current + 1} / {qs.length}</span>
                </div>
            </div>

            <div className="question-card glass" key={current}>
                <div className="question-subject-badge">
                    {subject.emoji} {t(`subjects.${subject.id}`, { defaultValue: subject.name })}
                </div>
                <div className="question-text">{getQuestionText(q.q)}</div>

                {q.imageUrl && (
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <img
                            src={q.imageUrl}
                            alt={t('test.question_image', { defaultValue: "Savol rasmi" })}
                            style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '8px', border: '1px solid var(--border)' }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/600x400/2a2a35/ffffff?text=Image+Not+Available';
                            }}
                        />
                    </div>
                )}

                {q.type === 'input' ? (
                    <div style={{ marginTop: '20px' }}>
                        <input
                            type="text"
                            className="option-btn"
                            placeholder={t('test.enter_answer', { defaultValue: 'Javobni kiriting...' })}
                            style={{ width: '100%', marginBottom: '10px', background: 'var(--bg)', color: 'var(--text)', textAlign: 'center', fontSize: '1.1rem' }}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={answered}
                            onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
                        />
                        {!answered && (
                            <button className="btn btn-primary" onClick={handleInputSubmit} style={{ width: '100%', justifyContent: 'center' }}>{t('common.check', { defaultValue: "Tekshirish" })}</button>
                        )}
                    </div>
                ) : (
                    <div className="options-grid">
                        {getOptionsList(q.options).map((opt, i) => {
                            let cls = 'option-btn';
                            if (answered) {
                                if (i === q.answer) cls += ' correct';
                                else if (i === selected) cls += ' wrong';
                            }
                            return (
                                <button
                                    key={i}
                                    className={cls}
                                    onClick={() => handleSelect(i)}
                                    disabled={answered}
                                >
                                    <span className="option-letter">{LETTERS[i]}</span>
                                    {opt}
                                    {answered && i === q.answer && <CheckCircle size={16} style={{ marginLeft: 'auto', color: '#34d399' }} />}
                                    {answered && i === selected && i !== q.answer && <XCircle size={16} style={{ marginLeft: 'auto', color: '#f87171' }} />}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {answered && (
                <div className={`feedback-banner ${(q.type === 'input' ? selected === true : selected === q.answer) ? 'correct' : 'wrong'}`}>
                    {(q.type === 'input' ? selected === true : selected === q.answer)
                        ? <><CheckCircle size={20} /> {t('test.correct', { defaultValue: "To'g'ri!" })}</>
                        : <><XCircle size={20} /> {t('test.wrong_correct_is', { defaultValue: "Xato. To'g'ri:" })} {q.type === 'input' ? (getOptionsList(q.options)[0] || q.textAnswer) : getOptionsList(q.options)[q.answer]}</>
                    }
                </div>
            )}

            {answered && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                    <button className="btn btn-primary" onClick={handleNext} id="next-btn">
                        {current + 1 >= qs.length ? t('common.finish', { defaultValue: 'Tugatish' }) : t('common.next', { defaultValue: 'Keyingi' })}
                        <ArrowRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}
