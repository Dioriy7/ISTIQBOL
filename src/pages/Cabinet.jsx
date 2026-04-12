import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { subjects } from '../data/questions';
import RadarChart from '../components/RadarChart';
import { User, LogOut, Calendar, Award, BookOpen, ChevronRight, Settings, ArrowRight } from 'lucide-react';

export default function Cabinet() {
    const { user, logout, updateProfile } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedGrade, setSelectedGrade] = useState(user?.grade || '5');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        // Load user's test history from localStorage
        const savedHistory = JSON.parse(localStorage.getItem(`history_${user.username}`) || '[]');
        setHistory(savedHistory);
        setSelectedGrade(user.grade);
    }, [user, navigate]);

    if (!user) return null;

    const handleSaveProfile = () => {
        updateProfile({ grade: selectedGrade });
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setSelectedGrade(user.grade);
        setIsEditing(false);
    };

    // Calculate stats for radar chart based on latest tests of each subject (history is latest-first)
    const latestScores = {};
    history.forEach(test => {
        if (!latestScores[test.subjectId]) {
            latestScores[test.subjectId] = test;
        }
    });

    const radarData = {};
    subjects.forEach(s => {
        radarData[s.id] = latestScores[s.id]?.score || 0;
    });

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="page results-page">
            <div className="orb orb-1" style={{ opacity: 0.05 }} />
            <div className="orb orb-2" style={{ opacity: 0.05 }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '32px', marginTop: '40px' }}>

                {/* Profile Info Side */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="glass" style={{ padding: '32px', textAlign: 'center' }}>
                        <div style={{
                            width: '100px', height: '100px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                            margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '3rem', boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)'
                        }}>
                            {user?.username ? user.username[0].toUpperCase() : '?'}
                        </div>
                        <h2 style={{ fontFamily: 'Outfit', fontSize: '1.5rem', marginBottom: '4px' }}>{user?.firstName} {user?.lastName}</h2>

                        {!isEditing ? (
                            <>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>@{user?.username} · {user?.grade}-sinf o'quvchisi</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <button className="btn btn-outline" onClick={() => setIsEditing(true)} style={{ width: '100%', justifyContent: 'center' }}>
                                        <Settings size={16} /> Profilni tahrirlash
                                    </button>
                                    <button className="btn btn-outline" onClick={handleLogout} style={{ width: '100%', justifyContent: 'center', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                                        <LogOut size={16} /> Chiqish
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ textAlign: 'left' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Sinfingizni tanlang:</label>
                                    <select
                                        className="option-btn"
                                        value={selectedGrade}
                                        onChange={(e) => setSelectedGrade(e.target.value)}
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'var(--text)' }}
                                    >
                                        {[5, 6, 7, 8, 9, 10, 11].map(n => (
                                            <option key={n} value={n} style={{ background: 'var(--bg)', color: 'var(--text)' }}>
                                                {n}-sinf
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button className="btn btn-primary" onClick={handleSaveProfile} style={{ flex: 1, height: '40px', fontSize: '0.85rem' }}>Saqlash</button>
                                    <button className="btn btn-outline" onClick={handleCancelEdit} style={{ flex: 1, height: '40px', fontSize: '0.85rem' }}>Bekor qilish</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="glass" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Award size={18} color="var(--primary)" /> Erishilgan natijalar
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span>Umumiy testlar:</span>
                                <span style={{ fontWeight: '700' }}>{history.length} ta</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span>Tugallangan fanlar:</span>
                                <span style={{ fontWeight: '700' }}>{Object.keys(latestScores).length} ta</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Side */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        {/* Radar summary */}
                        <div className="glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '10px' }}>Bilimlar xaritasi</h3>
                            <div style={{ transform: 'scale(0.8)', margin: '-30px 0' }}>
                                <RadarChart scores={radarData} subjects={subjects} />
                            </div>
                        </div>

                        {/* Quick stats / History summary */}
                        <div className="glass" style={{ padding: '24px' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '20px' }}>So'nggi faollik</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {history.length > 0 ? history.slice(0, 3).map((test, i) => {
                                    const subject = subjects.find(s => s.id === test.subjectId);
                                    return (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ fontSize: '1.5rem' }}>{subject?.emoji}</span>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{t(`subjects.${subject?.id}`, { defaultValue: subject?.name })}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{test.date}</div>
                                            </div>
                                            <div style={{ fontWeight: '700', color: test.score >= 70 ? 'var(--success)' : 'var(--text)' }}>
                                                {test.score}%
                                            </div>
                                        </div>
                                    )
                                }) : (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginTop: '20px' }}>Hali testlar topshirilmagan</p>
                                )}
                            </div>
                            {history.length > 0 && (
                                <button className="btn btn-outline"
                                    onClick={() => document.getElementById('history-section').scrollIntoView({ behavior: 'smooth' })}
                                    style={{ width: '100%', marginTop: '20px', fontSize: '0.8rem' }}>
                                    Barcha tarixni ko'rish
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="glass" style={{ padding: '32px' }} id="history-section">
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <BookOpen size={20} color="var(--primary)" /> Tavsiya etilgan yo'nalishlar
                        </h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
                            Sizning natijalaringiz asosida AI tomonidan shakllantirilgan shaxsiy tavsiyalaringizni ko'rish uchun fanlarni yakunlang.
                        </p>
                        <button className="btn btn-primary" onClick={() => navigate('/subjects')}>
                            O'qishni davom ettirish <ArrowRight size={18} />
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}
