// ======================================
// 1. SELECT HTML ELEMENTS
// ======================================

const tabs = document.querySelectorAll(".tab");
const officeSelect = document.getElementById("office");
const courseSelect = document.getElementById("courseProgram");
const form = document.getElementById("ticketForm");
const modal = document.getElementById("ticketModal");

const notificationBtn = document.getElementById("notificationBtn");
const notificationPanel = document.getElementById("notificationPanel");
const notificationDot = document.getElementById("notificationDot");
const clearNotifBtn = document.getElementById("clearNotifBtn");
const notificationList = document.getElementById("notificationList");

const profileBtn = document.getElementById("profileBtn");
const profilePanel = document.getElementById("profilePanel");


// ======================================
// 2. INITIAL VARIABLES
// ======================================

let studentType = "Freshman";


// Ticket counters for each office

const queueCounters = {
    Nurse: 1,
    Registrar: 1,
    MIS: 1
};


// Ticket prefixes

const officePrefixes = {
    Nurse: "N",
    Registrar: "R",
    MIS: "M"
};


// Office information

const officeInfo = {

    Nurse: {
        description: "Medical screening & clearance",
        serving: "N-001",
        wait: "~ 15 minutes"
    },

    Registrar: {
        description: "Enrollment records & assessment",
        serving: "R-003",
        wait: "~ 20 minutes"
    },

    MIS: {
        description: "Student information & technical support",
        serving: "M-002",
        wait: "~ 10 minutes"
    }

};


// ======================================
// 3. STUDENT TYPE SELECTION
// ======================================

tabs.forEach((tab) => {

    tab.addEventListener("click", () => {

        // Remove active class

        tabs.forEach((item) => {
            item.classList.remove("active");
        });


        // Activate selected tab

        tab.classList.add("active");


        // Save student type

        studentType = tab.dataset.type;

    });

});


// ======================================
// 4. UPDATE OFFICE INFORMATION
// ======================================

function updateOfficeCard() {

    const office = officeSelect.value;

    const info = officeInfo[office];

    if (!info) return;


    // Update office name

    document.getElementById("officeTitle").textContent =
        office;


    // Update office description

    document.getElementById("officeDescription").textContent =
        info.description;


    // Update now serving

    document.getElementById("nowServing").textContent =
        info.serving;


    // Update estimated waiting time

    document.getElementById("waitTime").textContent =
        info.wait;

}


// Detect office selection changes

officeSelect.addEventListener("change", updateOfficeCard);


// ======================================
// 5. ISSUE NEW TICKET
// ======================================

form.addEventListener("submit", (event) => {

    // Prevent page refresh

    event.preventDefault();


    // Get selected office

    const office = officeSelect.value;


    // Get student name

    const name =
        document.getElementById("studentName").value.trim()
        || "Student";


    // Get course program

    const course = courseSelect.value;


    // Get office prefix

    const prefix = officePrefixes[office];

    if (!prefix) return;


    // Generate ticket number

    const ticketNumber =
        `${prefix}-${String(queueCounters[office]).padStart(3, "0")}`;


    // Increase ticket counter

    queueCounters[office] = queueCounters[office] + 1;


    // Display generated ticket number

    document.getElementById("generatedTicket").textContent =
        ticketNumber;


    // Display student name

    document.getElementById("ticketStudent").textContent =
        name;


    // Display course program

    document.getElementById("ticketCourse").textContent =
        course;


    // Display student type

    document.getElementById("ticketType").textContent =
        studentType;


    // Display selected office

    document.getElementById("ticketOffice").textContent =
        office;


    // ==================================
    // DISPLAY SELECTED REQUIREMENTS
    // ==================================

    const selectedRequirements =
        document.querySelectorAll(
            'input[name="requirements"]:checked'
        );

    const requirementList =
        document.getElementById("ticketRequirements");


    // Clear previous requirements

    requirementList.innerHTML = "";


    // Check if requirements were selected

    if (selectedRequirements.length === 0) {

        const li = document.createElement("li");

        li.textContent = "No requirements selected";

        requirementList.appendChild(li);

    } else {

        selectedRequirements.forEach((item) => {

            const li = document.createElement("li");

            li.textContent = item.value;

            requirementList.appendChild(li);

        });

    }


    // Add dynamic notification for newly issued ticket

    addNotification(`<strong>${office}:</strong> New ticket <strong>${ticketNumber}</strong> issued for ${name} (${course}).`);


    // Show ticket confirmation

    modal.classList.add("show");

    modal.setAttribute("aria-hidden", "false");

});


// ======================================
// 6. CLOSE TICKET POPUP
// ======================================

function closeTicketModal() {

    modal.classList.remove("show");

    modal.setAttribute("aria-hidden", "true");

}


// Close using X button

document.getElementById("closeModal")
    .addEventListener("click", closeTicketModal);


// Close using Done button

document.getElementById("doneButton")
    .addEventListener("click", closeTicketModal);


// Close by clicking outside popup

modal.addEventListener("click", (event) => {

    if (event.target === modal) {

        closeTicketModal();

    }

});


// Close popup using Escape key

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        closeTicketModal();

    }

});


// ======================================
// 7. CANCEL / RESET FORM
// ======================================

form.addEventListener("reset", () => {

    window.setTimeout(() => {

        // Reset student type

        studentType = "Freshman";


        // Return active tab to Freshman

        tabs.forEach((tab) => {

            tab.classList.toggle(
                "active",
                tab.dataset.type === "Freshman"
            );

        });


        // Reset office to Nurse

        officeSelect.value = "Nurse";


        // Reset course to BSIT

        courseSelect.value = "BSIT";


        // Uncheck medical requirements

        document.querySelectorAll(
            'input[name="requirements"]'
        ).forEach((checkbox) => {

            checkbox.checked = false;

        });


        // Update office information

        updateOfficeCard();

    }, 0);

});


// ======================================
// 8. AUTOMATIC DATE AND TIME (LIVE CLOCK - SECONDS/MINUTES/DAYS)
// ======================================

function updateDateTime() {

    const now = new Date();

    // Format date (Day and Date)
    const date = now.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"

    });


    // Format time with seconds for automatic counting

    const time = now.toLocaleTimeString("en-US", {

        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true

    });

    // Display date and time

    const dateTimeEl = document.getElementById("dateTime");

    if (dateTimeEl) {

        dateTimeEl.textContent = `${date} · ${time}`;

    }

}


// Update time every second

updateDateTime();

setInterval(updateDateTime, 1000);


// ======================================
// 9. INITIALIZE OFFICE INFORMATION
// ======================================

updateOfficeCard();


// ======================================
// 10. CLICKABLE NOTIFICATION PANEL & ITEMS
// ======================================

notificationBtn.addEventListener("click", (event) => {

    event.stopPropagation();

    notificationPanel.hidden = !notificationPanel.hidden;

    profilePanel.hidden = true;

});


// Clickable individual notification item marks as read

notificationList.addEventListener("click", (event) => {

    const item = event.target.closest(".notif-item");

    if (item) {

        item.classList.remove("unread");

        checkUnreadNotifications();

    }

});


// Clear / mark all read button

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
// 11. ADMIN PROFILE BUTTON
// ======================================

profileBtn.addEventListener("click", (event) => {

    event.stopPropagation();

    profilePanel.hidden = !profilePanel.hidden;

    notificationPanel.hidden = true;

});


// ======================================
// 12. CLOSE HEADER MENUS
// ======================================

document.addEventListener("click", (event) => {

    if (!event.target.closest(".header-menu")) {

        notificationPanel.hidden = true;

        profilePanel.hidden = true;

    }

});


// ======================================
// 13. LOGOUT FUNCTION
// ======================================

function logout() {

    const confirmLogout = confirm(
        "Are you sure you want to logout?"
    );

    if (confirmLogout) {

        alert("You have selected Logout.");

    }

}


// Profile logout

document.getElementById("profileLogout")
    .addEventListener("click", logout);


// Sidebar logout

document.getElementById("sidebarLogout")
    .addEventListener("click", (event) => {

        event.preventDefault();

        logout();

    });


// ======================================
// 14. SIDEBAR MENU INTERACTIONS
// ======================================

const sidebarLinks =
    document.querySelectorAll(".sidebar .nav-link");

sidebarLinks.forEach((link) => {

    link.addEventListener("click", (event) => {

        const href = link.getAttribute("href");

        if (href && href !== "#") {

            return; // Allow normal navigation if page link exists

        }

        event.preventDefault();


        // Remove previous active state

        sidebarLinks.forEach((item) => {

            item.classList.remove("active");

        });


        // Highlight clicked menu

        link.classList.add("active");


        // Other pages warning

        const menuName = link.textContent.trim();

        if (menuName !== "Issue Ticket" &&
            menuName !== "Logout") {

            alert(
                menuName + " page is not connected yet."
            );

        }

    });

});


// ======================================
// 15. MEDICAL REQUIREMENTS
// ======================================

const requirementCheckboxes =
    document.querySelectorAll(
        'input[name="requirements"]'
    );

requirementCheckboxes.forEach((checkbox) => {

    checkbox.addEventListener("change", () => {

        console.log(
            checkbox.value,
            checkbox.checked
        );

    });

});


// INITIALIZE LUCIDE ICONS
lucide.createIcons();
