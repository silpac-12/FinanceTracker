// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/login';
import Register from './components/Register';
import Home from './components/Home';
import TransactionForm from './components/TransactionFormWithList';
import { auth } from './firebase';
import { useEffect, useState } from 'react';

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    return (
        <Router>
            <Routes>
                {!user ? (
                    <>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        {/* Redirect to login if not authenticated */}
                        <Route path="*" element={<Navigate to="/login" replace />} />
                        
                    </>
                ) : (
                    <>
                        <Route path="/home" element={<Home />} />
                        {/* Redirect to home if authenticated */}
                            <Route path="*" element={<Navigate to="/home" replace />} />
                            <Route path="/TransactionForm" element={<TransactionForm />} />
                    </>
                )}
            </Routes>
        </Router>
    );
};

export default App;
