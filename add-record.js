document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("patientForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    let data = {};
    formData.forEach((value, key) => {
      if (key !== "medical_files") data[key] = value;
    });

    fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(res => {
      if (res.status === "success") {
        alert("Record submitted successfully!");
        form.reset();
      } else {
        alert("Failed to submit record: " + (res.message || "Unknown error"));
      }
    })
    .catch(err => {
      console.error("Error:", err);
      alert("Failed to submit record. Check Apps Script deployment and permissions.");
    });
  });
});








