import React, { useState } from 'react';
import { MessageCircle, X, Send, CheckCircle } from 'lucide-react';
import { addMessage } from '../data/dataService';
import { useAuth } from '../context/AuthContext';

export default function SupportCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('idle'); // idle, sending, sent
    const { user } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setStatus('sending');

        // Simulate network delay
        setTimeout(() => {
            addMessage('feedback', message, user?.username || 'Anonim');
            setStatus('sent');
            setMessage('');
            setTimeout(() => {
                setStatus('idle');
                setIsOpen(false);
            }, 2000);
        }, 800);
    };

    return (
        <div className="support-widget" style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}>
            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="btn btn-primary"
                    style={{ width: '60px', height: '60px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(var(--primary-rgb), 0.4)' }}
                >
                    <MessageCircle size={28} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="glass chat-window" style={{ width: '320px', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                    <div style={{ background: 'var(--primary)', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Qo'llab-quvvatlash</h3>
                            <p style={{ fontSize: '0.75rem', margin: 0, opacity: 0.8 }}>O'rtacha javob vaqti: 1 soat</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <X size={20} />
                        </button>
                    </div>

                    <div style={{ padding: '20px' }}>
                        {status === 'sent' ? (
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <CheckCircle size={48} color="var(--success)" style={{ marginBottom: '16px' }} />
                                <h4 style={{ margin: '0 0 8px' }}>Xabar yuborildi!</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tez orada adminlarimiz siz bilan bog'lanishadi.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>
                                    Savol yoki taklifingizni yozing:
                                </label>
                                <textarea
                                    className="search-bar"
                                    style={{ width: '100%', minHeight: '120px', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.1)' }}
                                    placeholder="Xabaringiz..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    disabled={status === 'sending'}
                                />
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ width: '100%', borderRadius: '12px' }}
                                    disabled={status === 'sending' || !message.trim()}
                                >
                                    {status === 'sending' ? 'Yuborilmoqda...' : (
                                        <>Yuborish <Send size={16} /></>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
