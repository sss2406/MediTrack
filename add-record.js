document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    let editIndex = localStorage.getItem("editIndex");

    if (editIndex !== null) {
        let records = JSON.parse(localStorage.getItem("patientRecords")) || [];
        let record = records[editIndex];

        for (let key in record) {
            if (document.getElementById(key)) {
                if(key === "medical_files") {
                    // file inputs cannot be prefilled due to browser restrictions
                    continue;
                } else {
                    document.getElementById(key).value = record[key];
                }
            }
        }
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        let newRecord = {};
        let fields = [
            "name","mobile","email","age","gender","height","weight","blood_pressure",
            "heart_rate","temperature","follow_up","symptoms","diagnosis","medications",
            "notes","doctor","medical_files"
        ];

        fields.forEach(f => {
            if(f === "medical_files") {
                const files = document.getElementById(f).files;
                newRecord[f] = [];
                for(let i = 0; i < files.length; i++){
                    newRecord[f].push(files[i].name); // store file names
                }
            } else {
                newRecord[f] = document.getElementById(f).value;
            }
        });

        let records = JSON.parse(localStorage.getItem("patientRecords")) || [];

        if (editIndex !== null) {
            records[editIndex] = newRecord;
            localStorage.removeItem("editIndex");
            alert("Record Updated Successfully!");
        } else {
            records.push(newRecord);
            alert("Record Added Successfully!");
        }

        localStorage.setItem("patientRecords", JSON.stringify(records));
        form.reset();
    });
});

