import './Component.css'
import React, { useState } from 'react';
import Web3 from 'web3';

import { Auth } from '../types';

interface ILogin {
    onLoggedIn: (auth: Auth) => void;
}

const API = process.env.REACT_APP_BACKEND_URL

let web3: Web3 | undefined = undefined;

export const Login = ({ onLoggedIn }: ILogin) => {

    const [loading, setLoading] = useState(false);

    const handleAuthenticate = ({
        publicAddress,
        signature,
    }: {
        publicAddress: any;
        signature: any;
    }) =>
        fetch(`${API}/auth`, {
            body: JSON.stringify({ publicAddress, signature }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        }).then((response) => response.json());

    const handleSignMessage = async ({
        publicAddress,
        nonce,
    }: {
        publicAddress: string;
        nonce: string;
    }) => {
        try {
            const signature = await web3?.eth.personal.sign(
                `nonce: ${nonce}`,
                publicAddress,
                '' // MetaMask will ignore the password argument here
            );

            return { publicAddress, signature };
        } catch (err) {
            throw new Error(
                'You need to sign the message to be able to log in.'
            );
        }
    };

    const handleSignup = (publicAddress: string) =>
        fetch(`${API}/users`, {
            body: JSON.stringify({ publicAddress }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        }).then((response) => response.json());

    const handleClick = async () => {

        if (!web3) {
            try {
                // Request account access if needed
                await (window as any).ethereum.enable();
                web3 = new Web3((window as any).ethereum);
            } catch (error) {
                window.alert('You need to allow MetaMask.');
                return;
            }
        }

        const coinbase = await web3.eth.getCoinbase();
        if (!coinbase) {
            window.alert('Please activate MetaMask first.');
            return;
        }

        const publicAddress = coinbase.toLowerCase();
        setLoading(true);

        // Check  user publicAddress is already present on backend

        fetch(
            `${API}/users?publicAddress=${publicAddress}`
        )
            .then((response) => response.json())
            // If yes, retrieve it. If no, create it.
            .then((users) =>
                users.length ? users[0] : handleSignup(publicAddress)
            )
            // Popup MetaMask confirmation modal to sign message
            .then(handleSignMessage)
            // Send signature to backend on the /auth route
            .then(handleAuthenticate)
            // Pass accessToken back to parent component (to save it in localStorage)
            .then(onLoggedIn)
            .catch((err) => {
                window.alert(err);
                setLoading(false);
            });
    };

    return (
        <button style={{ background: 'transparent', border: '1px #ffff solid', marginRight: '20px' }}
            onClick={handleClick}
        >
            <span style={{ color: '#fff' }}>
                {loading ? 'Loading...' : 'Connect Wallet'}
            </span>
        </button>
    );
    // return (
    //     <div>

    //         <button className="Login-button Login-mm" onClick={handleClick}>
    //             {loading ? 'Loading...' : 'Login with MetaMask'}
    //         </button>
    //     </div>
    // );
};