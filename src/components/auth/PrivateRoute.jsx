import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export { PrivateRoute };

function PrivateRoute({ children }) {
    const token = localStorage.getItem('token')
    const navigate = useNavigate();
    
    useEffect(() => {
        console.log(localStorage.getItem('token'));
        if(!localStorage.getItem('token')) {
            // not logged in so redirect to login page with the return url
            // return <Navigate to="/login" state={ '/home' } />
            console.log('navigate to login page');
            navigate({
                pathname: '/login',
                // state: { from: {pathname: '/home'} }
            })
       }
    })

    return children;
}