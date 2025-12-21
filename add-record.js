document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("patientForm");

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxiqRFNgSgLnu41HhG3AnAOW4aiUxgIvD1Jfs72UvH3_51r7xTrL5id1XYw6defysy5xw/exec";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form));

    try {
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("Patient record saved to Google Sheets!");
        form.reset();
      }
    } catch (err) {
      alert("Failed to save record");
      console.error(err);
    }
  });
});


