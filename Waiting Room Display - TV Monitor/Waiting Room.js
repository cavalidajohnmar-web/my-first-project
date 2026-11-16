// ======================================
// 1. LIVE CLOCK (Month Day, Year · Time AM/PM)
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
// 2. TEXT-TO-SPEECH VOICE ANNOUNCEMENT
// ======================================

let lastAnnouncedNurseTicket = "";

function speakTicketAnnouncement(ticket, officeName) {
    if ('speechSynthesis' in window) {
        // I-cancel ang bisan unsa nga nag-sulti pa para dili mag-patong-patong
        window.speechSynthesis.cancel();

        const message = `Now serving ticket ${ticket} at ${officeName} office. Please proceed to the counter.`;
        const utterance = new SpeechSynthesisUtterance(message);
        
        utterance.rate = 0.9; // Hinay-hinay og sulti para klaro
        utterance.pitch = 1.0;
        utterance.volume = 1.0; // Puno ang volume

        window.speechSynthesis.speak(utterance);
    }
}


// ======================================
// 3. SYNC QUEUE DATA FROM LOCALSTORAGE
// ======================================

function updateWaitingRoomDisplay() {
    const savedQueue = localStorage.getItem("nurseQueue");

    if (savedQueue) {
        try {
            const queue = JSON.parse(savedQueue);

            // Hanapin ang currently serving student para sa Nurse Office
            const servingNurse = queue.find(s => s.status === "Serving");
            if (servingNurse) {
                const currentTicketOnScreen = servingNurse.ticket;
                document.getElementById("nurseServing").textContent = currentTicketOnScreen;

                // Kon naay bag-ong ticket nga gitawag, mo-tingog dayon ang speaker
                if (lastAnnouncedNurseTicket !== currentTicketOnScreen) {
                    lastAnnouncedNurseTicket = currentTicketOnScreen;
                    speakTicketAnnouncement(currentTicketOnScreen, "Nurse");
                }
            }

            // Hanapin ang next waiting student para sa Nurse Office
            const waitingNurseList = queue.filter(s => s.status === "Waiting");
            if (waitingNurseList.length > 0) {
                document.getElementById("nurseNext").textContent = waitingNurseList.items ? waitingNurseList[0].ticket : waitingNurseList[0].ticket;
            } else {
                document.getElementById("nurseNext").textContent = "None";
            }

            document.getElementById("nurseWaiting").textContent = `${waitingNurseList.length} waiting`;

        } catch (e) {
            console.error("Error reading queue data:", e);
        }
    }
}

// Paminaw sa pagbag-o sa localStorage kung mo-update ang Nurse Office/Console
window.addEventListener("storage", (event) => {
    if (event.key === "nurseQueue") {
        updateWaitingRoomDisplay();
    }
});

// Regular check kada segundo para laging updated
setInterval(updateWaitingRoomDisplay, 1000);

// Initial call
updateWaitingRoomDisplay();

// Initialize Lucide Icons
lucide.createIcons();