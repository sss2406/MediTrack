document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("patientForm");

  
  const scriptURL = "https://script.google.com/macros/s/AKfycbx79rWGdf7wGq7WuZA6z9gJaNBtupMa8Hw2RO6dABPCYcJmjFL5Nbbp8Q3OFfhJjoXQ1A/exec";

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
      console.error("Fetch error:", err);
      alert("Failed to submit record. Check Apps Script deployment and permissions.");
    });
  });
});





