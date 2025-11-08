const linkedInProfiles = [
  "https://www.linkedin.com/in/anuj-kumar-b47528215/",
  "https://www.linkedin.com/in/nancy-gupta-71833b24a/",
  "https://www.linkedin.com/in/mohit-kumar-agrawal-02183b23a/",
];

let currentIndex = 0;


chrome.runtime.onMessage.addListener(async (msg) => {
  if (msg.action === "startScraping") {
    console.log("🧠 startScraping started");
    currentIndex = 0;
    openNextProfile();
  }
  else if (msg.action === "profileDone") {
    console.log("✅ Profile scraped:", msg.profileData);
    currentIndex++;
    if (currentIndex < linkedInProfiles.length) {
      openNextProfile();
    } else {
      console.log("✅ All profiles scraped!");
    }
  }
else if (msg.action === "startFeedAutomation") {
    console.log("⚙️ startFeed called");
    openFeedAutomation();
  }
});


function openNextProfile() {
  const url = linkedInProfiles[currentIndex];
  chrome.tabs.create({ url }, (tab) => {
    chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
      if (tabId === tab.id && info.status === "complete") {
        chrome.tabs.onUpdated.removeListener(listener);
        console.log("📩 Injecting profileScrapper.js into:", url);
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content/profileScraper.js"] 
        });
      }
    });
  });
}


// function openFeedAutomation() {
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     const tab = tabs[0];
//     if (!tab) return console.error("❌ No active tab found");

//     console.log("🔍 Checking current tab:", tab.url);

//     if (tab.url && tab.url.includes("linkedin.com/feed")) {
//       console.log("✅ Already on LinkedIn feed — injecting feedAutomation.js");
//       chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         files: ["content/feedAutomation.js"],
//       });
//     } else {
//       console.log("🌐 Not on feed — opening LinkedIn feed...");
//       chrome.tabs.create({ url: "https://www.linkedin.com/feed/" }, (newTab) => {
//         console.log("🆕 Feed tab opened:", newTab.id);
//         setTimeout(() => {
//           chrome.scripting.executeScript({
//             target: { tabId: newTab.id },
//             files: ["content/feedAutomation.js"],
//           });
//           console.log("✅ Injected feedAutomation.js after opening feed");
//         }, 5000);
//       });
//     }
//   });
// }

function openFeedAutomation() {
  chrome.tabs.query({}, (tabs) => {
    const feedTab = tabs.find(t => t.url && t.url.includes("linkedin.com/feed"));
    
    if (feedTab) {
      console.log("🔄 Found existing feed tab — injecting script");
      chrome.scripting.executeScript({
        target: { tabId: feedTab.id },
        files: ["content/feedAutomation.js"],
      });
      chrome.tabs.update(feedTab.id, { active: true });
      return;
    }

    console.log("🌐 No feed tab found — opening new one...");
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
  });
}
