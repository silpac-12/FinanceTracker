import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import MonthlySpendingGraph from './MonthlySpendingGraph';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const TransactionFormWithList = () => {
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: '',
    });
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [showChart, setShowChart] = useState(true);
    const [showTransactions, setShowTransactions] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = 10;

    const BASE_URL = process.env.REACT_APP_API_URL;
    console.log('Base URL:', BASE_URL);

    // Preset categories
    const presetCategories = [
        'Food',
        'Transport',
        'Entertainment',
        'Utilities',
        'Shopping',
        'Health',
        'Other', // For custom input
    ];

    const fetchUserTransactions = async () => {
        const user = auth.currentUser;
        const userId = user ? user.uid : null;

        if (!userId) {
            setError('User not authenticated.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/transaction/user/${userId}`);
            if (!response.ok) {
                setError(`Failed to fetch transactions: ${response.statusText}`);
                return;
            }
            const data = await response.json();
            setTransactions(data);
            setFilteredTransactions(data);
            setError('');
        } catch (error) {
            setError('Error fetching transactions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserTransactions();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'category' && value === 'Other') {
            setFormData({ ...formData, category: '' }); // Clear category for custom input
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = auth.currentUser;
        const userId = user ? user.uid : null;

        if (!userId) {
            alert('User not authenticated.');
            return;
        }

        if (parseFloat(formData.amount) <= 0) {
            alert('Amount should be a positive number.');
            return;
        }

        const transactionWithUser = {
            ...formData,
            userId,
            date: formData.date ? formData.date : new Date().toISOString(),
        };

        try {
            const response = await fetch(`${BASE_URL}/api/transaction`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transactionWithUser),
            });

            if (response.ok) {
                alert('Transaction added successfully.');
                setFormData({ description: '', amount: '', category: '', date: '' });
                fetchUserTransactions();
            } else {
                setError(`Failed to add transaction: ${response.statusText}`);
            }
        } catch (error) {
            setError('Error adding transaction. Please try again.');
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
                if (!transaction.date) {
                    console.error('Invalid transaction date:', transaction.date);
                    return false;
                }

                const transactionDate = new Date(transaction.date); // Parse ISO string to Date
                return (
                    transactionDate.getMonth() === currentMonth &&
                    transactionDate.getFullYear() === currentYear
                );
            })
            .reduce((total, transaction) => total + parseFloat(transaction.amount || 0), 0);
    };

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

    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className={`container-fluid mt-4 ${darkMode ? 'bg-dark text-light' : ''}`}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="text-center">Finance Tracker</h1>
                <button
                    className={`btn ${darkMode ? 'btn-light' : 'btn-dark'}`}
                    onClick={() => setDarkMode(!darkMode)}
                >
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading && <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>}

            <div className="alert alert-info text-center">
                Monthly Spending: ${getMonthlySpending().toFixed(2)}
            </div>

            <div className="row mb-4">
                <div className="col-lg-6">
                    <div className={`p-3 rounded ${darkMode ? 'bg-secondary' : 'bg-light'}`}>
                        <h3 className="text-center">Monthly Spending Overview</h3>
                        <MonthlySpendingGraph transactions={transactions} darkMode={darkMode} />
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className={`p-3 rounded ${darkMode ? 'bg-secondary' : 'bg-light'}`}>
                        <h3 className="text-center">Transaction Breakdown</h3>
                        <div className="d-flex justify-content-center">
                            <Pie data={getPieChartData()} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-6">
                    <div className={`p-3 rounded ${darkMode ? 'bg-secondary' : 'bg-light'}`}>
                        <h3 className="text-center">Add a Transaction</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
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
                            <div className="mb-3">
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
                            <div className="mb-3">
                                <label htmlFor="category" className="form-label">Category</label>
                                <select
                                    name="category"
                                    id="category"
                                    className="form-control"
                                    value={formData.category || 'Other'}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Select a category</option>
                                    {presetCategories.map((category, index) => (
                                        <option key={index} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {formData.category === '' && (
                                <div className="mb-3">
                                    <label htmlFor="customCategory" className="form-label">Custom Category</label>
                                    <input
                                        type="text"
                                        name="category"
                                        id="customCategory"
                                        className="form-control"
                                        placeholder="Enter custom category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            )}

                            <div className="text-center">
                                <button type="submit" className="btn btn-primary">Add Transaction</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className={`p-3 rounded ${darkMode ? 'bg-secondary' : 'bg-light'}`}>
                        <h3 className="text-center">Your Transactions</h3>
                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Search by description or category"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        <div className="transactions-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {filteredTransactions.length === 0 ? (
                                <p className="text-center">No transactions found</p>
                            ) : (
                                filteredTransactions.map((transaction) => (
                                    <div
                                        className={`transaction-card mb-3 p-2 rounded ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}
                                        key={transaction.id}
                                    >
                                        <h5>{transaction.description}</h5>
                                        <p><strong>Amount:</strong> ${transaction.amount}</p>
                                        <p><strong>Category:</strong> {transaction.category}</p>
                                        <p><strong>Date:</strong> {transaction.date ? new Date(transaction.date).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionFormWithList;
