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
        // Uses middle dot (·) separator instead of a dash
        dateTimeEl.textContent = `${dateHeaderStr} · ${timeHeaderStr}`;
    }

    const selectedDateText = document.getElementById("selectedDateText");
    if (selectedDateText && !selectedDateText.dataset.manual) {
        selectedDateText.textContent = now.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
    }
}

// Initialize clock and update every 1 second (1000ms)
updateDateTime();
setInterval(updateDateTime, 1000);

// ======================================
// 2. CLICKABLE FILTER PILLS WITH INTERACTIVE BAR & PIE DATA
// ======================================
const pillBtns = document.querySelectorAll(".pill-btn");

const reportData = {
    today: {
        total: 48,
        totalSub: "Across all enrollment offices",
        completed: 31,
        completedSub: "64.6% of today's total",
        avgWait: "10 min",
        barSub: "Number of tickets issued today",
        registrarVal: 18, registrarHeight: "110px",
        nurseVal: 15, nurseHeight: "92px",
        misVal: 15, misHeight: "92px",
        footerText: "Registrar received the highest number of queues today.",
        legendCompleted: 31, legendServing: 3, legendWaiting: 14,
        donutNote: "48 total queues · Last updated live",
        pieGradient: "conic-gradient(#0869d9 0deg 232deg, #00b85a 232deg 254deg, #f8e900 254deg 360deg)"
    },
    week: {
        total: 312,
        totalSub: "From Monday to Friday this week",
        completed: 240,
        completedSub: "76.9% completion rate",
        avgWait: "12 min",
        barSub: "Number of tickets issued this week",
        registrarVal: 110, registrarHeight: "115px",
        nurseVal: 125, nurseHeight: "125px",
        misVal: 77, misHeight: "80px",
        footerText: "Nurse department recorded the highest volume this week.",
        legendCompleted: 240, legendServing: 12, legendWaiting: 60,
        donutNote: "312 total weekly queues",
        pieGradient: "conic-gradient(#0869d9 0deg 277deg, #00b85a 277deg 291deg, #f8e900 291deg 360deg)"
    },
    month: {
        total: 1245,
        totalSub: "Total queues for November 2026",
        completed: 1050,
        completedSub: "84.3% monthly completion",
        avgWait: "11 min",
        barSub: "Number of tickets issued this month",
        registrarVal: 450, registrarHeight: "120px",
        nurseVal: 420, nurseHeight: "112px",
        misVal: 375, misHeight: "100px",
        footerText: "Registrar maintains peak volume for the month.",
        legendCompleted: 1050, legendServing: 25, legendWaiting: 170,
        donutNote: "1,245 total monthly queues",
        pieGradient: "conic-gradient(#0869d9 0deg 303deg, #00b85a 303deg 310deg, #f8e900 310deg 360deg)"
    },
    custom: {
        total: 85,
        totalSub: "Custom date range selection",
        completed: 62,
        completedSub: "72.9% completion rate",
        avgWait: "9 min",
        barSub: "Tickets issued in custom range",
        registrarVal: 35, registrarHeight: "95px",
        nurseVal: 30, nurseHeight: "82px",
        misVal: 20, misHeight: "55px",
        footerText: "Custom range analytical breakdown.",
        legendCompleted: 62, legendServing: 5, legendWaiting: 18,
        donutNote: "85 total custom queues",
        pieGradient: "conic-gradient(#0869d9 0deg 263deg, #00b85a 263deg 284deg, #f8e900 284deg 360deg)"
    }
};

pillBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        pillBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filterKey = btn.dataset.filter;
        const data = reportData[filterKey];

        if (data) {
            // Update Stats Cards
            document.getElementById("statTotalQueues").textContent = data.total;
            document.getElementById("statTotalSub").textContent = data.totalSub;
            document.getElementById("statCompleted").textContent = data.completed;
            document.getElementById("statCompletedSub").textContent = data.completedSub;
            document.getElementById("statAvgWait").textContent = data.avgWait;

            // Update Bar Chart Values & Heights dynamically
            document.getElementById("barChartSub").textContent = data.barSub;
            
            document.getElementById("valRegistrar").textContent = data.registrarVal;
            document.getElementById("barRegistrar").style.height = data.registrarHeight;

            document.getElementById("valNurse").textContent = data.nurseVal;
            document.getElementById("barNurse").style.height = data.nurseHeight;

            document.getElementById("valMis").textContent = data.misVal;
            document.getElementById("barMis").style.height = data.misHeight;

            document.getElementById("chartFooterText").textContent = data.footerText;

            // Update Pie Chart Legend & Gradient
            document.getElementById("legendCompleted").textContent = data.legendCompleted;
            document.getElementById("legendServing").textContent = data.legendServing;
            document.getElementById("legendWaiting").textContent = data.legendWaiting;
            document.getElementById("donutFooterNote").textContent = data.donutNote;

            const pieEl = document.getElementById("interactivePieChart");
            if (pieEl) {
                pieEl.style.background = data.pieGradient;
            }

            addNotification(`<strong>Reports Updated:</strong> Displaying interactive data for <strong>${btn.textContent}</strong>.`);
        }
    });
});


// ======================================
// 3. DATE PICKER DROPDOWN CLICK ACTION
// ======================================
const datePickerBtn = document.getElementById("datePickerBtn");
if (datePickerBtn) {
    datePickerBtn.addEventListener("click", () => {
        const customDate = prompt("Enter target date (e.g., November 15, 2026):");
        if (customDate) {
            const selectedDateText = document.getElementById("selectedDateText");
            selectedDateText.textContent = customDate;
            selectedDateText.dataset.manual = "true";
            addNotification(`<strong>Date Changed:</strong> Reports filtered for ${customDate}.`);
        }
    });
}


// ======================================
// 4. EXPORT REPORT BUTTON ACTION
// ======================================
const exportBtn = document.getElementById("exportBtn");
if (exportBtn) {
    exportBtn.addEventListener("click", () => {
        alert("Report summary successfully exported as PDF!");
        addNotification(`<strong>Export:</strong> Report exported successfully.`);
    });
}


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
// 6. INITIALIZATION
// ======================================
lucide.createIcons();