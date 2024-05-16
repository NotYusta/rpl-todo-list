// bisa pake caching system biar cpu lebih efektif, but meh.

let currentUpdateName = "";
function setData(data) {
  localStorage.setItem("tasks", JSON.stringify(data));
}

function getData() {
  const data = localStorage.getItem("tasks");
  if (!data) {
    const newTasks = {
      cancelled: [],
      onGoing: [],
      completed: [],
    };

    setData(newTasks);
    return newTasks;
  }

  const parsedData = JSON.parse(data);
  return parsedData;
}

function updateTask(name) {}

function cancelTask(name) {
  const data = getData();

  let cancelledData = {};
  const newOnGoData = [];
  for (const ongo of data.onGoing) {
    if (ongo.name == name) {
      cancelledData = ongo;

      const curDate = new Date();
      cancelledData.cancelled_at = `${curDate.getFullYear()}-${
        curDate.getMonth() - 1
      }-${curDate.getDate()}`;
      continue;
    }

    newOnGoData.push(ongo);
  }

  data.cancelled.push(cancelledData);
  data.onGoing = newOnGoData;
  setData(data);

  alert(`Successfully cancelled ${cancelledData.name}`);
}

function completeTask(name) {
  const data = getData();

  let completedData = {};
  const newOnGoData = [];
  for (const ongo of data.onGoing) {
    if (ongo.name == name) {
      completedData = ongo;

      const curDate = new Date();
      completedData.completed_at = `${curDate.getFullYear()}-${curDate.getMonth()}-${curDate.getDate()}`;
      continue;
    }

    newOnGoData.push(ongo);
  }

  data.completed.push(completedData);
  data.onGoing = newOnGoData;
  setData(data);

  alert(`Successfully mark ${completedData.name} as completed`);
}

function createOnGoElement(onGo) {
  const trElement = document.createElement("tr");
  trElement.classList.add("bg-gray", "item");
  const nameTh = document.createElement("th");
  const nameThValue = document.createTextNode(onGo.name);
  nameTh.appendChild(nameThValue);

  const targetTh = document.createElement("th");
  const targetThValue = document.createTextNode(
    new Date(onGo.target).toDateString()
  );
  targetTh.appendChild(targetThValue);

  const actionsTh = document.createElement("th");
  actionsTh.classList.add("actions");

  const compleActTh = document.createElement("button");
  compleActTh.classList.add("complete");

  const completeActThValue = document.createTextNode("Mark As Completed");
  compleActTh.appendChild(completeActThValue);
  compleActTh.onclick = function () {
    completeTask(onGo.name);
    location.reload();
  };

  const updateActTh = document.createElement("button");
  updateActTh.classList.add("update");
  updateActTh.onclick = function () {
    currentUpdateName = onGo.name;
    openModal("update-task");
  };

  const updateActThValue = document.createTextNode("Update");
  updateActTh.appendChild(updateActThValue);

  const cancelActTh = document.createElement("button");
  cancelActTh.classList.add("cancel");
  cancelActTh.onclick = function () {
    cancelTask(onGo.name);
    location.reload();
  };

  const cancelActThValue = document.createTextNode("Cancel");
  cancelActTh.appendChild(cancelActThValue);

  actionsTh.appendChild(compleActTh);
  actionsTh.appendChild(updateActTh);
  actionsTh.appendChild(cancelActTh);
  trElement.appendChild(nameTh);
  trElement.appendChild(targetTh);
  trElement.appendChild(actionsTh);

  return trElement;
}

function createCancelledElement(onGo) {
  const trElement = document.createElement("tr");
  trElement.classList.add("bg-gray", "item");
  const nameTh = document.createElement("th");
  const nameThValue = document.createTextNode(onGo.name);
  nameTh.appendChild(nameThValue);

  const targetTh = document.createElement("th");
  const targetThValue = document.createTextNode(
    new Date(onGo.target).toDateString()
  );
  targetTh.appendChild(targetThValue);

  const cancelledAtTh = document.createElement("th");
  const cancelledAtValue = document.createTextNode(
    new Date(onGo.cancelled_at).toDateString()
  );
  cancelledAtTh.appendChild(cancelledAtValue);

  trElement.appendChild(nameTh);
  trElement.appendChild(targetTh);
  trElement.appendChild(cancelledAtTh);
  return trElement;
}

function createCompletedElement(onGo) {
  const trElement = document.createElement("tr");
  trElement.classList.add("bg-gray", "item");
  const nameTh = document.createElement("th");
  const nameThValue = document.createTextNode(onGo.name);
  nameTh.appendChild(nameThValue);

  const targetTh = document.createElement("th");
  const targetThValue = document.createTextNode(
    new Date(onGo.target).toDateString()
  );
  targetTh.appendChild(targetThValue);

  const completedAtTh = document.createElement("th");
  const completedAtValue = document.createTextNode(
    new Date(onGo.completed_at).toDateString()
  );

  completedAtTh.appendChild(completedAtValue);

  trElement.appendChild(nameTh);
  trElement.appendChild(targetTh);
  trElement.appendChild(completedAtTh);
  return trElement;
}

function loadPage() {
  const data = getData();

  document.getElementById("task_completed").innerHTML = data.completed.length;
  document.getElementById("task_ongoing").innerHTML = data.onGoing.length;
  document.getElementById("task_cancelled").innerHTML = data.cancelled.length;

  const onGoingTasksElement = document.getElementById("on_going_tasks_table");
  const cancelledTasksElement = document.getElementById(
    "cancelled_tasks_table"
  );
  const completedTasksElement = document.getElementById(
    "completed_tasks_table"
  );
  for (const onGo of data.onGoing) {
    onGoingTasksElement.appendChild(createOnGoElement(onGo));
  }

  for (const cancelled of data.cancelled) {
    cancelledTasksElement.appendChild(createCancelledElement(cancelled));
  }

  for (const completed of data.completed) {
    completedTasksElement.appendChild(createCompletedElement(completed));
  }
}

function getNewTaskValue(id) {
  const res = document.getElementById("new-task-" + id);
  if (res) {
    return res.value;
  }

  return "";
}

function getUpdateTaskValue(id) {
  const res = document.getElementById("update-task-" + id);
  if (res) {
    return res.value;
  }

  return "";
}

function updateTask() {
  if (currentUpdateName == "") {
    alert("The data your updating is invalid!");
    return;
  }

  const name = getUpdateTaskValue("name");
  const target = getUpdateTaskValue("target");

  if (name == "") {
    alert("The name must be not empty!");
    return;
  }

  if (target == "") {
    alert("The date must be not empty!");
    return;
  }

  const currentDate = new Date();
  const dateTarget = new Date(target);

  if (currentDate.getTime() > dateTarget.getTime()) {
    alert("The target date must be newer than the current date!");
    return;
  }

  if (name.length > 100) {
    alert("The name must be not be longer than 100");
    return;
  }

  const dataValue = {
    name: name,
    target: target,
  };
  const data = getData();
  const newOnGoingData = [];

  for (const onTask of data.onGoing) {
    if (onTask.name == currentUpdateName) {
      newOnGoingData.push(dataValue);
      continue;
    }

    newOnGoingData.push(onTask);
  }

  data.onGoing = newOnGoingData;
  setData(data);
  currentUpdateName = "";
  alert("The task successfully updated!");
}

function createNewTask() {
  const name = getNewTaskValue("name");
  const target = getNewTaskValue("target");

  if (name == "") {
    alert("The name must be not empty!");
    return;
  }

  if (target == "") {
    alert("The date must be not empty!");
    return;
  }

  const currentDate = new Date();
  const dateTarget = new Date(target);

  if (currentDate.getTime() > dateTarget.getTime()) {
    alert("The target date must be newer than the current date!");
    return;
  }

  if (name.length > 100) {
    alert("The name must be not be longer than 100");
    return;
  }

  const data = getData();
  for (const onTask of data.onGoing) {
    if (onTask.name == name) {
      alert("You can't set a same name while on going!");
      return;
    }
  }

  const dataValue = {
    name: name,
    target: target,
  };

  data.onGoing.push(dataValue);
  setData(data);
  alert("The task successfully created!");
}
