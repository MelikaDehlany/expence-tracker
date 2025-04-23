import React, { useState } from 'react';

const AddCategoryForm = ({ addCategory }) => {
  const [newCategory, setNewCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addCategory(newCategory.trim());
    setNewCategory('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="add new category"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        
      />
      <button type="submit">add</button>
    </form>
  );
};

export default AddCategoryForm;
