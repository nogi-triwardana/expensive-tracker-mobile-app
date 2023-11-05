import { createContext, useReducer } from "react";

export const ExpensesContext = createContext({
  expenses: [],
  addExpense: ({description, amount, date}) => {},
  setExpense: (expense) => {},
  deleteExpense: (id) => {},
  updateExpense: (id, {description, amount, date}) => {}
});

function expensesReducer(state, action) {
  switch(action.type) {
    case 'ADD':
      return [action.payload, ...state];
    case 'SET':
      const inverted = action.payload.reverse();
      return inverted;
    case 'UPDATE':
      const updatableIdIndex = state.findIndex(
        (expense) => expense.id === action.payload.id
      );
      const updtableExpense = state[updatableIdIndex];
      const updatedItem = { ...updtableExpense, ...action.payload.data };
      const updatedExpenses = [...state];
      updatedExpenses[updatableIdIndex] = updatedItem;
      return updatedExpenses;
    case 'DELETE':
      return state.filter((expense) => expense.id !== action.payload)
    default: 
      return state;
  }
}

function ExpenseContextProvider({ children }) {
  const [expensesState, dispatch] = useReducer(expensesReducer, []);

  function addExpense(expenseData) {
    dispatch({ type: 'ADD', payload: expenseData });
  }

  function deleteExpense(id) {
    dispatch({ type: 'DELETE', payload: id })
  }

  function updateExpense(id, expenseData) {
    dispatch({ type: 'UPDATE', payload: { id: id, data: expenseData} })
  }

  function setExpense(expenses) {
    dispatch({ type: 'SET', payload: expenses });
  }

  const value = {
    expenses: expensesState,
    setExpense: setExpense,
    addExpense: addExpense,
    updateExpense: updateExpense,
    deleteExpense: deleteExpense
  };

  return (
    <ExpensesContext.Provider 
      value={value}
    >
      {children}
    </ExpensesContext.Provider>
  );
}

export default ExpenseContextProvider;