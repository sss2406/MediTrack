document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("patientForm");

  const scriptURL =
"https://script.google.com/macros/s/AKfycbz4MGPFA_qdPuFMyn04_524T_rXId6KebEKIvfWFUXc-wyU-r4jObBQS960T7HcrxY9/exec"

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const formData = new FormData(form);

    const reminder = {
      medicine: formData.get("medicine_name"),
      time: formData.get("reminder_time"),
      dosage: formData.get("dosage")
    };

    const reminders =
      JSON.parse(localStorage.getItem("mt_reminders")) || [];

    reminders.push(reminder);

    localStorage.setItem(
      "mt_reminders",
      JSON.stringify(reminders)
    );

    try {

      await fetch(scriptURL,{
        method:"POST",
        mode:"no-cors",
        body:formData
      });

      alert("Medication saved successfully");

      form.reset();

    } catch(error){

      console.error(error);

      alert("Unable to save record");

    }

  });

});
