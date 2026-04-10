import React from 'react';
import { motion } from 'framer-motion';
import { Book, FileText, Download } from 'lucide-react';

const Books = () => {
    const resources = [
        { title: 'Frontend Asoslari', type: 'PDF Kitob', size: '12 MB' },
        { title: 'UI/UX Dizayn Qo\'llanma', type: 'E-book', size: '8 MB' },
        { title: 'JavaScript To\'liq Kurs', type: 'Video Playlist', size: 'Various' },
        { title: 'Backend Dunyosi', type: 'PDF', size: '15 MB' },
    ];

    return (
        <div className="main-content">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }} className="gradient-text">
                Kutubxona va Ma'lumotlar
            </h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
                {resources.map((res, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass"
                        style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ color: 'var(--accent-secondary)' }}><Book size={24} /></div>
                            <div>
                                <h4 style={{ margin: 0 }}>{res.title}</h4>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{res.type} • {res.size}</p>
                            </div>
                        </div>
                        <button style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--glass-border)',
                            color: '#fff',
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <Download size={16} /> Yuklash
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Books;
