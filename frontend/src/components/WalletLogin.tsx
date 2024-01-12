import React, { useState } from 'react';

const WalletLogin: React.FC = () => {
    const [privateKey, setPrivateKey] = useState<string>('');
    const [message, setMessage] = useState<string>('Login to DApp');

    const handleLogin = async () => {
        try {

            setMessage('clicked')
        } catch (error: any) {
            console.error('Error:', error.message);
            alert('Login failed. Please check your private key.');
        }
    };


    return (
        <div>
            <h1>Wallet Login</h1>
            <label htmlFor="privateKey">Enter your private key:</label>
            <input
                type="text"
                id="privateKey"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default WalletLogin;
