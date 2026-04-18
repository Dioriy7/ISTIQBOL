import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

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
                        text: "API kalit topilmadi. Iltimos, VITE_GROQ_API_KEY ni .env fayliga qo'shing."
                    }]);
                    setLoading(false);
                    return;
                }

                const topSubjects = Object.entries(scores)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 3)
                    .map(([subject]) => subject)
                    .join(', ');

                const greetingStart = `Assalomu alaykum! Siz dastlab ${topSubjects} fanlariga e’tibor qaratganingiz, aynan shu fanlar siz uchun qiziqarli va tushunarli ekanini ko‘rsatadi. Bu esa sizda ushbu yo‘nalishlarga nisbatan kuchli qiziqish va qobiliyat shakllanayotganidan dalolat beradi, shu asosda kelajakda aynan shu fanlarga bog‘liq kasblarni tanlash siz uchun eng to‘g‘ri va muvaffaqiyatli yo‘nalish bo‘lib xizmat qiladi.`;

                const systemPrompt = `Sen 5-11 sinf o'quvchilari uchun professional karyera maslahatchisisan. 
Sening vazifang - o'quvchining test natijalarini judayam tartibli, tushunarli va mantiqiy tahlil qilish.

DIQQAT: Har doim javobingni aynan mana bu gap bilan boshla:
"${greetingStart}"

Qoidalar:
1. Juda aniq va lo'nda bo'l. Tavsiyalar mantiqan to'g'ri bo'lsin.
2. Max 3-4 ta eng mos va zamonaviy kasbni tavsiya qil.
3. O'quvchilar uchun sodda tilda tushuntir.
4. Har bir tavsiya etilgan kasb uchun:
   - Kasb nomi (emoji bilan)
   - Bu kasbda nima ish qilinishi (1-2 gapda)
   - Nima uchun bu aynan shu o'quvchiga mos (natijalarga asoslanib)
5. Ruhlantiruvchi va do'stona ohangda gaplash.`;

                const prompt = `Foydalanuvchi natijalari: ${Object.entries(scores).map(([s, sc]) => `${s}: ${sc}%`).join(', ')}. Iltimos, tahlilni va tavsiyalarni ber.`;

                const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${API_KEY}`
                    },
                    body: JSON.stringify({
                        messages: [{ role: "user", content: prompt }],
                        model: "llama-3.1-8b-instant"
                    })
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const data = await response.json();
                const text = data.choices[0].message.content;
                setMessages([{ role: 'ai', text: text }]);
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
            const topSubjects = Object.entries(scores)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([subject]) => subject)
                .join(', ');

            const systemPrompt = `Sen 5-11 sinf o'quvchilari uchun professional karyera maslahatchisisan. 
Sening vazifang - o'quvchining test natijalarini judayam tartibli, tushunarli va mantiqiy tahlil qilish.

Qoidalar:
1. Juda aniq va lo'nda bo'l. Tavsiyalar mantiqan to'g'ri bo'lsin.
2. Max 3-4 ta eng mos va zamonaviy kasbni tavsiya qil.
3. O'quvchilar uchun sodda tilda tushuntir.
4. Har bir tavsiya etilgan kasb uchun:
   - Kasb nomi (emoji bilan)
   - Bu kasbda nima ish qilinishi (1-2 gapda)
   - Nima uchun bu aynan shu o'quvchiga mos (natijalarga asoslanib: ${topSubjects})
5. Ruhlantiruvchi va do'stona ohangda gaplash.`;

            const history = [
                { role: "system", content: systemPrompt },
                ...messages.map(m => ({
                    role: m.role === 'ai' ? 'assistant' : 'user',
                    content: m.text
                })),
                { role: "user", content: input }
            ];

            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    messages: history,
                    model: "llama-3.1-8b-instant"
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            const text = data.choices[0].message.content;
            setMessages(prev => [...prev, { role: 'ai', text: text }]);
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
                                <div className="chat-msg-text">
                                    {msg.role === 'ai' ? (
                                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                                    ) : (
                                        msg.text
                                    )}
                                </div>
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
