document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("patientForm");

  
  const scriptURL = "https://script.google.com/macros/s/AKfycbyJCWn1fvwuukE8Dg1ilQTs9hcFubwlpeEGEq4PYIS22elDsUKJdzjhJqnFccwXL2FpJQ/exec";

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    let data = {};

    formData.forEach((value, key) => {
      if (key !== "medical_files") {  
        data[key] = value;
      }
    });

    fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    })
    .then(() => {
      alert("Record submitted successfully!");
      form.reset();
    })
    .catch(err => {
      console.error("Error:", err);
      alert("Failed to submit record. Check Apps Script deployment and permissions.");
    });
  });

});







