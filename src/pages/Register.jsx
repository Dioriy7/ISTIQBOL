import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, ArrowRight, UserPlus } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        password: '',
        grade: '5',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            register(formData);
            navigate('/cabinet');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '100px' }}>
            <div className="orb orb-1" />
            <div className="orb orb-2" />

            <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚀</div>
                    <h1 className="section-title">Ro'yxatdan o'tish</h1>
                    <p style={{ color: 'var(--text-muted)' }}>ISTIQBOL platformasiga xush kelibsiz!</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {error && <div style={{ color: 'var(--danger)', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Ism:</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                            <input
                                type="text"
                                name="firstName"
                                required
                                className="option-btn"
                                style={{ width: '100%', paddingLeft: '40px', background: 'rgba(255,255,255,0.05)' }}
                                placeholder="Ismingiz"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Familiya:</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                            <input
                                type="text"
                                name="lastName"
                                required
                                className="option-btn"
                                style={{ width: '100%', paddingLeft: '40px', background: 'rgba(255,255,255,0.05)' }}
                                placeholder="Familiyangiz"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Sinf:</label>
                        <select
                            name="grade"
                            className="option-btn"
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'var(--text)' }}
                            onChange={handleChange}
                            value={formData.grade}
                        >
                            {[5, 6, 7, 8, 9, 10, 11].map(n => (
                                <option key={n} value={n} style={{ background: 'var(--bg)', color: 'var(--text)' }}>
                                    {n}-sinf
                                </option>
                            ))}
                        </select>
                    </div>

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
                                placeholder="masalan: alisher123"
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
                                placeholder="Kamida 6 belgi"
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
                        {loading ? 'Yaratilmoqda...' : 'Ro\'yxatdan o\'tish'} <UserPlus size={18} style={{ marginLeft: '10px' }} />
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Akkauntingiz bormi? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Kirish</Link>
                </p>
            </div>
        </div>
    );
}
