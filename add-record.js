document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("patientForm");
  const scriptURL = "https://script.google.com/macros/s/AKfycbzjvLqPbJQkR0jFeuk5jyHpE3KRgawzcQ6VUtB0u6NeG-hz1ufJDIpFUWCKctYeFy3n/exec";

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







