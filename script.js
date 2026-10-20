const Taskform = document.getElementById("Taskform");
const Taskinput = document.getElementById("Taskinput");
const Tasklist = document.getElementById("Tasklist");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
let currentFilter = "all";
Taskform.addEventListener("submit", function(event) {
    event.preventDefault();

    const taskName = Taskinput.value.trim();

    if (taskName === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        id: Date.now(),
        title: taskName,
        completed: false,
        createdAt: new Date().toLocaleDateString()
    });

    Taskinput.value = "";
    saveTasks();
    displayTasks();
});

function displayTasks() {
    Tasklist.innerHTML = "";

    const filteredTasks = tasks.filter(function(task) {
    if (currentFilter === "completed") {
        return task.completed === true;
    }

    if (currentFilter === "pending") {
        return task.completed === false;
    }

    return true;
});

filteredTasks.forEach(function(task) {
        const li = document.createElement("li");
        li.className = "task";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        const title = document.createElement("span");
        title.className = "task-title";
        title.textContent = task.title;
        const date = document.createElement("small");
        date.textContent = "Created: " + (task.createdAt || "Date unavailable");

        if (task.completed) {
            title.style.textDecoration = "line-through";
        }

        checkbox.addEventListener("change", function() {
            task.completed = checkbox.checked;
            saveTasks();
            displayTasks();
        });

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";

        editBtn.addEventListener("click", function() {
            const newTitle = prompt("Edit task:", task.title);

            if (newTitle !== null && newTitle.trim() !== "") {
                task.title = newTitle.trim();
                saveTasks();
                displayTasks();
            }
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", function() {
            if (confirm("Delete this task?")) {
                tasks = tasks.filter(function(item) {
                    return item.id !== task.id;
                });
                saveTasks();
                displayTasks();
            }
        });

        li.append(checkbox, title, date, editBtn, deleteBtn);
        Tasklist.appendChild(li);
    });
    document.getElementById("total").textContent =
        tasks.length;

    document.getElementById("completed").textContent =
        tasks.filter(function(task) {
            return task.completed === true;
        }).length;

    document.getElementById("remaining").textContent =
        tasks.filter(function(task) {
            return task.completed === false;
        }).length;
}

document.querySelectorAll("[data-filter]").forEach(function(button) {
    button.addEventListener("click", function() {
        currentFilter = button.dataset.filter;
        displayTasks();
    });
});
const clearCompletedBtn = document.getElementById("clearCompleted");

clearCompletedBtn.addEventListener("click", function() {
    tasks = tasks.filter(function(task) {
        return task.completed === false;
    });

    saveTasks();
    displayTasks();
});
displayTasks();