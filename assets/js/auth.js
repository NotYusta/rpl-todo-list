/**
 *
 * @param {String} value
 */
function isEmail(value) {
  if (value.includes("@") && value.includes(".") && value.length > 4) {
    return true;
  }

  return false;
}

/**
 *
 * @returns {import('../../typings/users').IUser[]}
 */
function getUsersData() {
  const data = localStorage.getItem("users");
  if (data) {
    return JSON.parse(data);
  }

  localStorage.setItem("users", "[]");
  return [];
}

/**
 *
 * @returns {import('../../typings/users').IUser | undefined}
 */
function getUserData(email) {
  const data = getUsersData();
  console.log(JSON.stringify(data));

  for (const x of data) {
    if (x.email == email) {
      return x;
    }
  }
}

/**
 *
 * @param {import('../../typings/users').IUser} user
 */
function setOneUserData(user) {
  const data = getUsersData();

  const newData = [];
  for (const x of data) {
    if (x.email == user.email) {
      newData.push(user);
      continue;
    }

    newData.push(x);
  }

  localStorage.setItem("users", JSON.stringify(newData));
}

/**
 *
 * @param {import('../../typings/users').IUser[]} users
 */
function setUsersData(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function logout() {
  localStorage.removeItem("profile");
  window.location.reload();
}

function login() {
  const emailDoc = document.getElementById("email");
  const passwordDoc = document.getElementById("email");

  if (!emailDoc || emailDoc.value == "") {
    alert("The email should not be empty!");
    return;
  }

  if (!passwordDoc || passwordDoc.value == "") {
    alert("The password should not be empty!");
    return;
  }

  /**
   * @type { String }
   */
  const email = emailDoc.value;
  /**
   * @type { String }
   */
  const password = passwordDoc.value;

  if (!isEmail(email)) {
    alert("Invalid email! please input a valid email to continue");
    return;
  }

  if (password.length < 8) {
    alert("The password must be longer!");
    return;
  }

  /**
   * @type { import('../../typings/users').IUser[]}
   */
  const usersData = getUsersData();
  for (const user of usersData) {
    if (user.email == email && user.password == password) {
      setProfileData({
        email: email,
        first_name: user.first_name,
        last_name: user.last_name,
      });

      window.location.href = "./";
      return;
    }
  }

  alert("Invalid credentials!");
}

function signup() {
  const firstNameDoc = document.getElementById("first_name");
  const lastNameDoc = document.getElementById("last_name");
  const emailDoc = document.getElementById("email");
  const passwordDoc = document.getElementById("email");

  // null validation
  if (!firstNameDoc || firstNameDoc.value == "") {
    alert("The first name should not be empty!");
    return;
  }

  if (!lastNameDoc || lastNameDoc.value == "") {
    alert("The last name should not be empty!");
    return;
  }

  if (!emailDoc || emailDoc.value == "") {
    alert("The email should not be empty!");
    return;
  }

  if (!passwordDoc || passwordDoc.value == "") {
    alert("The password should not be empty!");
    return;
  }

  /**
   * @type { String }
   */
  const firstName = firstNameDoc.value;
  /**
   * @type { String }
   */
  const lastName = lastNameDoc.value;
  /**
   * @type { String }
   */
  const email = emailDoc.value;
  /**
   * @type { String }
   */
  const password = passwordDoc.value;

  if (!isEmail(email)) {
    alert("Invalid email! please input a valid email to continue");
    return;
  }

  if (password.length < 8) {
    alert("The password must be longer!");
    return;
  }

  /**
   * @type { import('../../typings/users').IUser[]}
   */
  const usersData = getUsersData();
  for (const user of usersData) {
    if (user.email == email) {
      alert("An account is already registered with this email!");
      return;
    }
  }

  const userData = {
    email: email,
    password: password,
    first_name: firstName,
    last_name: lastName,
    total_xp: 0,
    xp: 0,
    level: 1,
  };
  usersData.push(userData);

  setUsersData(usersData);
  setProfileData({
    email: userData.email,
    first_name: firstName,
    last_name: lastName,
  });
  window.location.href = "./index.html";
}
