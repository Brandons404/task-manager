const local = localStorage;

export function addTask(task) {
  if (local.getItem("taskList")) {
    const tasks = JSON.parse(local.getItem("taskList"));
    tasks.push({ ...task, ind: tasks.length });
    local.setItem("taskList", JSON.stringify(tasks));
  } else {
    local.setItem("taskList", JSON.stringify([{ ...task, ind: 0 }]));
  }
}

export function getTasks() {
  return JSON.parse(local.getItem("taskList")) || [];
}

export function updateTask(task) {
  const allTasks = JSON.parse(local.getItem("taskList"));

  allTasks[task.ind] = task;
  local.setItem("taskList", JSON.stringify(allTasks));
}

export function deleteTask(task) {
  const allTasks = JSON.parse(local.getItem("taskList"));

  allTasks.splice(task.ind, 1);

  // update indexes of all other tasks
  allTasks.forEach((t, i) => {
    t.ind = i;
  });

  local.setItem("taskList", JSON.stringify(allTasks));
}
