const XPLevel = {
  // REQUIRED XP GAIN TO LEVEL UP
  // LVL 2
  2: 5000,
  // LVL 3,
  3: 7000,
  4: 9000,
  5: 12000,

  6: 17500,
  //
};

const XPGain = {
  COMPLETED_EARLY: 700,
  COMPLETED: 500,
  COMPLETED_LATE: 300,
};

/**
 *
 * @param {import('../../typings/users').IUser} userData
 */
function levelUp(userData) {
  if (
    (userData.level == 1 && userData.xp >= XPLevel[2]) ||
    (userData.level == 2 && userData.xp >= XPLevel[3]) ||
    (userData.level == 3 && userData.xp >= XPLevel[4]) ||
    (userData.level == 4 && userData.xp >= XPLevel[5]) ||
    (userData.level == 5 && userData.xp >= XPLevel[6])
  ) {
    userData.xp = -1;
  }

  if (userData.xp == -1) {
    userData.level++;
    userData.xp = 0;
    return true;
  }

  return false;
}
// bisa pake caching system biar cpu lebih efektif, but meh.

let currentUpdateTaskData = {};

function convertDateMsToDay(value) {
  return value / 1000 / 60 / 60 / 24;
}
/**
 *
 * @param {import('../../typings/tasks').IUserTaskList[]} data
 */
function setTaskData(data) {
  localStorage.setItem("tasks", JSON.stringify(data));
}

/**
 *
 * @returns {import('../../typings/tasks').IUserTaskList}
 */
function getTaskDataList() {
  const data = localStorage.getItem("tasks");
  if (!data) {
    const newTasks = {};

    setTaskData(newTasks);
    return newTasks;
  }

  const parsedData = JSON.parse(data);
  return parsedData;
}

/**
 * @returns {import('../../typings/tasks').ITaskData}
 */
function getUserTaskData(email) {
  /**
   * @type {import('../../typings/tasks').IUserTaskList}
   */
  const data = getTaskDataList();
  if (!data[email]) {
    const emailData = {
      cancelled: [],
      completed: [],
      on_going: [],
    };

    data[email] = emailData;
    setUserTaskData(email, emailData);
  }

  return data[email];
}

/**
 * @param { String } email
 * @param {import('../../typings/tasks').ITaskData} data
 */
function setUserTaskData(email, data) {
  /**
   * @type {import('../../typings/tasks').IUserTaskList}
   */
  const tasksData = getTaskDataList();
  tasksData[email] = data;

  setTaskData(tasksData);
}

function cancelTask(email, name) {
  const taskData = getUserTaskData(email);

  let cancelledData = {};
  const newOnGoData = [];
  for (const ongo of taskData.on_going) {
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

  taskData.cancelled.push(cancelledData);
  taskData.on_going = newOnGoData;
  setUserTaskData(email, taskData);

  alert(`Successfully cancelled ${cancelledData.name}`);
}

function completeTask(email, name) {
  const userData = getUserData(email);
  const taskData = getUserTaskData(email);
  const curDate = new Date();

  /**
   * @type {import('../../typings/tasks').ICompletedTask}
   */
  let completedData = {};
  const newOnGoData = [];
  for (const ongo of taskData.on_going) {
    if (ongo.name == name) {
      completedData = ongo;

      completedData.completed_at = `${curDate.getFullYear()}-${curDate.getMonth()}-${curDate.getDate()}`;
      continue;
    }

    newOnGoData.push(ongo);
  }

  taskData.completed.push(completedData);
  taskData.on_going = newOnGoData;
  setUserTaskData(email, taskData);

  // xp gain progress
  const difDays = convertDateMsToDay(
    curDate.getTime() - new Date(completedData.completed_at).getTime()
  );
  // early finish
  if (difDays > 2) {
    userData.xp += XPGain.COMPLETED_EARLY;
    userData.total_xp += XPGain.COMPLETED_EARLY;
  } else if (difDays < 2 && difDays > 0) {
    userData.xp += XPGain.COMPLETED;
    userData.total_xp += XPGain.COMPLETED;
  } else {
    userData.xp += XPGain.COMPLETED_LATE;
    userData.total_xp += XPGain.COMPLETED_LATE;
  }

  if (levelUp(userData)) {
    alert(
      `Congratulations, you are now level ${userData.level}! - task ${completedData.name} marked as completed`
    );
  } else {
    alert(`Successfully mark ${completedData.name} as completed`);
  }

  setOneUserData(userData);
}

function createOnGoElement(email, onGo) {
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
    completeTask(email, onGo.name);
    location.reload();
  };

  const updateActTh = document.createElement("button");
  updateActTh.classList.add("update");
  updateActTh.onclick = function () {
    currentUpdateTaskData.name = onGo.name;
    currentUpdateTaskData.target = onGo.target;
    openModal("update-task");
  };

  const updateActThValue = document.createTextNode("Update");
  updateActTh.appendChild(updateActThValue);

  const cancelActTh = document.createElement("button");
  cancelActTh.classList.add("cancel");
  cancelActTh.onclick = function () {
    cancelTask(email, onGo.name);
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

/**
 *
 * @param { import('../../typings/tasks.d.ts').ICompletedTask } completed
 * @returns
 */
function createCompletedElement(completed) {
  const trElement = document.createElement("tr");
  trElement.classList.add("bg-gray", "item");
  const nameTh = document.createElement("th");
  const nameThValue = document.createTextNode(completed.name);
  nameTh.appendChild(nameThValue);

  const targetTh = document.createElement("th");
  const targetThValue = document.createTextNode(
    new Date(completed.target).toDateString()
  );
  targetTh.appendChild(targetThValue);

  const completedAtTh = document.createElement("th");
  const completedAtValue = document.createTextNode(
    new Date(completed.completed_at).toDateString()
  );

  completedAtTh.appendChild(completedAtValue);

  trElement.appendChild(nameTh);
  trElement.appendChild(targetTh);
  trElement.appendChild(completedAtTh);
  return trElement;
}

function loadPage() {
  const profileData = getProfileData();
  if (!profileData) {
    window.location.href = "./login.html";
    return;
  }

  const userData = getUserData(profileData.email);
  const email = profileData.email;
  const userTaskData = getUserTaskData(email);
  console.log(
    `XP: ${userData.xp} | Level: ${userData.level} | Total XP: ${userData.total_xp}`
  );
  const curDate = new Date();
  // document.getElementById("task_completed").innerHTML =
  //   userTaskData.completed.length;
  // document.getElementById("task_ongoing").innerHTML =
  //   userTaskData.on_going.length;
  // document.getElementById("task_cancelled").innerHTML =
  //   userTaskData.cancelled.length;

  const onGoingTasksElement = document.getElementById("on_going_tasks_table");
  const cancelledTasksElement = document.getElementById(
    "cancelled_tasks_table"
  );
  const completedTasksElement = document.getElementById(
    "completed_tasks_table"
  );

  let nearIncompleteTasks = 0;

  document.getElementById(
    "full_name"
  ).innerHTML = `${userData.first_name} ${userData.last_name}`;
  document.getElementById("level").innerHTML = `Level ${userData.level}`;
  for (const onGo of userTaskData.on_going) {
    const targetDate = new Date(onGo.target);
    // convert to day
    const difDay = convertDateMsToDay(targetDate.getTime() - curDate.getTime());
    if (difDay < 3) {
      nearIncompleteTasks++;
    }

    onGoingTasksElement.appendChild(createOnGoElement(email, onGo));
  }

  for (const cancelled of userTaskData.cancelled) {
    cancelledTasksElement.appendChild(createCancelledElement(cancelled));
  }

  for (const completed of userTaskData.completed) {
    completedTasksElement.appendChild(createCompletedElement(completed));
  }

  if (userTaskData.cancelled.length > 0) {
    document.getElementById("cancelled_task_empty").style.display = "none";
    document.getElementById("cancelled_task_items").style.display = "flex";
  }

  if (userTaskData.completed.length > 0) {
    document.getElementById("completed_task_empty").style.display = "none";
    document.getElementById("completed_task_items").style.display = "flex";
  }

  if (userTaskData.on_going.length > 0) {
    document.getElementById("ongoing_task_empty").style.display = "none";
    document.getElementById("ongoing_task_items").style.display = "flex";
  }

  if (nearIncompleteTasks > 0) {
    document.getElementById("reminder").style.display = "block";
    document.getElementById(
      "reminder-text"
    ).innerHTML = `You have ${nearIncompleteTasks} incomplete tasks that need to be completed soon.`;
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
  if (currentUpdateTaskData.name == "") {
    alert("The data your updating is invalid!");
    return;
  }

  const name = getUpdateTaskValue("name");
  let target = getUpdateTaskValue("target");

  if (name == "") {
    alert("The name must be not empty!");
    return;
  }

  if (target == "") {
    target = currentUpdateTaskData.target;
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

  const userData = getProfileData();
  const taskData = getUserTaskData(userData.email);
  const newOnGoingData = [];

  for (const onTask of taskData.on_going) {
    if (onTask.name == name) {
      alert("The name you're updating is already exists!");
      return;
    }
  }

  let updated = false;
  for (const onTask of taskData.on_going) {
    if (
      onTask.name == currentUpdateTaskData.name &&
      onTask.target == onTask.target &&
      !updated
    ) {
      newOnGoingData.push(dataValue);
      updated = true;
      continue;
    }

    newOnGoingData.push(onTask);
  }

  taskData.on_going = newOnGoingData;
  setUserTaskData(userData.email, taskData);
  currentUpdateTaskData = {};
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

  const userData = getProfileData();
  const taskData = getUserTaskData(userData.email);
  for (const onTask of taskData.on_going) {
    if (onTask.name == name) {
      alert("You can't set a same name while on going!");
      return;
    }
  }

  const dataValue = {
    name: name,
    target: target,
  };

  taskData.on_going.push(dataValue);
  setUserTaskData(userData.email, taskData);
  alert("The task successfully created!");
}
