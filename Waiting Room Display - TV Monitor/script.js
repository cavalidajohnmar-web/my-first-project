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
// 2. SYNC QUEUE DATA FROM LOCALSTORAGE
// ======================================

function updateWaitingRoomDisplay() {
    const savedQueue = localStorage.getItem("nurseQueue");

    if (savedQueue) {
        try {
            const queue = JSON.parse(savedQueue);

            // Find currently serving student for Nurse Office
            const servingNurse = queue.find(s => s.status === "Serving");
            if (servingNurse) {
                document.getElementById("nurseServing").textContent = servingNurse.ticket;
            }

            // Find next waiting student for Nurse Office
            const waitingNurseList = queue.filter(s => s.status === "Waiting");
            if (waitingNurseList.length > 0) {
                document.getElementById("nurseNext").textContent = waitingNurseList[0].ticket;
            } else {
                document.getElementById("nurseNext").textContent = "None";
            }

            document.getElementById("nurseWaiting").textContent = `${waitingNurseList.length} waiting`;

        } catch (e) {
            console.error("Error reading queue data:", e);
        }
    }
}

// Listen for storage changes if other pages update the queue
window.addEventListener("storage", (event) => {
    if (event.key === "nurseQueue") {
        updateWaitingRoomDisplay();
    }
});

// Periodic check to keep display updated
setInterval(updateWaitingRoomDisplay, 1000);

// Initial call
updateWaitingRoomDisplay();

// Initialize Lucide Icons
lucide.createIcons();