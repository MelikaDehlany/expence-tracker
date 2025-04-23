import React, { createContext, useState, useEffect, useContext } from 'react';

const defaultVsalues = {
  transactions: [],
  categories: [],
  addTransaction: () => {},
  deleteTransaction: () => {},
  updateTransaction: () => {},
  setEditTransaction: () => {},
  addCategory: () => {},
  editTransaction: null,
  clearTransactions: () => {},
};
const TransactionContext = createContext(defaultVsalues);
export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState(['food', 'transportation', 'bills', 'fun']);
  const [editTransaction, setEditTransaction] = useState(null);

  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (transactions.length > 0) {
        localStorage.setItem('transactions', JSON.stringify(transactions));
      } else {
        localStorage.removeItem('transactions');
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [transactions]);

  const addTransaction = (transaction) => {
    try {
      setTransactions((prev) => [...prev, transaction]);
    } catch (error) {
      console.error('error adding transaction:', error);
    }
  };

  const deleteTransaction = (id) => {
    try {
      setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
    } catch (error) {
      console.error('error deleting transaction :', error);
    }
  };

  const updateTransaction = (updatedTransaction) => {
    try {
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === updatedTransaction.id ? updatedTransaction : transaction
        )
      );
      setEditTransaction(null);
    } catch (error) {
      console.error(' error updating transaction :', error);
    }
  };

  const addCategory = (newCategory) => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories((prev) => [...prev, newCategory]);
    } else {
      console.warn('category already added.');
    }
  };

  const clearTransactions = () => {
    setTransactions([]);
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        categories,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        setEditTransaction,
        addCategory,
        editTransaction,
        clearTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  return useContext(TransactionContext);
};