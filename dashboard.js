
const scriptUrl = "https://script.google.com/macros/s/AKfycbyiTs9jTs_5r0-idIqpAZY-uoI4gHepKPA-ht8rciudWesWxK7YipYPaNpvDT-j_cOxIA/exec";

document.getElementById("openSheetBtn").addEventListener("click", function() {
  
  const newWindow = window.open(scriptUrl, "_blank");
  
  if (!newWindow) {
    document.getElementById("errorMsg").textContent = 
      "Pop-up blocked! Please allow pop-ups in your browser.";
  } else {
    document.getElementById("errorMsg").textContent = "";
  }
});





