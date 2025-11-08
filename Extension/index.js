const likeInput = document.getElementById("likeCount");
const commentInput = document.getElementById("commentCount");
const startFeedBtn = document.getElementById("startFeedBtn");
const check=document.getElementById("check");

check?.addEventListener("click",  async()=>{
  chrome.runtime.sendMessage({ action: "check" });
});


function toggleFeedBtn() {
  startFeedBtn.disabled = !(likeInput.value && commentInput.value);
}

likeInput.addEventListener("input", toggleFeedBtn);
commentInput.addEventListener("input", toggleFeedBtn);

// When scraping profiles
document.getElementById("startScrapeBtn").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "startScraping" });
});

// When starting feed actions
startFeedBtn.addEventListener("click", async () => {
  const likeCount = parseInt(likeInput.value);
  const commentCount = parseInt(commentInput.value);
  console.log("Storing feed settings:", { likeCount, commentCount });
  await chrome.storage.local.set({ likeCount, commentCount });
  chrome.runtime.sendMessage({ action: "startFeedAutomation" });
});
