document.addEventListener("DOMContentLoaded", function () {

  const form = document.querySelector("#patientForm");
  let editIndex = localStorage.getItem("editIndex");

  // ---------- LOAD RECORD FOR EDIT ----------
  if (editIndex !== null) {
    const records = JSON.parse(localStorage.getItem("patientRecords")) || [];
    const record = records[editIndex];

    if (record) {
      for (let key in record) {
        const field = form.querySelector(`[name="${key}"]`);
        if (!field) continue;

        if (key === "medical_files") {
          // Files cannot be prefilled for security reasons
          continue;
        } else {
          field.value = record[key];
        }
      }
    }
  }

  // ---------- FORM SUBMIT ----------
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    let newRecord = {};
    const fields = [
      "name","mobile","email","age","gender","height","weight",
      "blood_pressure","heart_rate","temperature","follow_up",
      "symptoms","diagnosis","medications","notes","doctor","medical_files"
    ];

    fields.forEach(fieldName => {
      const field = form.querySelector(`[name="${fieldName}"]`);
      if (!field) return;

      if (fieldName === "medical_files") {
        const files = field.files;
        newRecord[fieldName] = [];
        for (let i = 0; i < files.length; i++) {
          newRecord[fieldName].push(files[i].name);
        }
      } else {
        newRecord[fieldName] = field.value.trim();
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



