import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Mail, MessageSquare, Phone } from 'lucide-react';

const Support = () => {
    return (
        <div className="main-content">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }} className="gradient-text">
                Yordam Markazi
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                <motion.div whileHover={{ scale: 1.02 }} className="glass" style={{ padding: '2rem' }}>
                    <div style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}><MessageSquare size={32} /></div>
                    <h3 style={{ marginBottom: '0.5rem' }}>Chat Orqali</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Operatorlarimiz bilan onlayn muloqot qiling.</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="glass" style={{ padding: '2rem' }}>
                    <div style={{ color: 'var(--accent-secondary)', marginBottom: '1rem' }}><Mail size={32} /></div>
                    <h3 style={{ marginBottom: '0.5rem' }}>Email</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>savol@kasb.uz manziliga xat yuboring.</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="glass" style={{ padding: '2rem' }}>
                    <div style={{ color: 'var(--accent-tertiary)', marginBottom: '1rem' }}><Phone size={32} /></div>
                    <h3 style={{ marginBottom: '0.5rem' }}>Telefon</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>+998 (99) 123-45-67 raqamiga qo'ng'iroq qiling.</p>
                </motion.div>
            </div>

            <div className="glass" style={{ marginTop: '3rem', padding: '2.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Ko'p So'raladigan Savollar</h3>
                <div style={{ textAlign: 'left', display: 'grid', gap: '1.5rem' }}>
                    {[
                        "Kurslar bepulmi?",
                        "Sertifikat beriladimi?",
                        "Qaysi kasbdan boshlashni maslahat berasiz?"
                    ].map((q, i) => (
                        <div key={i} style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
                                <HelpCircle size={18} color="var(--accent-primary)" /> {q}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Support;
