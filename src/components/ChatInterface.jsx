import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const ChatInterface = ({ onFinish }) => {
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Assalomu alaykum! Sizni kelajagingiz haqida o‘ylantirayotgan savollar bormi? To‘g‘ri yo‘nalishni tanlash hozirdanoq juda muhim, chunki bu sizning kelajak hayotingizga ta’sir qiladi. Keling, birga sizga eng mos yo‘lni aniqlab chiqamiz. Sening qiziqishlaringni bilish uchun savol bersam bo\'ladimi?' }
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
                    setMessages(prev => [...prev, { role: 'ai', text: "API kalit topilmadi. Iltimos, .env faylga VITE_GROQ_API_KEY=sizning_kalitingiz ni qo'shing. Hozircha men faqat namunaviy rejimdaman." }]);
                    setLoading(false);
                }, 1000);
                return;
            }

            // Prompt engineering context to guide the AI
            const contextPrompt = `Sen maktab o'quvchilari uchun mehribon psixolog va karyera maslahatchisisan. 

Sening vazifang:
1. O'quvchi bilan judayam tartibli va tushunarli tilda gaplashish.
2. O'quvchining qiziqishlarini aniqlash uchun oddiy savollar berish.
3. Agar o'quvchi haqida yetarli ma'lumot to'plansa, "NATIJA:" deb boshlab, unga 3 ta real kasbni tavsiya qilish.
4. Javobing tartib bilan, punktlarga bo'lingan va chiroyli formatda bo'lsin.
5. Murakkab atamalarni ishlatma, bolalarga mos bo'lsin.`;

            const history = [{ role: "system", content: contextPrompt }];
            messages.forEach(m => {
                history.push({
                    role: m.role === 'ai' ? 'assistant' : 'user',
                    content: m.text
                });
            });
            history.push({ role: "user", content: input });

            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    messages: history,
                    model: "llama-3.1-8b-instant",
                    max_tokens: 150,
                })
            });

            if (!response.ok) {
                throw new Error(`API xatosi: ${response.status}`);
            }

            const data = await response.json();
            const text = data.choices[0].message.content;

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
