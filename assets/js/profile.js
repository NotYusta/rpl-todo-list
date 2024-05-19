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
