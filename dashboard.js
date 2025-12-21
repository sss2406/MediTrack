
const scriptUrl = "https://script.google.com/macros/s/AKfycbyJCWn1fvwuukE8Dg1ilQTs9hcFubwlpeEGEq4PYIS22elDsUKJdzjhJqnFccwXL2FpJQ/exec";


document.getElementById("openSheetBtn").addEventListener("click", function() {
  const newWindow = window.open(scriptUrl, "_blank");
  if (!newWindow) {
    document.getElementById("errorMsg").textContent = 
      "Pop-up blocked! Please allow pop-ups in your browser.";
  } else {
    document.getElementById("errorMsg").textContent = "";
  }
});


function submitForm() {
  const data = {
    name: document.getElementById("name").value,
    mobile: document.getElementById("mobile").value,
    email: document.getElementById("email").value,
    age: document.getElementById("age").value,
    gender: document.getElementById("gender").value,
    height: document.getElementById("height").value,
    weight: document.getElementById("weight").value,
    blood_pressure: document.getElementById("blood_pressure").value,
    heart_rate: document.getElementById("heart_rate").value,
    temperature: document.getElementById("temperature").value,
    follow_up: document.getElementById("follow_up").value,
    symptoms: document.getElementById("symptoms").value,
    diagnosis: document.getElementById("diagnosis").value,
    medications: document.getElementById("medications").value,
    notes: document.getElementById("notes").value,
    doctor: document.getElementById("doctor").value
  };

  fetch(scriptUrl, {
    method: "POST",
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(response => {
    console.log("Success:", response);
    alert("Data submitted successfully!");
  })
  .catch(err => {
    console.error("Error:", err);
    alert("Failed to submit data. Check console for details.");
  });
}









