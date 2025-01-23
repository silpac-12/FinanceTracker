import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

const MonthlySpendingGraph = ({ transactions, darkMode }) => {
    const getDailySpendingForMonth = () => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        const dailySpending = Array(daysInMonth).fill(0);

        transactions.forEach((transaction) => {
            if (!transaction.date) return;

            const transactionDate = new Date(transaction.date);
            const transactionMonth = transactionDate.getMonth();
            const transactionYear = transactionDate.getFullYear();

            if (transactionMonth === currentMonth && transactionYear === currentYear) {
                const day = transactionDate.getDate();
                dailySpending[day - 1] += parseFloat(transaction.amount || 0);
            }
        });

        return dailySpending;
    };

    const getLineGraphData = () => {
        const dailySpending = getDailySpendingForMonth();

        const labels = Array.from(
            { length: dailySpending.length },
            (_, i) => `Day ${i + 1}`
        );

        return {
            labels,
            datasets: [
                {
                    label: 'Daily Spending',
                    data: dailySpending,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                },
            ],
        };
    };

    const lineOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: darkMode ? '#ffffff' : '#000000',
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: darkMode ? '#ffffff' : '#000000',
                },
            },
            y: {
                ticks: {
                    color: darkMode ? '#ffffff' : '#000000',
                },
            },
        },
    };

    return (
        <div className={`line-graph-container ${darkMode ? 'bg-dark' : 'bg-light'} p-4 rounded`}>
            <h2 className={`text-center ${darkMode ? 'text-light' : 'text-dark'}`}>
                Monthly Spending Overview
            </h2>
            <Line data={getLineGraphData()} options={lineOptions} />
        </div>
    );
};

export default MonthlySpendingGraph;
