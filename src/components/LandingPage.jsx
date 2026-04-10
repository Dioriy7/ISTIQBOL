import React from 'react';
import { motion } from 'framer-motion';

const LandingPage = ({ onStart }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card landing-page"
            style={{ maxWidth: '800px', width: '90%' }}
        >
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem', background: '-webkit-linear-gradient(45deg, #090979, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Kelajak Kasbini Kashf Et!
            </h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                Salom! Men sening shaxsiy AI yordamchingman.
                Bir nechta qiziqarli savollarga javob ber va men senga qanday kasb mos kelishini aytaman.
                Tayyormisan?
            </p>
            <button
                onClick={onStart}
                style={{
                    padding: '1rem 2rem',
                    fontSize: '1.2rem',
                    background: '#4ade80',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(74, 222, 128, 0.4)'
                }}
            >
                Boshlash! 🚀
            </button>
        </motion.div>
    );
};

export default LandingPage;
