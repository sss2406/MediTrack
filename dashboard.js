document.addEventListener("DOMContentLoaded", function () {
    let container = document.getElementById("recordsContainer");
    let totalPatients = document.getElementById("totalPatients");

    function loadRecords() {
        container.innerHTML = ""; 

        let records = JSON.parse(localStorage.getItem("patientRecords")) || [];

    
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
        recordHTML += `<p><strong>${key.replace(/_/g, " ")}:</strong> ${record[key]}</p>`;
    }

    recordHTML += `
        <button class="edit-btn" data-index="${index}">Edit</button>
        <button class="delete-btn" data-index="${index}">Delete</button>
    `;

    box.innerHTML = recordHTML;
    container.appendChild(box);
});

        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", function () {
                let index = this.getAttribute("data-index");
                deleteRecord(index);
            });
        });

        document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", function () {
                let index = this.getAttribute("data-index");
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

    loadRecords();
});


