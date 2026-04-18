import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { getSubjects, addMessage } from '../data/dataService';
import { getAIRecommendation } from '../data/careers';
import { useAuth } from '../context/AuthContext';
import RadarChart from '../components/RadarChart';
import AICareerAdvisor from '../components/AICareerAdvisor';
import { RotateCcw, Trophy, Zap, Star, LayoutDashboard, ArrowRight, Sparkles, ThumbsUp, ThumbsDown, AlertTriangle, Send } from 'lucide-react';

const SUBJECT_COLORS = {
    math: '#6366f1', physics: '#8b5cf6', chemistry: '#10b981',
    biology: '#22c55e', history: '#f59e0b', english: '#3b82f6',
    literature: '#ec4899', informatics: '#06b6d4', uzbek: '#f97316',
    russian: '#ef4444',
};

export default function Results({ scores, onReset }) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useAuth();
    const [currentSection, setCurrentSection] = useState('home');
    const [showAIAdvisor, setShowAIAdvisor] = useState(false);
    const [radarScores, setRadarScores] = useState({});
    const [animBars, setAnimBars] = useState(false);

    const subjects = getSubjects() || [];

    const BADGE_DEFS = [
        { id: 'first', label: 'Birinchi qadam', emoji: '👶', cond: (s) => Object.keys(s).length >= 1 },
        { id: 'three', label: 'Uchlik', emoji: '🥉', cond: (s) => Object.keys(s).length >= 3 },
        { id: 'half', label: 'Yarim yo\'l', emoji: '🥈', cond: (s) => Object.keys(s).length >= Math.ceil(subjects.length / 2) },
        { id: 'all', label: 'To\'liq fan', emoji: '🏆', cond: (s) => Object.keys(s).length >= subjects.length },
        { id: 'perfect', label: 'Mukammal', emoji: '💯', cond: (s) => Object.values(s).some(v => v === 100) },
        { id: 'genius', label: 'Daho', emoji: '🧠', cond: (s) => Object.values(s).filter(v => v >= 80).length >= 3 },
    ];

    const subjectsWithScores = subjects.filter(s => scores[s.id] !== undefined);
    const avg = subjectsWithScores.length
        ? Math.round(subjectsWithScores.reduce((a, s) => a + scores[s.id], 0) / subjectsWithScores.length)
        : 0;

    const ai = getAIRecommendation(scores);
    const badges = BADGE_DEFS.map(b => ({ ...b, earned: b.cond(scores) }));

    useEffect(() => {
        setTimeout(() => setAnimBars(true), 200);
        const animated = {};
        subjects.forEach(s => { animated[s.id] = scores[s.id] ?? 0; });
        setTimeout(() => setRadarScores(animated), 300);

        // System notification
        if (Object.keys(scores).length > 0) {
            addMessage('system', `Test yakunlandi: ${user?.username || 'Anonim'} (${avg}%)`, 'Tizim', { scores });
        }
    }, [scores]); // avg is stable as it depends on scores

    const handleFeedback = (type, response, comment = '') => {
        addMessage('feedback', `${type}: ${response}. Izoh: ${comment}`, user?.username || 'Anonim', { type, response });
        alert('Rahmat! Fikringiz qabul qilindi.');
    };

    const handleReport = () => {
        const comment = window.prompt('Xatolik haqida qisqacha yozing:');
        if (comment) {
            addMessage('report', comment, user?.username || 'Anonim', { subjects: Object.keys(scores) });
            alert('Xabar yuborildi. Tekshiruv uchun rahmat!');
        }
    };

    if (Object.keys(scores).length === 0) {
        return (
            <div className="page results-page" style={{ textAlign: 'center', paddingTop: 200 }}>
                <span style={{ fontSize: '4rem' }}>😅</span>
                <h2 style={{ fontFamily: 'Outfit', fontSize: '1.8rem', margin: '16px 0' }}>Testlar ishlanmagan</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Avval kamida bitta fan bo'yicha test ishlang.</p>
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/subjects')}>Testni Boshlash</button>
            </div>
        );
    }

    return (
        <div className="page results-page">
            <div className="orb orb-1" style={{ opacity: 0.07 }} />
            <div className="orb orb-2" style={{ opacity: 0.05 }} />

            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <span style={{ fontSize: '3rem' }}>🎯</span>
                <h1 style={{ fontFamily: 'Outfit', fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 900, margin: '12px 0 8px' }}>
                    {user ? user.firstName : 'Foydalanuvchi'}, natijalaringiz!
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>
                    {subjectsWithScores.length} ta fan · O'rtacha: <strong style={{ color: 'var(--primary)' }}>{avg}%</strong>
                </p>
            </div>

            <div className="results-grid">

                <div className="glass ai-message-card">
                    <div className="ai-label"><Zap size={14} /> AI TAHLILI</div>
                    <p>{ai.message}</p>
                </div>

                <div className="glass radar-card">
                    <h3>🕸️ Bilimlar xaritasi</h3>
                    <RadarChart scores={radarScores} subjects={subjects} />
                </div>

                <div className="glass scores-card">
                    <h3>📊 Fan natijalari</h3>
                    {subjects.map((s) => {
                        const sc = scores[s.id];
                        if (sc === undefined) return null;
                        return (
                            <div className="score-item" key={s.id}>
                                <div className="score-label">
                                    <span>{s.emoji} {t(`subjects.${s.id}`, { defaultValue: s.name })}</span>
                                    <span style={{ color: sc >= 80 ? '#34d399' : sc >= 60 ? '#f59e0b' : '#f87171', fontWeight: 700 }}>{sc}%</span>
                                </div>
                                <div className="score-bar-track">
                                    <div
                                        className="score-bar-fill"
                                        style={{
                                            width: animBars ? `${sc}%` : '0%',
                                            background: `linear-gradient(90deg, ${SUBJECT_COLORS[s.id]}, ${SUBJECT_COLORS[s.id]}99)`,
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {ai.careers.length > 0 && (
                    <div className="careers-section">
                        <h3 style={{ fontFamily: 'Outfit', fontSize: '1.4rem', fontWeight: 800, marginBottom: 20 }}>
                            🚀 Tavsiya etilgan kasblar
                        </h3>
                        <div className="careers-grid">
                            {ai.careers.map((c, i) => (
                                <div className="career-card-wrapper" key={i}>
                                    <div className="career-card-inner">
                                        <div className="career-front glass">
                                            <div>
                                                <div className="career-icon">
                                                    {c.imageUrl ? (
                                                        <img src={c.imageUrl} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                                                    ) : (
                                                        c.icon
                                                    )}
                                                </div>
                                                <div className="career-title">{c.title}</div>
                                            </div>
                                            <div className="career-match">
                                                <div className="career-match-bar"><div className="career-match-fill" style={{ width: `${c.match}%` }} /></div>
                                                <span className="career-match-text">{c.match}%</span>
                                            </div>
                                        </div>
                                        <div className="career-back">
                                            <div style={{ fontWeight: 700, marginBottom: 8 }}>{c.title}</div>
                                            <p style={{ fontSize: '0.8rem' }}>{c.desc}</p>
                                            <div className="career-salary">💰 {c.salary}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="premium-ai-card" onClick={() => setShowAIAdvisor(true)}>
                    <div className="premium-ai-glow"></div>
                    <div className="premium-ai-content">
                        <div className="premium-ai-icon-wrapper">
                            <Sparkles className="premium-ai-icon" size={36} />
                        </div>
                        <div className="premium-ai-text">
                            <h3>AI Karyera Maslahatchisi bilan suhbat</h3>
                            <p>Test natijalaringiz asosida o'zingizga eng mos kelajak kasbini topish uchun sun'iy intellekt bilan yuzma-yuz maslahatlashing. Shaxsiy tavsiyalar olish uchun tugmani bosing!</p>
                        </div>
                    </div>
                    <button className="premium-ai-cta btn">
                        <Sparkles size={18} /> Maslahatlashish <ArrowRight size={18} />
                    </button>
                </div>

                <div className="glass badges-section">
                    <h3>🏅 Nishonlar</h3>
                    <div className="badges-grid">
                        {badges.map((b, i) => (
                            <div key={b.id} className={`badge-chip ${b.earned ? 'earned' : 'locked'}`}>
                                <span>{b.emoji}</span> {b.label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* New Feedback Sections */}
                <div className="glass" style={{ gridColumn: '1 / -1', padding: '32px', textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '16px' }}>Natijalar sizga foydali bo'ldimi?</h3>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button className="btn btn-outline" onClick={() => handleFeedback('Test Natijasi', 'Ha')}>
                            <ThumbsUp size={18} style={{ marginRight: '8px' }} /> Ha
                        </button>
                        <button className="btn btn-outline" onClick={() => handleFeedback('Test Natijasi', 'Yo\'q')}>
                            <ThumbsDown size={18} style={{ marginRight: '8px' }} /> Yo'q
                        </button>
                        <button className="btn btn-outline" style={{ color: 'var(--danger)' }} onClick={handleReport}>
                            <AlertTriangle size={18} style={{ marginRight: '8px' }} /> Xatolik haqida xabar berish
                        </button>
                    </div>
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 16 }}>
                    <button className="btn btn-outline btn-lg" onClick={() => navigate('/subjects')}>
                        Keyingi fanlar <ArrowRight size={18} />
                    </button>
                    {user && (
                        <button className="btn btn-outline btn-lg" onClick={() => navigate('/cabinet')}>
                            <LayoutDashboard size={18} /> Shaxsiy kabinet
                        </button>
                    )}
                    <button className="btn btn-outline btn-lg" onClick={() => { onReset(); navigate('/subjects'); }}>
                        <RotateCcw size={18} /> Qayta
                    </button>
                </div>

            </div>

            <AnimatePresence>
                {showAIAdvisor && (
                    <AICareerAdvisor
                        scores={scores}
                        onClose={() => setShowAIAdvisor(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
