import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom';
import {
    getQuestions, saveQuestions, getSubjects, getSettings, saveSettings,
    getUsers, saveUsers, getCareers, saveCareers, getMessages, getStats
} from '../data/dataService';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, Users, BookOpen, Briefcase, FileText,
    Settings, MessageSquare, LogOut, Plus, Edit2, Trash2,
    Save, X, Search, Filter, TrendingUp, Users as UsersIcon,
    CheckCircle, AlertCircle, Shield
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

const QuestionsView = () => {
    const [subjects, setSubjects] = useState([]);
    const [questions, setQuestions] = useState({});
    const [selectedSubject, setSelectedSubject] = useState('');
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const { i18n } = useTranslation();

    const [formData, setFormData] = useState({
        grade: 5,
        type: 'test',
        imageUrl: '',
        q: { uz: '', ru: '', en: '' },
        options: { uz: ['', '', '', ''], ru: ['', '', '', ''], en: ['', '', '', ''] },
        answer: 0
    });

    useEffect(() => {
        const subjs = getSubjects() || [];
        setSubjects(subjs);
        setQuestions(getQuestions() || {});
        if (subjs.length > 0) setSelectedSubject(subjs[0].id);
    }, []);

    const handleSave = () => {
        const updated = { ...questions };
        if (!updated[selectedSubject]) updated[selectedSubject] = [];
        if (editingQuestion !== null) updated[selectedSubject][editingQuestion] = formData;
        else updated[selectedSubject].push(formData);
        saveQuestions(updated);
        setQuestions(updated);
        resetForm();
    };

    const handleDelete = (index) => {
        if (window.confirm('Haqiqatdan ham o\'chirmoqchimisiz?')) {
            const updated = { ...questions };
            updated[selectedSubject].splice(index, 1);
            saveQuestions(updated);
            setQuestions(updated);
        }
    };

    const resetForm = () => {
        setEditingQuestion(null);
        setIsAdding(false);
        setFormData({
            grade: 5, type: 'test', imageUrl: '',
            q: { uz: '', ru: '', en: '' },
            options: { uz: ['', '', '', ''], ru: ['', '', '', ''], en: ['', '', '', ''] },
            answer: 0
        });
    };

    const startEdit = (index) => {
        const q = questions[selectedSubject][index];
        setFormData({
            grade: q.grade || 5, type: q.type || 'test', imageUrl: q.imageUrl || '',
            q: typeof q.q === 'string' ? { uz: q.q, ru: q.q, en: q.q } : q.q,
            options: Array.isArray(q.options) ? { uz: q.options, ru: q.options, en: q.options } : (q.options || { uz: ['', '', '', ''], ru: ['', '', '', ''], en: ['', '', '', ''] }),
            answer: q.answer || 0
        });
        setEditingQuestion(index);
        setIsAdding(true);
    };

    return (
        <div className="admin-view">
            <div className="admin-header">
                <h2>Savollar Boshqaruvi</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="search-bar" style={{ width: '200px' }}>
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    <button className="btn btn-primary" onClick={() => { resetForm(); setIsAdding(true); }}>
                        <Plus size={18} /> Yangi savol
                    </button>
                </div>
            </div>

            {isAdding && (
                <div className="glass" style={{ padding: '24px', marginBottom: '24px' }}>
                    <h3>{editingQuestion !== null ? 'Tahrirlash' : 'Qo\'shish'}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                        <div>
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                                <div style={{ flex: 1 }}>
                                    <label>Sinf:</label>
                                    <input type="number" value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: parseInt(e.target.value) })} className="search-bar" style={{ width: '100%', marginTop: '4px' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label>Tur:</label>
                                    <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="search-bar" style={{ width: '100%', marginTop: '4px' }}>
                                        <option value="test">Test</option>
                                        <option value="input">Yozma</option>
                                    </select>
                                </div>
                            </div>
                            {['uz', 'ru', 'en'].map(lang => (
                                <div key={lang} style={{ marginBottom: '12px' }}>
                                    <label>Savol ({lang.toUpperCase()}):</label>
                                    <textarea value={formData.q[lang]} onChange={(e) => setFormData({ ...formData, q: { ...formData.q, [lang]: e.target.value } })} className="search-bar" style={{ width: '100%', minHeight: '60px', marginTop: '4px' }} />
                                </div>
                            ))}
                        </div>
                        <div>
                            <label>Variantlar va Javob:</label>
                            {['uz', 'ru', 'en'].map(lang => (
                                <div key={lang} style={{ marginBottom: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                                    <h4 style={{ fontSize: '0.8rem', marginBottom: '8px' }}>{lang.toUpperCase()} Tilida</h4>
                                    {[0, 1, 2, 3].map(i => (
                                        <div key={i} style={{ display: formData.type === 'input' && i > 0 ? 'none' : 'flex', gap: '8px', marginBottom: '4px' }}>
                                            {formData.type !== 'input' && <input type="radio" checked={formData.answer === i} onChange={() => setFormData({ ...formData, answer: i })} />}
                                            <input type="text" value={formData.options[lang][i]} onChange={(e) => { const n = JSON.parse(JSON.stringify(formData.options)); n[lang][i] = e.target.value; setFormData({ ...formData, options: n }); }} className="search-bar" style={{ flex: 1, padding: '6px' }} placeholder={`Option ${i + 1}`} />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                        <button className="btn btn-outline" onClick={resetForm}>Bekor qilish</button>
                        <button className="btn btn-primary" onClick={handleSave}>Saqlash</button>
                    </div>
                </div>
            )}

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Sinf</th>
                            <th>Savol</th>
                            <th>Turi</th>
                            <th>Amallar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions[selectedSubject]?.map((q, i) => (
                            <tr key={i}>
                                <td>{q.grade}</td>
                                <td>{typeof q.q === 'string' ? q.q : q.q[i18n.language] || q.q.uz}</td>
                                <td><span className="hero-badge" style={{ margin: 0 }}>{q.type || 'test'}</span></td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn btn-outline" style={{ padding: '6px' }} onClick={() => startEdit(i)}><Edit2 size={14} /></button>
                                        <button className="btn btn-outline" style={{ padding: '6px', color: '#ef4444' }} onClick={() => handleDelete(i)}><Trash2 size={14} /></button>
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

const CareersView = () => {
    const [careers, setCareers] = useState(getCareers());
    const [isAdding, setIsAdding] = useState(false);
    const [editIdx, setEditIdx] = useState(null);
    const [formData, setFormData] = useState({ title: { uz: '', ru: '', en: '' }, icon: '🚀', subjects: [] });

    const handleSave = () => {
        let updated = [...careers];
        if (editIdx !== null) updated[editIdx] = formData;
        else updated.push({ ...formData, id: Date.now() });
        saveCareers(updated);
        setCareers(updated);
        setIsAdding(false);
        setEditIdx(null);
        setFormData({ title: { uz: '', ru: '', en: '' }, icon: '🚀', subjects: [] });
    };

    return (
        <div className="admin-view">
            <div className="admin-header">
                <h2>Kasblar Boshqaruvi</h2>
                <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
                    <Plus size={18} /> Yangi kasb
                </button>
            </div>

            {isAdding && (
                <div className="glass" style={{ padding: '24px', marginBottom: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            {['uz', 'ru', 'en'].map(l => (
                                <div key={l} style={{ marginBottom: '12px' }}>
                                    <label>Sarlavha ({l.toUpperCase()}):</label>
                                    <input type="text" value={formData.title[l]} onChange={(e) => setFormData({ ...formData, title: { ...formData.title, [l]: e.target.value } })} className="search-bar" style={{ width: '100%', marginTop: '4px' }} />
                                </div>
                            ))}
                        </div>
                        <div>
                            <label>Emoji Icon:</label>
                            <input type="text" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className="search-bar" style={{ width: '100%', marginTop: '4px' }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                        <button className="btn btn-outline" onClick={() => setIsAdding(false)}>Bekor qilish</button>
                        <button className="btn btn-primary" onClick={handleSave}>Saqlash</button>
                    </div>
                </div>
            )}

            <div className="stat-grid">
                {careers.map((c, i) => (
                    <div key={i} className="stat-card glass">
                        <div style={{ fontSize: '2rem' }}>{c.icon}</div>
                        <div style={{ fontWeight: 'bold' }}>{c.title.uz}</div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                            <button className="btn btn-outline" style={{ padding: '6px', flex: 1 }} onClick={() => { setFormData(c); setEditIdx(i); setIsAdding(true); }}><Edit2 size={14} /></button>
                            <button className="btn btn-outline" style={{ padding: '6px', color: '#ef4444', flex: 1 }} onClick={() => { if (confirm('Ochirish?')) { const n = careers.filter((_, idx) => idx !== i); setCareers(n); saveCareers(n); } }}><Trash2 size={14} /></button>
                        </div>
                    </div>
                ))}
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
