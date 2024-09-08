// script.js

// Selectors
const form = document.getElementById('todo-form');
const todoList = document.getElementById('todo-list');
const errorMsg = document.getElementById('error-msg');
const todoIdInput = document.getElementById('todo-id');  // Hidden field for storing ID during edit

// Event listener for form submission
form.addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent form from submitting

    const title = document.getElementById('todo-title').value;
    const description = document.getElementById('todo-description').value;
    const todoId = todoIdInput.value;

    // Form validation with Regex (only letters and numbers for title)
    const titleRegex = /^[A-Za-z0-9 ]{3,50}$/;  // At least 3 characters, alphanumeric
    const descriptionRegex = /^.{10,200}$/;  // At least 10 characters for description

    if (!titleRegex.test(title)) {
        errorMsg.textContent = 'Title must be 3-50 characters long and alphanumeric.';
        return;
    }

    if (!descriptionRegex.test(description)) {
        errorMsg.textContent = 'Description must be 10-200 characters long.';
        return;
    }

    // Clear error message
    errorMsg.textContent = '';

    if (todoId) {
        // Edit the existing ToDo
        editTodo(todoId, title, description);
    } else {
        // Create new ToDo
        addNewTodo(title, description);
    }

    // Clear form inputs and hidden todoId field
    form.reset();
    todoIdInput.value = '';
});

// Function to add a new ToDo
function addNewTodo(title, description) {
    // Create ToDo object
    const todo = {
        title: title,
        description: description,
        id: Date.now()  // Unique ID based on timestamp
    };

    // Store ToDo in localStorage as JSON
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));

    // Render ToDo
    renderTodo(todo);
}

// Function to edit an existing ToDo
function editTodo(id, updatedTitle, updatedDescription) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    // Find the todo with the matching id and update it
    todos = todos.map(todo => {
        if (todo.id == id) {
            return {
                ...todo,
                title: updatedTitle,
                description: updatedDescription
            };
        }
        return todo;
    });

    // Save updated todos back to localStorage
    localStorage.setItem('todos', JSON.stringify(todos));

    // Re-render the todo list to reflect the changes
    displayTodos();
}

// Function to render a ToDo as a card
function renderTodo(todo) {
    const todoCard = document.createElement('div');
    todoCard.classList.add('todo-card');

    todoCard.innerHTML = `
        <h2>${todo.title}</h2>
        <p>${todo.description}</p>
        <button onclick="editTodoForm(${todo.id})">Edit</button>
        <button onclick="deleteTodo(${todo.id})">Delete</button>
    `;

    todoList.appendChild(todoCard);
}

// Function to pre-fill the form with ToDo data for editing
function editTodoForm(id) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    // Find the todo with the matching id
    const todo = todos.find(todo => todo.id == id);

    if (todo) {
        // Set the form fields with the existing data
        document.getElementById('todo-title').value = todo.title;
        document.getElementById('todo-description').value = todo.description;
        todoIdInput.value = todo.id;  // Set the hidden field with the todo id
    }
}

// Function to delete ToDo
function deleteTodo(id) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos = todos.filter(todo => todo.id !== id);
    localStorage.setItem('todos', JSON.stringify(todos));
    displayTodos();
}

// Function to display all todos from localStorage
function displayTodos() {
    todoList.innerHTML = '';  // Clear existing todos
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => renderTodo(todo));
}

// Display todos on page load
window.onload = displayTodos;
