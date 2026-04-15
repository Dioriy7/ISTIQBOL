import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, User, Bot } from 'lucide-react';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const AICareerAdvisor = ({ scores, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initial message on mount
    useEffect(() => {
        const initAI = async () => {
            setLoading(true);
            try {
                if (!API_KEY) {
                    setMessages([{
                        role: 'ai',
                        text: "API kalit topilmadi. Iltimos, VITE_GEMINI_API_KEY ni .env fayliga qo'shing."
                    }]);
                    setLoading(false);
                    return;
                }

                const genAI = new GoogleGenerativeAI(API_KEY);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                const scoreText = Object.entries(scores)
                    .map(([subject, score]) => `${subject}: ${score}%`)
                    .join(', ');

                const systemPrompt = `Sen professional career advisor sifatida ishlaysan. 
Foydalanuvchining test natijalariga qarab unga mos kasblarni aniqlaysan.
Har doim:
1. Mos kasblarni ayt
2. Nima uchun mosligini tushuntir
3. 2-3 aniq yo‘nalish ber
4. Qanday boshlashni sodda qilib tushuntir
Javob oddiy, tushunarli va motivatsion bo‘lsin.`;

                const prompt = `${systemPrompt}\n\nFoydalanuvchi natijalari: ${scoreText}. Iltimos, birinchi tahlilni va tavsiyalarni ber.`;

                const result = await model.generateContent(prompt);
                const response = result.response;
                setMessages([{ role: 'ai', text: response.text() }]);
            } catch (error) {
                console.error("AI Error:", error);
                setMessages([{ role: 'ai', text: "Kechirasiz, tahlil qilishda xatolik yuz berdi. Iltimos, keyinroq qayta urunib ko'ring." }]);
            } finally {
                setLoading(false);
            }
        };

        if (scores) initAI();
    }, [scores]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const chat = model.startChat({
                history: messages.map(m => ({
                    role: m.role === 'ai' ? 'model' : 'user',
                    parts: [{ text: m.text }]
                })),
            });

            const result = await chat.sendMessage(input);
            const response = result.response;
            setMessages(prev => [...prev, { role: 'ai', text: response.text() }]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'ai', text: "Xatolik yuz berdi. Qayta urinib ko'ring." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-advisor-overlay" onClick={onClose}>
            <motion.div
                className="ai-advisor-modal glass"
                onClick={e => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
                <div className="ai-advisor-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: 'var(--primary)', color: 'white', padding: '8px', borderRadius: '10px' }}>
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>AI Karyera Maslahatchisi</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>Online</div>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <div className="ai-advisor-chat">
                    <AnimatePresence>
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                className={`chat-msg ${msg.role}`}
                                initial={{ opacity: 0, x: msg.role === 'ai' ? -10 : 10 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <div style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', opacity: 0.6 }}>
                                    {msg.role === 'ai' ? <Bot size={12} /> : <User size={12} />}
                                    {msg.role === 'ai' ? 'AI Mentor' : 'Siz'}
                                </div>
                                {msg.text}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {loading && <div className="typing-indicator">AI tahlil qilmoqda...</div>}
                    <div ref={messagesEndRef} />
                </div>

                <div className="ai-advisor-input-area">
                    <input
                        className="ai-advisor-input"
                        placeholder="Savolingizni yozing..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        className="btn btn-primary"
                        style={{ padding: '12px' }}
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AICareerAdvisor;
