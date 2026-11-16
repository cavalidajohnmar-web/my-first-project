// ======================================
// 1. LIVE CLOCK FUNCTION
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
        tabCards.forEach(c => c.classList.remove("active"));
        card.classList.add("active");

        Object.values(sections).forEach(sec => {
            if (sec) sec.style.display = "none";
        });

        const targetTab = card.dataset.tab;
        if (sections[targetTab]) {
            sections[targetTab].style.display = "block";
        }
    });
});


// ======================================
// 3. SPEAKER VOICE VOLUME CONTROLLER & SETTINGS
// ======================================
const ttsVolume = document.getElementById("ttsVolume");
const volVal = document.getElementById("volVal");

if (ttsVolume) {
    // Load saved volume
    const savedVol = localStorage.getItem("tts_volume");
    if (savedVol !== null) {
        ttsVolume.value = savedVol;
        volVal.textContent = savedVol;
    }

    ttsVolume.addEventListener("input", () => {
        volVal.textContent = ttsVolume.value;
        localStorage.setItem("tts_volume", ttsVolume.value);
    });
}


// ======================================
// 4. TOGGLE SWITCH STATES & DYNAMIC ADD OFFICE
// ======================================
const officesList = document.getElementById("officesList");
const addOfficeBtn = document.getElementById("addOfficeBtn");

function initToggles() {
    const officeToggles = document.querySelectorAll(".office-toggle");
    officeToggles.forEach(toggle => {
        const statusLabel = toggle.parentElement.querySelector(".status-label");
        
        const officeName = toggle.dataset.office;
        const savedState = localStorage.getItem(`office_enabled_${officeName}`);
        if (savedState !== null) {
            toggle.checked = savedState === "true";
        }

        statusLabel.textContent = toggle.checked ? "Enabled" : "Disabled";

        toggle.addEventListener("change", () => {
            statusLabel.textContent = toggle.checked ? "Enabled" : "Disabled";
        });
    });
}

initToggles();

if (addOfficeBtn) {
    addOfficeBtn.addEventListener("click", () => {
        const officeName = prompt("Enter new office name:");
        if (!officeName) return;

        const prefix = prompt("Enter queue prefix letter (e.g. A):", "A").toUpperCase();
        const counterNum = officesList.querySelectorAll(".office-row-card").length + 1;

        const newRow = document.createElement("div");
        newRow.className = "office-row-card";
        newRow.innerHTML = `
            <div class="office-col-name">
                <i data-lucide="building" style="color: #0869d9;"></i>
                <span>${officeName}</span>
            </div>
            <div class="office-col-prefix">
                <input type="text" class="prefix-input" value="${prefix}" data-office="${officeName}">
            </div>
            <div class="office-col-counter">
                Counter ${counterNum}
            </div>
            <div class="office-col-status">
                <label class="switch">
                    <input type="checkbox" checked class="office-toggle" data-office="${officeName}">
                    <span class="slider"></span>
                    <span class="status-label">Enabled</span>
                </label>
            </div>
        `;

        officesList.appendChild(newRow);
        lucide.createIcons();
        initToggles();
        addNotification(`<strong>Office Added:</strong> ${officeName} has been configured.`);
    });
}


// ======================================
// 5. SAVE CHANGES & CANCEL BUTTON ACTIONS
// ======================================
const saveChangesBtn = document.getElementById("saveChangesBtn");
const cancelBtn = document.getElementById("cancelBtn");

saveChangesBtn.addEventListener("click", () => {
    // Save Office Toggles & Prefixes
    const officeToggles = document.querySelectorAll(".office-toggle");
    officeToggles.forEach(toggle => {
        const officeName = toggle.dataset.office;
        localStorage.setItem(`office_enabled_${officeName}`, toggle.checked);
    });

    const prefixInputs = document.querySelectorAll(".prefix-input");
    prefixInputs.forEach(input => {
        const officeName = input.dataset.office;
        localStorage.setItem(`office_prefix_${officeName}`, input.value);
    });

    // Save Queue Numbering settings
    const startNum = document.getElementById("startNumberInput")?.value;
    const padding = document.getElementById("digitPaddingSelect")?.value;
    if (startNum) localStorage.setItem("queue_start_num", startNum);
    if (padding) localStorage.setItem("queue_padding", padding);

    // Save Ticker banner text
    const ticker = document.getElementById("tickerText")?.value;
    if (ticker) localStorage.setItem("waiting_ticker_text", ticker);

    addNotification(`<strong>Settings:</strong> All configuration changes saved successfully.`);
    alert("System settings saved successfully!");
});

cancelBtn.addEventListener("click", () => {
    location.reload();
});


// ======================================
// 6. INTERACTIVE HEADER NOTIFICATIONS & PROFILE MENUS
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
// 7. INITIALIZATION
// ======================================
lucide.createIcons();