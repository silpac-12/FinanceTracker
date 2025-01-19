import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
//import './styles.css';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const TransactionFormWithList = () => {
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: '',
    });
    const [transactions, setTransactions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [darkMode, setDarkMode] = useState(false);
    const [showChart, setShowChart] = useState(true);
    const [showTransactions, setShowTransactions] = useState(true);

    const fetchUserTransactions = async () => {
        const user = auth.currentUser;
        const userId = user ? user.uid : null;

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
            setFilteredTransactions(data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

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
            date: formData.date ? formData.date : new Date().toISOString(),
        };

        try {
            const response = await fetch('http://localhost:5259/api/transaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transactionWithUser),
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

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setFilteredTransactions(
            transactions.filter((transaction) =>
                transaction.description.toLowerCase().includes(query) ||
                transaction.category.toLowerCase().includes(query)
            )
        );
    };

    const getMonthlySpending = () => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        return transactions
            .filter((transaction) => {
                const transactionDate = new Date(transaction.date.seconds * 1000);
                return (
                    transactionDate.getMonth() === currentMonth &&
                    transactionDate.getFullYear() === currentYear
                );
            })
            .reduce((total, transaction) => total + parseFloat(transaction.amount || 0), 0);
    };

    // Prepare data for Pie Chart
    const getPieChartData = () => {
        const categoryTotals = filteredTransactions.reduce((acc, transaction) => {
            const category = transaction.category || 'Uncategorized';
            const amount = parseFloat(transaction.amount) || 0;
            acc[category] = (acc[category] || 0) + amount;
            return acc;
        }, {});

        return {
            labels: Object.keys(categoryTotals),
            datasets: [
                {
                    data: Object.values(categoryTotals),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                },
            ],
        };
    };

    return (
        <div className={`container mt-4 ${darkMode ? 'bg-dark text-light' : ''}`}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="text-center">Finance Tracker</h1>
                <button
                    className={`btn ${darkMode ? 'btn-light' : 'btn-dark'}`}
                    onClick={() => setDarkMode(!darkMode)}
                >
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
            </div>

            <div className="alert alert-info text-center">
                Monthly Spending: ${getMonthlySpending().toFixed(2)}
            </div>

            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-secondary" onClick={() => setShowChart(!showChart)}>
                    {showChart ? 'Hide Chart' : 'Show Chart'}
                </button>
                <button className="btn btn-secondary" onClick={() => setShowTransactions(!showTransactions)}>
                    {showTransactions ? 'Hide Transactions' : 'Show Transactions'}
                </button>
            </div>

            <form className="transaction-form mb-4" onSubmit={handleSubmit}>
                <div className="row g-3">
                    <div className="col-md-4">
                        <label htmlFor="description" className="form-label">Description</label>
                        <input
                            type="text"
                            name="description"
                            id="description"
                            className="form-control"
                            placeholder="Enter description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="amount" className="form-label">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            id="amount"
                            className="form-control"
                            placeholder="Enter amount"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="category" className="form-label">Category</label>
                        <input
                            type="text"
                            name="category"
                            id="category"
                            className="form-control"
                            placeholder="Enter category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="text-center mt-3">
                    <button type="submit" className="btn btn-primary">Add Transaction</button>
                </div>
            </form>

            <div className="row gx-5 align-items-stretch">
                {showChart && (
                    <div className="col-lg-6 d-flex flex-column justify-content-center">
                        <h2 className="text-center">Transaction Breakdown</h2>
                        <div className="chart-container d-flex justify-content-center">
                            <Pie data={getPieChartData()} style={{ maxWidth: '400px', height: 'auto' }} />
                        </div>
                    </div>
                )}

                {showTransactions && (
                    <div className="col-lg-6">
                        <h2 className="text-center">Your Transactions</h2>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by description or category"
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </div>
                        <div className="transactions-list border rounded p-3" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            {filteredTransactions.length === 0 ? (
                                <p className="text-center">No transactions found</p>
                            ) : (
                                filteredTransactions.map((transaction) => (
                                    <div className="transaction-card mb-3 p-2 border rounded" key={transaction.id}>
                                        <h5 className="transaction-description">{transaction.description}</h5>
                                        <p><strong>Amount:</strong> ${transaction.amount}</p>
                                        <p><strong>Category:</strong> {transaction.category}</p>
                                        <p><strong>Date:</strong> {transaction.date ? new Date(transaction.date.seconds * 1000).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionFormWithList;
