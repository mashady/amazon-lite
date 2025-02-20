import { setCookie } from "../cookies/cookies.js";
import {
  isLogin,
  validateEmail,
  validateName,
  generateUsername,
} from "../utils/users.js";

//if (isLogin()) window.location.href = "/index.html";

function showError(elementId, errorMessage) {
  const element = document.getElementById(elementId);
  element.classList.add("is-invalid");
  const feedbackElement = element.nextElementSibling;
  feedbackElement.innerHTML = errorMessage;
  feedbackElement.style.display = "block";
}

function clearError(elementId) {
  const element = document.getElementById(elementId);
  element.classList.remove("is-invalid");
  const feedbackElement = element.nextElementSibling;
  feedbackElement.innerHTML = "";
  feedbackElement.style.display = "none";
}

function validateField(
  fieldValue,
  fieldId,
  errorId,
  validationFn,
  errorMessage
) {
  if (!fieldValue || (validationFn && !validationFn(fieldValue))) {
    showError(fieldId, errorMessage);
    return false;
  } else {
    clearError(fieldId);
    return true;
  }
}

document.getElementById("fullName").addEventListener("blur", () => {
  validateField(
    document.getElementById("fullName").value.trim(),
    "fullName",
    "fullNameFeedback",
    validateName,
    "Full name is required and must contain only characters"
  );
});

document.getElementById("email").addEventListener("blur", () => {
  validateField(
    document.getElementById("email").value.trim(),
    "email",
    "emailFeedback",
    validateEmail,
    "Please enter a valid email"
  );
});

document.getElementById("password").addEventListener("blur", () => {
  validateField(
    document.getElementById("password").value.trim(),
    "password",
    "passwordFeedback",
    (value) => value.length >= 8,
    "Password must be at least 8 characters long"
  );
});

document.getElementById("rePass").addEventListener("blur", () => {
  validateField(
    document.getElementById("rePass").value.trim(),
    "rePass",
    "rePassFeedback",
    (value) => value === document.getElementById("password").value.trim(),
    "Passwords do not match"
  );
});

document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const rePassword = document.getElementById("rePass").value.trim();

  const isFullNameValid = validateField(
    fullName,
    "fullName",
    "fullNameFeedback",
    validateName,
    "Full name is required and must contain only characters"
  );

  const isEmailValid = validateField(
    email,
    "email",
    "emailFeedback",
    validateEmail,
    "Please enter a valid email"
  );

  const isPasswordValid = validateField(
    password,
    "password",
    "passwordFeedback",
    (value) => value.length >= 8,
    "Password must be at least 8 characters long"
  );

  const isRePasswordValid = validateField(
    rePassword,
    "rePass",
    "rePassFeedback",
    (value) => value === password,
    "Passwords do not match"
  );

  if (
    !isFullNameValid ||
    !isEmailValid ||
    !isPasswordValid ||
    !isRePasswordValid
  ) {
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    showError("email", "Email already exists");
    return;
  }

  const username = generateUsername(fullName, users);
  const newUser = {
    fullName,
    username,
    email,
    password,
    isAdmin: false,
    courses: [],
    wishlist: [],
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  setCookie("user", JSON.stringify({ username }), 1);
  isLogin();
  window.location.href = "/index.html";
});
