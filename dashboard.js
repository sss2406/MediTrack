
const scriptUrl = "https://script.google.com/macros/s/AKfycbyJCWn1fvwuukE8Dg1ilQTs9hcFubwlpeEGEq4PYIS22elDsUKJdzjhJqnFccwXL2FpJQ/exec";

document.getElementById("openSheetBtn").addEventListener("click", function() {
  
  const newWindow = window.open(scriptUrl, "_blank");
  
  if (!newWindow) {
    document.getElementById("errorMsg").textContent = 
      "Pop-up blocked! Please allow pop-ups in your browser.";
  } else {
    document.getElementById("errorMsg").textContent = "";
  }
});






