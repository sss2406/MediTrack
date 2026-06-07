document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("patientForm");

  const scriptURL =
"https://script.google.com/macros/s/AKfycbz4MGPFA_qdPuFMyn04_524T_rXId6KebEKIvfWFUXc-wyU-r4jObBQS960T7HcrxY9/exec";

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const formData = new FormData(form);

    const startDate =
      formData.get("start_date");

    const endDate =
      formData.get("end_date");

    if(startDate > endDate){

      alert("End Date must be after Start Date");

      return;

    }

    const stock =
      Number(formData.get("stock"));

    if(stock < 0){

      alert("Stock cannot be negative");

      return;

    }

    const reminder = {

      medicine:
        formData.get("medicine_name"),

      dosage:
        formData.get("dosage"),

      time:
        formData.get("reminder_time"),

      frequency:
        formData.get("frequency")

    };

    const reminders =
      JSON.parse(
        localStorage.getItem("mt_reminders")
      ) || [];

    reminders.push(reminder);

    localStorage.setItem(
      "mt_reminders",
      JSON.stringify(reminders)
    );

    try {

      await fetch(scriptURL, {

        method: "POST",

        mode: "no-cors",

        body: formData

      });

      alert(
        "Medication Record Saved Successfully"
      );

      form.reset();

    }

    catch(error){

      console.error(error);

      alert(
        "Unable to save record"
      );

    }

  });

});
