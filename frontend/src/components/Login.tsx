import './Component.css'
import React, { useState } from 'react';
import Web3 from 'web3';
import axios from 'axios';

import { Auth } from '../types';

interface ILogin {
    onLoggedIn: (user: Auth) => void;
}

const API = process.env.REACT_APP_BACKEND_URL

let web3: Web3 | undefined = undefined;

export const Login = ({ onLoggedIn }: ILogin) => {

    const [loading, setLoading] = useState(false);


    const handleAuthenticate = async ({ publicAddress, signature }: { publicAddress: any; signature: any }) => {
      try {
        const response = await axios.post(
          `${API}/auth`,
          { publicAddress, signature },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
    
        return response.data;
      } catch (err: any) {
        throw new Error(err.response?.data?.message || 'Error during authentication');
      }
    };
    
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

    const handleSignup = async (publicAddress: string) => {
        try {
          const response = await axios.post(
            `${API}/users`,
            { publicAddress },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
      
          return response.data;
        } catch (err: any) {
          throw new Error(err.response?.data?.message || 'Error during signup');
        }
      };
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

        try {
            const response = await axios.get(`${API}/users`, {
              params: { publicAddress: publicAddress }
            });
          
            const users = response.data;

            const user = users.length ? users[0] : await handleSignup(publicAddress);
            const signedMessage = await handleSignMessage(user);
            const accessInfo = await handleAuthenticate(signedMessage);
            onLoggedIn(accessInfo);

          } catch (err: any) {
            window.alert(err.message);
            setLoading(false);
          }
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
};
