import React, { useState } from 'react';
import Web3 from 'web3';
import './Component.css';

// import { Auth } from '../types';

// interface ILogin {
//     onLoggedIn: (auth: Auth) => void;
// }

let web3: Web3 | undefined = undefined;

// interface ILogin {
//     onLoggedIn: (auth: Auth) => void;
// }

export const Login = () => {
    const [isLoading, setIsLoading] = useState<Boolean>(false)
    const [publicAddress, setPublicAddress] = useState<String>()

    const detectCurrentProvider = () => {

        let provider;
        if ((window as any).ethereum) {

            // Check if the provider is MetaMask
            provider = (window as any).ethereum;
        } else if ((window as any).web3) {

            // Fallback for older versions
            provider = (window as any).web3.currentProvider;
        } else {
            console.error('No Ethereum provider found');
        }
        return provider
    }

    const onConnect = async () => {
        try {
            const currentProvider = detectCurrentProvider()
            if (currentProvider) {
                await currentProvider.request({ method: "eth_requestAccounts" })
                const web3 = new Web3(currentProvider)
                const userAccount = await web3.eth.getAccounts()
                setPublicAddress(userAccount[0])
            }



            fetch(
                `${process.env.BACKEND_API_URL}/users?publicAddress=${publicAddress}`
            ).then(response => response.json())
            // check acc is exist
            const isAccountExist = true
            if (isAccountExist) {
                // Login 
            } else {
                // register mail username pro_pic

            }

        } catch (err) {
            console.error(err);
        }
    }

    const [loading, setLoading] = useState(false);

    const handleAuthenticate = ({
        publicAddress,
        signature,
    }: {
        publicAddress: any;
        signature: any;
    }) =>
        fetch(`${process.env.REACT_APP_BACKEND_URL}/auth`, {
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
        fetch(`${process.env.REACT_APP_BACKEND_URL}/users`, {
            body: JSON.stringify({ publicAddress }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        }).then((response) => response.json());



    // Check  user publicAddress is already present on backend
    //     fetch(
    //         `${process.env.REACT_APP_BACKEND_URL}/users?publicAddress=${publicAddress}`
    //     )
    //         .then((response) => response.json())
    //         // If yes, retrieve it. If no, create it.
    //         .then((users) =>
    //             users.length ? users[0] : handleSignup(publicAddress)
    //         )
    //         // Popup MetaMask confirmation modal to sign message
    //         .then(handleSignMessage)
    //         // Send signature to backend on the /auth route
    //         .then(handleAuthenticate)
    //         // Pass accessToken back to parent component (to save it in localStorage)
    //         // .then(onLoggedIn)
    //         .catch((err) => {
    //             window.alert(err);
    //             setLoading(false);
    //         });

    return (
        <button style={{ background: 'transparent', border: '1px #ffff solid', marginRight: '20px' }}
            onClick={onConnect}
        >
            <span style={{ color: '#fff' }}>
                Connect Wallet
            </span>
        </button>
    );
};
