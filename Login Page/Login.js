// ==========================================
// GET HTML ELEMENTS
// ==========================================

const loginForm = document.getElementById("loginForm");

const usernameInput = document.getElementById("username");

const passwordInput = document.getElementById("password");

const roleSelect = document.getElementById("role");

const loginFeedback = document.getElementById("loginFeedback");

const togglePassword = document.getElementById("togglePassword");

const eyeSlash = document.getElementById("eyeSlash");

const eyeOpen = document.getElementById("eyeOpen");

const contactMIS = document.getElementById("contactMIS");


// ==========================================
// PASSWORD VISIBILITY
// ==========================================

function changePasswordVisibility() {

    // CHECK CURRENT PASSWORD VISIBILITY
    const isPasswordHidden = passwordInput.type === "password";

    if (isPasswordHidden) {

        // SHOW PASSWORD
        passwordInput.type = "text";

        // HIDE EYE WITH SLASH
        eyeSlash.style.display = "none";

        // SHOW NORMAL EYE
        eyeOpen.style.display = "block";

        // UPDATE ACCESSIBILITY LABEL
        togglePassword.setAttribute(
            "aria-label",
            "Hide password"
        );

        togglePassword.setAttribute(
            "title",
            "Hide password"
        );

    } else {

        // HIDE PASSWORD
        passwordInput.type = "password";

        // SHOW EYE WITH SLASH
        eyeSlash.style.display = "block";

        // HIDE NORMAL EYE
        eyeOpen.style.display = "none";

        // UPDATE ACCESSIBILITY LABEL
        togglePassword.setAttribute(
            "aria-label",
            "Show password"
        );

        togglePassword.setAttribute(
            "title",
            "Show password"
        );

    }

}


// ==========================================
// CLICK EYE ICON
// ==========================================

togglePassword.addEventListener("click", function () {

    changePasswordVisibility();

});


// ==========================================
// LOGIN FORM
// ==========================================

loginForm.addEventListener("submit", function (event) {

    // PREVENT PAGE REFRESH
    event.preventDefault();


    // GET USER INPUT
    const username = usernameInput.value.trim();

    const password = passwordInput.value;

    const role = roleSelect.value;


    // RESET FEEDBACK
    loginFeedback.textContent = "";

    loginFeedback.className = "login-feedback";


    // VALIDATE EMPTY FIELDS
    if (username === "" || password === "") {

        displayMessage(
            "Please enter your username and password.",
            "error"
        );

        return;

    }


    // VALIDATE PASSWORD LENGTH
    if (password.length < 6) {

        displayMessage(
            "Password must contain at least 6 characters.",
            "error"
        );

        return;

    }


    // LOGIN DEMONSTRATION
    displayMessage(
        "Form validated for " + role +
        ". Please connect your authentication system.",
        "success"
    );


    // CONSOLE OUTPUT
    console.log("Username:", username);

    console.log("Role:", role);

});


// ==========================================
// DISPLAY MESSAGE FUNCTION
// ==========================================

function displayMessage(message, type) {

    loginFeedback.textContent = message;

    loginFeedback.classList.add(type);

}


// ==========================================
// CONTACT MIS
// ==========================================

contactMIS.addEventListener("click", function (event) {

    event.preventDefault();

    alert(
        "For login assistance, please contact your campus MIS personnel."
    );

});