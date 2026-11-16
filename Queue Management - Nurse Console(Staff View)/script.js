/* =========================================
   1. INITIAL QUEUE DATA
========================================= */

const defaultQueue = [
    {
        name: "John Mar Cavalida",
        ticket: "N-001",
        type: "Freshman",
        time: "09:30 AM",
        status: "Serving",
        serviceTime: "09:35 AM",
        requirements: [true, true, true, true],
        screeningStatus: "Documents Under Review",
        notes: "Review all submitted medical documents before completing the screening."
    },
    {
        name: "Jea Mea Pielago",
        ticket: "N-002",
        type: "Freshman",
        time: "09:34 AM",
        status: "Waiting",
        serviceTime: "",
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

/* =========================================
   2. LOAD AND SAVE QUEUE
========================================= */

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

let currentFilter = "Freshman";

/* =========================================
   3. HTML ELEMENTS
========================================= */

const studentList = document.getElementById("studentList");
const nowServing = document.getElementById("nowServing");
const waitingCount = document.getElementById("waitingCount");

const detailName = document.getElementById("detailName");
const detailTicket = document.getElementById("detailTicket");
const detailType = document.getElementById("detailType");

const requirements = document.getElementById("requirements");
const screeningStatus = document.getElementById("screeningStatus");
const studentNotes = document.getElementById("studentNotes");

/* =========================================
   4. SAVE QUEUE
========================================= */

function saveQueue() {
    localStorage.setItem("nurseQueue", JSON.stringify(queue));
}

/* =========================================
   5. CURRENT TIME
========================================= */

function getCurrentTime() {
    return new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

/* =========================================
   6. UPDATE COUNTERS
========================================= */

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

/* =========================================
   7. DISPLAY STUDENTS
========================================= */

function displayStudents() {
    studentList.innerHTML = "";

    queue.forEach((student, index) => {
        if (
            student.type !== currentFilter ||
            student.status === "Completed" ||
            student.status === "Transferred"
        ) {
            return;
        }

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
        }

        row.innerHTML = `
            <div class="student-name">
                <span>${student.name}</span>
                <small>${student.ticket}</small>
            </div>

            <span>${student.type}</span>

            <span class="student-status ${statusClass}">
                ${student.status}
            </span>
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

/* =========================================
   8. DISPLAY STUDENT DETAILS
========================================= */

function displayDetails() {
    const student = queue[selectedIndex];

    if (!student) {
        detailName.textContent = "No student selected";
        detailTicket.textContent = "";
        detailType.textContent = "";

        requirements.querySelectorAll("input").forEach(input => {
            input.checked = false;
        });

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

    const checkboxes = requirements.querySelectorAll("input");

    checkboxes.forEach((checkbox, index) => {
        checkbox.checked = student.requirements[index] || false;
    });
}

/* =========================================
   9. SELECT STUDENT TABS
========================================= */

document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach(item => {
            item.classList.remove("active");
        });

        tab.classList.add("active");

        currentFilter = tab.dataset.filter;

        displayStudents();
    });
});

/* =========================================
   10. SAVE STUDENT DETAILS
========================================= */

document.getElementById("saveStudent").addEventListener("click", () => {
    const student = queue[selectedIndex];

    if (!student) {
        alert("Please select a student first.");
        return;
    }

    student.requirements = Array.from(
        requirements.querySelectorAll("input")
    ).map(input => input.checked);

    student.screeningStatus = screeningStatus.value;
    student.notes = studentNotes.value;

    saveQueue();

    alert("Student details saved successfully.");
});

/* =========================================
   11. CALL NEXT STUDENT
========================================= */

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

    alert("Now serving " + next.ticket);
});

/* =========================================
   12. SKIP STUDENT
========================================= */

document.getElementById("skipStudent").addEventListener("click", () => {
    const student = queue[selectedIndex];

    if (!student || student.status !== "Serving") {
        alert("Please select the currently serving student.");
        return;
    }

    student.status = "Skipped";

    const next = queue.find(
        item => item.status === "Waiting"
    );

    if (next) {
        next.status = "Serving";
        next.serviceTime = getCurrentTime();
        selectedIndex = queue.indexOf(next);
        currentFilter = next.type;
    } else {
        selectedIndex = -1;
    }

    updateTabs();
    saveQueue();
    displayStudents();
    displayDetails();
});

/* =========================================
   13. TRANSFER STUDENT
========================================= */

document.getElementById("transferStudent").addEventListener("click", () => {
    const student = queue[selectedIndex];

    if (!student || student.status !== "Serving") {
        alert("Please select the currently serving student.");
        return;
    }

    const destination = prompt(
        "Enter destination office (Registrar Office or MIS Office):"
    );

    if (!destination) return;

    student.status = "Transferred";
    student.destination = destination;

    const next = queue.find(
        item => item.status === "Waiting"
    );

    if (next) {
        next.status = "Serving";
        next.serviceTime = getCurrentTime();
        selectedIndex = queue.indexOf(next);
        currentFilter = next.type;
    } else {
        selectedIndex = -1;
    }

    updateTabs();
    saveQueue();
    displayStudents();
    displayDetails();

    alert("Student transferred to " + destination);
});

/* =========================================
   14. COMPLETE SCREENING
========================================= */

document.getElementById("completeScreening").addEventListener("click", () => {
    const student = queue[selectedIndex];

    if (!student || student.status !== "Serving") {
        alert("There is no active student to complete.");
        return;
    }

    const allComplete = Array.from(
        requirements.querySelectorAll("input")
    ).every(input => input.checked);

    if (!allComplete) {
        alert("Please check all medical requirements before completing screening.");
        return;
    }

    student.requirements = Array.from(
        requirements.querySelectorAll("input")
    ).map(input => input.checked);

    student.screeningStatus = screeningStatus.value;
    student.notes = studentNotes.value;

    if (screeningStatus.value !== "Requirements Complete") {
        alert("Please change the status to Requirements Complete first.");
        return;
    }

    student.status = "Completed";

    const next = queue.find(
        item => item.status === "Waiting"
    );

    if (next) {
        next.status = "Serving";
        next.serviceTime = getCurrentTime();
        selectedIndex = queue.indexOf(next);
        currentFilter = next.type;
    } else {
        selectedIndex = -1;
    }

    updateTabs();
    saveQueue();
    displayStudents();
    displayDetails();

    alert("Medical screening completed successfully.");
});

/* =========================================
   15. UPDATE ACTIVE TAB
========================================= */

function updateTabs() {
    document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.toggle(
            "active",
            tab.dataset.filter === currentFilter
        );
    });
}

/* =========================================
   16. DATE AND TIME
========================================= */

function updateDateTime() {
    const now = new Date();

    document.getElementById("dateTime").textContent =
        now.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric"
        }) + " · " +
        now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit"
        });
}

updateDateTime();

/* =========================================
   17. SYNC BETWEEN PAGES
========================================= */

window.addEventListener("storage", event => {
    if (event.key === "nurseQueue") {
        queue = loadQueue();

        selectedIndex = queue.findIndex(
            student => student.status === "Serving"
        );

        displayStudents();
        displayDetails();
    }
});

/* =========================================
   18. INITIAL DISPLAY
========================================= */

displayStudents();
displayDetails();

lucide.createIcons();