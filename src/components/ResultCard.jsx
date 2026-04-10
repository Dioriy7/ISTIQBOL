import React from 'react';
import { motion } from 'framer-motion';

const ResultCard = ({ result, onRestart }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card"
            style={{ maxWidth: '800px', width: '90%', textAlign: 'left' }}
        >
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Sening Kelajak Kasbing:</h2>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {result}
            </div>
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <button onClick={onRestart} style={{ background: '#f43f5e', color: '#fff' }}>Qaytadan Boshlash</button>
            </div>
        </motion.div>
    );
};

export default ResultCard;
