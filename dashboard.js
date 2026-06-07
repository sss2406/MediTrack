document.addEventListener("DOMContentLoaded",()=>{

  const reminders =
    JSON.parse(
      localStorage.getItem("mt_reminders")
    ) || [];

  document.getElementById("activeMeds").textContent =
    reminders.length;

  document.getElementById("todayDoses").textContent =
    reminders.length;

  let lowStockCount = 0;

  const records =
    JSON.parse(
      localStorage.getItem("mt_records")
    ) || [];

  records.forEach(record=>{

    const stock =
      Number(record.stock);

    const daily =
      Number(record.daily_consumption);

    if(daily > 0){

      const daysLeft =
      stock/daily;

      if(daysLeft <= 7){

        lowStockCount++;

      }

    }

  });

  document.getElementById("lowStock").textContent =
    lowStockCount;

});
