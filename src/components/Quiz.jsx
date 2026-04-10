import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, Sparkles } from 'lucide-react';

const Quiz = () => {
    return (
        <div className="main-content" style={{ textAlign: 'center', padding: '4rem 0' }}>
            <motion.div className="glass" style={{ padding: '3rem', maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ color: 'var(--accent-tertiary)', marginBottom: '1.5rem' }}><ClipboardCheck size={60} style={{ margin: '0 auto' }} /></div>
                <h2 style={{ marginBottom: '1rem' }}>O'z Bilimingizni Sinab Ko'ring</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Sizga qaysi kasb mos kelishini aniqlash yoki o'rgangan bilimingizni tekshirish uchun testdan o'ting.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button className="glass" style={{
                        padding: '1rem 2rem',
                        border: '1px solid var(--accent-primary)',
                        color: 'var(--accent-primary)',
                        cursor: 'pointer'
                    }}>
                        Kasb Tanlash Testi
                    </button>
                    <button style={{
                        padding: '1rem 2rem',
                        background: 'linear-gradient(45deg, var(--accent-secondary), var(--accent-tertiary))',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer'
                    }}>
                        Bilimni Tekshirish
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Quiz;
