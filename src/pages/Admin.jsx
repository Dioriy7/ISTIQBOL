import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom';
import {
    api, getSubjects, getSettings, saveSettings,
    getUsers, saveUsers, getCareers, saveCareers, getMessages, saveMessages, addMessage, getStats
} from '../data/dataService';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, Users, BookOpen, Briefcase, FileText,
    Settings, MessageSquare, LogOut, Plus, Edit2, Trash2, ChevronDown, GraduationCap,
    Save, X, Search, Filter, TrendingUp, Users as UsersIcon,
    CheckCircle, AlertCircle, Shield, ThumbsUp, AlertTriangle, Zap
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// --- Sub-components for Sections ---

const DashboardView = () => {
    const stats = getStats();
    return (
        <div className="admin-view">
            <div className="admin-header">
                <h2>Boshqaruv Paneli</h2>
                <div className="hero-badge">Oxirgi yangilanish: Bugun</div>
            </div>

            <div className="stat-grid">
                <div className="stat-card glass">
                    <div className="stat-icon"><UsersIcon size={24} /></div>
                    <div className="stat-value">{stats.totalUsers}</div>
                    <div className="stat-label">Jami foydalanuvchilar</div>
                </div>
                <div className="stat-card glass">
                    <div className="stat-icon" style={{ borderColor: 'var(--success)', color: 'var(--success)' }}><CheckCircle size={24} /></div>
                    <div className="stat-value">{stats.totalTests}</div>
                    <div className="stat-label">Topshirilgan testlar</div>
                </div>
                <div className="stat-card glass">
                    <div className="stat-icon" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}><TrendingUp size={24} /></div>
                    <div className="stat-value">{stats.activeNow}</div>
                    <div className="stat-label">Hozir onlayn</div>
                </div>
            </div>

            <div className="stat-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
                <div className="glass" style={{ padding: '24px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Ommabop fanlar (Trend)</h3>
                    <div className="chart-bar-container">
                        {stats.popularSubjects.map((s, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <div className="chart-bar" style={{ height: `${s.count * 2}px`, width: '100%' }}></div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="glass" style={{ padding: '24px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Tizim xabarnomalari</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.85rem' }}>
                            <div style={{ fontWeight: 'bold' }}>Yangi feedback</div>
                            <div style={{ color: 'var(--text-muted)' }}>Foydalanuvchi "Sarvar" xabar qoldirdi.</div>
                        </div>
                        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.85rem' }}>
                            <div style={{ fontWeight: 'bold' }}>Tizim yangilanishi</div>
                            <div style={{ color: 'var(--text-muted)' }}>AI modeli parametrlari yangilandi.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const UsersView = () => {
    const [users, setUsers] = useState(getUsers());
    const [searchTerm, setSearchTerm] = useState('');

    const handleAction = (username, action) => {
        if (window.confirm(`Haqiqatdan ham ushbu amalni bajarmoqchimisiz?`)) {
            const updatedUsers = users.map(u => {
                if (u.username === username) {
                    if (action === 'block') return { ...u, isBlocked: !u.isBlocked };
                    if (action === 'makeAdmin') return { ...u, role: u.role === 'admin' ? 'user' : 'admin' };
                }
                return u;
            });
            if (action === 'delete') {
                const filtered = users.filter(u => u.username !== username);
                setUsers(filtered);
                saveUsers(filtered);
            } else {
                setUsers(updatedUsers);
                saveUsers(updatedUsers);
            }
        }
    };

    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.grade?.toString().includes(searchTerm)
    );

    return (
        <div className="admin-view">
            <div className="admin-header">
                <h2>Foydalanuvchilar Boshqaruvi</h2>
                <input
                    type="text"
                    placeholder="Search users..."
                    className="search-bar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Foydalanuvchi</th>
                            <th>Sinf</th>
                            <th>Rol</th>
                            <th>Status</th>
                            <th>Amallar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((u, i) => (
                            <tr key={i}>
                                <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                                        {u.username[0].toUpperCase()}
                                    </div>
                                    {u.username}
                                </td>
                                <td>{u.grade}-sinf</td>
                                <td>
                                    <span className={`status-badge ${u.role === 'admin' ? 'admin' : 'user'}`}>
                                        {u.role || 'user'}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${u.isBlocked ? 'blocked' : 'user'}`}>
                                        {u.isBlocked ? 'Blocked' : 'Active'}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn btn-outline" style={{ padding: '6px' }} onClick={() => handleAction(u.username, 'makeAdmin')} title="Change Role">
                                            <Shield size={14} />
                                        </button>
                                        <button className="btn btn-outline" style={{ padding: '6px' }} onClick={() => handleAction(u.username, 'block')} title={u.isBlocked ? 'Unblock' : 'Block'}>
                                            <AlertCircle size={14} />
                                        </button>
                                        <button className="btn btn-outline" style={{ padding: '6px', color: '#ef4444' }} onClick={() => handleAction(u.username, 'delete')} title="Delete">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AccordionItem = ({ title, children, isOpen, onClick, icon }) => (
    <div className="glass" style={{ marginBottom: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
        <button
            onClick={onClick}
            style={{
                width: '100%',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: isOpen ? 'rgba(var(--primary-rgb), 0.05)' : 'transparent',
                border: 'none',
                color: 'var(--text)',
                cursor: 'pointer',
                textAlign: 'left'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ color: 'var(--primary)', display: 'flex' }}>
                    {icon}
                </div>
                <span style={{ fontWeight: 600, fontSize: '1rem' }}>{title}</span>
            </div>
            <div style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: '0.3s' }}>
                <ChevronDown size={18} />
            </div>
        </button>
        {isOpen && (
            <div style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                {children}
            </div>
        )}
    </div>
);

const QuestionsView = () => {
    const { t, i18n } = useTranslation();
    const [subjects, setSubjects] = useState([]);
    const [questions, setQuestions] = useState({});
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'bank'

    const [openGrades, setOpenGrades] = useState({});
    const [openSubjects, setOpenSubjects] = useState({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const subjs = getSubjects() || []; // static for now
            const sortedSubjs = [...subjs].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            setSubjects(sortedSubjs);
            if (sortedSubjs.length > 0) setSelectedSubject(sortedSubjs[0].id);

            const qData = await api.questions.getAll();
            setQuestions(qData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        grade: 5,
        type: 'test',
        imageUrl: '',
        q: { uz: '', ru: '', en: '' },
        options: { uz: ['', '', '', ''], ru: ['', '', '', ''], en: ['', '', '', ''] },
        answer: 0
    });

    const handleSave = async () => {
        if (!selectedSubject) return alert('Iltimos, fanni tanlang');
        if (!formData.q.uz.trim()) return alert('Savol matni (UZ) bo\'sh bo\'lmasligi kerak');

        setLoading(true);
        try {
            if (editingId) {
                await api.questions.update(selectedSubject, editingId, formData);
            } else {
                await api.questions.create(selectedSubject, formData);
            }
            await loadData();
            resetForm();
        } catch (err) {
            alert('Saqlashda xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Haqiqatdan ham o\'chirmoqchimisiz?')) {
            setLoading(true);
            try {
                await api.questions.delete(selectedSubject, id);
                await loadData();
            } catch (err) {
                alert('O\'chirishda xatolik');
            } finally {
                setLoading(false);
            }
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setIsAdding(false);
        setFormData({
            grade: selectedGrade !== 'all' ? parseInt(selectedGrade) : 5,
            type: 'test',
            imageUrl: '',
            q: { uz: '', ru: '', en: '' },
            options: { uz: ['', '', '', ''], ru: ['', '', '', ''], en: ['', '', '', ''] },
            answer: 0
        });
    };

    const startEdit = (q) => {
        setFormData({
            grade: q.grade,
            type: q.type || 'test',
            imageUrl: q.imageUrl || '',
            q: typeof q.q === 'string' ? { uz: q.q, ru: q.q, en: q.q } : q.q,
            options: Array.isArray(q.options) ? { uz: q.options, ru: q.options, en: q.options } : (q.options || { uz: ['', '', '', ''], ru: ['', '', '', ''], en: ['', '', '', ''] }),
            answer: q.answer || 0
        });
        setEditingId(q.id);
        setIsAdding(true);
    };

    const filteredList = (questions[selectedSubject] || []).filter(q => {
        const matchGrade = selectedGrade === 'all' || q.grade === parseInt(selectedGrade);
        const search = searchTerm.toLowerCase();
        const matchSearch = (q.q?.uz || '').toLowerCase().includes(search) ||
            (q.q?.ru || '').toLowerCase().includes(search) ||
            (q.q?.en || '').toLowerCase().includes(search);
        return matchGrade && matchSearch;
    });

    const toggleGrade = (grade) => setOpenGrades(p => ({ ...p, [grade]: !p[grade] }));
    const toggleSub = (g, s) => setOpenSubjects(p => ({ ...p, [`${g}-${s}`]: !p[`${g}-${s}`] }));

    if (loading && Object.keys(questions).length === 0) return <div className="admin-view">Yuklanmoqda...</div>;

    return (
        <div className="admin-view">
            <div className="admin-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <h2>Savollar Boshqaruvi</h2>
                    <div className="glass" style={{ display: 'flex', padding: '4px', borderRadius: '10px' }}>
                        <button
                            className={`btn ${viewMode === 'table' ? 'btn-primary' : ''}`}
                            style={{ padding: '6px 16px', fontSize: '0.8rem' }}
                            onClick={() => setViewMode('table')}
                        >
                            Jadval
                        </button>
                        <button
                            className={`btn ${viewMode === 'bank' ? 'btn-primary' : ''}`}
                            style={{ padding: '6px 16px', fontSize: '0.8rem' }}
                            onClick={() => setViewMode('bank')}
                        >
                            Bankni Ko'rish
                        </button>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                        type="text"
                        placeholder="Savollardan izlash..."
                        className="search-bar"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '250px' }}
                    />
                    <button className="btn btn-primary" onClick={() => { resetForm(); setIsAdding(true); }}>
                        <Plus size={18} /> Yangi savol
                    </button>
                </div>
            </div>

            {viewMode === 'table' ? (
                <>
                    <div className="glass" style={{ padding: '16px', marginBottom: '24px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Sinf:</span>
                            <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)} className="search-bar" style={{ width: '120px' }}>
                                <option value="all">Barchasi</option>
                                {[5, 6, 7, 8, 9, 10, 11].map(g => <option key={g} value={g}>{g}-sinf</option>)}
                            </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Fan:</span>
                            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="search-bar" style={{ width: '180px' }}>
                                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            <Filter size={16} />
                            Jami: {filteredList.length} ta savol
                        </div>
                    </div>

                    {isAdding && (
                        <div className="glass" style={{ padding: '24px', marginBottom: '24px', border: '1px solid var(--primary)' }}>
                            <h3 style={{ marginBottom: '20px' }}>{editingId ? 'Savolni tahrirlash' : 'Yangi savol qo\'shish'}</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                <div>
                                    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: '0.85rem' }}>Sinf:</label>
                                            <select value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: parseInt(e.target.value) })} className="search-bar" style={{ width: '100%', marginTop: '6px' }}>
                                                {[5, 6, 7, 8, 9, 10, 11].map(g => <option key={g} value={g}>{g}-sinf</option>)}
                                            </select>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: '0.85rem' }}>Tur:</label>
                                            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="search-bar" style={{ width: '100%', marginTop: '6px' }}>
                                                <option value="test">Test (Variantli)</option>
                                                <option value="input">Yozma (Javob yoziladi)</option>
                                            </select>
                                        </div>
                                    </div>
                                    {['uz', 'ru', 'en'].map(lang => (
                                        <div key={lang} style={{ marginBottom: '16px' }}>
                                            <label style={{ fontSize: '0.85rem' }}>Savol ({lang.toUpperCase()}):</label>
                                            <textarea
                                                value={formData.q[lang]}
                                                onChange={(e) => setFormData({ ...formData, q: { ...formData.q, [lang]: e.target.value } })}
                                                className="search-bar"
                                                style={{ width: '100%', minHeight: '80px', marginTop: '6px' }}
                                                placeholder={`${lang.toUpperCase()} tilida savol matni...`}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.9rem', fontWeight: 700, display: 'block', marginBottom: '12px' }}>Javoblar va variantlar:</label>
                                    {['uz', 'ru', 'en'].map(lang => (
                                        <div key={lang} style={{ marginBottom: '16px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <h4 style={{ fontSize: '0.75rem', marginBottom: '10px', color: 'var(--primary)', letterSpacing: '0.05em' }}>{lang.toUpperCase()} TILIDA</h4>
                                            {[0, 1, 2, 3].map(i => (
                                                <div key={i} style={{ display: formData.type === 'input' && i > 0 ? 'none' : 'flex', gap: '10px', marginBottom: '8px', alignItems: 'center' }}>
                                                    {formData.type !== 'input' && (
                                                        <input
                                                            type="radio"
                                                            name={`correct-${lang}`}
                                                            checked={formData.answer === i}
                                                            onChange={() => setFormData({ ...formData, answer: i })}
                                                            style={{ cursor: 'pointer' }}
                                                        />
                                                    )}
                                                    <input
                                                        type="text"
                                                        value={formData.options[lang][i]}
                                                        onChange={(e) => {
                                                            const n = JSON.parse(JSON.stringify(formData.options));
                                                            n[lang][i] = e.target.value;
                                                            setFormData({ ...formData, options: n });
                                                        }}
                                                        className="search-bar"
                                                        style={{ flex: 1, padding: '8px' }}
                                                        placeholder={formData.type === 'input' ? "To'g'ri javobni yozing..." : `Variant ${i + 1}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <button className="btn btn-outline" onClick={resetForm}>Bekor qilish</button>
                                <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                                    <Save size={18} /> {loading ? 'Saqlanmoqda...' : 'Saqlash'}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '80px' }}>Sinf</th>
                                    <th>Savol matni</th>
                                    <th style={{ width: '120px' }}>Turi</th>
                                    <th style={{ width: '100px' }}>Amallar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredList.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                            Bu bo'limda savollar mavjud emas.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredList.map((q) => (
                                        <tr key={q.id}>
                                            <td><span className="hero-badge" style={{ margin: 0, background: 'rgba(var(--primary-rgb), 0.1)' }}>{q.grade}-sinf</span></td>
                                            <td style={{ maxWidth: '400px' }}>
                                                <div style={{ fontWeight: 600, marginBottom: '4px' }}>{typeof q.q === 'string' ? q.q : (q.q?.[i18n.language] || q.q?.uz || 'Savol matni yo\'q')}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--success)' }}>
                                                    {(() => {
                                                        const opts = Array.isArray(q.options) ? q.options : (q.options?.uz || []);
                                                        return `To'g'ri javob: ${q.type === 'input' ? opts[0] : opts[q.answer]}`;
                                                    })()}
                                                </div>
                                            </td>
                                            <td><span className="status-badge user" style={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>{q.type || 'test'}</span></td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button className="btn btn-outline" style={{ padding: '8px' }} onClick={() => startEdit(q)}><Edit2 size={14} /></button>
                                                    <button className="btn btn-outline" style={{ padding: '8px', color: '#ef4444' }} onClick={() => handleDelete(q.id)}><Trash2 size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <div style={{ marginTop: '20px' }}>
                    {[5, 6, 7, 8, 9, 10, 11].map(grade => {
                        const gradeQuestionsCount = subjects.reduce((acc, sub) => {
                            return acc + (questions[sub.id]?.filter(q => q.grade === grade).length || 0);
                        }, 0);
                        if (gradeQuestionsCount === 0) return null;

                        return (
                            <AccordionItem
                                key={grade}
                                title={`${grade}-sinf (${gradeQuestionsCount} ta savol)`}
                                isOpen={openGrades[grade]}
                                onClick={() => toggleGrade(grade)}
                                icon={<GraduationCap size={20} />}
                            >
                                {subjects.map(subject => {
                                    const subQuestions = (questions[subject.id] || []).filter(q => q.grade === grade);
                                    if (subQuestions.length === 0) return null;

                                    return (
                                        <div key={subject.id} style={{ marginTop: '12px' }}>
                                            <button
                                                onClick={() => toggleSub(grade, subject.id)}
                                                className="glass"
                                                style={{ width: '100%', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: 'none', cursor: 'pointer', marginBottom: '8px', color: 'inherit' }}
                                            >
                                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                    <span>{subject.emoji}</span>
                                                    <span>{subject.name}</span>
                                                    <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>{subQuestions.length} ta</span>
                                                </div>
                                                <ChevronDown size={14} style={{ transform: openSubjects[`${grade}-${subject.id}`] ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                                            </button>
                                            {openSubjects[`${grade}-${subject.id}`] && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '12px' }}>
                                                    {subQuestions.map((q, idx) => (
                                                        <div key={q.id} className="glass" style={{ padding: '12px', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.02)' }}>
                                                            <div style={{ fontWeight: 600, marginBottom: '6px' }}>{idx + 1}. {q.q?.[i18n.language] || q.q?.uz || 'Savol matni yo\'q'}</div>
                                                            <div style={{ fontSize: '0.8rem', color: 'var(--success)' }}>
                                                                ✓ {Array.isArray(q.options) ? q.options[q.answer] : (q.options?.uz?.[q.answer] || q.options?.uz?.[0])}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </AccordionItem>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const CareersView = () => {
    const [careers, setCareers] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: { uz: '', ru: '', en: '' },
        description: { uz: '', ru: '', en: '' },
        icon: '🚀',
        imageUrl: '',
        category: 'it',
        subjects: []
    });

    useEffect(() => {
        loadCareers();
    }, []);

    const loadCareers = async () => {
        setLoading(true);
        try {
            const data = await api.professions.getAll();
            setCareers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { id: 'it', label: 'IT & Texnologiya' },
        { id: 'medical', label: 'Tibbiyot' },
        { id: 'engineering', label: 'Muhandislik' },
        { id: 'education', label: 'Ta\'lim' },
        { id: 'business', label: 'Biznes & Moliya' },
        { id: 'arts', label: 'San\'at & Madaniyat' },
        { id: 'law', label: 'Huquqshunoslik' },
    ];

    const handleSave = async () => {
        if (!formData.title.uz.trim()) return alert('Kasb nomi (UZ) bo\'lishi shart');
        if (!formData.imageUrl.trim()) return alert('Rasm havolasi bo\'lishi shart');

        setLoading(true);
        try {
            if (editingId) {
                await api.professions.update(editingId, formData);
            } else {
                await api.professions.create(formData);
            }
            await loadCareers();
            resetForm();
        } catch (err) {
            alert('Saqlashda xatolik');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Ochirish?')) {
            setLoading(true);
            try {
                await api.professions.delete(id);
                await loadCareers();
            } catch (err) {
                alert('O\'chirishda xatolik');
            } finally {
                setLoading(false);
            }
        }
    };

    const resetForm = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({
            title: { uz: '', ru: '', en: '' },
            description: { uz: '', ru: '', en: '' },
            icon: '🚀',
            imageUrl: '',
            category: 'it',
            subjects: []
        });
    };

    const startEdit = (c) => {
        setFormData(c);
        setEditingId(c.id);
        setIsAdding(true);
    };

    if (loading && careers.length === 0) return <div className="admin-view">Yuklanmoqda...</div>;

    return (
        <div className="admin-view">
            <div className="admin-header">
                <h2>Kasblar Boshqaruvi</h2>
                <button className="btn btn-primary" onClick={() => { resetForm(); setIsAdding(true); }}>
                    <Plus size={18} /> Yangi kasb
                </button>
            </div>

            {isAdding && (
                <div className="glass" style={{ padding: '24px', marginBottom: '24px' }}>
                    <h3 style={{ marginBottom: '20px' }}>{editingId ? 'Kasbni tahrirlash' : 'Yangi kasb qo\'shish'}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                        <div>
                            {['uz', 'ru', 'en'].map(l => (
                                <div key={l} style={{ marginBottom: '16px' }}>
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sarlavha ({l.toUpperCase()}):</label>
                                    <input
                                        type="text"
                                        value={formData.title[l]}
                                        onChange={(e) => setFormData({ ...formData, title: { ...formData.title, [l]: e.target.value } })}
                                        className="search-bar"
                                        style={{ width: '100%', marginTop: '6px' }}
                                        placeholder="Kasb nomi..."
                                    />
                                </div>
                            ))}
                            <div style={{ marginTop: '20px' }}>
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Emoji Icon:</label>
                                <input
                                    type="text"
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    className="search-bar"
                                    style={{ width: '100%', marginTop: '6px', fontSize: '1.5rem', textAlign: 'center' }}
                                />
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Maslahat: Win + . (nuqta) orqali emoji tanlang</p>
                            </div>
                            <div style={{ marginTop: '20px' }}>
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Kategoriya:</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="search-bar"
                                    style={{ width: '100%', marginTop: '6px' }}
                                >
                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                                </select>
                            </div>
                            <div style={{ marginTop: '20px' }}>
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Rasm Havolasi (Image URL):</label>
                                <input
                                    type="text"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    className="search-bar"
                                    style={{ width: '100%', marginTop: '6px' }}
                                    placeholder="https://example.com/image.jpg"
                                />
                                {formData.imageUrl && (
                                    <div style={{ marginTop: '10px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', height: '120px' }}>
                                        <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            {['uz', 'ru', 'en'].map(l => (
                                <div key={l} style={{ marginBottom: '16px' }}>
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tavsif ({l.toUpperCase()}):</label>
                                    <textarea
                                        value={formData.description[l]}
                                        onChange={(e) => setFormData({ ...formData, description: { ...formData.description, [l]: e.target.value } })}
                                        className="search-bar"
                                        style={{ width: '100%', height: '80px', marginTop: '6px', padding: '12px' }}
                                        placeholder="Kasb haqida qisqacha ma'lumot..."
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                        <button className="btn btn-outline" onClick={resetForm} disabled={loading}>Bekor qilish</button>
                        <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                            <Save size={18} /> {loading ? 'Saqlanmoqda...' : 'Saqlash'}
                        </button>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {careers.length === 0 ? (
                    <div className="glass" style={{ padding: '40px', textAlign: 'center', gridColumn: '1/-1', color: 'var(--text-muted)' }}>
                        Hozircha kasblar yo'q.
                    </div>
                ) : (
                    careers.map((c) => (
                        <div key={c.id} className="stat-card glass" style={{ minHeight: 'auto', display: 'flex', flexDirection: 'column', padding: '16px' }}>
                            <div style={{ height: '140px', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', background: 'rgba(255,255,255,0.02)' }}>
                                {c.imageUrl ? (
                                    <img src={c.imageUrl} alt={c.title?.uz || 'Kasb'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>{c.icon}</div>
                                )}
                            </div>
                            <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '4px' }}>{c.title?.uz || 'Noma\'lum kasb'}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                                {categories.find(cat => cat.id === c.category)?.label || 'Uncategorized'}
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>
                                {c.description?.uz || ''}
                            </p>
                            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                                <button className="btn btn-outline" style={{ padding: '8px', flex: 1 }} onClick={() => startEdit(c)}><Edit2 size={16} /></button>
                                <button className="btn btn-outline" style={{ padding: '8px', color: '#ef4444', flex: 1 }} onClick={() => handleDelete(c.id)}><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const SettingsView = () => {
    const [settings, setSettings] = useState(getSettings());
    const handleSave = () => {
        saveSettings(settings);
        alert('Sozlamalar saqlandi!');
    };

    return (
        <div className="admin-view">
            <div className="admin-header">
                <h2>Tizim Sozlamalari</h2>
                <button className="btn btn-primary" onClick={handleSave}>
                    <Save size={18} /> Saqlash
                </button>
            </div>

            <div className="glass" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label>Sayt nomi:</label>
                    <input type="text" value="Istiqbol" readOnly className="search-bar" style={{ width: '100%', marginTop: '8px', opacity: 0.7 }} />
                </div>
                <div>
                    <label>Telegram Bot Havolasi:</label>
                    <input type="text" value={settings.telegram} onChange={(e) => setSettings({ ...settings, telegram: e.target.value })} className="search-bar" style={{ width: '100%', marginTop: '8px' }} />
                </div>
                <div>
                    <label>Instagram Havolasi:</label>
                    <input type="text" value={settings.instagram} onChange={(e) => setSettings({ ...settings, instagram: e.target.value })} className="search-bar" style={{ width: '100%', marginTop: '8px' }} />
                </div>
                <div>
                    <label>Biz haqimizda (Footer):</label>
                    {['uz', 'ru', 'en'].map(l => (
                        <div key={l} style={{ marginTop: '12px' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{l.toUpperCase()}:</span>
                            <textarea value={settings.about[l]} onChange={(e) => setSettings({ ...settings, about: { ...settings.about, [l]: e.target.value } })} className="search-bar" style={{ width: '100%', minHeight: '80px', marginTop: '4px' }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const MessagesView = () => {
    const [messages, setMessages] = useState(getMessages());
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const [broadcastMsg, setBroadcastMsg] = useState('');

    const handleBroadcast = () => {
        if (broadcastMsg) {
            addMessage('broadcast', broadcastMsg, 'Administrator');
            setMessages(getMessages());
            setBroadcastMsg('');
            setIsBroadcasting(false);
            alert('E\'lon barcha foydalanuvchilarga yuborildi!');
        }
    };

    const deleteMessage = (id) => {
        if (confirm('Ochirish?')) {
            const up = messages.filter(m => m.id !== id);
            saveMessages(up);
            setMessages(up);
        }
    };

    const filtered = messages.filter(m => {
        const matchCat = filter === 'all' || m.category === filter;
        const msgContent = String(m.content || '').toLowerCase();
        const msgSender = String(m.sender || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        return matchCat && (msgContent.includes(search) || msgSender.includes(search));
    });

    const categories = [
        { id: 'all', label: 'Barchasi', icon: <MessageSquare size={16} /> },
        { id: 'feedback', label: 'Fikr-mulohaza', icon: <ThumbsUp size={16} /> },
        { id: 'report', label: 'Xatolar', icon: <AlertTriangle size={16} /> },
        { id: 'system', label: 'Tizim', icon: <Shield size={16} /> },
        { id: 'broadcast', label: 'E\'lonlar', icon: <Zap size={16} /> },
    ];

    return (
        <div className="admin-view">
            <div className="admin-header">
                <h2>Xabarlar va Bildirishnomalar</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                        type="text"
                        placeholder="Izlash..."
                        className="search-bar"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={() => setIsBroadcasting(true)}>
                        <Zap size={18} /> E'lon yuborish
                    </button>
                </div>
            </div>

            {isBroadcasting && (
                <div className="glass" style={{ padding: '24px', marginBottom: '24px', border: '1px solid var(--primary)' }}>
                    <h3 style={{ marginBottom: '12px' }}>Umumiy e'lon yuborish</h3>
                    <textarea
                        className="search-bar"
                        style={{ width: '100%', minHeight: '100px', marginBottom: '16px' }}
                        placeholder="Barcha foydalanuvchilarga ko'rinadigan xabar..."
                        value={broadcastMsg}
                        onChange={(e) => setBroadcastMsg(e.target.value)}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button className="btn btn-outline" onClick={() => setIsBroadcasting(false)}>Bekor qilish</button>
                        <button className="btn btn-primary" onClick={handleBroadcast}>Yuborish</button>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px' }}>
                <div className="glass" style={{ padding: '16px', height: 'fit-content' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`admin-nav-link ${filter === cat.id ? 'active' : ''}`}
                                style={{ border: 'none', background: 'transparent', width: '100%', justifyContent: 'flex-start' }}
                                onClick={() => setFilter(cat.id)}
                            >
                                {cat.icon}
                                <span>{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {filtered.length === 0 ? (
                        <div className="glass" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            Xabarlar topilmadi.
                        </div>
                    ) : (
                        filtered.map(m => (
                            <div key={m.id} className="glass" style={{ padding: '20px', borderLeft: `4px solid ${m.category === 'report' ? 'var(--danger)' : m.category === 'system' ? 'var(--primary)' : 'var(--accent)'}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                                            {m.sender[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700 }}>{m.sender}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(m.timestamp).toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <span className={`status-badge ${m.category}`} style={{ height: 'fit-content' }}>{m.category}</span>
                                        <button className="btn btn-outline" style={{ padding: '4px', color: 'var(--danger)' }} onClick={() => deleteMessage(m.id)}><Trash2 size={14} /></button>
                                    </div>
                                </div>
                                <p style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{m.content}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Main Admin Layout ---

export default function Admin() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Security Check
    if (!user || user.role !== 'admin' && user.username !== 'admin') {
        return <Navigate to="/login" />;
    }

    return (
        <div className="admin-container">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        🚀
                    </div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'Outfit' }}>Istiqbol</h2>
                </div>

                <nav className="admin-nav">
                    <NavLink to="/admin/dashboard" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/admin/users" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
                        <Users size={20} />
                        <span>Foydalanuvchilar</span>
                    </NavLink>
                    <NavLink to="/admin/questions" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
                        <BookOpen size={20} />
                        <span>Savollar</span>
                    </NavLink>
                    <NavLink to="/admin/careers" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
                        <Briefcase size={20} />
                        <span>Kasblar</span>
                    </NavLink>
                    <NavLink to="/admin/messages" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
                        <MessageSquare size={20} />
                        <span>Xabarlar</span>
                    </NavLink>
                    <NavLink to="/admin/settings" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
                        <Settings size={20} />
                        <span>Sozlamalar</span>
                    </NavLink>
                </nav>

                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', color: 'white' }}>
                            {user.username[0].toUpperCase()}
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user.username}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Administrator</div>
                        </div>
                    </div>
                    <button onClick={() => { logout(); navigate('/'); }} className="admin-nav-link" style={{ width: '100%', border: 'none', background: 'transparent', marginTop: '10px' }}>
                        <LogOut size={18} />
                        <span>Chiqish</span>
                    </button>
                    <button onClick={() => navigate('/')} className="admin-nav-link" style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--primary)' }}>
                        <X size={18} />
                        <span>Saytni Ko'rish</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <Routes>
                    <Route path="dashboard" element={<DashboardView />} />
                    <Route path="users" element={<UsersView />} />
                    <Route path="questions" element={<QuestionsView />} />
                    <Route path="careers" element={<CareersView />} />
                    <Route path="settings" element={<SettingsView />} />
                    <Route path="messages" element={<MessagesView />} />
                    <Route path="*" element={<Navigate to="dashboard" />} />
                </Routes>
            </main>
        </div>
    );
}
