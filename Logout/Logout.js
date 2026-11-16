// ======================================
// 1. LIVE CLOCK & DATE FUNCTION (Updates every second with ticking seconds and middle dot separator)
// ======================================
function updateDateTime() {
    const now = new Date();
    
    const dateHeaderStr = now.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
    });
    const timeHeaderStr = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });

    const dateTimeEl = document.getElementById("dateTime");
    if (dateTimeEl) {
        dateTimeEl.textContent = `${dateHeaderStr} · ${timeHeaderStr}`;
    }
}

// Initialize clock and update every 1 second (1000ms)
updateDateTime();
setInterval(updateDateTime, 1000);


// ======================================
// 2. INTERACTIVE HEADER NOTIFICATIONS & PROFILE MENUS
// ======================================
const notificationBtn = document.getElementById("notificationBtn");
const notificationPanel = document.getElementById("notificationPanel");
const notificationDot = document.getElementById("notificationDot");
const clearNotifBtn = document.getElementById("clearNotifBtn");
const notificationList = document.getElementById("notificationList");
const profileBtn = document.getElementById("profileBtn");
const profilePanel = document.getElementById("profilePanel");

if (notificationBtn && notificationPanel) {
    notificationBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        notificationPanel.hidden = !notificationPanel.hidden;
        if (profilePanel) profilePanel.hidden = true;
    });
}

if (profileBtn && profilePanel) {
    profileBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        profilePanel.hidden = !profilePanel.hidden;
        if (notificationPanel) notificationPanel.hidden = true;
    });
}

// Close dropdowns when clicking outside
document.addEventListener("click", (event) => {
    if (!event.target.closest(".header-menu")) {
        if (notificationPanel) notificationPanel.hidden = true;
        if (profilePanel) profilePanel.hidden = true;
    }
});

// Mark notifications as read
if (clearNotifBtn) {
    clearNotifBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        document.querySelectorAll(".notif-item.unread").forEach(item => {
            item.classList.remove("unread");
        });
        if (notificationDot) notificationDot.classList.add("hidden");
    });
}


// ======================================
// 3. LOGOUT MODAL BUTTON ACTIONS
// ======================================
const cancelBtn = document.getElementById("cancelBtn");
if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
        // Redirect back to main dashboard when canceled
        window.location.href = "Main Dashboard.html";
    });
}

const confirmLogoutBtn = document.getElementById("confirmLogoutBtn");
if (confirmLogoutBtn) {
    confirmLogoutBtn.addEventListener("click", () => {
        alert("You have successfully logged out of the system.");
        // Redirect to login or main dashboard screen
        window.location.href = "Main Dashboard.html";
    });
}

const profileLogout = document.getElementById("profileLogout");
if (profileLogout) {
    profileLogout.addEventListener("click", () => {
        alert("Session terminated.");
        window.location.href = "Main Dashboard.html";
    });
}


// ======================================
// 4. INITIALIZATION
// ======================================
lucide.createIcons();