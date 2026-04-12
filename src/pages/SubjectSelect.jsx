import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getSubjects, getQuestions } from '../data/dataService';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, PlayCircle, ArrowRight, Lock } from 'lucide-react';

export default function SubjectSelect({ scores }) {
    const navigate = useNavigate();
    const { user, updateProfile } = useAuth();
    const { t } = useTranslation();

    const allSubjects = getSubjects() || [];
    const subjects = allSubjects.filter(s => {
        if (!user) return true;
        const grade = parseInt(user.grade);
        if (s.id === 'chemistry' && grade < 7) return false;
        if (s.id === 'physics' && grade < 6) return false;
        return true;
    });
    const questions = getQuestions() || {};

    const completedCount = Object.keys(scores).length;

    // Filter questions for the user's grade to show correct count if needed
    // In our simple case, we just show the subjects, but the Test page will filter them.

    return (
        <div className="page subjects-page">
            <div className="orb orb-1" style={{ opacity: 0.08 }} />
            <div className="orb orb-2" style={{ opacity: 0.06 }} />

            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <span className="hero-badge" style={{ display: 'inline-flex' }}>
                    📚 {user ? t('subjectSelect.grade_subjects', { grade: user.grade, defaultValue: `${user.grade}-sinf uchun fanlar` }) : t('subjectSelect.select_grade_title', { defaultValue: 'Fan tanlang' })}
                </span>
            </div>
            <h1 className="section-title" style={{ textAlign: 'center' }}>
                {t('common.subjects_title', 'Qaysi fandan test ishlaysiz?')}
            </h1>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '8px' }}>
                {user ? t('common.subjects_subtitle_user', "Sizning sinfingizga mos maxsus savollar to'plami.") : t('common.subjects_subtitle_guest', "Ro'yxatdan o'ting va sinfingizni tanlang.")}
            </p>



            {!user && (
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px' }}>
                        {t('subjectSelect.register_prompt', { defaultValue: "Sinfni tanlash uchun ro'yxatdan o'ting" })}
                    </Link>
                </div>
            )}

            {/* Progress */}
            <div className="glass" style={{ maxWidth: 500, margin: '24px auto', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.85rem' }}>
                        <span>{t('subjectSelect.total_progress', { defaultValue: 'Umumiy progress' })}</span>
                        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{completedCount}/{subjects.length}</span>
                    </div>
                    <div className="score-bar-track">
                        <div
                            className="score-bar-fill"
                            style={{
                                width: `${(completedCount / subjects.length) * 100}%`,
                                background: 'linear-gradient(90deg, var(--primary), var(--accent))',
                            }}
                        />
                    </div>
                </div>
                {completedCount > 0 && (
                    <button className="btn btn-primary" onClick={() => navigate('/results')} style={{ whiteSpace: 'nowrap', padding: '10px 18px' }}>
                        {t('common.results', { defaultValue: 'Natijalar' })} <ArrowRight size={14} />
                    </button>
                )}
            </div>

            <div className="subjects-grid" style={{ position: 'relative', zIndex: 1 }}>
                {subjects.map((s, i) => {
                    const done = scores[s.id] !== undefined;
                    const score = scores[s.id];

                    // Count questions for this subject in the user's grade
                    const subjectQuestions = questions[s.id] || [];
                    const qCount = user
                        ? subjectQuestions.filter(q => q.grade === parseInt(user.grade)).length
                        : 0;

                    return (
                        <div
                            key={s.id}
                            className={`glass subject-card ${done ? 'done selected' : ''}`}
                            onClick={() => user ? navigate(`/test/${s.id}`) : navigate('/login')}
                            style={{ animationDelay: `${i * 0.06}s`, opacity: !user ? 0.7 : 1 }}
                            id={`subject-${s.id}`}
                        >
                            <span className="subject-emoji" style={{ fontSize: '2.8rem' }}>{s.emoji}</span>
                            <span className="subject-name">{s.name}</span>
                            <span className="subject-q-count">
                                {user ? (qCount > 0 ? `${qCount} ${t('subjectSelect.questions_count', { defaultValue: 'ta savol' })}` : t('subjectSelect.coming_soon', { defaultValue: 'Tez orada...' })) : t('subjectSelect.login_required', { defaultValue: 'Kirish kerak' })}
                            </span>

                            {done ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#34d399', fontSize: '0.85rem', fontWeight: 700 }}>
                                    <CheckCircle size={14} />
                                    {score}%
                                </div>
                            ) : (
                                !user ? <Lock size={14} color="var(--text-dim)" /> : <div className="subject-dot" />
                            )}
                        </div>
                    );
                })}
            </div>

            {completedCount >= 3 && (
                <div style={{ textAlign: 'center', marginTop: 40 }}>
                    <button className="btn btn-primary btn-lg" onClick={() => navigate('/results')}>
                        {t('subjectSelect.view_ai_analysis', { defaultValue: "AI Tahlilni Ko'rish" })} <ArrowRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
}
