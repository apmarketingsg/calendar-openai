const micBtn = document.getElementById("micBtn");
const transcriptEl = document.getElementById("transcript");
const tapText = document.getElementById("tapText");
function renderMeetings(meetings){
meetingList.innerHTML = "";
meetings.forEach(m => {
const el = document.createElement("div");
el.className = "meeting-card";
el.innerHTML = `
<div class="time">${m.time}</div>
<div>
<div class="meeting-title">${m.title}</div>
<div class="meeting-sub">${m.sub}</div>
</div>`;
meetingList.appendChild(el);
});
}
renderMeetings([
{ time:"10:00 AM", title:"Team Standup", sub:"with Engineering Team" },
{ time:"2:30 PM", title:"Client Review", sub:"with John Tan" }
]);
// Voice transcription (free)
micBtn.addEventListener("click", () => {
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
if(!SR){ alert("Speech recognition not supported. Try Chrome on Android."); return; }
const rec = new SR();
rec.lang = "en-SG";
rec.interimResults = false;
micBtn.classList.add("listening");
  tapText.textContent = "Listening...";
transcriptEl.textContent = "";
rec.onresult = (e) => {
const text = e.results[0][0].transcript;
transcriptEl.textContent = `You said: ${text}`;
};
rec.onend = () => {
micBtn.classList.remove("listening");
tapText.textContent = "Tap to speak";
};
rec.start();
});
// PWA service worker will be added in Step 5
if("serviceWorker" in navigator){
navigator.serviceWorker.register("/sw.js").catch(()=>{});
}
