/**
 *
 * @returns {import('../../typings/users').IUserProfile | undefined}
 */
function getProfileData() {
  const data = localStorage.getItem("profile");
  if (data) {
    return JSON.parse(data);
  }
}

/**
 *
 * @param {import('../../typings/users').IUserProfile } data
 */
function setProfileData(data) {
  localStorage.setItem("profile", JSON.stringify(data));
}

function loadProfile() {
  const profileData = getProfileData();
  if (!profileData) {
    window.location.href = "./login.html";
    return;
  }

  const email = profileData.email;
  const userData = getUserData(email);
  const userTaskData = getUserTaskData(email);

  document.getElementById(
    "full_name"
  ).innerHTML = `${userData.first_name} ${userData.last_name}`;
  document.getElementById("level").innerHTML = `Level ${userData.level}`;
  document.getElementById("task_completed").innerHTML =
    userTaskData.completed.length;
  document.getElementById("task_ongoing").innerHTML =
    userTaskData.on_going.length;
  document.getElementById("task_cancelled").innerHTML =
    userTaskData.cancelled.length;

  document.getElementById("total_xp").innerHTML = userData.total_xp;
  document.getElementById("progression_xp").innerHTML = `${userData.xp} / ${
    XPLevel[userData.level + 1]
  }`;
}
