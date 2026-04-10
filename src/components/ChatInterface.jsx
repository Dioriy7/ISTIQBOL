import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion } from 'framer-motion';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const ChatInterface = ({ onFinish }) => {
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Salom! Men sening qiziqishlaringni aniqlashga yordam beraman. Senga ko\'proq nima qilish yoqadi: Odamlar bilan ishlashmi yoki kompyuterda bir o\'zing ishlashmi?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            if (!API_KEY) {
                // Fallback for demo without API key
                setTimeout(() => {
                    setMessages(prev => [...prev, { role: 'ai', text: "API kalit topilmadi. Iltimos, .env faylga VITE_GEMINI_API_KEY=sizning_kalitingiz ni qo'shing. Hozircha men faqat namunaviy rejimdaman." }]);
                    setLoading(false);
                }, 1000);
                return;
            }

            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const chat = model.startChat({
                history: messages.map(m => ({
                    role: m.role === 'ai' ? 'model' : 'user',
                    parts: [{ text: m.text }]
                })),
                generationConfig: {
                    maxOutputTokens: 150,
                },
            });

            // Prompt engineering context to guide the AI
            const contextPrompt = "Sen bolalar psixologi va karyera maslahatchisisan. Bolani qiziqishlarini aniqlash uchun savol ber. Agar yetarlicha ma'lumot olsang, 'NATIJA:' deb boshlab, unga mos 3 ta kasb va qisqacha ta'rif ber.";

            const result = await chat.sendMessage(contextPrompt + "\n" + input);
            const response = result.response;
            const text = response.text();

            if (text.includes("NATIJA:")) {
                onFinish(text);
            } else {
                setMessages(prev => [...prev, { role: 'ai', text: text }]);
            }

        } catch (error) {
            console.error("Error:", error);
            setMessages(prev => [...prev, { role: 'ai', text: "Kechirasiz, xatolik yuz berdi. Qaytadan urinib ko'ring." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card" style={{ width: '90%', maxWidth: '600px', height: '80vh', display: 'flex', flexDirection: 'column', padding: '1rem' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.map((msg, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            background: msg.role === 'user' ? '#4ade80' : 'rgba(255,255,255,0.2)',
                            color: msg.role === 'user' ? '#fff' : 'inherit',
                            padding: '10px 15px',
                            borderRadius: '15px',
                            maxWidth: '80%',
                            textAlign: 'left'
                        }}
                    >
                        {msg.text}
                    </motion.div>
                ))}
                {loading && <div style={{ alignSelf: 'flex-start', color: '#aaa' }}>Yozmoqda...</div>}
                <div ref={messagesEndRef} />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Javobingizni yozing..."
                    style={{ flex: 1, padding: '1rem', borderRadius: '10px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'inherit' }}
                />
                <button onClick={handleSend} style={{ background: '#3b82f6', color: '#fff' }}>Yuborish</button>
            </div>
        </div>
    );
};

export default ChatInterface;
