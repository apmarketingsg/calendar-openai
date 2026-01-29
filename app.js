const micBtn = document.getElementById("micBtn");

micBtn.addEventListener("click", () => {
  micBtn.classList.add("listening");

  // Visual feedback only for now
  micBtn.style.boxShadow = "0 0 60px rgba(255, 140, 90, 0.9)";

  setTimeout(() => {
    micBtn.style.boxShadow = "0 0 40px rgba(255, 122, 61, 0.6)";
  }, 1500);

  // Later:
  // - Start speech recognition
  // - Send transcript to backend
});
