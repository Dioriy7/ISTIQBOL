import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, PlayCircle, ClipboardList, HelpCircle, Home } from 'lucide-react';

const Navbar = ({ currentSection, setSection }) => {
    const navItems = [
        { id: 'home', label: 'Bosh sahifa', icon: <Home size={20} /> },
        { id: 'courses', label: 'Kurslar', icon: <PlayCircle size={20} /> },
        { id: 'books', label: 'Kitoblar', icon: <BookOpen size={20} /> },
        { id: 'quiz', label: 'Testlar', icon: <ClipboardList size={20} /> },
        { id: 'support', label: 'Yordam', icon: <HelpCircle size={20} /> },
    ];

    return (
        <nav className="glass" style={{
            margin: '1rem 2rem',
            padding: '0.75rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: '1rem',
            zIndex: 100
        }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }} className="gradient-text">
                Kasb.uz
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                {navItems.map((item) => (
                    <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSection(item.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            background: currentSection === item.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                            color: currentSection === item.id ? '#38bdf8' : '#e2e8f0',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontSize: '0.9rem',
                            fontWeight: '500'
                        }}
                    >
                        {item.icon}
                        <span className="nav-label">{item.label}</span>
                    </motion.button>
                ))}
            </div>
        </nav>
    );
};

export default Navbar;
