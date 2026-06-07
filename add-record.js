console.log("ADD RECORD JS LOADED");
document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("patientForm");

const scriptURL =
"https://script.google.com/macros/s/AKfycbzRLiGmS1YqnhnywMFBYhPbx4IWBcs-W2W-nj8NLV6BIEJp1n1NnF3GzNPGnx3pfmQG/exec";

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
