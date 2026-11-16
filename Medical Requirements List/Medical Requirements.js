// ======================================
// 1. LIVE CLOCK (Month Day, Year · Time - without weekday)
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
// 2. INTERACTIVE CHECKLIST STORAGE & SYNC
// ======================================
const checkboxes = document.querySelectorAll(".interactive-check");

// Load saved checklist states from localStorage
checkboxes.forEach(checkbox => {
    const id = checkbox.dataset.id;
    const savedState = localStorage.getItem(`med_req_${id}`);
    if (savedState === "true") {
        checkbox.checked = true;
    }

    // Listen for changes
    checkbox.addEventListener("change", () => {
        localStorage.setItem(`med_req_${id}`, checkbox.checked);
        addNotification(`<strong>Checklist updated:</strong> Requirement status saved.`);
    });
});


// ======================================
// 3. PRINT CHECKLIST BUTTON ACTION
// ======================================
const printBtn = document.getElementById("printBtn");
if (printBtn) {
    printBtn.addEventListener("click", () => {
        window.print();
    });
}


// ======================================
// 4. NOTIFICATIONS & PROFILE MENUS
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

document.addEventListener("click", (event) => {
    if (!event.target.closest(".header-menu")) {
        if (notificationPanel) notificationPanel.hidden = true;
        if (profilePanel) profilePanel.hidden = true;
    }
});

if (clearNotifBtn) {
    clearNotifBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        document.querySelectorAll(".notif-item.unread").forEach(item => {
            item.classList.remove("unread");
        });
        if (notificationDot) notificationDot.classList.add("hidden");
    });
}

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
// 5. INITIALIZE
// ======================================
lucide.createIcons();