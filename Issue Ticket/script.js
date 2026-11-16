// ==========================================
// GET HTML ELEMENTS
// ==========================================

const ticketForm = document.getElementById("ticketForm");

const studentTabs = document.querySelectorAll(".student-tab");

const studentTypeInput = document.getElementById("studentType");

const studentNameInput = document.getElementById("studentName");

const officeSelect = document.getElementById("office");

const formMessage = document.getElementById("formMessage");

const cancelButton = document.getElementById("cancelButton");


// OFFICE INFORMATION ELEMENTS

const officeName = document.getElementById("officeName");

const officeDescription = document.getElementById("officeDescription");

const officeStatus = document.getElementById("officeStatus");

const nowServing = document.getElementById("nowServing");

const estimatedWait = document.getElementById("estimatedWait");


// MODAL ELEMENTS

const ticketModal = document.getElementById("ticketModal");

const closeModal = document.getElementById("closeModal");

const doneButton = document.getElementById("doneButton");

const generatedTicketNumber = document.getElementById("generatedTicketNumber");

const generatedOffice = document.getElementById("generatedOffice");

const generatedStudent = document.getElementById("generatedStudent");

const generatedType = document.getElementById("generatedType");

const generatedDate = document.getElementById("generatedDate");


// ==========================================
// OFFICE DATA
// ==========================================

const officeData = {

    Nurse: {
        prefix: "N",
        description: "Medical screening & clearance",
        nowServing: "N-001",
        wait: "~ 15 minutes",
        status: "Accepting students"
    },

    Registrar: {
        prefix: "R",
        description: "Student registration & enrollment",
        nowServing: "R-003",
        wait: "~ 20 minutes",
        status: "Accepting students"
    },

    MIS: {
        prefix: "M",
        description: "Information technology services",
        nowServing: "M-002",
        wait: "~ 10 minutes",
        status: "Accepting students"
    }

};


// ==========================================
// UPDATE DATE AND TIME
// ==========================================

function updateDateTime() {

    const dateTimeElement = document.getElementById("dateTime");

    const now = new Date();

    const date = now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });

    const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
    });

    dateTimeElement.textContent = date + " · " + time;

}

updateDateTime();


// ==========================================
// STUDENT TYPE SELECTION
// ==========================================

studentTabs.forEach(function(tab) {

    tab.addEventListener("click", function() {

        // REMOVE ACTIVE CLASS FROM ALL TABS
        studentTabs.forEach(function(item) {
            item.classList.remove("active");
        });

        // ACTIVATE SELECTED TAB
        tab.classList.add("active");

        // SAVE STUDENT TYPE
        studentTypeInput.value = tab.dataset.type;

    });

});


// ==========================================
// UPDATE OFFICE INFORMATION
// ==========================================

function updateOfficeInformation() {

    const selectedOffice = officeSelect.value;

    const office = officeData[selectedOffice];

    if (!office) {
        return;
    }

    officeName.textContent = selectedOffice;

    officeDescription.textContent = office.description;

    officeStatus.textContent = office.status;

    nowServing.textContent = office.nowServing;

    estimatedWait.textContent = office.wait;

}


// RUN WHEN OFFICE IS CHANGED

officeSelect.addEventListener("change", function() {

    updateOfficeInformation();

});


// INITIAL OFFICE INFORMATION

updateOfficeInformation();


// ==========================================
// GENERATE QUEUE NUMBER
// ==========================================

function generateTicketNumber(office) {

    const prefix = officeData[office].prefix;

    const storageKey = "qbsems_" + prefix + "_counter";

    // GET PREVIOUS NUMBER FROM LOCAL STORAGE
    let counter = Number(localStorage.getItem(storageKey)) || 0;

    // INCREASE NUMBER
    counter = counter + 1;

    // SAVE NEW NUMBER
    localStorage.setItem(storageKey, counter);

    // FORMAT NUMBER: N-001, R-001, M-001
    const formattedNumber = String(counter).padStart(3, "0");

    return prefix + "-" + formattedNumber;

}


// ==========================================
// ISSUE TICKET FORM
// ==========================================

ticketForm.addEventListener("submit", function(event) {

    // PREVENT PAGE RELOAD
    event.preventDefault();

    // GET FORM VALUES
    const studentName = studentNameInput.value.trim();

    const studentType = studentTypeInput.value;

    const selectedOffice = officeSelect.value;

    // CHECK OFFICE
    if (!officeData[selectedOffice]) {

        showMessage("Please select a valid office.", "error");

        return;

    }

    // GET SELECTED REQUIREMENTS
    const selectedRequirements = document.querySelectorAll(
        'input[name="requirements"]:checked'
    );

    // GENERATE TICKET NUMBER
    const ticketNumber = generateTicketNumber(selectedOffice);

    // GET CURRENT DATE
    const currentDate = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });

    // DISPLAY GENERATED TICKET INFORMATION
    generatedTicketNumber.textContent = ticketNumber;

    generatedOffice.textContent = selectedOffice + " Office";

    generatedStudent.textContent = studentName || "Not provided";

    generatedType.textContent = studentType;

    generatedDate.textContent = currentDate;

    // SHOW SUCCESS MESSAGE
    showMessage("Ticket generated successfully!", "success");

    // SHOW CONFIRMATION MODAL
    ticketModal.classList.add("show");

    // DISPLAY INFORMATION IN CONSOLE FOR DEMONSTRATION
    console.log("===== NEW TICKET =====");

    console.log("Ticket Number:", ticketNumber);

    console.log("Student Name:", studentName || "Not provided");

    console.log("Student Type:", studentType);

    console.log("Office:", selectedOffice);

    console.log(
        "Requirements:",
        Array.from(selectedRequirements).map(function(item) {
            return item.value;
        })
    );

});


// ==========================================
// DISPLAY FORM MESSAGE
// ==========================================

function showMessage(message, type) {

    formMessage.textContent = message;

    formMessage.className = "form-message " + type;

}


// ==========================================
// CLOSE TICKET MODAL
// ==========================================

function closeTicketModal() {

    ticketModal.classList.remove("show");

}

closeModal.addEventListener("click", closeTicketModal);

doneButton.addEventListener("click", function() {

    closeTicketModal();

    resetTicketForm();

});


// CLOSE MODAL WHEN CLICKING OUTSIDE
ticketModal.addEventListener("click", function(event) {

    if (event.target === ticketModal) {

        closeTicketModal();

    }

});


// ==========================================
// RESET FORM
// ==========================================

function resetTicketForm() {

    // RESET FORM INPUTS
    ticketForm.reset();

    // RETURN TO FRESHMAN TAB
    studentTabs.forEach(function(tab) {

        tab.classList.remove("active");

        if (tab.dataset.type === "Freshman") {
            tab.classList.add("active");
        }

    });

    studentTypeInput.value = "Freshman";

    // CLEAR MESSAGE
    formMessage.textContent = "";

    formMessage.className = "form-message";

    // UPDATE DEFAULT OFFICE INFORMATION
    updateOfficeInformation();

}


// ==========================================
// CANCEL BUTTON
// ==========================================

cancelButton.addEventListener("click", function() {

    resetTicketForm();

});