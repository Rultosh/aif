import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export { UserRoute };

function UserRoute({ children }) {
    const token = localStorage.getItem('token')
    const navigate = useNavigate();
    
    const hasUserRoleInToken = () => {
        try {
            const currentToken = localStorage.getItem('token');
            if (!currentToken) return false;
            const payload = currentToken.split('.')[1];
            if (!payload) return false;
            const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
            const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
            const decoded = JSON.parse(window.atob(padded));
            const roles = Array.isArray(decoded?.rol) ? decoded.rol.map((r) => String(r).toUpperCase()) : [];
            // Only allow USER role (registered applicants)
            return roles.includes("USER");
        } catch {
            return false;
        }
    };
    
    const forceLogout = () => {
        // Clear all authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('activeRole');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
        // Clear any other auth-related items
        Object.keys(localStorage).forEach(key => {
            if (key.toLowerCase().includes('auth') || 
                key.toLowerCase().includes('token') || 
                key.toLowerCase().includes('session')) {
                localStorage.removeItem(key);
            }
        });
        // Redirect to login
        navigate('/login');
    };
    
    useEffect(() => {
        if(!localStorage.getItem('token')) {
            // not logged in so redirect to login page
            navigate('/login');
            return;
        }

        const activeRole = localStorage.getItem('activeRole') || '';
        if(activeRole !== "USER" && !hasUserRoleInToken()) {
            // SECURITY: Force logout for unauthorized access attempt
            console.warn('Unauthorized access attempt to /workflow - forcing logout');
            forceLogout();
            return;
        }
    })

    return children;
}