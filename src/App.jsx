import './App.css';
import React from 'react';
import TransactionForm from './components/TransactionForm';
import AddCategoryForm from './components/AddCategoryForm';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, Tooltip as PieTooltip, ResponsiveContainer as PieResponsiveContainer } from 'recharts';
import { useTransactions } from './context/TransactionContext';

function App() {
  const {
    transactions,
    categories,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    setEditTransaction,
    addCategory,
  } = useTransactions();

  console.log('transactions:', transactions);
  console.log('categories:', categories);

  const incomeData = transactions.filter((transaction) => transaction.type === 'income');
  const expenseData = transactions.filter((transaction) => transaction.type === 'expense');

  const chartData = transactions.map((transaction) => ({
    date: transaction.date,
    income: incomeData.filter((t) => t.date === transaction.date).reduce((acc, t) => acc + t.amount, 0),
    expense: expenseData.filter((t) => t.date === transaction.date).reduce((acc, t) => acc + t.amount, 0),
  }));
  console.log('line chart data:', chartData);

  const categoryData = categories.map((category) => {
    const incomeByCategory = transactions
      .filter((t) => t.type === 'income' && t.category === category)
      .reduce((acc, t) => acc + t.amount, 0);
    const expenseByCategory = transactions
      .filter((t) => t.type === 'expense' && t.category === category)
      .reduce((acc, t) => acc + Math.abs(t.amount), 0);

    const total = incomeByCategory + expenseByCategory;
    const incomePercent = total === 0 ? 0 : (incomeByCategory / total) * 100;
    const expensePercent = total === 0 ? 0 : (expenseByCategory / total) * 100;

    return {
      category,
      incomePercent,
      expensePercent,
    };
  });
  console.log('pie chart data:', categoryData);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB'];

  return (
    <div>
      <h1>input & expence management</h1>

      <TransactionForm
        addTransaction={addTransaction}
        editTransaction={setEditTransaction}
        categories={categories}
        updateTransaction={updateTransaction}
      />

      <div>
        <h2>add new category </h2>
        <AddCategoryForm addCategory={addCategory} />
      </div>

      <h2>transactions:</h2>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            {transaction.title} - {transaction.amount} $ - {transaction.category} - {transaction.date} -{' '}
            <strong>{transaction.type === 'income' ? 'income' : 'expence'}</strong>
            <button onClick={() => setEditTransaction(transaction)}>edit</button>
            <button onClick={() => deleteTransaction(transaction.id)}>delete</button>
          </li>
        ))}
      </ul>

        <h2>income & expence chart</h2>      
        <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#82ca9d" />
          <Line type="monotone" dataKey="expense" stroke="#ff7300" />
        </LineChart>
      </ResponsiveContainer>

      <h2> pie chart </h2>
      <PieResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={categoryData}
            dataKey="incomePercent"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#82ca9d"
            label
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-income-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Pie
            data={categoryData}
            dataKey="expensePercent"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#ff7300"
            label
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-expense-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <PieTooltip />
        </PieChart>
      </PieResponsiveContainer>
    </div>
  );
}

export default App;