document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("patientForm");


  const scriptURL = "https://script.google.com/macros/s/AKfycbzzg61nQ9Gtofe4LZp0IJeNZKxihgFjhmD1ndQNH6ZQmhpf937ZOOLDu-NfTsbNEolt8w/exec";

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









