import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export { PrivateRoute };

function PrivateRoute({ children }) {
    const navigate = useNavigate();

    // If this tab was kicked out by another tab, treat as unauthenticated
    const isKickedOut = sessionStorage.getItem('kicked_out_crosstab') === 'true';

    useEffect(() => {
        if (!localStorage.getItem('token') || isKickedOut) {
            navigate({ pathname: '/login' });
        }
    }, [navigate, isKickedOut]);

    if (!localStorage.getItem('token') || isKickedOut) {
        return null;
    }

    return children;
}