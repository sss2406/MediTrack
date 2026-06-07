// dashboard.js — MediTrack Dashboard (direct, no proxy)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw2jT6n1A7vnyOHCoERZaWd-hjMjYxgS0Hr0dggK1VAoeRHX03Ks4a3cCO74PJC3Ioi/exec";

async function fetchSheetData() {
  const res = await fetch(SCRIPT_URL, { redirect: "follow" });
  if (!res.ok) throw new Error("Request failed: " + res.status);
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error("Bad JSON: " + text.slice(0, 100));
  }
}

async function loadDashboard() {
  try {
    document.getElementById("loading").innerText = "Loading data...";
    const records = await fetchSheetData();
    if (!records || !records.length) {
      document.getElementById("loading").innerText = "No records found yet.";
      document.getElementById("medicineList").innerHTML =
        "<div style='color:var(--muted);font-size:14px;padding:10px 0;'>No patient records yet. Add one to get started.</div>";
      return;
    }
    const latest = records[records.length - 1];
    document.getElementById("activeMedicines").innerText = records.length;
    document.getElementById("latestWeight").innerText = latest.weight || "--";
    document.getElementById("latestBP").innerText = latest.blood_pressure || "--";
    document.getElementById("latestSugar").innerText = latest.blood_sugar || "--";
    const reminders = JSON.parse(localStorage.getItem("mt_reminders")) || [];
    document.getElementById("todayReminders").innerText = reminders.length;
    let lowStockCount = 0;
    let medicineHTML = "";
    records.forEach(record => {
      const stock = Number(record.stock || 0);
      const daily = Number(record.daily_consumption || 1);
      const daysLeft = Math.floor(stock / daily);
      if (daysLeft <= 7) lowStockCount++;
      const urgency = daysLeft <= 3 ? "color:var(--danger);" : daysLeft <= 7 ? "color:#f59e0b;" : "color:var(--success);";
      medicineHTML += `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);"><div><strong style="font-size:14px;">${record.medicine_name || record.name || 'Unknown'}</strong><div style="font-size:12px;color:var(--muted);margin-top:2px;">${record.dosage || ''} · ${record.frequency || ''} ${record.reminder_time ? '· ⏰ ' + record.reminder_time : ''}</div></div><div style="text-align:right;font-size:13px;"><div>Stock: <strong>${stock}</strong></div><div style="${urgency}">Days left: <strong>${daysLeft}</strong></div></div></div>`;
    });
    document.getElementById("lowStock").innerText = lowStockCount;
    document.getElementById("medicineList").innerHTML = medicineHTML || "<div>No medicines found.</div>";
    document.getElementById("loading").innerText = "✅ Dashboard updated";
  } catch (error) {
    console.error("Dashboard error:", error);
    document.getElementById("loading").innerText = "❌ Failed to load — " + error.message;
  }
}
loadDashboard();
