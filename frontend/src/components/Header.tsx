import React, { useState, useEffect } from 'react';
import { Login } from './Login';
import { Profile } from './Profile';
import { Auth } from '../types';

import './Component.css'

const LS_KEY = 'login-with-metamask:auth';


interface State {
    auth?: Auth;
}
export const Header: React.FC = () => {
    const [state, setState] = useState<State>({});


    useEffect(() => {
        // Access token is stored in localstorage
        const ls = window.localStorage.getItem(LS_KEY);
        const auth = ls && JSON.parse(ls);
        setState({ auth });
    }, []);

    const handleLoggedIn = (auth: Auth) => {
        localStorage.setItem(LS_KEY, JSON.stringify(auth));
        setState({ auth });
    };

    const handleLoggedOut = () => {
        localStorage.removeItem(LS_KEY);
        setState({ auth: undefined });
    };

    const { auth } = state;
    // useEffect(() => {
    
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#000', boxShadow: 'black 0px 0px 20px 15px', padding: ' 6px 24px' }}>
            <h2>CYAN</h2>
            <div style={{ display: 'flex', width: "70%", alignItems: 'center', justifyContent: 'space-between', }}>
                {/* <p>Docs</p>
                <p>Team</p>
                <p>Twitter</p>
                <p>Discord</p>
                <p>YouTube</p>
                <p>Articles</p> */}
                <div>
                    {auth ? (
                        <Profile auth={auth} onLoggedOut={handleLoggedOut} />
                    ) : (
                        <Login onLoggedIn={handleLoggedIn} />
                    )}
                    <button>
                        <span>
                            Launch App
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}