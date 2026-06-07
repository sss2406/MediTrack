

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw2jT6n1A7vnyOHCoERZaWd-hjMjYxgS0Hr0dggK1VAoeRHX03Ks4a3cCO74PJC3Ioi/exec";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("patientForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const startDate = formData.get("start_date");
    const endDate = formData.get("end_date");

    if (startDate > endDate) {
      alert("End Date must be after Start Date");
      return;
    }

    const stock = Number(formData.get("stock"));
    if (stock < 0) {
      alert("Stock cannot be negative");
      return;
    }

    // Save reminder to localStorage
    const reminder = {
      medicine: formData.get("medicine_name"),
      dosage: formData.get("dosage"),
      time: formData.get("reminder_time"),
      frequency: formData.get("frequency")
    };
    const reminders = JSON.parse(localStorage.getItem("mt_reminders") || "[]");
    reminders.push(reminder);
    localStorage.setItem("mt_reminders", JSON.stringify(reminders));

    // Submit to Google Sheet
    // NOTE: mode "no-cors" means we can't read the response, but the data IS sent.
    // Google Apps Script accepts this — check your Sheet after submitting.
    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: formData
      });

      alert("✅ Medication Record Saved Successfully!\n\nCheck your Google Sheet to confirm the record appeared.");
      form.reset();

    } catch (error) {
      console.error(error);
      alert("❌ Unable to save record: " + error.message);
    }
  });
});
