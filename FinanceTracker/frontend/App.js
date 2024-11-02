// src/App.js
import React from 'react';
import SummaryDashboard from './components/SummaryDashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import './styles.css';

const App = () => {
    return (
        <div className="app">
            <h1>Finance Tracker</h1>
            <SummaryDashboard />
            <TransactionForm />
            <TransactionList />
        </div>
    );
};

export default App;
