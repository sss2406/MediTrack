const API_URL =
"https://script.google.com/macros/s/AKfycbwxrJGBx1_FEX-7Wa1andtXPe74OvlAFKlkI2lp_c1nGstidPx9Yj7-mQkq4s82pG0q/exec";

async function loadDashboard() {

  try {

    document.getElementById("loading").innerText =
      "Loading real data...";

    const response = await fetch(API_URL);

    const records = await response.json();

    if (!records.length) {

      document.getElementById("loading").innerText =
        "No records found";

      return;
    }

    const latest =
      records[records.length - 1];

    document.getElementById("activeMedicines").innerText =
      records.length;

    document.getElementById("latestWeight").innerText =
      latest["Weight"] || "--";

    document.getElementById("latestBP").innerText =
      latest["Blood Pressure"] || "--";

    document.getElementById("latestSugar").innerText =
      latest["Blood Sugar"] || "--";

    const reminders =
      JSON.parse(localStorage.getItem("mt_reminders")) || [];

    document.getElementById("todayReminders").innerText =
      reminders.length;

    let lowStockCount = 0;

    let medicineHTML = "";

    records.forEach(record => {

      const stock =
        Number(record["Stock"] || 0);

      const daily =
        Number(record["Daily Consumption"] || 1);

      const daysLeft =
        Math.floor(stock / daily);

      if(daysLeft <= 7){
        lowStockCount++;
      }

      medicineHTML += `
      <div>
        <strong>${record["Medicine Name"]}</strong>
        <br>
        Stock: ${stock}
        |
        Days Left: ${daysLeft}
      </div>
      `;

    });

    document.getElementById("lowStock").innerText =
      lowStockCount;

    document.getElementById("medicineList").innerHTML =
      medicineHTML || "No medicines available";

    document.getElementById("loading").innerText =
      "Dashboard Updated";

  }

  catch(error){

    console.error(error);

    document.getElementById("loading").innerText =
      "Unable to load data";

  }

}

loadDashboard();
