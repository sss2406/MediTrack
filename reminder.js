if ("Notification" in window) {

  Notification.requestPermission();

}

setInterval(()=>{

  const reminders =
  JSON.parse(
    localStorage.getItem("mt_reminders")
  ) || [];

  const now = new Date();

  const currentTime =
  now.toLocaleTimeString([],{
    hour:"2-digit",
    minute:"2-digit",
    hour12:false
  });

  reminders.forEach(reminder=>{

    if(reminder.time === currentTime){

      new Notification(
        "Medicine Reminder",
        {
          body:
          `${reminder.medicine} (${reminder.dosage})`
        }
      );

    }

  });

},60000);
