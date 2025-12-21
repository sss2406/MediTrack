
const scriptUrl = "https://script.google.com/macros/s/AKfycbyiTs9jTs_5r0-idIqpAZY-uoI4gHepKPA-ht8rciudWesWxK7YipYPaNpvDT-j_cOxIA/exec";

document.getElementById("openSheetBtn").addEventListener("click", function() {
  try {
    const newWindow = window.open(scriptUrl, "_blank");
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // Pop-up blocked
      document.getElementById("errorMsg").textContent = "Pop-up blocked! Please allow pop-ups in your browser.";
    }
  } catch (err) {
    document.getElementById("errorMsg").textContent = "Unable to open Google Sheets. Check your URL and browser settings.";
    console.error(err);
  }
});







