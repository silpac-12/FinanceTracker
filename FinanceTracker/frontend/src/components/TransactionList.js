// src/components/TransactionList.js
import React, { useEffect, useState } from 'react';

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch('/api/transaction'); // Adjust the endpoint as needed
                const data = await response.json();
                setTransactions(data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };
        fetchTransactions();
    }, []);

    return (
        <div className="transaction-list">
            <h2>Transactions</h2>
            <ul>
                {transactions.map((transaction) => (
                    <li key={transaction.id}>
                        <strong>{transaction.description}</strong>: ${transaction.amount} - {transaction.category} on {new Date(transaction.date).toLocaleDateString()}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransactionList;
