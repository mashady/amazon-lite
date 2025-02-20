import { setCookie, getCookie, removeCookie } from "../cookies/cookies.js";

function isLogin() {
  const userCookie = getCookie("user");
  if (userCookie) {
    const user = JSON.parse(userCookie);
    console.log(`Logged in as: ${user.username}`);
    return user;
  } else {
    return null;
  }
}

function logOut() {
  removeCookie("user");
  window.location.href = "/";

  console.log("Logged out successfully.");
}
function isAdmin() {
  const userCookie = getCookie("user");
  if (userCookie) {
    const user = JSON.parse(userCookie);

    return getUserDataByUsername(user.username).isAdmin;
  }
  return false;
}
function generateUsername(fullName, users) {
  const baseUsername = fullName.toLowerCase().replace(/\s+/g, "");
  let username = baseUsername;
  let counter = 1;

  while (users.some((user) => user.username === username)) {
    username = `${baseUsername}${counter}`;
    counter++;
  }

  return username;
}

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
function validateName(name) {
  const regex = /^[a-zA-Z]{4,}$/;
  //let regex = new RegExp(/^[a-zA-Z\s]+[^\s]$/);
  if (regex.test(name)) {
    {
      console.log("Name is valid");
      return true;
    }
  }
  // return regex.test(name);
  // console.log(name);
}

function getUserDataByUsername(username) {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find((user) => user.username === username);

  return user || null;
}

function showNotification(message, duration = 3000) {
  const notification = document.getElementById("notification");
  const notificationMessage = document.getElementById("notification-message");
  const overlay = document.getElementById("overlay");

  notificationMessage.textContent = message;

  notification.classList.add("show");
  overlay.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
    overlay.classList.remove("show");
  }, duration);
}

function updateUI() {
  const user = isLogin();
  const logoutButton = document.getElementById("logout");
  const profileLink = document.getElementById("profileLink");
  const profileDiv = document.getElementById("profile");
  const loginButton = document.getElementById("login");

  if (user) {
    logoutButton.style.display = "block";
    profileDiv.style.display = "block";
    profileLink.setAttribute("href", "/profile.html");
    loginButton.style.display = "none";
  } else {
    logoutButton.style.display = "none";
    profileDiv.style.display = "none";
    loginButton.style.display = "block";
  }
}

function displayUserProfile(username) {
  const user = getUserDataByUsername(username);

  if (!user) {
    alert("User not found!");
    return;
  }

  const profileInfo = document.getElementById("profileInfo");
  // profileInfo.innerHTML = `
  //   <h1>Hello ${user.username}</h1>
  // `;

  const enrolledCoursesContainer = document.getElementById("enrolledCourses");
  console.log(user.courses);
  let slicedCoueses = user.courses.slice(); // handle pagination
  if (slicedCoueses.length == 0)
    document.getElementById("noAvail").style.display = "inline";

  slicedCoueses.forEach((course) => {
    console.log(course);

    if (course) {
      const courseDiv = document.createElement("div");
      courseDiv.className = "course";
      courseDiv.innerHTML = `
        <div class="card">
        <a href="./watching.html?courseID=${course.ID}?lessonID=1" >

          <img src="${course.Image}" alt="${course.Title}">
        </a>
        <div class="card-content">
          <h3>${course.Title}</h3>
          <p><strong>Instructor:</strong> ${course.Instructor}</p>
          <p>${course.Description}</p>
          <p>${course.Category}</p>
          <p><strong>Price:</strong> ${course.Price || 0}</p>
          <p><strong>Duration:</strong> ${course.Duration}</p>
        </div>
        </div>
      `;
      enrolledCoursesContainer.appendChild(courseDiv);
    }
  });
}
function updateUserData(userData) {
  const users = JSON.parse(localStorage.getItem("users")) || {};
  /*const updatedUsers = users.map((u) =>
    u.username === userData.username ? { ...u, userData } : u
  );*/
  const updatedUsers = users.map((user) =>
    user.username === userData.username
      ? { ...user, courses: userData.courses }
      : user
  );
  console.log(userData);
  console.log(updatedUsers);
  //users[userData.username] = userData;
  localStorage.setItem("users", JSON.stringify(updatedUsers));
}
export {
  isLogin,
  validateEmail,
  validateName,
  logOut,
  generateUsername,
  getUserDataByUsername,
  isAdmin,
  showNotification,
  updateUI,
  displayUserProfile,
  updateUserData,
};
// handle get user data function -> finish the profile and courses page
// function take username and return user data from local storage
// isAdmin
// progress -> on the course page after enrolled
// handle admin content
// merge full name
