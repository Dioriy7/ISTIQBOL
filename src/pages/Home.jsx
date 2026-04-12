import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, Brain, Sparkles, Trophy, Zap, ArrowRight } from 'lucide-react';

export default function Home() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="page">
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />

            {/* Hero */}
            <section className="hero">
                <div className="hero-badge">
                    <Sparkles size={14} />
                    AI asosida kasb yo'naltirish
                </div>
                <h1>
                    <span className="gradient-text">{t('common.istiqbol')}</span> {t('home.hero_title_with', 'bilan')}<br />
                    {t('home.hero_title_discover', 'kelajagingni kashf et')} 🚀
                </h1>
                <p>
                    {t('home.hero_description', "Maktab fanlari bo'yicha interaktiv testlar, AI tahlili va shaxsiy kasb tavsiyalari — hammasi bir joyda.")}
                </p>
                <div className="hero-cta">
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={() => navigate('/subjects')}
                        id="start-btn"
                    >
                        {t('common.start_test')} <ArrowRight size={18} />
                    </button>
                    <button
                        className="btn btn-outline btn-lg"
                        onClick={() => document.getElementById('how').scrollIntoView({ behavior: 'smooth' })}
                    >
                        Qanday ishlaydi?
                    </button>
                </div>

                <div className="stats-row">
                    {[
                        { number: '9', label: 'Fan bo\'yicha test' },
                        { number: '90+', label: 'Savol' },
                        { number: '20+', label: 'Kasb tavsiyasi' },
                        { number: 'AI', label: 'Tahlil tizimi' },
                    ].map((s, i) => (
                        <div key={i} className="stat-item">
                            <div className="stat-number">{s.number}</div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section className="how-it-works" id="how">
                <p className="gradient-text" style={{ fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                    JARAYON
                </p>
                <h2 className="section-title">Qanday ishlaydi?</h2>
                <p className="section-subtitle">
                    Uchta oddiy qadam orqali kelajak kasbingizni aniqlang
                </p>

                <div className="steps-grid">
                    {[
                        {
                            num: '01',
                            icon: <BookOpen size={28} />,
                            emoji: '📝',
                            title: 'Fan tanlash va test',
                            desc: 'Maktab darsliklaridan olingan savollar bo\'yicha 9 ta fandan test ishlang.',
                        },
                        {
                            num: '02',
                            icon: <Brain size={28} />,
                            emoji: '🤖',
                            title: 'AI tahlil qiladi',
                            desc: 'Natijalaringizni sun\'iy intellekt tahlil qilib, kuchli tomonlaringizni aniqlaydi.',
                        },
                        {
                            num: '03',
                            icon: <Trophy size={28} />,
                            emoji: '🎯',
                            title: 'Kasb tavsiyasi',
                            desc: 'Sizga mos bo\'lgan kasblar ro\'yxati va ular haqida batafsil ma\'lumot ko\'rsatiladi.',
                        },
                    ].map((step, i) => (
                        <div className="step-card glass" key={i}>
                            <div className="step-number">{step.num}</div>
                            <span className="step-icon">{step.emoji}</span>
                            <h3>{step.title}</h3>
                            <p>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section style={{ padding: '60px 40px', maxWidth: 1100, margin: '0 auto' }}>
                <p className="gradient-text" style={{ fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8, textAlign: 'center' }}>
                    INTERAKTIV XUSUSIYATLAR
                </p>
                <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 16 }}>Nima bor bu saytda?</h2>
                <p className="section-subtitle" style={{ textAlign: 'center' }}>Oddiy testdan ko'ra ko'proq narsa</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                    {[
                        { emoji: '🕸️', title: 'Radar Grafik', desc: 'Barcha fanlaringiz bo\'yicha natijalari ko\'rinadigan interaktiv grafik.' },
                        { emoji: '🃏', title: 'Flip Kartochkalar', desc: 'Hover qilganda kasb haqida batafsil ma\'lumot, maosh va ko\'nikma talab.' },
                        { emoji: '🏅', title: 'Badge Tizimi', desc: 'Har bir tugallangan fan uchun nishon (medal) olasiz.' },
                        { emoji: '⚡', title: 'Tezkor Javob', desc: 'Har bir savolga javob berganda darhol to\'g\'ri/noto\'g\'riligini ko\'rasiz.' },
                        { emoji: '📊', title: 'Batafsil Statistika', desc: 'Har bir fanda erishilgan ball va foizlar ko\'rsatiladi.' },
                        { emoji: '🎯', title: 'AI Tavsiya', desc: 'Natijalar asosida maxsus tanlangan kasblar va yo\'nalishlar.' },
                    ].map((f, i) => (
                        <div className="step-card glass" key={i} style={{ cursor: 'default' }}>
                            <span style={{ fontSize: '2.2rem' }}>{f.emoji}</span>
                            <h3 style={{ marginTop: 12, marginBottom: 8 }}>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section style={{ textAlign: 'center', padding: '60px 40px 100px' }}>
                <div className="glass" style={{ maxWidth: 600, margin: '0 auto', padding: '48px 40px' }}>
                    <span style={{ fontSize: '3rem' }}>🎓</span>
                    <h2 style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 800, margin: '16px 0 12px' }}>
                        Hoziroq boshlang!
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.6 }}>
                        Faqat 10 ta savol orqali kelajak kasbingizni aniqlang.
                    </p>
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={() => navigate('/subjects')}
                    >
                        <Zap size={18} /> Testni Boshlash
                    </button>
                </div>
            </section>
        </div>
    );
}
