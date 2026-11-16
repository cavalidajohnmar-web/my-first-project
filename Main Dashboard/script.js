// ======================================
// 1. SELECT HTML ELEMENTS
// ======================================

const dateTimeEl = document.getElementById("dateTime");
const notificationBtn = document.getElementById("notificationBtn");
const notificationPanel = document.getElementById("notificationPanel");
const notificationDot = document.getElementById("notificationDot");
const clearNotifBtn = document.getElementById("clearNotifBtn");
const notificationList = document.getElementById("notificationList");

const profileBtn = document.getElementById("profileBtn");
const profilePanel = document.getElementById("profilePanel");

const waitingRoomModal = document.getElementById("waitingRoomModal");
const btnWaitingRoom = document.getElementById("btnWaitingRoom");
const closeWaitingModal = document.getElementById("closeWaitingModal");
const doneWaitingModal = document.getElementById("doneWaitingModal");


// ======================================
// 2. INITIAL DASHBOARD STATE
// ======================================

const dashboardData = {
    Registrar: {
        serving: "R-003",
        waiting: 5,
        next: "R-004",
        accepting: true
    },
    Nurse: {
        serving: "N-001",
        waiting: 3,
        next: "N-002",
        accepting: true
    },
    MIS: {
        serving: "M-002",
        waiting: 4,
        next: "M-003",
        accepting: true
    },
    summary: {
        totalQueues: 48,
        served: 28,
        notServed: 20
    }
};


// ======================================
// 3. AUTOMATIC REAL-TIME DATE & TIME
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

    if (dateTimeEl) {
        dateTimeEl.textContent = `${date} · ${time}`;
    }
}

updateDateTime();
setInterval(updateDateTime, 1000);


// ======================================
// 4. CLICKABLE NOTIFICATION BELL & ITEMS
// ======================================

notificationBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    notificationPanel.hidden = !notificationPanel.hidden;
    profilePanel.hidden = true;
});

// Mark individual notification as read when clicked
notificationList.addEventListener("click", (event) => {
    const item = event.target.closest(".notif-item");
    if (item) {
        item.classList.remove("unread");
        checkUnreadNotifications();
    }
});

// Mark all notifications as read
clearNotifBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    document.querySelectorAll(".notif-item.unread").forEach((item) => {
        item.classList.remove("unread");
    });
    checkUnreadNotifications();
});

function checkUnreadNotifications() {
    const unreadCount = document.querySelectorAll(".notif-item.unread").length;
    if (unreadCount === 0) {
        notificationDot.classList.add("hidden");
    } else {
        notificationDot.classList.remove("hidden");
    }
}


// ======================================
// 5. CLICKABLE ADMIN PROFILE MENU
// ======================================

profileBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    profilePanel.hidden = !profilePanel.hidden;
    notificationPanel.hidden = true;
});

// Close dropdowns when clicking anywhere outside
document.addEventListener("click", (event) => {
    if (!event.target.closest(".header-menu")) {
        notificationPanel.hidden = true;
        profilePanel.hidden = true;
    }
});


// ======================================
// 6. CLICKABLE OFFICE CARDS (ADVANCE QUEUE)
// ======================================

function incrementTicket(ticketStr) {
    const [prefix, numStr] = ticketStr.split("-");
    const nextNum = parseInt(numStr, 10) + 1;
    return `${prefix}-${String(nextNum).padStart(3, "0")}`;
}

function renderDashboard() {
    // Registrar
    document.getElementById("registrarServing").textContent = dashboardData.Registrar.serving;
    document.getElementById("registrarWaiting").textContent = dashboardData.Registrar.waiting;
    document.getElementById("registrarNext").textContent = dashboardData.Registrar.next;
    document.getElementById("registrarStatusWait").textContent = `${dashboardData.Registrar.waiting} students waiting`;

    // Nurse
    document.getElementById("nurseServing").textContent = dashboardData.Nurse.serving;
    document.getElementById("nurseWaiting").textContent = dashboardData.Nurse.waiting;
    document.getElementById("nurseNext").textContent = dashboardData.Nurse.next;
    document.getElementById("nurseStatusWait").textContent = `${dashboardData.Nurse.waiting} students waiting`;

    // MIS
    document.getElementById("misServing").textContent = dashboardData.MIS.serving;
    document.getElementById("misWaiting").textContent = dashboardData.MIS.waiting;
    document.getElementById("misNext").textContent = dashboardData.MIS.next;
    document.getElementById("misStatusWait").textContent = `${dashboardData.MIS.waiting} students waiting`;

    // Summary
    document.getElementById("totalQueuesCount").textContent = dashboardData.summary.totalQueues;
    document.getElementById("servedCount").textContent = dashboardData.summary.served;
    document.getElementById("notServedCount").textContent = dashboardData.summary.notServed;

    // Modal sync
    document.getElementById("modalRegistrar").textContent = dashboardData.Registrar.serving;
    document.getElementById("modalRegistrarNext").textContent = dashboardData.Registrar.next;
    document.getElementById("modalNurse").textContent = dashboardData.Nurse.serving;
    document.getElementById("modalNurseNext").textContent = dashboardData.Nurse.next;
    document.getElementById("modalMis").textContent = dashboardData.MIS.serving;
    document.getElementById("modalMisNext").textContent = dashboardData.MIS.next;
}

// Clicking an office card simulates calling the next student & pushes a live notification
document.querySelectorAll(".queue-hero-card").forEach((card) => {
    card.addEventListener("click", () => {
        const office = card.dataset.office;
        const info = dashboardData[office];

        if (info.waiting > 0) {
            info.serving = info.next;
            info.next = incrementTicket(info.next);
            info.waiting -= 1;

            dashboardData.summary.served += 1;
            dashboardData.summary.notServed = Math.max(0, dashboardData.summary.notServed - 1);

            renderDashboard();
            document.getElementById("lastUpdatedText").textContent = "Updated just now";
            addNotification(`<strong>${office}:</strong> Called next ticket ${info.serving}.`);
        } else {
            alert(`No waiting students left for ${office}.`);
        }
    });
});

function addNotification(htmlText) {
    const div = document.createElement("div");
    div.className = "notif-item unread";
    div.innerHTML = `
        <p>${htmlText}</p>
        <small>Just now</small>
    `;
    notificationList.prepend(div);
    checkUnreadNotifications();
}


// ======================================
// 7. CLICKABLE OFFICE STATUS TOGGLES
// ======================================

document.querySelectorAll("[data-office-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
        const office = btn.dataset.officeToggle;
        const isAccepting = !dashboardData[office].accepting;
        dashboardData[office].accepting = isAccepting;

        if (isAccepting) {
            btn.textContent = "Accepting students";
            btn.classList.remove("paused");
            btn.classList.add("active");
        } else {
            btn.textContent = "Paused";
            btn.classList.remove("active");
            btn.classList.add("paused");
        }

        updateGlobalOnlineBadge();
        document.getElementById("lastUpdatedText").textContent = "Updated just now";
    });
});

function updateGlobalOnlineBadge() {
    const badge = document.getElementById("globalStatusBadge");
    const allOnline =
        dashboardData.Registrar.accepting &&
        dashboardData.Nurse.accepting &&
        dashboardData.MIS.accepting;

    if (allOnline) {
        badge.textContent = "All offices online";
        badge.classList.remove("partial");
    } else {
        badge.textContent = "Some offices paused";
        badge.classList.add("partial");
    }
}


// ======================================
// 8. QUICK ACTIONS & WAITING ROOM MODAL
// ======================================

document.getElementById("btnIssueNewTicket").addEventListener("click", () => {
    window.location.href = "Issue Ticket.html";
});

document.getElementById("btnViewReports").addEventListener("click", () => {
    alert("Navigating to Reports page...");
});

btnWaitingRoom.addEventListener("click", () => {
    waitingRoomModal.classList.add("show");
    waitingRoomModal.setAttribute("aria-hidden", "false");
});

function closeModal() {
    waitingRoomModal.classList.remove("show");
    waitingRoomModal.setAttribute("aria-hidden", "true");
}

closeWaitingModal.addEventListener("click", closeModal);
doneWaitingModal.addEventListener("click", closeModal);

waitingRoomModal.addEventListener("click", (event) => {
    if (event.target === waitingRoomModal) {
        closeModal();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeModal();
    }
});


// ======================================
// 9. LOGOUT FUNCTION
// ======================================

function logout() {
    const confirmLogout = confirm("Are you sure you want to logout?");
    if (confirmLogout) {
        alert("You have selected Logout.");
    }
}

document.getElementById("profileLogout").addEventListener("click", logout);

document.getElementById("sidebarLogout").addEventListener("click", (event) => {
    event.preventDefault();
    logout();
});


// ======================================
// 10. INITIALIZE
// ======================================

renderDashboard();
lucide.createIcons();