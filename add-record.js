document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("patientForm");

  
  const scriptURL = "https://script.google.com/macros/s/AKfycbx2YAnc6QKz1nEWJEGkS0dG_wW7JoefzWQzSAbw4i0Y5IQTN_-MqKNW9RnQuIqNP1tX8A/exec";

  
  console.log("add-record.js loaded");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("Form submit clicked");

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
      console.log("Response from Apps Script:", res);
      if (res.status === "success") {
        alert("Record submitted successfully!");
        form.reset();
      } else {
        alert("Failed to submit record: " + (res.message || "Unknown error"));
      }
    })
    .catch(err => {
      console.error("Fetch error:", err);
      alert("Failed to submit record. Check Apps Script deployment and permissions.");
    });
  });
});




