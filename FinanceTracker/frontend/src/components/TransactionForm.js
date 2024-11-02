// src/components/TransactionForm.js
import React, { useState } from 'react';

const TransactionForm = () => {
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: '',
        date: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Make a POST request to your backend API
        try {
            const response = await fetch('/api/transaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                alert('Transaction added successfully');
                setFormData({ description: '', amount: '', category: '', date: '' });
            } else {
                alert('Failed to add transaction');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
            <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} required />
            <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
            <button type="submit">Add Transaction</button>
        </form>
    );
};

export default TransactionForm;
