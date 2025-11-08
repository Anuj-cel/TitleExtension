// const profileScraperFunction=async () => {
//   await new Promise(res => setTimeout(res, 3000));
//   const name = document.querySelector(".pv-text-details__left-panel h1")?.innerText || "";
//   const location = document.querySelector(".pv-text-details__left-panel span.text-body-small div")?.innerText || "";
//   const about = document.querySelector(".pv-about__summary-text")?.innerText || "";
//   const bio = document.querySelector(".text-body-medium.break-words")?.innerText || "";
//   const followerCount = parseInt(document.body.innerText.match(/(\d+)\s+followers/)?.[1] || "0");
//   const connectionCount = parseInt(document.body.innerText.match(/(\d+)\s+connections/)?.[1] || "0");

//   const profileData = { name, url: window.location.href, about, bio, location, followerCount, connectionCount };

//   await fetch("http://localhost:5000/", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(profileData)
//   });
  
//   chrome.runtime.sendMessage({ action: "profileDone",  profileData });
// }

// profileScraperFunction();
const profileScraperFunction = async () => {
  console.log("🚀 Scraping LinkedIn Profile...");

  // Wait for page content to load properly
  await new Promise(res => setTimeout(res, 4000));

  // Get name (almost always the first <h1>)
  const name = document.querySelector("h1")?.innerText?.trim() || "";

  // Get headline / bio
  const bio = document.querySelector(".text-body-medium.break-words")?.innerText?.trim() || "";

  // Get location
  const location = document.querySelector(".text-body-small.inline.t-black--light.break-words")?.innerText?.trim()
    || document.querySelector("span.text-body-small")?.innerText?.trim()
    || "";

  // Get About section
  const about = document.querySelector("section[id='about'] .inline-show-more-text")?.innerText.trim() || "";


  // Followers and connections
  const text = document.body.innerText;
  const followerCount = parseInt(text.match(/(\d+)\s+followers/i)?.[1] || "0");
  const connectionCount = parseInt(text.match(/(\d+)\s+connections/i)?.[1] || "0");

  // Final data
  const profileData = { 
    name, 
    url: window.location.href, 
    about, 
    bio, 
    location, 
    followerCount, 
    connectionCount 
  };

  console.log("📋 Scraped:", profileData);

  // Send to backend
  await fetch("http://localhost:5000/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profileData),
  });

  // Notify background
  chrome.runtime.sendMessage({ action: "profileDone", profileData });
};

profileScraperFunction();
