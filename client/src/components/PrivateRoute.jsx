import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'
import PropTypes from 'prop-types';

export default function PrivateRoute({ allowedRoles }) {
    const { currentUser } = useSelector(state => state.user)
    
    if (!currentUser) {
        return <Navigate to='/sign-in' />
    }

    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        return <Navigate to='/' />
    }

    return <Outlet />
}

PrivateRoute.propTypes = {
    allowedRoles: PropTypes.arrayOf(PropTypes.string)
};
