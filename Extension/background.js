const linkedInProfiles = [
  "https://www.linkedin.com/in/anuj-kumar-b47528215/",
  "https://www.linkedin.com/in/anuj-kumar-b47528215/",
  "https://www.linkedin.com/in/anuj-kumar-b47528215/",
];

let currentIndex = 0;

// Listen to messages
chrome.runtime.onMessage.addListener(async (msg) => {
  if (msg.action === "startScraping") {
    console.log("🧠 startScraping started");
    currentIndex = 0;
    openNextProfile();
  }

  else if (msg.action === "profileDone") {
    currentIndex++;
    if (currentIndex < linkedInProfiles.length) {
      openNextProfile();
    } else {
      console.log("✅ All profiles scraped!");
    }
  }

  else if (msg.action === "check") {
    console.log("🔍 check called");
    checkerFunction();
  }

  else if (msg.action === "startFeedAutomation") {
    console.log("⚙️ startFeed called");
    openFeedAutomation();
  }
});

// --- Open profile pages one by one ---
function openNextProfile() {
  const url = linkedInProfiles[currentIndex];
  chrome.tabs.create({ url }, (tab) => {
    chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
      if (tabId === tab.id && info.status === "complete") {
        chrome.tabs.onUpdated.removeListener(listener);
        console.log("📩 Injecting profileScrapper.js into:", url);
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content/profileScrapper.js"] // ✅ path corrected
        });
      }
    });
  });
}

// --- Open feed automation page ---
function openFeedAutomation() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab) return console.error("❌ No active tab found");

    console.log("🔍 Checking current tab:", tab.url);

    if (tab.url && tab.url.includes("linkedin.com/feed")) {
      console.log("✅ Already on LinkedIn feed — injecting feedAutomation.js");
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content/feedAutomation.js"],
      });
    } else {
      console.log("🌐 Not on feed — opening LinkedIn feed...");
      chrome.tabs.create({ url: "https://www.linkedin.com/feed/" }, (newTab) => {
        console.log("🆕 Feed tab opened:", newTab.id);
        setTimeout(() => {
          chrome.scripting.executeScript({
            target: { tabId: newTab.id },
            files: ["content/feedAutomation.js"],
          });
          console.log("✅ Injected feedAutomation.js after opening feed");
        }, 5000);
      });
    }
  });
}


// --- Run checker function on active tab ---
function checkerFunction() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log("Tabs found for checking:", tabs);
    if (tabs[0]) {
      console.log("🔧 Injecting check.js into:", tabs[0].url);
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["content/check.js"] // ✅ removed extra dot (.)
      });
    }
  });
}


chrome.runtime.onMessage.addListener(async (msg) => {
  // if (msg.action === "sendToServer") {
 console.log("Message received in background.js: fkjafd;lka", msg);
  // }
});
