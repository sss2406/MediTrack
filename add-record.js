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
      mode: "no-cors",   
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(() => {
      alert("Record submitted successfully!");
      form.reset();
    })
    .catch(() => {
      alert("Error submitting record");
    });

  });

});







