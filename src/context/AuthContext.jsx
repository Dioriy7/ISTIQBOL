import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load user from localStorage on initial load
        const savedUser = localStorage.getItem('istiqbol_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('istiqbol_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('istiqbol_user');
    };

    const register = (userData) => {
        // Simple registration simulation (storing in a list of users)
        const users = JSON.parse(localStorage.getItem('istiqbol_users') || '[]');
        const userExists = users.find(u => u.username === userData.username);

        if (userExists) {
            throw new Error('Ushbu foydalanuvchi nomi band.');
        }

        users.push(userData);
        localStorage.setItem('istiqbol_users', JSON.stringify(users));

        // Automatically login after successful registration
        login(userData);
    };

    const updateProfile = (updatedData) => {
        const newUser = { ...user, ...updatedData };
        setUser(newUser);
        localStorage.setItem('istiqbol_user', JSON.stringify(newUser));

        // Also update in the 'users' list
        const users = JSON.parse(localStorage.getItem('istiqbol_users') || '[]');
        const userIndex = users.findIndex(u => u.username === user.username);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updatedData };
            localStorage.setItem('istiqbol_users', JSON.stringify(users));
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, updateProfile, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
