import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, LogIn, ArrowRight } from 'lucide-react';

export default function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const users = JSON.parse(localStorage.getItem('istiqbol_users') || '[]');
        const foundUser = users.find(u => u.username === formData.username && u.password === formData.password);

        if (foundUser) {
            login(foundUser);
            navigate('/cabinet');
        } else {
            setError('Foydalanuvchi nomi yoki parol xato.');
            setLoading(false);
        }
    };

    return (
        <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '100px' }}>
            <div className="orb orb-1" />
            <div className="orb orb-2" />

            <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔑</div>
                    <h1 className="section-title">Kirish</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Akkauntingizga kiring</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {error && <div style={{ color: 'var(--danger)', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Foydalanuvchi nomi:</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                            <input
                                type="text"
                                name="username"
                                required
                                className="option-btn"
                                style={{ width: '100%', paddingLeft: '40px', background: 'rgba(255,255,255,0.05)' }}
                                placeholder="Foydalanuvchi nomi"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Parol:</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                            <input
                                type="password"
                                name="password"
                                required
                                className="option-btn"
                                style={{ width: '100%', paddingLeft: '40px', background: 'rgba(255,255,255,0.05)' }}
                                placeholder="Parolingiz"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                        style={{ width: '100%', marginTop: '10px' }}
                    >
                        {loading ? 'Kirilmoqda...' : 'Kirish'} <LogIn size={18} style={{ marginLeft: '10px' }} />
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Akkauntingiz yo'qmi? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Ro'yxatdan o'tish</Link>
                </p>
            </div>
        </div>
    );
}
