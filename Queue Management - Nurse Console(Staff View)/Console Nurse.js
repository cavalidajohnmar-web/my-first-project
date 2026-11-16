/* ======================================
   1. INITIAL QUEUE DATA
====================================== */

const defaultQueue = [
    {
        name: "John Mar Cavalida",
        ticket: "N-001",
        type: "Freshman",
        time: "09:30 AM",
        status: "Completed",
        serviceTime: "09:35 AM",
        requirements: [true, true, true, true],
        screeningStatus: "Requirements Complete",
        notes: "Screening completed successfully."
    },
    {
        name: "Jea Mea Pielago",
        ticket: "N-002",
        type: "Freshman",
        time: "09:34 AM",
        status: "Serving",
        serviceTime: "09:40 AM",
        requirements: [false, false, false, false],
        screeningStatus: "Documents Under Review",
        notes: ""
    },
    {
        name: "Carlo Reyes",
        ticket: "N-003",
        type: "Freshman",
        time: "09:38 AM",
        status: "Waiting",
        serviceTime: "",
        requirements: [false, false, false, false],
        screeningStatus: "Documents Under Review",
        notes: ""
    },
    {
        name: "Ana Lim",
        ticket: "N-004",
        type: "Old Student",
        time: "09:40 AM",
        status: "Waiting",
        serviceTime: "",
        requirements: [false, false, false, false],
        screeningStatus: "Documents Under Review",
        notes: ""
    },
    {
        name: "Ben Garcia",
        ticket: "N-005",
        type: "Old Student",
        time: "09:42 AM",
        status: "Waiting",
        serviceTime: "",
        requirements: [false, false, false, false],
        screeningStatus: "Documents Under Review",
        notes: ""
    }
];


// ======================================
// 2. LOAD AND SAVE QUEUE
// ======================================

function loadQueue() {
    const saved = localStorage.getItem("nurseQueue");

    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (error) {
            console.error("Unable to load queue:", error);
        }
    }

    localStorage.setItem("nurseQueue", JSON.stringify(defaultQueue));
    return JSON.parse(JSON.stringify(defaultQueue));
}

let queue = loadQueue();

let selectedIndex = queue.findIndex(
    student => student.status === "Serving"
);

if (selectedIndex === -1) {
    selectedIndex = queue.findIndex(
        student => student.status === "Waiting"
    );
    if (selectedIndex === -1) selectedIndex = 0;
}

let currentFilter = "Freshman";


// ======================================
// 3. SELECT HTML ELEMENTS
// ======================================

const studentList = document.getElementById("studentList");
const nowServing = document.getElementById("nowServing");
const waitingCount = document.getElementById("waitingCount");

const detailName = document.getElementById("detailName");
const detailTicket = document.getElementById("detailTicket");
const detailType = document.getElementById("detailType");

const requirementsContainer = document.querySelector(".requirements");
const screeningStatus = document.getElementById("screeningStatus");
const studentNotes = document.getElementById("studentNotes");

const notificationBtn = document.getElementById("notificationBtn");
const notificationPanel = document.getElementById("notificationPanel");
const notificationDot = document.getElementById("notificationDot");
const clearNotifBtn = document.getElementById("clearNotifBtn");
const notificationList = document.getElementById("notificationList");

const profileBtn = document.getElementById("profileBtn");
const profilePanel = document.getElementById("profilePanel");


// ======================================
// 4. SAVE QUEUE
// ======================================

function saveQueue() {
    localStorage.setItem("nurseQueue", JSON.stringify(queue));
}


// ======================================
// 5. CURRENT TIME
// ======================================

function getCurrentTime() {
    return new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
    });
}


// ======================================
// 6. UPDATE COUNTERS
// ======================================

function updateCounters() {
    const serving = queue.find(
        student => student.status === "Serving"
    );

    const waiting = queue.filter(
        student => student.status === "Waiting"
    ).length;

    nowServing.textContent = serving ? serving.ticket : "None";
    waitingCount.textContent = waiting;
}


// ======================================
// 7. DISPLAY STUDENTS
// ======================================

function displayStudents() {
    studentList.innerHTML = "";

    const filteredQueue = queue.filter(
        student => student.type === currentFilter
    );

    if (filteredQueue.length === 0) {
        studentList.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #718baa; font-size: 13px;">
                No ${currentFilter.toLowerCase()} students in queue.
            </div>
        `;
        updateCounters();
        return;
    }

    queue.forEach((student, index) => {
        if (student.type !== currentFilter) return;

        const row = document.createElement("div");
        row.className = "student-row";

        if (index === selectedIndex) {
            row.classList.add("selected");
        }

        let statusClass = "waiting-status";
        if (student.status === "Serving") {
            statusClass = "serving-status";
        } else if (student.status === "Skipped") {
            statusClass = "skipped-status";
        } else if (student.status === "Completed") {
            statusClass = "completed-status";
        } else if (student.status === "Transferred") {
            statusClass = "transferred-status";
        }

        row.innerHTML = `
            <div class="student-name">
                <span>${student.name}</span>
                <small>${student.ticket}</small>
            </div>

            <span>${student.type}</span>

            <div>
                <span class="student-status ${statusClass}">
                    ${student.status}
                </span>
            </div>
        `;

        row.addEventListener("click", () => {
            selectedIndex = index;
            displayStudents();
            displayDetails();
        });

        studentList.appendChild(row);
    });

    updateCounters();
}


// ======================================
// 8. DISPLAY STUDENT DETAILS
// ======================================

function displayDetails() {
    const student = queue[selectedIndex];

    if (!student) {
        detailName.textContent = "No student selected";
        detailTicket.textContent = "";
        detailType.textContent = "";

        requirementsContainer.querySelectorAll("input").forEach(input => {
            input.checked = false;
        });

        screeningStatus.value = "Documents Under Review";
        studentNotes.value = "";
        return;
    }

    detailName.textContent = student.name;
    detailTicket.textContent =
        `Ticket ${student.ticket} · ${student.type}`;

    detailType.textContent =
        student.type === "Old Student"
            ? "Type: Continuing Student"
            : "Type: New Student";

    screeningStatus.value =
        student.screeningStatus || "Documents Under Review";

    studentNotes.value = student.notes || "";

    const checkboxes = requirementsContainer.querySelectorAll("input");

    checkboxes.forEach((checkbox, index) => {
        checkbox.checked = student.requirements[index] || false;
    });
}


// ======================================
// 9. STUDENT TABS SELECTION
// ======================================

document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach(item => {
            item.classList.remove("active");
        });

        tab.classList.add("active");

        currentFilter = tab.dataset.filter;

        const firstMatching = queue.findIndex(
            s => s.type === currentFilter
        );
        if (firstMatching !== -1) {
            selectedIndex = firstMatching;
        }

        displayStudents();
        displayDetails();
    });
});


// ======================================
// 10. SAVE STUDENT DETAILS
// ======================================

document.getElementById("saveStudent").addEventListener("click", () => {
    const student = queue[selectedIndex];

    if (!student) {
        alert("Please select a student first.");
        return;
    }

    student.requirements = Array.from(
        requirementsContainer.querySelectorAll("input")
    ).map(input => input.checked);

    student.screeningStatus = screeningStatus.value;
    student.notes = studentNotes.value;

    saveQueue();

    alert("Student details saved successfully.");
    displayStudents();
});


// ======================================
// 11. CALL NEXT STUDENT
// ======================================

document.getElementById("callNext").addEventListener("click", () => {
    const current = queue.find(
        student => student.status === "Serving"
    );

    if (current) {
        current.status = "Waiting";
    }

    const next = queue.find(
        student => student.status === "Waiting"
    );

    if (!next) {
        if (current) current.status = "Serving";
        alert("There are no waiting students.");
        saveQueue();
        displayStudents();
        displayDetails();
        return;
    }

    next.status = "Serving";
    next.serviceTime = getCurrentTime();

    selectedIndex = queue.indexOf(next);
    currentFilter = next.type;

    updateTabs();
    saveQueue();
    displayStudents();
    displayDetails();

    addNotification(`<strong>Nurse:</strong> Now serving <strong>${next.ticket}</strong> (${next.name}).`);
    alert("Now serving " + next.ticket + " (" + next.name + ")");
});


// ======================================
// 12. SKIP STUDENT
// ======================================

document.getElementById("skipStudent").addEventListener("click", () => {
    const student = queue[selectedIndex];

    if (!student || student.status !== "Serving") {
        alert("Please select the currently serving student to skip.");
        return;
    }

    student.status = "Skipped";

    const next = queue.find(
        item => item.status === "Waiting" && item.type === currentFilter
    ) || queue.find(
        item => item.status === "Waiting"
    );

    if (next) {
        next.status = "Serving";
        next.serviceTime = getCurrentTime();
        selectedIndex = queue.indexOf(next);
    } else {
        selectedIndex = -1;
    }

    updateTabs();
    saveQueue();
    displayStudents();
    displayDetails();
});


// ======================================
// 13. TRANSFER STUDENT
// ======================================

document.getElementById("transferStudent").addEventListener("click", () => {
    const student = queue[selectedIndex];

    if (!student || student.status !== "Serving") {
        alert("Please select the currently serving student to transfer.");
        return;
    }

    const destination = prompt(
        "Enter destination office (Registrar Office or MIS Office):",
        "Registrar"
    );

    if (!destination) return;

    student.status = "Transferred";
    student.destination = destination;

    const next = queue.find(
        item => item.status === "Waiting" && item.type === currentFilter
    ) || queue.find(
        item => item.status === "Waiting"
    );

    if (next) {
        next.status = "Serving";
        next.serviceTime = getCurrentTime();
        selectedIndex = queue.indexOf(next);
    } else {
        selectedIndex = -1;
    }

    updateTabs();
    saveQueue();
    displayStudents();
    displayDetails();

    addNotification(`<strong>Nurse:</strong> Transferred ${student.ticket} to ${destination}.`);
    alert("Student transferred to " + destination);
});


// ======================================
// 14. COMPLETE SCREENING
// ======================================

document.getElementById("completeScreening").addEventListener("click", () => {
    const student = queue[selectedIndex];

    if (!student || student.status !== "Serving") {
        alert("There is no active serving student to complete.");
        return;
    }

    const allComplete = Array.from(
        requirementsContainer.querySelectorAll("input")
    ).every(input => input.checked);

    if (!allComplete) {
        alert("Please check all medical requirements before completing screening.");
        return;
    }

    if (screeningStatus.value !== "Requirements Complete") {
        alert("Please change the status to 'Requirements Complete' first.");
        screeningStatus.value = "Requirements Complete";
    }

    student.requirements = Array.from(
        requirementsContainer.querySelectorAll("input")
    ).map(input => input.checked);

    student.screeningStatus = screeningStatus.value;
    student.notes = studentNotes.value;
    student.status = "Completed";

    const next = queue.find(
        item => item.status === "Waiting" && item.type === currentFilter
    ) || queue.find(
        item => item.status === "Waiting"
    );

    if (next) {
        next.status = "Serving";
        next.serviceTime = getCurrentTime();
        selectedIndex = queue.indexOf(next);
    } else {
        selectedIndex = -1;
    }

    updateTabs();
    saveQueue();
    displayStudents();
    displayDetails();

    addNotification(`<strong>Nurse:</strong> Screening completed for ${student.ticket} (${student.name}).`);
    alert("Medical screening completed successfully.");
});


// ======================================
// 15. UPDATE ACTIVE TAB
// ======================================

function updateTabs() {
    document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.toggle(
            "active",
            tab.dataset.filter === currentFilter
        );
    });
}


// ======================================
// 16. AUTOMATIC DATE AND TIME (LIVE CLOCK - SECONDS/MINUTES/DAYS)
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
// 17. CLICKABLE NOTIFICATION PANEL & ITEMS
// ======================================

if (notificationBtn && notificationPanel) {
    notificationBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        notificationPanel.hidden = !notificationPanel.hidden;
        if (profilePanel) profilePanel.hidden = true;
    });
}

// Click individual notification item to mark as read
if (notificationList) {
    notificationList.addEventListener("click", (event) => {
        const item = event.target.closest(".notif-item");
        if (item) {
            item.classList.remove("unread");
            checkUnreadNotifications();
        }
    });
}

// Mark all notifications as read button
if (clearNotifBtn) {
    clearNotifBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        document.querySelectorAll(".notif-item.unread").forEach((item) => {
            item.classList.remove("unread");
        });
        checkUnreadNotifications();
    });
}

function checkUnreadNotifications() {
    const unreadCount = document.querySelectorAll(".notif-item.unread").length;
    if (notificationDot) {
        if (unreadCount === 0) {
            notificationDot.classList.add("hidden");
        } else {
            notificationDot.classList.remove("hidden");
        }
    }
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
    checkUnreadNotifications();
}


// ======================================
// 18. ADMIN PROFILE BUTTON & LOGOUT
// ======================================

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

function logout() {
    const confirmLogout = confirm("Are you sure you want to logout?");
    if (confirmLogout) {
        alert("You have selected Logout.");
    }
}

const profileLogout = document.getElementById("profileLogout");
if (profileLogout) {
    profileLogout.addEventListener("click", logout);
}

const sidebarLogout = document.getElementById("sidebarLogout");
if (sidebarLogout) {
    sidebarLogout.addEventListener("click", (event) => {
        event.preventDefault();
        logout();
    });
}


// ======================================
// 19. SYNC BETWEEN PAGES & INITIALIZE
// ======================================

window.addEventListener("storage", event => {
    if (event.key === "nurseQueue") {
        queue = loadQueue();
        selectedIndex = queue.findIndex(
            student => student.status === "Serving"
        );
        if (selectedIndex === -1) selectedIndex = 0;
        displayStudents();
        displayDetails();
    }
});

displayStudents();
displayDetails();

// INITIALIZE LUCIDE ICONS
lucide.createIcons();