import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks'
import { selectUsers } from '../../features/admin/adminSlice'

export { UserAdminRoute };

function UserAdminRoute({ children }) {
    const token = localStorage.getItem('token')
    const navigate = useNavigate();
    const user = useAppSelector(selectUsers)
    const hasUserAdminRoleInToken = () => {
        try {
            const currentToken = localStorage.getItem('token');
            if (!currentToken) return false;
            const payload = currentToken.split('.')[1];
            if (!payload) return false;
            const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
            const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
            const decoded = JSON.parse(window.atob(padded));
            const roles = Array.isArray(decoded?.rol) ? decoded.rol.map((r) => String(r).toUpperCase()) : [];
            // Accept USERADMIN or legacy MANAGER as valid user admin role
            return roles.includes("USERADMIN") || roles.includes("MANAGER");
        } catch {
            return false;
        }
    };
    
    // Check if this is a stolen session
    const tabId = sessionStorage.getItem('app_tab_id');
    const activeTabId = localStorage.getItem('active_tab_id');
    const isStolenSession = activeTabId && tabId && activeTabId !== tabId;
    
    useEffect(() => {
        console.log(localStorage.getItem('token'));
        if(!localStorage.getItem('token') || isStolenSession) {
            // not logged in so redirect to login page with the return url
            // return <Navigate to="/login" state={ '/home' } />
            console.log('navigate to login page');
            navigate({
                pathname: '/login',
                // state: { from: {pathname: '/home'} }
            })
       }

       const activeRole = localStorage.getItem('activeRole') || '';
       if(activeRole !== "USERADMIN" && !hasUserAdminRoleInToken()) {
        navigate({
            pathname: '/login',
        })
       }
    }, [navigate, isStolenSession]);

    if (!localStorage.getItem('token') || isStolenSession) {
        return null;
    }

    return children;
}