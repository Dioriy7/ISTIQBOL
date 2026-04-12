import React, { useState, useEffect } from 'react';
import { getQuestions, saveQuestions, getSubjects, getSettings, saveSettings } from '../data/dataService';
import { Plus, Edit2, Trash2, Save, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Admin() {
    const { t, i18n } = useTranslation();
    const [subjects, setSubjects] = useState([]);
    const [questions, setQuestions] = useState({});
    const [selectedSubject, setSelectedSubject] = useState('');
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [activeTab, setActiveTab] = useState('questions');
    const [settings, setSettings] = useState({ about: { uz: '', ru: '', en: '' }, telegram: '', instagram: '', logoUrl: '' });

    const [formData, setFormData] = useState({
        grade: 5,
        type: 'test',
        imageUrl: '',
        q: { uz: '', ru: '', en: '' },
        options: {
            uz: ['', '', '', ''],
            ru: ['', '', '', ''],
            en: ['', '', '', '']
        },
        answer: 0
    });

    useEffect(() => {
        const subjs = getSubjects() || [];
        const questns = getQuestions() || {};
        setSubjects(subjs);
        setQuestions(questns);
        setSettings(getSettings());
        if (subjs.length > 0) setSelectedSubject(subjs[0].id);
    }, []);

    const handleSaveSettings = () => {
        saveSettings(settings);
        alert('Sozlamalar saqlandi!');
    };

    const handleSave = () => {
        const updatedQuestions = { ...questions };
        if (!updatedQuestions[selectedSubject]) updatedQuestions[selectedSubject] = [];

        if (editingQuestion !== null) {
            updatedQuestions[selectedSubject][editingQuestion] = formData;
        } else {
            updatedQuestions[selectedSubject].push(formData);
        }

        saveQuestions(updatedQuestions);
        setQuestions(updatedQuestions);
        resetForm();
    };

    const handleDelete = (index) => {
        if (window.confirm('Haqiqatdan ham o\'chirmoqchimisiz?')) {
            const updatedQuestions = { ...questions };
            updatedQuestions[selectedSubject].splice(index, 1);
            saveQuestions(updatedQuestions);
            setQuestions(updatedQuestions);
        }
    };

    const resetForm = () => {
        setEditingQuestion(null);
        setIsAdding(false);
        setFormData({
            grade: 5,
            type: 'test',
            imageUrl: '',
            q: { uz: '', ru: '', en: '' },
            options: {
                uz: ['', '', '', ''],
                ru: ['', '', '', ''],
                en: ['', '', '', '']
            },
            answer: 0
        });
    };

    const startEdit = (index) => {
        const q = questions[selectedSubject][index];
        // Ensure structure is correct (fill in missing languages if any)
        const qData = {
            grade: q.grade || 5,
            type: q.type || 'test',
            imageUrl: q.imageUrl || '',
            q: typeof q.q === 'string' ? { uz: q.q, ru: q.q, en: q.q } : q.q,
            options: Array.isArray(q.options)
                ? { uz: q.options, ru: q.options, en: q.options }
                : (q.options || { uz: ['', '', '', ''], ru: ['', '', '', ''], en: ['', '', '', ''] }),
            answer: q.answer || 0
        };
        setFormData(qData);
        setEditingQuestion(index);
        setIsAdding(true);
    };

    return (
        <div className="page admin-page" style={{ padding: '2rem' }}>
            <h1 className="gradient-text">Admin Panel</h1>
            <p className="section-subtitle">Sayt ma'lumotlarini va savollarni boshqarish</p>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    className={`btn ${activeTab === 'questions' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setActiveTab('questions')}
                >
                    Savollar
                </button>
                <button
                    className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setActiveTab('settings')}
                >
                    Sozlamalar
                </button>
            </div>

            {activeTab === 'questions' && (
                <>
                    <div className="admin-controls glass" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                            <label>Fan tanlash:</label>
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="btn btn-outline"
                                style={{ padding: '8px', background: 'white' }}
                            >
                                {subjects.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                            <button className="btn btn-primary" onClick={() => { resetForm(); setIsAdding(true); }}>
                                <Plus size={18} /> Yangi savol
                            </button>
                        </div>

                        {isAdding && (
                            <div className="edit-form glass" style={{ padding: '1.5rem', marginTop: '1rem', border: '1px solid var(--primary)' }}>
                                <h3>{editingQuestion !== null ? 'Savolni tahrirlash' : 'Yangi savol qo\'shish'}</h3>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                                    <div>
                                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                            <div style={{ flex: 1 }}>
                                                <label>Sinf:</label>
                                                <input
                                                    type="number"
                                                    value={formData.grade}
                                                    onChange={(e) => setFormData({ ...formData, grade: parseInt(e.target.value) })}
                                                    style={{ width: '100%', padding: '8px' }}
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label>Turi:</label>
                                                <select
                                                    value={formData.type || 'test'}
                                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                    style={{ width: '100%', padding: '8px' }}
                                                >
                                                    <option value="test">Test (Variantli)</option>
                                                    <option value="input">Yozish (Input)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '1rem' }}>
                                            <label>Rasm havolasi (majburiy emas):</label>
                                            <input
                                                type="text"
                                                value={formData.imageUrl || ''}
                                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                                placeholder="https://misol.com/rasm.jpg"
                                                style={{ width: '100%', padding: '8px' }}
                                            />
                                        </div>

                                        {['uz', 'ru', 'en'].map(lang => (
                                            <div key={lang} style={{ marginBottom: '1rem' }}>
                                                <label>Savol ({lang.toUpperCase()}):</label>
                                                <textarea
                                                    value={formData.q[lang]}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        q: { ...formData.q, [lang]: e.target.value }
                                                    })}
                                                    style={{ width: '100%', padding: '8px' }}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div>
                                        <label>{formData.type === 'input' ? 'To\'g\'ri javoblar:' : 'Variantlar va Javob:'}</label>
                                        {['uz', 'ru', 'en'].map(lang => (
                                            <div key={lang} style={{ marginBottom: '1.5rem', padding: '10px', background: 'rgba(0,0,0,0.03)', borderRadius: '8px' }}>
                                                <h4 style={{ margin: '0 0 10px 0' }}>{formData.type === 'input' ? `Javob matni (${lang.toUpperCase()})` : `Variantlar (${lang.toUpperCase()})`}</h4>
                                                {[0, 1, 2, 3].map(i => (
                                                    <div key={i} style={{ display: formData.type === 'input' && i > 0 ? 'none' : 'flex', gap: '10px', marginBottom: '5px' }}>
                                                        {formData.type !== 'input' && (
                                                            <input
                                                                type="radio"
                                                                name={`answer_${lang}`}
                                                                checked={formData.answer === i}
                                                                onChange={() => setFormData({ ...formData, answer: i })}
                                                            />
                                                        )}
                                                        <input
                                                            type="text"
                                                            value={formData.options[lang] ? formData.options[lang][i] : ''}
                                                            onChange={(e) => {
                                                                const newOpts = JSON.parse(JSON.stringify(formData.options));
                                                                if (!newOpts[lang]) newOpts[lang] = ['', '', '', ''];
                                                                newOpts[lang][i] = e.target.value;
                                                                setFormData({ ...formData, options: newOpts });
                                                            }}
                                                            placeholder={formData.type === 'input' ? `To'g'ri javob` : `Variant ${i + 1}`}
                                                            style={{ flex: 1, padding: '5px' }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                    <button className="btn btn-outline" onClick={resetForm}><X size={18} /> Bekor qilish</button>
                                    <button className="btn btn-primary" onClick={handleSave}><Save size={18} /> Saqlash</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="questions-list">
                        <h3>{selectedSubject} fanidan savollar ({questions[selectedSubject]?.length || 0})</h3>
                        <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                            {questions[selectedSubject]?.map((q, i) => (
                                <div key={i} className="step-card glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                                    <div>
                                        <span className="hero-badge">{q.grade}-sinf</span>
                                        <p style={{ fontWeight: 600, margin: '8px 0' }}>
                                            {typeof q.q === 'string' ? q.q : q.q[i18n.language] || q.q.uz}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button className="btn btn-outline" style={{ padding: '8px' }} onClick={() => startEdit(i)}>
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="btn btn-outline" style={{ padding: '8px', color: '#ef4444' }} onClick={() => handleDelete(i)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'settings' && (
                <div className="settings-section glass" style={{ padding: '2rem' }}>
                    <h3>Sayt sozlamalari</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                        <div>
                            <label>Saytdagi Logotip (Rasm yuklash yoki havola):</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setSettings({ ...settings, logoUrl: reader.result });
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                style={{ display: 'block', width: '100%', marginTop: '8px', padding: '10px', background: 'rgba(0,0,0,0.05)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                            />
                            <div style={{ textAlign: 'center', margin: '8px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>YOKI</div>
                            <input
                                type="text"
                                className="option-btn"
                                placeholder="Masalan: https://site.com/logo.png"
                                style={{ width: '100%', padding: '10px' }}
                                value={settings.logoUrl || ''}
                                onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                            />
                            {settings.logoUrl && (
                                <div style={{ marginTop: '12px', padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', width: 'fit-content' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Joriy logotip:</span>
                                    <img src={settings.logoUrl} alt="Joriy Logo" style={{ height: '36px', borderRadius: '4px' }} />
                                </div>
                            )}
                        </div>
                        <div>
                            <label>Telegram havola:</label>
                            <input
                                type="text"
                                className="option-btn"
                                style={{ width: '100%', marginTop: '8px', padding: '10px' }}
                                value={settings.telegram}
                                onChange={(e) => setSettings({ ...settings, telegram: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Instagram havola:</label>
                            <input
                                type="text"
                                className="option-btn"
                                style={{ width: '100%', marginTop: '8px', padding: '10px' }}
                                value={settings.instagram}
                                onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                            />
                        </div>

                        <div style={{ marginTop: '1rem' }}>
                            <label style={{ fontWeight: 'bold' }}>"Biz haqimizda" (Footer teksti):</label>
                            {['uz', 'ru', 'en'].map(lang => (
                                <div key={lang} style={{ marginTop: '10px' }}>
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{lang.toUpperCase()} Tilida:</label>
                                    <textarea
                                        className="option-btn"
                                        style={{ width: '100%', minHeight: '60px', marginTop: '4px', padding: '10px', fontSize: '0.95rem' }}
                                        value={settings.about?.[lang] || ''}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            about: { ...settings.about, [lang]: e.target.value }
                                        })}
                                    />
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="btn btn-primary" onClick={handleSaveSettings}>
                                <Save size={18} /> Saqlash
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
