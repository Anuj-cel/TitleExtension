async function  getTitle ()
{
    try{
        const [tab]=await chrome.tabs.query({active:true,currentWindow:true})
        const tabTitle=document.querySelector("#tabTitle")
        tabTitle.innerHTML=tab.title;
        console.log(tab.title);
    }catch(err)
    {
        console.log("Error: ",err);
    }
}
window.addEventListener("load",()=>{
    getTitle();
})