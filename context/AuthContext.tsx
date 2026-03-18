'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
    phone?: string;
    isActive?: boolean;
    lastLogin?: string;
    createdAt?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (userData: any, token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode; lang: string }> = ({ children, lang }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Load session from localStorage
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('current_user');

        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('auth_token');
                localStorage.removeItem('current_user');
            }
        }
        setLoading(false);
    }, []);

    const login = useCallback((userData: any, token: string) => {
        setToken(token);
        setUser(userData);
        localStorage.setItem('auth_token', token);
        localStorage.setItem('current_user', JSON.stringify(userData));
        // Set cookie for middleware
        document.cookie = `auth_token=${token}; path=/; max-age=${24 * 60 * 60}; samesite=lax`;
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
        // Remove cookie
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        router.push(`/${lang}/dashboard/login`);
    }, [router, lang]);

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            loading, 
            login, 
            logout, 
            isAuthenticated: !!token 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
