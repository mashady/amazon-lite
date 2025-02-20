import { setCookie } from "../cookies/cookies.js";
import { isLogin } from "../utils/users.js";

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email");
  const password = document.getElementById("password");

  let isValid = true;

  if (!email.value.trim()) {
    email.classList.add("is-invalid");
    isValid = false;
  } else {
    email.classList.remove("is-invalid");
    email.classList.add("is-valid");
  }

  if (!password.value.trim()) {
    password.classList.add("is-invalid");
    isValid = false;
  } else {
    password.classList.remove("is-invalid");
    password.classList.add("is-valid");
  }

  if (!isValid) return;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(
    (user) => user.email.toLowerCase() === email.value.toLowerCase()
  );

  if (user && user.password === password.value) {
    console.log("Login successful!");
    setCookie("user", JSON.stringify({ username: user.username }), 1);
    isLogin();
    window.location.href = "/index.html";
  } else {
    console.log("Invalid email or password!");
    password.classList.add("is-invalid");
    document.getElementById("passErr").innerText = "Invalid email or password!";
  }
});
