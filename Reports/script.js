// ======================================
// 1. LIVE CLOCK FUNCTION
// Updates header date and time every second (Format: Month Day, Year · HH:MM:SS AM/PM)
// ======================================
function updateDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
    });
    const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });

    const dateTimeEl = document.getElementById("dateTime");
    if (dateTimeEl) {
        dateTimeEl.textContent = `${date} · ${time}`;
    }
}

updateDateTime();
setInterval(updateDateTime, 1000);


// ======================================
// 2. FILTER PILLS INTERACTION (Today, Week, Month, Custom)
// ======================================
const pillBtns = document.querySelectorAll(".pill-btn");

pillBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        pillBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filterType = btn.dataset.filter;
        addNotification(`<strong>Filter applied:</strong> Showing reports for <strong>${filterType}</strong>.`);
    });
});


// ======================================
// 3. EXPORT REPORT BUTTON ACTION
// ======================================
const exportBtn = document.getElementById("exportBtn");
if (exportBtn) {
    exportBtn.addEventListener("click", () => {
        alert("Report data successfully compiled and exported as PDF/CSV!");
        addNotification(`<strong>Export:</strong> Enrollment report exported successfully.`);
    });
}


// ======================================
// 4. INTERACTIVE HEADER NOTIFICATIONS & PROFILE MENUS
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

// Mark all notifications as read
if (clearNotifBtn) {
    clearNotifBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        document.querySelectorAll(".notif-item.unread").forEach(item => {
            item.classList.remove("unread");
        });
        if (notificationDot) notificationDot.classList.add("hidden");
    });
}

// Helper function to dynamically add notifications
function addNotification(htmlText) {
    if (!notificationList) return;
    const div = document.createElement("div");
    div.className = "notif-item unread";
    div.innerHTML = `
        <p>${htmlText}</p>
        <small>Just now</small>
    `;
    notificationList.prepend(div);
    if (notificationDot) notificationDot.classList.remove("hidden");
}

// Logout confirmation handlers
function logout() {
    if (confirm("Are you sure you want to logout?")) {
        alert("You have selected Logout.");
    }
}

const profileLogout = document.getElementById("profileLogout");
if (profileLogout) profileLogout.addEventListener("click", logout);

const sidebarLogout = document.getElementById("sidebarLogout");
if (sidebarLogout) {
    sidebarLogout.addEventListener("click", (event) => {
        event.preventDefault();
        logout();
    });
}


// ======================================
// 5. INITIALIZATION
// ======================================
lucide.createIcons();