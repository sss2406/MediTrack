document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("patientForm");

  
  const scriptURL = "https://script.google.com/macros/s/AKfycbwV-Ih6TgJngY09X8-8tsw8wNLXqe1kUrtL9U38VPId6cMLHiUUAmukJScv3i-fGKhk1A/exec";

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    let data = {};

    formData.forEach((value, key) => {
      
      if (key !== "medical_files") data[key] = value;
    });

    
    fetch(scriptURL, {
      method: "POST",
      mode: "no-cors", 
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    .then(() => {
      
      alert("Record sent to Google Sheets!");
      form.reset();
    })
    .catch((err) => {
      console.error("Error:", err);
      alert("Something went wrong. Check console.");
    });
  });
});






