document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("recordsContainer");
    const totalPatients = document.getElementById("totalPatients");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const resetBtn = document.getElementById("resetBtn");

    function loadRecords(recordsToLoad = null) {
        container.innerHTML = ""; 

        let records = recordsToLoad || JSON.parse(localStorage.getItem("patientRecords")) || [];
        totalPatients.innerText = records.length;

        if (records.length === 0) {
            container.innerHTML = "<p>No patient records found.</p>";
            return;
        }

        records.forEach((record, index) => {
            let box = document.createElement("div");
            box.className = "record-box";

            let recordHTML = `<h3>Patient #${index + 1}</h3>`;
            for (let key in record) {
                let displayValue = Array.isArray(record[key]) ? record[key].join(", ") : record[key];
                recordHTML += `<p><strong>${key.replace(/_/g, " ")}:</strong> ${displayValue}</p>`;
            }

            recordHTML += `
                <button class="edit-btn" data-index="${index}">Edit</button>
                <button class="delete-btn" data-index="${index}">Delete</button>
            `;

            box.innerHTML = recordHTML;
            container.appendChild(box);
        });

        attachEditDeleteEvents();
    }

    function attachEditDeleteEvents() {
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                deleteRecord(index);
            });
        });

        document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                editRecord(index);
            });
        });
    }

    function deleteRecord(index) {
        let records = JSON.parse(localStorage.getItem("patientRecords")) || [];
        records.splice(index, 1);
        localStorage.setItem("patientRecords", JSON.stringify(records));
        loadRecords();
    }

    function editRecord(index) {
        localStorage.setItem("editIndex", index);
        window.location.href = "add-record.html";  
    }

    // Search functionality
    searchBtn.addEventListener("click", function() {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) return alert("Please enter a Name, Mobile, or Doctor to search.");

        let records = JSON.parse(localStorage.getItem("patientRecords")) || [];
        let filteredRecords = records.filter(record => 
            record.name.toLowerCase().includes(query) ||
            record.mobile.includes(query) ||
            record.doctor.toLowerCase().includes(query)
        );

        if(filteredRecords.length === 0) {
            container.innerHTML = "<p>No matching patient records found.</p>";
            totalPatients.innerText = 0;
            return;
        }

        loadRecords(filteredRecords);
    });

    // Reset button to show all records
    resetBtn.addEventListener("click", function() {
        searchInput.value = "";
        loadRecords();
    });

    // Initial load of all records
    loadRecords();
});



