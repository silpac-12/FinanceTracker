// src/components/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Home = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    return (
        <div>
            <h2>Welcome to your Dashboard</h2>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={() => navigate('/TransactionForm')}>Add Transaction</button>
        </div>
    );
};

export default Home;
