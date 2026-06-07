// dashboard.js — MediTrack Dashboard
// BUG FIX: field names changed from Title Case ("Medicine Name", "Blood Pressure")
// to snake_case (medicine_name, blood_pressure) to match what the Google Apps
// Script actually returns. Also unified to use the same endpoint as meditrack-hub.js.

const API_URL =
"https://script.google.com/macros/s/AKfycbwxqK1HwNDrIUVOhdorQMvbTjOmLIFwri2DQP3TnPjQaq45nYwF3LReYZXWXbdRf9Rl/exec":

async function loadDashboard() {
  try {
    document.getElementById("loading").innerText = "Loading real data...";

    const response = await fetch(API_URL);
    const records = await response.json();

    if (!records || !records.length) {
      document.getElementById("loading").innerText = "No records found";
      document.getElementById("medicineList").innerHTML =
        "<div style='color:var(--muted);font-size:14px;padding:10px 0;'>No patient records yet. Add one to get started.</div>";
      return;
    }

    const latest = records[records.length - 1];

    // Active medicines = total records
    document.getElementById("activeMedicines").innerText = records.length;

    // BUG FIX: was latest["Weight"] — sheet returns lowercase snake_case keys
    document.getElementById("latestWeight").innerText =
      latest.weight || "--";
    document.getElementById("latestBP").innerText =
      latest.blood_pressure || "--";
    document.getElementById("latestSugar").innerText =
      latest.blood_sugar || "--";

    // Reminders from localStorage
    const reminders =
      JSON.parse(localStorage.getItem("mt_reminders")) || [];
    document.getElementById("todayReminders").innerText = reminders.length;

    // Low stock & medicine list
    let lowStockCount = 0;
    let medicineHTML = "";

    records.forEach(record => {
      // BUG FIX: was record["Stock"] and record["Daily Consumption"]
      const stock = Number(record.stock || 0);
      const daily = Number(record.daily_consumption || 1);
      const daysLeft = Math.floor(stock / daily);

      if (daysLeft <= 7) lowStockCount++;

      const urgency =
        daysLeft <= 3 ? "color:var(--danger);" :
        daysLeft <= 7 ? "color:#f59e0b;" :
        "color:var(--success);";

      // BUG FIX: was record["Medicine Name"] — sheet returns medicine_name
      medicineHTML += `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);">
          <div>
            <strong style="font-size:14px;">${record.medicine_name || 'Unknown'}</strong>
            <div style="font-size:12px;color:var(--muted);margin-top:2px;">
              ${record.dosage || ''} · ${record.frequency || ''}
              ${record.reminder_time ? '· ⏰ ' + record.reminder_time : ''}
            </div>
          </div>
          <div style="text-align:right;font-size:13px;">
            <div>Stock: <strong>${stock}</strong></div>
            <div style="${urgency}">Days left: <strong>${daysLeft}</strong></div>
          </div>
        </div>
      `;
    });

    document.getElementById("lowStock").innerText = lowStockCount;
    document.getElementById("medicineList").innerHTML =
      medicineHTML || "<div>No medicines found.</div>";

    document.getElementById("loading").innerText = "✅ Dashboard updated";

  } catch (error) {
    console.error("Dashboard load error:", error);
    document.getElementById("loading").innerText =
      "❌ Unable to load data — check console for details";
  }
}

loadDashboard();
