document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("patientForm");

  const scriptURL =
"https://script.google.com/macros/s/AKfycbwxrJGBx1_FEX-7Wa1andtXPe74OvlAFKlkI2lp_c1nGstidPx9Yj7-mQkq4s82pG0q/exec";

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
