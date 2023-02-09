import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks'
import { selectUsers } from '../../features/admin/adminSlice'

export { UserAdminRoute };

function UserAdminRoute({ children }) {
    const token = localStorage.getItem('token')
    const navigate = useNavigate();
    const user = useAppSelector(selectUsers)
    
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

       if(user.role !== "USERADMIN") {
        navigate({
            pathname: '/login',
            // state: { from: {pathname: '/home'} }
        })
       }
    })

    return children;
}