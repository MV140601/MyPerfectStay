import React, { useContext, useState } from 'react';
import { UserContext } from '../usercontext';
import { Link, Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Placespage from '../pages/Placespage.jsx'
import AccountNavigation from '../components/AccountNavigation.jsx';
const Accountpage = () => {
    const { ready, user, setUser } = useContext(UserContext);
    const [redirect, setRedirect] = useState(null);
    let { subpages = 'profile' } = useParams();

    async function Logout() {
        try {
            await axios.post('/logout');
            setUser(null);
            setRedirect('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

   
    if (!ready) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <div>
           <AccountNavigation/>

            {subpages === 'profile' && user && (
                <div className="text-center max-w-lg mx-auto">
                    Logged in as {user.name}, {user.email}
                    <button onClick={Logout} className="primary max-w-sm mt-2">Logout</button>
                </div>
            )} {subpages === 'bookings' && <div>Bookings Content</div>}
            {subpages === 'places' && <div><Placespage/></div>}
        </div>
    );
};

export default Accountpage;
