function openSidebar() {
  document.getElementById("sidebar").style.display = "block";
  document.getElementById("mobile-open").style.display = "none";
  document.getElementById("main").style.display = "none";
}

function closeSidebar() {
  document.getElementById("sidebar").style.display = "none";
  document.getElementById("mobile-open").style.display = "block";
  document.getElementById("main").style.display = "block";
}