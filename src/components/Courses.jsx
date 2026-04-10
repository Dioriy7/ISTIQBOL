import React from 'react';
import { motion } from 'framer-motion';
import { Code, Palette, Database, Cpu, BrainCircuit } from 'lucide-react';

const Courses = () => {
    const courses = [
        { title: 'Frontend Dasturlash', icon: <Code />, level: 'Boshlang\'ich', color: '#38bdf8' },
        { title: 'UI/UX Dizayn', icon: <Palette />, level: 'O\'rta', color: '#c084fc' },
        { title: 'Data Science', icon: <Database />, level: 'Qiyin', color: '#fb7185' },
        { title: 'Mobil Ilovalar', icon: <Cpu />, level: 'O\'rta', color: '#4ade80' },
        { title: 'Sun\'iy Intellekt', icon: <BrainCircuit />, level: 'Qiyin', color: '#facc15' },
    ];

    return (
        <div className="main-content">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }} className="gradient-text">
                Zamonaviy Kurslar
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {courses.map((course, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ y: -5 }}
                        className="glass"
                        style={{ padding: '1.5rem', cursor: 'pointer', textAlign: 'left' }}
                    >
                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '12px',
                            background: course.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1rem',
                            color: '#fff'
                        }}>
                            {course.icon}
                        </div>
                        <h3 style={{ marginBottom: '0.5rem' }}>{course.title}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                            Ushbu kursda siz sohaning eng so'nggi asbob-uskunalarini o'rganasiz.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                                {course.level}
                            </span>
                            <span style={{ color: course.color, fontWeight: '600' }}>Batafsil</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Courses;
