document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("patientForm");
  const scriptURL = "https://script.google.com/macros/s/AKfycbx79rWGdf7wGq7WuZA6z9gJaNBtupMa8Hw2RO6dABPCYcJmjFL5Nbbp8Q3OFfhJjoXQ1A/exec";

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    
    const formData = new FormData(form);
    
    fetch(scriptURL, {
      method: "POST",
      mode: "no-cors", 
      body: formData
    })
    .then(() => {
      alert("Record submitted successfully!");
      form.reset();
    })
    .catch(err => {
      console.error("Error:", err);
      alert("Submission failed. Check your internet or Script Deployment.");
    });
  });
});






