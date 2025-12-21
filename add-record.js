document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("patientForm");

  
  const scriptURL = "https://script.google.com/macros/s/AKfycbyJCWn1fvwuukE8Dg1ilQTs9hcFubwlpeEGEq4PYIS22elDsUKJdzjhJqnFccwXL2FpJQ/exec";

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    let data = {};

    formData.forEach((value, key) => {
      if (key === "medical_files") return; 
      data[key] = value;
    });

    fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    })
    .then(res => res.json())
    .then(response => {
      if (response.status === "success") {
        alert("Record saved to Google Sheets!");
        form.reset();
      } else {
        alert("Error saving record.");
      }
    })
    .catch(err => {
      console.error(err);
      alert("Failed to connect to server.");
    });
  });

});

});





