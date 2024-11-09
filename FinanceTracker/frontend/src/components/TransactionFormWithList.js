import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';

const TransactionFormWithList = () => {
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: '',
    });
    const [transactions, setTransactions] = useState([]);

    const fetchUserTransactions = async () => {
        const user = auth.currentUser;
        const userId = user.uid;
        console.log("User Id:", userId);

        if (!userId) {
            console.error('User ID is missing');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5259/api/transaction/user/${userId}`);
            if (!response.ok) {
                console.error(`Failed to fetch transactions: ${response.statusText}`);
                return;
            }
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };


    // Fetch user transactions on component mount
    useEffect(() => {
        fetchUserTransactions();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = auth.currentUser;
        const userId = user ? user.uid : null;

        if (!userId) {
            alert("User not authenticated");
            return;
        }

        const transactionWithUser = {
            ...formData,
            userId,
            date: formData.date ? formData.date : new Date().toISOString() // Store date as a string
        };

        try {
            const response = await fetch('http://localhost:5259/api/transaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transactionWithUser)
            });

            if (response.ok) {
                alert('Transaction added successfully');
                setFormData({ description: '', amount: '', category: '', date: '' });
                fetchUserTransactions();
            } else {
                console.error('Failed to add transaction:', response.statusText);
                alert('Failed to add transaction');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
        <div className="container">
            <h1>Finance Tracker</h1>
            <form className="transaction-form" onSubmit={handleSubmit}>
                <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
                <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} required />
                <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
                <button type="submit">Add Transaction</button>
            </form>

            <h2>Your Transactions</h2>
            <div className="transactions-list">
                {transactions.length === 0 ? (
                    <p>No transactions found</p>
                ) : (
                    transactions.map((transaction) => (
                        <div className="transaction-card" key={transaction.id}>
                            <h3>{transaction.description}</h3>
                            <p><strong>Amount:</strong> ${transaction.amount}</p>
                            <p><strong>Category:</strong> {transaction.category}</p>
                            <p><strong>Date:</strong> {new Date(transaction.date.seconds * 1000).toLocaleDateString()}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TransactionFormWithList;
