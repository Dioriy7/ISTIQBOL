import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Star, TrendingUp } from 'lucide-react';

const Home = ({ setSection }) => {
    return (
        <div className="main-content">
            <header style={{ textAlign: 'center', padding: '4rem 0' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }} className="gradient-text float">
                        Zamonaviy Kasblarni O'rganing
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
                        Kelajagingizni bugundan boshlab quring. Bizning platformada eng so'nggi texnologiyalar, videodarslar va interaktiv testlar mavjud.
                    </p>

                    <button
                        onClick={() => setSection('courses')}
                        style={{
                            background: 'linear-gradient(45deg, var(--accent-primary), var(--accent-secondary))',
                            color: 'white',
                            padding: '1rem 2.5rem',
                            borderRadius: '50px',
                            border: 'none',
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 10px 20px rgba(56, 189, 248, 0.3)'
                        }}
                    >
                        Kurslarni ko'rish 🚀
                    </button>
                </motion.div>
            </header>

            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                <div className="glass" style={{ padding: '2rem' }}>
                    <div style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}><Rocket size={40} /></div>
                    <h3 style={{ marginBottom: '0.5rem' }}>Tezkor O'rganish</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Amaliy loyihalar orqali bilimingizni tezroq va samaraliroq oshiring.</p>
                </div>
                <div className="glass" style={{ padding: '2rem' }}>
                    <div style={{ color: 'var(--accent-secondary)', marginBottom: '1rem' }}><Star size={40} /></div>
                    <h3 style={{ marginBottom: '0.5rem' }}>Ekspert Tavsiyalari</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Sohada tajribali mutaxassislar tomonidan tayyorlangan darsliklar.</p>
                </div>
                <div className="glass" style={{ padding: '2rem' }}>
                    <div style={{ color: 'var(--accent-tertiary)', marginBottom: '1rem' }}><TrendingUp size={40} /></div>
                    <h3 style={{ marginBottom: '0.5rem' }}>Karyera O'sishi</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Bugungi kunda eng yuqori maoshli va talabgir kasblarni egallang.</p>
                </div>
            </section>
        </div>
    );
};

export default Home;
