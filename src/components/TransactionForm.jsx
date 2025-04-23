import React, { useState, useEffect } from 'react';
import { useTransactions } from '../context/TransactionContext';

function TransactionForm() {
  const { addTransaction, editTransaction, updateTransaction, categories } = useTransactions();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0] || 'food');
  const [type, setType] = useState('income');

  useEffect(() => {
    if (editTransaction) {
      setTitle(editTransaction.title || '');
      setAmount(editTransaction.amount || '');
      setCategory(editTransaction.category || (categories.length > 0 ? categories[0] : 'food'));
      setType(editTransaction.type || 'income');
    }
  }, [editTransaction, categories]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !amount || isNaN(Number(amount))) {
      alert('please fill in all fields correctly!');
      return;
    }

    const newTransaction = {
      id: editTransaction ? editTransaction.id : Date.now(),
      title: title.trim(),
      amount: type === 'expense' ? -Math.abs(Number(amount)) : Math.abs(Number(amount)),
      category,
      date: new Date().toISOString().slice(0, 16),
      type,
    };

    try {
      if (editTransaction) {
        updateTransaction(newTransaction);
        alert('transaction updated successfully!');
      } else {
        addTransaction(newTransaction);
        alert('transaction added successfully!');
      }

      setTitle('');
      setAmount('');
      setCategory(categories[0] || 'food');
      setType('income');
    } catch (error) {
      console.error('error saving transaction', error);
      alert('error, please try again!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          <input
            type="radio"
            name="type"
            value="income"
            checked={type === 'income'}
            onChange={(e) => setType(e.target.value)}
          />
        </label>
        <label>
          <input
            type="radio"
            name="type"
            value="expense"
            checked={type === 'expense'}
            onChange={(e) => setType(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="title"
        />
      </div>

      <div>
        <label>amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="amount"
        />
      </div>

      <div>
        <label>category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          {categories && categories.length > 0 ? (
            categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))
          ) : (
            <option value="">category not </option>
          )}
        </select>
      </div>

      <button type="submit">{editTransaction ? 'edit ' : 'add'}</button>
    </form>
  );
}

export default TransactionForm;