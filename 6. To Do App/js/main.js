
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");


let tasks = [];


if(localStorage.getItem("tasks")){

    tasks = JSON.parse(localStorage.getItem("tasks"));
}

tasks.forEach(function (task){

    renderTask(task);
    
});

checkEmptyList();

form.addEventListener("submit", addTask);

taskList.addEventListener("click", deleteTask);

taskList.addEventListener("click", doneTask);

function addTask(event) {

  event.preventDefault();
  const taskText = taskInput.value;

  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false
  }

  tasks.push(newTask);
  saveToLocalStorage();

  renderTask(newTask);

  taskInput.value = "";
  taskInput.focus();

 
  checkEmptyList();

  
}

function deleteTask(event) {
  if (event.target.dataset.action !== "delete") {
    return;
  }

  const parentNode = event.target.closest(".list-group-item");

  const id = Number(parentNode.id);

  tasks = tasks.filter((task) => task.id !==id);

  saveToLocalStorage();

  parentNode.remove();

  checkEmptyList();


}

function doneTask(event) {
  
    if (event.target.dataset.action !== "done") {
        return;
      }
    const parentNode = event.target.closest(".list-group-item");


    const id = Number(parentNode.id);

   const task = tasks.find((task) => task.id === id);

   task.done = !task.done;

   saveToLocalStorage();


    const taskTitle = parentNode.querySelector(".task-title");
    taskTitle.classList.toggle("task-title--done");
  
}


function checkEmptyList(){
    if(tasks.length === 0){

        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
        <div class="empty-list__title">Lista de tareas esta vacia</div>
    </li>`;

    taskList.insertAdjacentHTML("afterbegin",emptyListHTML);
    }

    if(tasks.length > 0){

        const emptyList1 = document.querySelector("#emptyList");
        emptyList1 ? emptyList1.remove() : null;

    }
}

function saveToLocalStorage(){

    localStorage.setItem("tasks",JSON.stringify(tasks));
}

function renderTask(task){

    const cssClass = task.done ? "task-title task-title--done" : "task-title";

    const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
          <span class="${cssClass}">${task.text}</span>
          <div class="task-item__buttons">
              <button type="button" data-action="done" class="btn-action">
                  <img src="./img/tick.svg" alt="Done" width="18" height="18">
              </button>
              <button type="button" data-action="delete" class="btn-action">
                  <img src="./img/cross.svg" alt="Done" width="18" height="18">
              </button>
          </div>
      </li>`;
  
    taskList.insertAdjacentHTML("beforeend", taskHTML);
}