import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="card p-4 shadow-lg text-center" style={{ width: '500px' }}>
                <h2 className="mb-4">Welcome to your Dashboard</h2>
                <div className="d-grid gap-3">
                    <button className="btn btn-primary" onClick={() => navigate('/TransactionForm')}>Add Transaction</button>
                    <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
};

export default Home;
