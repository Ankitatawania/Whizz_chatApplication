let prompt=document.querySelector("#prompt")
let submitbtn=document.querySelector("#submit")
let chatContainer=document.querySelector(".chat-area")
let resetbtn = document.querySelector(".reset")
let botName = "EassyAssist"; 
let botImagePath = "assets/EasyAssist.png"; 

//background image change function
const backgroundItems = document.querySelectorAll('.background-options li');
const setBackground = (imageName) => {
    document.body.style.backgroundImage = `url('assets/${imageName}.jpg')`;
    localStorage.setItem('backgroundItems', imageName);
  };
const savedImage = localStorage.getItem('backgroundItems');
  if (savedImage) {
    setBackground(savedImage);
  }
backgroundItems.forEach(item => {
  item.addEventListener('click', () => {
    const imageName = item.getAttribute('data-image');
    setBackground(imageName) ;
     
  });
});

// transparency function
const transparencyLevel = document.querySelectorAll('.transparency-options li');
const setTransparency = (opacity) => {
    chatContainer.style.backgroundColor = `rgba(150, 136, 186 , ${opacity})`;
    localStorage.setItem('transparencyLevel', opacity);
  };
const savedOpacity = localStorage.getItem('transparencyLevel');
if (savedOpacity) {
  setTransparency(savedOpacity);
}
transparencyLevel.forEach(item => {
    item.addEventListener('click', () => {
      const opacity = item.getAttribute('level'); 
      setTransparency(opacity);
    });
  });

//reset chat function
function resetChat(){
    const chatContent = document.querySelector(".chat-area");
    chatContent.innerHTML ='';
}

resetbtn.addEventListener("click",()=>{
    resetChat();
})

// changing bot name and image function
const botItems = document.querySelectorAll(".bot-item");

botItems.forEach((item) => {
    item.addEventListener("click", function () {
        
        botName = this.querySelector(".bot-details h3").textContent;
        botImagePath = this.querySelector(".bot-icon img").src;

        
        document.getElementById("bot-name").querySelector("h1").textContent = botName;

        
        document.getElementById("bot-img").src = botImagePath;

        
        document.getElementById("aiImage").src = botImagePath;
        resetChat();
        
    });
});


const Api_Url="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDjmpMWgWkseqCqa7TbbmsqPIbAPaWrqjQ "




let user={
    message:null,
    file:{
        mime_type:null,
        data: null
    }
}
 
async function generateResponse(aiChatBox) {

let text=aiChatBox.querySelector(".ai-chat-area")
    let RequestOption={
        method:"POST",
        headers:{'Content-Type' : 'application/json'},
        body:JSON.stringify({
            "contents":[
                {"parts":[{text:user.request},(user.file.data?[{inline_data:user.file}]:[])

                ]
            }]
        })
    }
    try{
        let response= await fetch(Api_Url,RequestOption)
        let data=await response.json()
       let apiResponse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
       text.innerHTML=apiResponse    
    }
    catch(error){
        console.log(error);
        
    }
   
}



function createChatBox(html,classes){
    let div=document.createElement("div")
    div.innerHTML=html
    div.classList.add(classes)
    return div
}


function handlechatResponse(userMessage,prompt){
    user.message=userMessage
    user.request=prompt
    let html=`<img src="assets/user.png" alt="" id="userImage" width="8%">
<div class="user-chat-area">
${user.message}
</div>`

let userChatBox=createChatBox(html,"user-chat-box")
chatContainer.appendChild(userChatBox)

chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})

setTimeout(()=>{
let html=`<img src="${botImagePath}" alt="" id="aiImage" width="9%">
    <div class="ai-chat-area">
    <img src="loading.webp" alt="" class="load" width="50px">
    </div>`
    let aiChatBox=createChatBox(html,"ai-chat-box")
    chatContainer.appendChild(aiChatBox)
    generateResponse(aiChatBox)

},600)



}



function handleSend(event) {
        if (event.type === 'click' || (event.type === 'keydown' && event.key === 'Enter')){ 
                
                if (botName === "CheerGuide") {
                        
                    message = `you are a playing role of Cheer guide. your charcteristic is being empathetic and supportive. So answer accordingly to this message ${prompt.value}`
                } else if (botName === "WiseWhiz") {
                        
                    message = `you are a playing role of WiseWhiz. your charcteristic is being wise and intellectual. So answer accordingly to this message ${prompt.value}`
                } else if (botName === "GiggleBot") {
                        
                    message = `you are a playing role of GiggleBot. your charcteristic is being funny and friendly. Try making interactive conversation but short. So answer accordingly to this message ${prompt.value}`
                } else if (botName === "ImagiMuse") {
                        
                    message = `you are a playing role of ImagiMuse. your charcteristic is being creative and artistic. So answer accordingly to this message ${prompt.value}`
                } else{
                    message =`${prompt.value}`
                }
            handlechatResponse(prompt.value ,message)
            prompt.value=""
               
        
              
    }
}

prompt.addEventListener("keydown",handleSend)

submitbtn.addEventListener("click",handleSend)





