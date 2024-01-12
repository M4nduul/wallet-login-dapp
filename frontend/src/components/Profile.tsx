import './Component.css';

import jwtDecode from 'jwt-decode';
import React, { useState, useEffect } from 'react';

import { Auth } from '../types';

interface Props {
    auth: Auth;
    onLoggedOut: () => void;
}

interface State {
    loading: boolean;
    user?: {
        id: number;
        username: string;
    };
    username: string;
}

interface JwtDecoded {
    payload: {
        id: string;
        publicAddress: string;
    };
}

export const Profile = ({ auth, onLoggedOut }: Props) => {
    const [state, setState] = useState<State>({
        loading: false,
        user: undefined,
        username: '',
    });

    useEffect(() => {
        const { accessToken } = auth;
        const {
            payload: { id },
        } = jwtDecode<JwtDecoded>(accessToken);

        fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((response) => response.json())
            .then((user) => setState({ ...state, user }))
            .catch(window.alert);
    }, []);

    const handleChange = ({
        target: { value },
    }: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, username: value });
    };

    const handleSubmit = () => {
        const { accessToken } = auth;
        const { user, username } = state;

        setState({ ...state, loading: true });

        if (!user) {
            window.alert(
                'The user id has not been fetched yet. Please try again in 5 seconds.'
            );
            return;
        }

        fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${user.id}`, {
            body: JSON.stringify({ username }),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            method: 'PATCH',
        })
            .then((response) => response.json())
            .then((user) => setState({ ...state, loading: false, user }))
            .catch((err) => {
                window.alert(err);
                setState({ ...state, loading: false });
            });
    };

    const { accessToken } = auth;

    const {
        payload: { publicAddress },
    } = jwtDecode<JwtDecoded>(accessToken);

    const { loading, user } = state;

    return (
        <div>
            <div style={{ color: '#fff' }}>
                Logged in with publicAddress :<pre>{publicAddress}</pre>
            </div>
            <p>
                <button style={{ background: 'transparent', border: '1px #ffff solid', marginRight: '20px' }}
                    onClick={onLoggedOut}
                >
                    <span style={{ color: '#fff' }}>
                        Logout
                    </span>
                </button>
            </p>
        </div>
    );
};
