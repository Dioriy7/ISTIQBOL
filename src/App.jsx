import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import SubjectSelect from './pages/SubjectSelect';
import Test from './pages/Test';
import Results from './pages/Results';
import Register from './pages/Register';
import Login from './pages/Login';
import Cabinet from './pages/Cabinet';
import Admin from './pages/Admin';
import { GraduationCap, BarChart2, BookOpen, User, LogOut, Settings } from 'lucide-react';
import { getSettings, addMessage } from './data/dataService';
import './index.css';

function Navbar() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [settings, setSettings] = useState(getSettings());
  const [showLanguage, setShowLanguage] = useState(false);
  const [showGrade, setShowGrade] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setSettings(getSettings()), 2000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        {settings.logoUrl ? (
          <img src={settings.logoUrl} alt="Logo" style={{ height: '24px', marginRight: '4px', borderRadius: '4px' }} />
        ) : (
          <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', marginRight: '4px', boxShadow: 'var(--glow-primary)' }} />
        )}
        <span className="gradient-text">{t('common.istiqbol')}</span>
      </NavLink>
      <div className="navbar-links">
        <NavLink to="/subjects">
          <BookOpen size={15} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
          {t('common.subjects')}
        </NavLink>
        {user ? (
          <>
            <NavLink to="/results">
              <BarChart2 size={15} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
              {t('common.results')}
            </NavLink>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '12px', paddingLeft: '12px', borderLeft: '1px solid var(--border)' }}>
              <NavLink to="/cabinet" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: '700' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                  {user?.username ? user.username[0].toUpperCase() : '?'}
                </div>
                <span>{t('common.cabinet')}</span>
              </NavLink>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '12px' }}>
            <NavLink to="/login" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>{t('common.login')}</NavLink>
            <NavLink to="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>{t('common.register')}</NavLink>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginLeft: '12px' }}>

          {user && (
            <div className="grade-dropdown-container" style={{ position: 'relative' }}>
              <button
                className="btn btn-outline"
                onClick={() => { setShowGrade(!showGrade); setShowLanguage(false); }}
                style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px', minWidth: '95px', justifyContent: 'center' }}
              >
                🎓 {user.grade}-sinf
              </button>

              {showGrade && (
                <div className="glass" style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '220px', padding: '12px', borderRadius: 'var(--radius)', zIndex: 100, border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', backdropFilter: 'blur(16px)' }}>
                  <h4 style={{ fontSize: '0.85rem', marginBottom: '10px', color: 'var(--text-muted)', fontFamily: 'Outfit' }}>{t('subjectSelect.your_grade', { defaultValue: 'Sinfingizni tanlang' })}</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                    {[5, 6, 7, 8, 9, 10, 11].map(n => (
                      <button
                        key={n}
                        className="btn"
                        onClick={() => { updateProfile({ grade: parseInt(n) }); setShowGrade(false); }}
                        style={{
                          padding: '6px',
                          background: user.grade === parseInt(n) ? 'var(--primary)' : 'rgba(0,0,0,0.2)',
                          color: user.grade === parseInt(n) ? '#fff' : 'var(--text)',
                          border: 'none',
                          fontSize: '0.85rem',
                          fontWeight: '700'
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="language-dropdown-container" style={{ position: 'relative' }}>
            <button
              className="btn btn-outline"
              onClick={() => { setShowLanguage(!showLanguage); setShowGrade(false); }}
              style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', minWidth: '75px', justifyContent: 'center' }}
            >
              🌐 {i18n.language || 'uz'}
            </button>

            {showLanguage && (
              <div className="glass" style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '150px', padding: '8px', borderRadius: 'var(--radius)', zIndex: 100, border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {['uz', 'ru', 'en'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => { changeLanguage(lang); setShowLanguage(false); }}
                    style={{
                      background: (i18n.language || 'uz') === lang ? 'var(--primary)' : 'transparent',
                      color: (i18n.language || 'uz') === lang ? '#fff' : 'var(--text)',
                      border: 'none',
                      borderRadius: 'calc(var(--radius) - 4px)',
                      padding: '8px 12px',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                  >
                    {lang === 'uz' ? "O'zbekcha" : lang === 'ru' ? "Русский" : "English"}
                  </button>
                ))}
              </div>
            )}
          </div>

          <NavLink to="/admin" title="Admin Panel" className="btn btn-outline" style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Settings size={18} />
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  const { t, i18n } = useTranslation();
  const [settings, setSettings] = useState(getSettings());

  useEffect(() => {
    // Interval to refresh settings if they were updated in admin panel, or listen to an event
    const interval = setInterval(() => {
      setSettings(getSettings());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const aboutText = settings.about[i18n.language || 'uz'] || settings.about.uz;

  return (
    <footer className="footer glass" style={{ marginTop: '80px', padding: '60px 40px', borderTop: '1px solid var(--border)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
        <div>
          <Link to="/" className="navbar-brand" style={{ marginBottom: '16px' }}>
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" style={{ height: '24px', marginRight: '4px' }} />
            ) : (
              <span>🚀</span>
            )}
            <span className="gradient-text">{t('common.istiqbol')}</span>
          </Link>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            {aboutText}
          </p>
        </div>
        <div>
          <h4 style={{ marginBottom: '20px', fontFamily: 'Outfit' }}>{t('common.subjects')}</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><Link to="/subjects" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Barcha fanlar</Link></li>
            <li><Link to="/results" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Natijalar</Link></li>
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: '20px', fontFamily: 'Outfit' }}>Platforma</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Kirish</Link></li>
            <li><Link to="/register" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Ro'yxatdan o'tish</Link></li>
            <li><Link to="/admin" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Admin panel</Link></li>
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: '20px', fontFamily: 'Outfit' }}>Admin bilan bog'lanish</h4>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const msg = e.target.msg.value;
              if (msg) {
                addMessage('feedback', msg, user?.username || 'Anonim');
              }
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            <textarea
              name="msg"
              placeholder="Xabar matni..."
              required
              className="search-bar"
              style={{ width: '100%', minHeight: '80px', fontSize: '0.85rem' }}
            />
            <button type="submit" className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '8px' }}>
              <Send size={14} style={{ marginRight: '6px' }} /> Yuborish
            </button>
          </form>
        </div>
      </div>
      <div style={{ maxWidth: '1200px', margin: '40px auto 0', paddingTop: '24px', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
        © {new Date().getFullYear()} ISTIQBOL — AI asosida kasb yo'naltirish. Barcha huquqlar himoyalangan.
      </div>
    </footer>
  );
}


function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
}

function AppContent() {
  const { user } = useAuth();
  const [scoresByGrade, setScoresByGrade] = useState({});

  const handleComplete = (subjectId, score, grade) => {
    setScoresByGrade(prev => ({
      ...prev,
      [grade]: {
        ...(prev[grade] || {}),
        [subjectId]: score
      }
    }));
  };

  const handleReset = (grade) => {
    setScoresByGrade(prev => {
      const next = { ...prev };
      delete next[grade];
      return next;
    });
  };

  const currentGrade = String(user?.grade || 5);
  const currentScores = scoresByGrade[currentGrade] || {};

  return (
    <BrowserRouter>
      <Routes>
        {/* Admin route without Navbar/Footer */}
        <Route path="/admin/*" element={<Admin />} />

        {/* Regular routes with Navbar/Footer */}
        <Route path="*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/subjects" element={<SubjectSelect scores={currentScores} />} />
              <Route path="/test/:subjectId" element={<Test onComplete={handleComplete} />} />
              <Route path="/results" element={<Results scores={currentScores} onReset={() => handleReset(currentGrade)} />} />
              <Route path="/cabinet" element={
                <ProtectedRoute>
                  <Cabinet />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
            </Routes>
            <Footer />
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}
