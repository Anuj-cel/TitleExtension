(async () => {
  const name = document.querySelector(".pv-text-details__left-panel h1")?.innerText || "";
  const location = document.querySelector(".pv-text-details__left-panel span.text-body-small")?.innerText || "";
  const about = document.querySelector(".pv-about__summary-text")?.innerText || "";
  const bio = document.querySelector(".text-body-medium.break-words")?.innerText || "";
  const followerCount = parseInt(document.body.innerText.match(/(\d+)\s+followers/)?.[1] || "0");
  const connectionCount = parseInt(document.body.innerText.match(/(\d+)\s+connections/)?.[1] || "0");

  const profileData = { name, url: window.location.href, about, bio, location, followerCount, connectionCount };

  await fetch("http://localhost:3000/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profileData)
  });
  chrome.runtime.sendMessage({ action: "profileDone" });
})();
