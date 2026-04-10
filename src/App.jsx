import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Courses from './components/Courses';
import Books from './components/Books';
import Quiz from './components/Quiz';
import Support from './components/Support';

function App() {
    const [currentSection, setCurrentSection] = useState('home');

    const renderSection = () => {
        switch (currentSection) {
            case 'home':
                return <Home setSection={setCurrentSection} />;
            case 'courses':
                return <Courses />;
            case 'books':
                return <Books />;
            case 'quiz':
                return <Quiz />;
            case 'support':
                return <Support />;
            default:
                return <Home setSection={setCurrentSection} />;
        }
    };

    return (
        <div className="app-container">
            <Navbar currentSection={currentSection} setSection={setCurrentSection} />
            <main className="main-content-wrapper" style={{ flex: 1 }}>
                {renderSection()}
            </main>
            <footer style={{
                padding: '2rem',
                textAlign: 'center',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                borderTop: '1px solid var(--glass-border)',
                marginTop: 'auto'
            }}>
                © 2026 Kasb.uz — Zamonaviy Kasblar Platformasi. Barcha huquqlar himoyalangan.
            </footer>
        </div>
    );
}

export default App;
