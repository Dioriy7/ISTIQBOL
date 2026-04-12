import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '40px',
                    background: '#1a1a2e',
                    color: '#ff4d4d',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif'
                }}>
                    <h1>Ups! Nimadir xato ketdi.</h1>
                    <p style={{ color: '#94a3b8' }}>{this.state.error?.toString()}</p>
                    <button
                        onClick={() => window.location.href = '/'}
                        style={{
                            marginTop: '20px',
                            padding: '10px 20px',
                            background: '#6366f1',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        Bosh sahifaga qaytish
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
