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
// 2. SETTINGS TABS SWITCHING LOGIC
// Allows clicking the top card tabs to switch between settings sections
// ======================================
const tabCards = document.querySelectorAll(".tab-card");
const sections = {
    "office-config": document.getElementById("office-config-section"),
    "queue-prefix": document.getElementById("queue-prefix-section"),
    "tv-display": document.getElementById("tv-display-section"),
    "user-role": document.getElementById("user-role-section")
};

tabCards.forEach(card => {
    card.addEventListener("click", () => {
        // Remove active class from all cards
        tabCards.forEach(c => c.classList.remove("active"));
        card.classList.add("active");

        // Hide all settings sections
        Object.values(sections).forEach(sec => {
            if (sec) sec.style.display = "none";
        });

        // Display target section based on data-tab attribute
        const targetTab = card.dataset.tab;
        if (sections[targetTab]) {
            sections[targetTab].style.display = "block";
        }
    });
});


// ======================================
// 3. TOGGLE SWITCH STATES & LOCALSTORAGE LOADING
// ======================================
const officeToggles = document.querySelectorAll(".office-toggle");

officeToggles.forEach(toggle => {
    const statusLabel = toggle.parentElement.querySelector(".status-label");
    
    // Load previously saved toggle state from localStorage
    const officeName = toggle.dataset.office;
    const savedState = localStorage.getItem(`office_enabled_${officeName}`);
    if (savedState !== null) {
        toggle.checked = savedState === "true";
    }

    // Update status text label ("Enabled" / "Disabled")
    statusLabel.textContent = toggle.checked ? "Enabled" : "Disabled";

    toggle.addEventListener("change", () => {
        statusLabel.textContent = toggle.checked ? "Enabled" : "Disabled";
    });
});


// ======================================
// 4. SAVE CHANGES & CANCEL BUTTON ACTIONS
// ======================================
const saveChangesBtn = document.getElementById("saveChangesBtn");
const cancelBtn = document.getElementById("cancelBtn");

saveChangesBtn.addEventListener("click", () => {
    // Save office toggle settings to localStorage
    officeToggles.forEach(toggle => {
        const officeName = toggle.dataset.office;
        localStorage.setItem(`office_enabled_${officeName}`, toggle.checked);
    });

    // Save office prefix inputs to localStorage
    const prefixInputs = document.querySelectorAll(".prefix-input");
    prefixInputs.forEach(input => {
        const officeName = input.dataset.office;
        localStorage.setItem(`office_prefix_${officeName}`, input.value);
    });

    addNotification(`<strong>Settings:</strong> Changes saved successfully.`);
    alert("System settings saved successfully!");
});

cancelBtn.addEventListener("click", () => {
    location.reload();
});


// ======================================
// 5. INTERACTIVE HEADER NOTIFICATIONS & PROFILE MENUS
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
// 6. INITIALIZATION
// ======================================
lucide.createIcons();