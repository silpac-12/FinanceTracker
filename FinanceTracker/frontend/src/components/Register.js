// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert('Registration successful!');
            navigate('/login');
        } catch (error) {
            console.error('Error registering:', error.message);
            alert('Failed to register. Please try again.');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Register</button>
            </form>
            <button onClick={() => navigate('/login')}>Back to Login</button>
        </div>
    );
};

export default Register;
