const feedAutomationFunction=async () => {
  const { likeCount = 0, commentCount = 0 } = await chrome.storage.local.get(["likeCount", "commentCount"]);
  console.log("Retrieved feed settings:", { likeCount, commentCount });

  let liked = 0;
  let commented = 0;

  const posts = document.querySelectorAll('.feed-shared-update-v2');
  console.log(`Found ${posts.length} posts`);

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    post.scrollIntoView({ behavior: "smooth", block: "center" });
    await new Promise(r => setTimeout(r, 1000));

  

    //like
    if (liked < likeCount) {
      const likeButton = post.querySelector('button[aria-label*="Like"]');
      if (likeButton) {
        likeButton.click();
        liked++;
      
        await new Promise(r => setTimeout(r, 1500));
      } else {
        console.warn(`⚠️ Like button not found in Post ${i + 1}`);
      }
    }

    //comment
    if (commented < commentCount) {
      const commentButton = post.querySelector('button[aria-label*="Comment"]');
      if (commentButton) {
        commentButton.click();
       
        await new Promise(r => setTimeout(r, 2000));

        const input = post.querySelector('.ql-editor[contenteditable="true"]');
        if (input) {
          input.innerHTML = "<p>CFBR</p>";
          input.dispatchEvent(new InputEvent("input", { bubbles: true }));
          let postBtn = post.querySelector('button.comments-comment-box__submit-button--cr');
          if (!postBtn) postBtn = document.querySelector('button.comments-comment-box__submit-button--cr');

          if (postBtn) {
            postBtn.click();
            commented++;
           
          } else {
            console.warn(`⚠️ Comment post button not found for Post ${i + 1}`);
          }
        }
        await new Promise(r => setTimeout(r, 1500));
      }
    }

    if (liked >= likeCount && commented >= commentCount) break;
  }



  const payload = {
    liked,
    commented,
    likeLimit: likeCount,
    commentLimit: commentCount,
    posts: posts.length,
    page: window.location.href,
    timestamp: new Date().toISOString(),
  };

  chrome.runtime.sendMessage({
    action: "sendToServer",
    payload,
  });
}

feedAutomationFunction();