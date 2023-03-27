//Select DOM
const todoInput = document.querySelector(".todo-input");
const timeInput = document.querySelector("#time-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const sortOption = document.querySelector(".sort-todo");
const completedList = document.querySelector(".completed-list");

//Event Listeners
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addTodo);
completedList.addEventListener("click", deleteTodo);
todoList.addEventListener("click", deleteTodo);
sortOption.addEventListener("click", sortTodo);

//Functions

function addTodo(e) {
  //Prevent natural behaviour
  e.preventDefault();

  //Create todo div
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  //Create list
  const newTodo = document.createElement("li");
  newTodo.innerText = todoInput.value;
  if (todoInput.value === "") {
    alert("Please enter a todo item.");
    return;
  } else if (todoInput.value.length > 160) {
    alert("Todo item cannot exceed 160 characters.");
    return;
  }
  const newDeadline = document.createElement("p");
  newDeadline.innerText = timeInput.value;

  //Save to session storage
  saveLocalTodos(todoInput.value, timeInput.value);

  // Calculate time remaining for the todo item
  const deadlineTime = new Date(timeInput.value).getTime();
  const currentTime = new Date().getTime();
  const timeRemaining = deadlineTime - currentTime;
  const secondsRemaining = Math.floor((timeRemaining % (1000 * 60)) / 1000);
  const minutesRemaining = Math.floor(
    (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
  );
  const hoursRemaining = Math.floor(
    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));

  // Format the time remaining string
  let timeRemainingStr = "";
  if (daysRemaining > 0) {
    timeRemainingStr += `${daysRemaining}d `;
  }
  if (hoursRemaining > 0) {
    timeRemainingStr += `${hoursRemaining}h `;
  }
  if (minutesRemaining > 0) {
    timeRemainingStr += `${minutesRemaining}m `;
  }
  if (timeRemaining <= 0) {
    timeRemainingStr = "Past deadline";
    newDeadline.classList.add("past-deadline");
  }

  // Display the time remaining in the HTML
  const timeRemainingEl = document.createElement("p");
  timeRemainingEl.innerText = timeRemainingStr;

  //Append new elements to todoDiv

  todoDiv.appendChild(newTodo);
  todoDiv.appendChild(timeRemainingEl);
  newTodo.classList.add("todo-item");

  //Clear input fields
  todoInput.value = "";
  timeInput.value = "";

  //Create Completed Button
  const completedButton = document.createElement("button");
  completedButton.innerHTML = `<i class="fas fa-check"></i>`;
  completedButton.classList.add("complete-btn");
  todoDiv.appendChild(completedButton);
  //Create trash button
  const trashButton = document.createElement("button");
  trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
  trashButton.classList.add("trash-btn");
  todoDiv.appendChild(trashButton);
  //attach final Todo
  todoList.appendChild(todoDiv);
  /*  location.reload(); */
}

function deleteTodo(e) {
  const item = e.target;

  if (item.classList[0] === "trash-btn") {
    // e.target.parentElement.remove();
    const todo = item.parentElement;
    todo.classList.add("fall");
    //at the end
    removeLocalTodos(todo);
    todo.addEventListener("transitionend", (e) => {
      todo.remove();
    });
  }
  if (item.classList[0] === "complete-btn") {
    const todo = item.parentElement;
    todo.classList.toggle("completed");
    completedList.appendChild(todo);

    console.log(todo);
  }
}

//sorting

function sortTodo() {
  const todos = Array.from(todoList.children); // create an array from todoList's children nodes
  switch (sortOption.value) {
    case "Recently added":
      // Sort by order of addition
      todos.sort((a, b) => {
        return a.dataset.id - b.dataset.id;
      });
      break;
    case "Deadline":
      // Sort by time remaining
      function sortTodo() {
        const todos = Array.from(todoList.children);
        todos.sort((a, b) => {
          const aTime = new Date(a.querySelector("p").textContent).getTime();
          const bTime = new Date(b.querySelector("p").textContent).getTime();
          return aTime - bTime;
        });
        todos.forEach((todo) => {
          todoList.appendChild(todo);
        });
      }

      break;
    case "uncompleted":
      // Display only uncompleted todos
      todos.filter((todo) => !todo.classList.contains("completed"));
      break;
  }
  // Remove existing todos from the DOM
  while (todoList.firstChild) {
    todoList.removeChild(todoList.firstChild);
  }
  // Append sorted todos to the DOM
  todos.forEach((todo) => {
    todoList.appendChild(todo);
  });
}

function saveLocalTodos(todo, deadline) {
  let todos;
  if (sessionStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(sessionStorage.getItem("todos"));
  }
  todos.push({ todo: todo, deadline: deadline });
  sessionStorage.setItem("todos", JSON.stringify(todos));
}
//todos.push(todo);
//sessionStorage.setItem("todos", JSON.stringify(todos));

function removeLocalTodos(todo) {
  let todos;
  if (sessionStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(sessionStorage.getItem("todos"));
  }
  const todoIndex = todo.children[0].innerText;
  todos.splice(todos.indexOf(todoIndex), 1);
  sessionStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
  let todos;
  if (sessionStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(sessionStorage.getItem("todos"));
  }
  todos.forEach(function (todo) {
    //Create todo div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    //Create list
    const newTodo = document.createElement("li");
    newTodo.innerText = todo.todo;
    const newDeadline = document.createElement("p");
    newDeadline.innerText = todo.deadline;

    // Calculate time remaining for the todo item
    const deadlineTime = new Date(todo.deadline).getTime();
    const currentTime = new Date().getTime();
    const timeRemaining = deadlineTime - currentTime;
    const secondsRemaining = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    const minutesRemaining = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );
    const hoursRemaining = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));

    // Format the time remaining string
    let timeRemainingStr = "";
    if (daysRemaining > 0) {
      timeRemainingStr += `${daysRemaining}d `;
    }
    if (hoursRemaining > 0) {
      timeRemainingStr += `${hoursRemaining}h `;
    }
    if (minutesRemaining > 0) {
      timeRemainingStr += `${minutesRemaining}m `;
    }
    if (timeRemaining <= 0) {
      timeRemainingStr = "Past deadline";
      newDeadline.classList.add("past-deadline");
    }

    // Display the time remaining in the HTML
    const timeRemainingEl = document.createElement("p");
    timeRemainingEl.innerText = timeRemainingStr;

    //Append new elements to todoDiv
    todoDiv.appendChild(newTodo);
    todoDiv.appendChild(timeRemainingEl);
    newTodo.classList.add("todo-item");

    //Create Completed Button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = `<i class="fas fa-check"></i>`;
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);
    //Create trash button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    //Append todoDiv to list
    todoList.appendChild(todoDiv);
  });
}
