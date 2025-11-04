async function getTitle() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const tabTitle = document.getElementById("tabTitle");
    tabTitle.textContent = tab.title;
    console.log("Current Tab Title:", tab.title);
  } catch (err) {
    console.error("Error fetching tab title:", err);
  }
}

document.getElementById("getTitleBtn").addEventListener("click", getTitle);
