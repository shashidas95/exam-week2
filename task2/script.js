document.addEventListener('DOMContentLoaded', () => {
 const todoList = document.getElementById('todoList');
 const addBtn = document.getElementById('addTodoBtn');
 const todoInput = document.getElementById('newTodoInput');
 const messageArea = document.querySelector('.message-area');
 const filterButtons = document.querySelectorAll('.filter-btn');
 const clearCompletedBtn = document.getElementById('clearCompletedBtn');

 // load from local storage
 let todos = JSON.parse(localStorage.getItem('todos')) || [];

 // for maintain unique id 
 let nextTodoId = todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) + 1 : 1;

 //filter type set up
 let currentFilter = 'all';
 
 //create a task Dom Element
 function createTodoItemElement(todo) {
  const listItem = document.createElement('li');
  listItem.classList.add('d-flex', 'justify-content-between', 'align-items-center')
  listItem.dataset.id = todo.id;
  if (todo.completed) {
   listItem.classList.add('completed');
  }
  listItem.innerHTML = `
     <label class="checkbox-container">
       <input type="checkbox" ${todo.completed ? 'checked' : ''} class="todo-checkbox hidden-checkbox">
       <span class="custom-checkbox"></span>
     </label>
    <span class="todo-text ${todo.completed ? 'text-decoration-line-through text-muted' : ''}">${todo.text}</span>
     <button class="delete-btn" aria-label="Delete task"><i class="fas fa-trash"></i></button>
   `;
  return listItem;
 }
 //show temporary message
 function showMessage(message, type) {
  messageArea.textContent = message;
  messageArea.className = `message-area show ${type}`;
  messageArea.setAttribute('aria-live', 'assertive');

  setTimeout(() => {
   messageArea.textContent = '';
   messageArea.classList.remove('show');
   messageArea.removeAttribute('aria-live');
  }, 3000);
 }
 //render tasks 
 function renderTodos() {
  todoList.innerHTML = '';

  const fragment = document.createDocumentFragment();
  todos
   .filter(todo => {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
   })
   .forEach(todo => {
    fragment.appendChild(createTodoItemElement(todo));
   });
  todoList.appendChild(fragment);

  const totalCount = todos.length;
  document.getElementById('totalTasks').textContent = `Total: ${totalCount} task${totalCount !== 1 ? 's' : ''}`;

  const activeCount = todos.filter(todo => !todo.completed).length;
  document.getElementById('itemsLeft').textContent = `${activeCount} task${activeCount !== 1 ? 's' : ''} left`;
 }
 //add new tasks
 function addTodo() {
  const todoText = todoInput.value.trim();
  if (todoText === '') {
   showMessage("Task description cannot be empty", 'error');
   return;
  }
  const newTodo = {
   id: nextTodoId++,
   text: todoText,
   completed: false
  };
  todos.push(newTodo);
  localStorage.setItem('todos', JSON.stringify(todos));
  todoInput.value = '';
  renderTodos();
  showMessage("Task added successfully", 'success');
 }
 //mark as completed/incomplete
 function toggleTodoComplete(id) {
  const todoIndex = todos.findIndex(todo => todo.id === id);
  if (todoIndex > -1) {
   todos[todoIndex].completed = !todos[todoIndex].completed;
   localStorage.setItem('todos', JSON.stringify(todos));
   renderTodos();
   showMessage(`Task is marked as ${todos[todoIndex].completed ? 'completed' : 'active'}!`);
  }
 }
 //clear completed tasks
 function clearCompletedTodos() {
  const initialLength = todos.length;
  todos = todos.filter(todo => !todo.completed);

  if (todos.length < initialLength) {
   localStorage.setItem('todos', JSON.stringify(todos));
   renderTodos();
   showMessage("Completed tasks cleared!", 'success');
  } else {
   showMessage("No completed tasks to clear.", 'info');
  }
 }
 //delete tasks
 function deleteTodo(id) {
  const initialLength = todos.length;
  todos = todos.filter(todo => todo.id !== id);
  if (todos.length < initialLength) {
   localStorage.setItem('todos', JSON.stringify(todos));
   renderTodos();
   showMessage("Task deleted successfully!", 'success');
  } else {
   showMessage("Error: Task not found for deletion", 'error');
  }
 }
 //button event listener
 addBtn.addEventListener('click', addTodo);
 //input event listener
 todoInput.addEventListener('keypress', (e) => {
  if (e.key === "Enter") {
   e.preventDefault(); // prevent form submission if inside a form
   addTodo();
  }
 });
 //task list handling( toggle/ delete)
 todoList.addEventListener('click', (event) => {
  const clickedElement = event.target;
  const todoItem = clickedElement.closest('li');

  if (todoItem) {
   const todoId = parseInt(todoItem.dataset.id);

   if (
    clickedElement.classList.contains('todo-checkbox') ||
    clickedElement.closest('.custom-checkbox')
   ) {
    toggleTodoComplete(todoId);
   } else if (
    clickedElement.classList.contains('delete-btn') ||
    clickedElement.closest('.delete-btn')
   ) {
    deleteTodo(todoId);
   }
  }
 });
 clearCompletedBtn.addEventListener('click', clearCompletedTodos);

 //filter buttons logic
 filterButtons.forEach(button => {
  button.addEventListener('click', () => {
   currentFilter = button.dataset.filter;
   filterButtons.forEach(btn => btn.classList.remove('active'));
   button.classList.add('active');
   renderTodos();
  });
 });

 renderTodos();


});
