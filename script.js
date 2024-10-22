const categories = [
  { name: "Food", limit: 500 },
  { name: "Transport", limit: 300 },
  { name: "Entertainment", limit: 400 },
  { name: "Utilities", limit: 600 },
];

const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
const budgets = JSON.parse(localStorage.getItem("budgets")) || [...categories];

function saveToLocalStorage() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
  localStorage.setItem("budgets", JSON.stringify(budgets));
}

function populateDropdowns() {
  const expenseCategory = document.getElementById("expense-category");
  const budgetCategory = document.getElementById("budget-category");

  expenseCategory.innerHTML = "";
  budgetCategory.innerHTML = "";

  budgets.forEach((budget) => {
    const option = `<option value="${budget.name}">${budget.name}</option>`;
    expenseCategory.innerHTML += option;
    budgetCategory.innerHTML += option;
  });
}

function showSection(sectionId) {
  document
    .querySelectorAll(".section")
    .forEach((section) => section.classList.remove("active"));
  document.getElementById(sectionId).classList.add("active");
}

function showAddForm() {
  document.getElementById("add-expense-form").style.display = "block";
}

function hideAddForm() {
  document.getElementById("add-expense-form").style.display = "none";
}

function addExpense(event) {
  event.preventDefault();
  const title = document.getElementById("expense-title").value;
  const category = document.getElementById("expense-category").value;
  const cost = parseFloat(document.getElementById("expense-cost").value);
  const date = new Date().toISOString(); // Store the current date

  const budget = budgets.find((b) => b.name === category);
  const totalExpense = expenses
    .filter((e) => e.category === category)
    .reduce((acc, curr) => acc + curr.cost, 0);

  if (totalExpense + cost > budget.limit) {
    alert(`Exceeds budget limit for ${category}!`);
    return;
  }

  expenses.push({ title, category, cost, date });
  saveToLocalStorage();
  hideAddForm();
  renderDashboard();
  renderExpenses();
  renderBudget();
}

function renderDashboard() {
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.cost, 0);

  const totalAvailableBudget = budgets.reduce((acc, budget) => {
    const totalExpenseForCategory = expenses
      .filter((e) => e.category === budget.name)
      .reduce((sum, e) => sum + e.cost, 0);
    return acc + Math.max(budget.limit - totalExpenseForCategory, 0);
  }, 0);

  document.getElementById("total-spent").textContent = totalSpent;
  document.getElementById("total-budget").textContent = totalAvailableBudget;

  const lastExpensesContainer = document.getElementById(
    "last-expenses-container"
  );
  lastExpensesContainer.innerHTML = "";

  const lastExpenses = expenses.slice(-3).reverse();
  lastExpenses.forEach((expense) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h4>${expense.title}</h4>
                        <p>Category: ${expense.category}</p>
                        <p>Cost: $${expense.cost}</p>`;
    lastExpensesContainer.appendChild(card);
  });
}

function renderExpenses() {
  const expenseContainer = document.getElementById("expense-cards-container");
  expenseContainer.innerHTML = "";

  expenses.forEach((expense) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h4>${expense.title}</h4>
                        <p>Category: ${expense.category}</p>
                        <p>Cost: $${expense.cost}</p>
                        <p>Date: ${new Date(
                          expense.date
                        ).toLocaleString()}</p>`;
    expenseContainer.appendChild(card);
  });
}

function updateBudget(event) {
  event.preventDefault();
  const category = document.getElementById("budget-category").value;
  const newLimit = parseFloat(document.getElementById("budget-limit").value);

  const budget = budgets.find((b) => b.name === category);
  budget.limit = newLimit;
  saveToLocalStorage();
  renderBudget();
}

function sortExpenses() {
  const criteria = document.getElementById("sort-criteria").value;

  expenses.sort((a, b) => {
    if (criteria === "title") {
      return a.title.localeCompare(b.title);
    } else if (criteria === "cost") {
      return a.cost - b.cost;
    } else if (criteria === "date") {
      return new Date(a.date) - new Date(b.date);
    }
  });

  renderExpenses();
}

function renderBudget() {
  const budgetList = document.getElementById("budget-list");
  budgetList.innerHTML = "";

  budgets.forEach((budget) => {
    const totalExpense = expenses
      .filter((e) => e.category === budget.name)
      .reduce((acc, curr) => acc + curr.cost, 0);
    const remaining = budget.limit - totalExpense;

    const card = document.createElement("div");
    card.className = "budget-card";
    card.innerHTML = `
      <h4>${budget.name}</h4>
      <p>Remaining: <strong>$${remaining}</strong></p>
      <p>Limit: <strong>$${budget.limit}</strong></p>
    `;
    budgetList.appendChild(card);
  });
}

function showAddForm() {
  document.getElementById("add-expense-form").style.display = "block";
  document.getElementById("add-expense-backdrop").style.display = "block";
}

function hideAddForm() {
  document.getElementById("add-expense-form").style.display = "none";
  document.getElementById("add-expense-backdrop").style.display = "none";
}

function showAddCategoryForm() {
  document.getElementById("add-category-form").style.display = "block";
  document.getElementById("add-category-backdrop").style.display = "block";
}

function hideAddCategoryForm() {
  document.getElementById("add-category-form").style.display = "none";
  document.getElementById("add-category-backdrop").style.display = "none";
}

function addCategory(event) {
  event.preventDefault();
  const categoryName = document.getElementById("new-category-name").value;
  const categoryLimit = parseFloat(
    document.getElementById("new-category-limit").value
  );

  if (budgets.find((b) => b.name === categoryName)) {
    alert("Category already exists!");
    return;
  }

  budgets.push({ name: categoryName, limit: categoryLimit });
  saveToLocalStorage();
  populateDropdowns();
  renderBudget();
  hideAddCategoryForm();
}

function searchExpenses() {
  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase();
  const filteredExpenses = expenses.filter((expense) =>
    expense.title.toLowerCase().includes(searchTerm)
  );

  renderExpenses(filteredExpenses);
}

function renderExpenses(filteredExpenses = expenses) {
  const expenseContainer = document.getElementById("expense-cards-container");
  expenseContainer.innerHTML = "";

  filteredExpenses.forEach((expense) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h4>${expense.title}</h4>
                        <p>Category: ${expense.category}</p>
                        <p>Cost: $${expense.cost}</p>
                        <p>Date: ${new Date(expense.date).toLocaleString()}</p>
                        <button onclick="editExpense('${
                          expense.title
                        }')">Edit</button>
                        <button onclick="deleteExpense('${
                          expense.title
                        }')">Delete</button>`;
    expenseContainer.appendChild(card);
  });
}

function editExpense(title) {
  const expenseToEdit = expenses.find((expense) => expense.title === title);
  if (expenseToEdit) {
    document.getElementById("expense-title").value = expenseToEdit.title;
    document.getElementById("expense-category").value = expenseToEdit.category;
    document.getElementById("expense-cost").value = expenseToEdit.cost;
    showAddForm();

    // Update the form to save changes instead of creating a new expense
    document.getElementById("add-expense-form").onsubmit = (event) => {
      updateExpense(event, expenseToEdit);
    };
  }
}

function updateExpense(event, expenseToEdit) {
  event.preventDefault();
  const title = document.getElementById("expense-title").value;
  const category = document.getElementById("expense-category").value;
  const cost = parseFloat(document.getElementById("expense-cost").value);

  const index = expenses.findIndex(
    (expense) => expense.title === expenseToEdit.title
  );
  if (index !== -1) {
    expenses[index] = { title, category, cost, date: expenseToEdit.date }; // Update the existing expense
    saveToLocalStorage();
    hideAddForm();
    renderDashboard();
    renderExpenses();
    renderBudget();
  }
}

function deleteExpense(title) {
  const index = expenses.findIndex((expense) => expense.title === title);
  if (index !== -1) {
    expenses.splice(index, 1);
    saveToLocalStorage();
    renderDashboard();
    renderExpenses();
    renderBudget();
  }
}

populateDropdowns();
renderDashboard();
renderExpenses();
renderBudget();
