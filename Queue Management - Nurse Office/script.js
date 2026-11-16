/* =========================================
   1. LOAD SHARED QUEUE
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

    return [];
}

let queue = loadQueue();

let selectedIndex = queue.findIndex(
    student => student.status === "Serving"
);

/* =========================================
   2. SELECT HTML ELEMENTS
========================================= */

const queueTable = document.getElementById("queueTable");

const nowServing = document.getElementById("nowServing");
const waitingCount = document.getElementById("waitingCount");

const currentTicket = document.getElementById("currentTicket");
const currentName = document.getElementById("currentName");
const currentType = document.getElementById("currentType");
const serviceTime = document.getElementById("serviceTime");

/* =========================================
   3. SAVE QUEUE
========================================= */

function saveQueue() {
    localStorage.setItem("nurseQueue", JSON.stringify(queue));
}

/* =========================================
   4. GET CURRENT TIME
========================================= */

function getCurrentTime() {
    return new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

/* =========================================
   5. DISPLAY QUEUE TABLE
========================================= */

function displayQueue() {
    queueTable.innerHTML = "";

    let rowNumber = 0;

    queue.forEach((student, index) => {

        if (
            student.status === "Completed" ||
            student.status === "Transferred"
        ) {
            return;
        }

        rowNumber++;

        const row = document.createElement("div");
        row.className = "queue-row";

        if (index === selectedIndex) {
            row.classList.add("selected");
        }

        let statusClass = "status-waiting";

        if (student.status === "Serving") {
            statusClass = "status-serving";
        } else if (student.status === "Skipped") {
            statusClass = "status-skipped";
        }

        row.innerHTML = `
            <span>${rowNumber}</span>

            <span class="ticket">${student.ticket}</span>

            <span>${student.type}</span>

            <span class="time-issued">${student.time}</span>

            <span class="queue-status ${statusClass}">
                ${student.status}
            </span>
        `;

        row.addEventListener("click", () => {
            if (student.status === "Serving") {
                selectedIndex = index;
                displayQueue();
                displayCurrentStudent();
            }
        });

        queueTable.appendChild(row);
    });

    updateCounters();
}

/* =========================================
   6. DISPLAY CURRENT STUDENT
========================================= */

function displayCurrentStudent() {
    const student = queue.find(
        item => item.status === "Serving"
    );

    if (!student) {
        selectedIndex = -1;

        currentTicket.textContent = "None";
        currentName.textContent = "No student currently serving";
        currentType.textContent = "";
        serviceTime.textContent = "--:--";

        return;
    }

    selectedIndex = queue.indexOf(student);

    currentTicket.textContent = student.ticket;
    currentName.textContent = student.name;

    currentType.textContent =
        student.type === "Old Student"
            ? "Old Student / Continuing Student"
            : student.type + " / New Student";

    serviceTime.textContent =
        student.serviceTime || "--:--";
}

/* =========================================
   7. UPDATE COUNTERS
========================================= */

function updateCounters() {
    const serving = queue.find(
        student => student.status === "Serving"
    );

    const waiting = queue.filter(
        student => student.status === "Waiting"
    ).length;

    nowServing.textContent =
        serving ? serving.ticket : "None";

    waitingCount.textContent = waiting;
}

/* =========================================
   8. CALL NEXT STUDENT
========================================= */

document.getElementById("callNext").addEventListener("click", () => {

    const current = queue.find(
        student => student.status === "Serving"
    );

    if (current) {
        current.status = "Completed";
    }

    const next = queue.find(
        student => student.status === "Waiting"
    );

    if (!next) {
        selectedIndex = -1;

        saveQueue();
        displayQueue();
        displayCurrentStudent();

        alert("There are no more waiting students.");
        return;
    }

    next.status = "Serving";
    next.serviceTime = getCurrentTime();

    selectedIndex = queue.indexOf(next);

    saveQueue();
    displayQueue();
    displayCurrentStudent();

    alert("Now serving " + next.ticket);
});

/* =========================================
   9. COMPLETE STUDENT
========================================= */

document.getElementById("completeStudent").addEventListener("click", () => {

    const student = queue.find(
        item => item.status === "Serving"
    );

    if (!student) {
        alert("There is no active student to complete.");
        return;
    }

    student.status = "Completed";

    const next = queue.find(
        item => item.status === "Waiting"
    );

    if (next) {
        next.status = "Serving";
        next.serviceTime = getCurrentTime();
    }

    saveQueue();
    displayQueue();
    displayCurrentStudent();

    alert(student.name + " has been completed.");
});

/* =========================================
   10. SKIP STUDENT
========================================= */

document.getElementById("skipStudent").addEventListener("click", () => {

    const student = queue.find(
        item => item.status === "Serving"
    );

    if (!student) {
        alert("There is no active student to skip.");
        return;
    }

    student.status = "Skipped";

    const next = queue.find(
        item => item.status === "Waiting"
    );

    if (next) {
        next.status = "Serving";
        next.serviceTime = getCurrentTime();
    }

    saveQueue();
    displayQueue();
    displayCurrentStudent();

    alert(student.ticket + " has been skipped.");
});

/* =========================================
   11. RECALL SKIPPED STUDENT
========================================= */

document.getElementById("recallStudent").addEventListener("click", () => {

    const current = queue.find(
        student => student.status === "Serving"
    );

    const skipped = queue.find(
        student => student.status === "Skipped"
    );

    if (!skipped) {
        alert("There are no skipped students to recall.");
        return;
    }

    if (current) {
        current.status = "Waiting";
    }

    skipped.status = "Serving";
    skipped.serviceTime = getCurrentTime();

    saveQueue();
    displayQueue();
    displayCurrentStudent();

    alert(
        "Recalling " + skipped.ticket +
        " - " + skipped.name
    );
});

/* =========================================
   12. OFFICE SELECTOR
========================================= */

document.getElementById("officeSelect").addEventListener("change", function() {

    const selectedOffice = this.value;

    if (selectedOffice === "Nurse Office") {
        window.location.href = "queue-management.html";
    }

    else if (selectedOffice === "Registrar Office") {
        alert("Registrar Office page is not yet connected.");
        this.value = "Nurse Office";
    }

    else if (selectedOffice === "MIS Office") {
        alert("MIS Office page is not yet connected.");
        this.value = "Nurse Office";
    }
});

/* =========================================
   13. DATE AND TIME
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
   14. SYNC WITH NURSE CONSOLE
========================================= */

window.addEventListener("storage", event => {

    if (event.key === "nurseQueue") {
        queue = loadQueue();

        displayQueue();
        displayCurrentStudent();
    }

});

/* =========================================
   15. INITIAL DISPLAY
========================================= */

displayQueue();
displayCurrentStudent();

lucide.createIcons();