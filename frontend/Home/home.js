let messages = [];
let count = 0;
async function sendChat(event) {
    try {
        event.preventDefault()
        const message = event.target.message.value;
        const obj = {message: message};
        const response = await axios.post('http://localhost:3000/chat/send-chat', obj, {headers: {'Authorization': localStorage.getItem('token')}});
        if(messages.length < 10) {
            messages.push(response.data.userChat);
        }   
        else {
            messages = messages.slice(1)
        }
        localStorage.setItem('messages', JSON.stringify(messages));
        showChat(response.data.userChat);
    } catch (error) {
        console.log(error.message);
    }
}

async function showChat(data) {
    const parentElm = document.getElementById('chat-display-area');
    const childElm = document.createElement('p');
    if(count%2 == 0) {
        childElm.classList = "p-1 rounded"
        childElm.style = "background-color: lightgray;"
    }
    childElm.innerHTML = `${data.name} : ${data.message}`;
    parentElm.appendChild(childElm);
    count++;
}

storeMessageInLocalStorage();

window.addEventListener('DOMContentLoaded', () => { setInterval(() => {
    if(count === 1)
        count = 1;
        else
        count = 0;
    const msg = JSON.parse(localStorage.getItem('messages'));
    if(msg) {
        const chatBody = document.getElementById('chat-display-area');
        chatBody.innerHTML="";
        for (let i = 0; i < msg.length; i++) {
            const element = msg[i];
            showChat(element);
        }
    }
    updateChat();
}, 1000)
});




async function storeMessageInLocalStorage() {
    const response = await axios.get('http://localhost:3000/chat/get-chat');
    for (let i = 0; i < response.data.chatData.length; i++) {
        const element = response.data.chatData[i];
        if(messages.length < 10) {
            messages.push(element);
        }
        else {
            messages = messages.slice(1);
            messages.push(element);
        }
    }
    localStorage.setItem('messages', JSON.stringify(messages));
}


let newMessages = [];
async function updateChat() {
    const messagesArrayInLocalStorage = JSON.parse(localStorage.getItem('messages'));
    const length = messagesArrayInLocalStorage.length - 1;
    const lastMessageId = messagesArrayInLocalStorage[length].id ;
    const response = await axios.get(`http://localhost:3000/chat/get-chat/?lastMessageId=${lastMessageId}`,); 
    for (let i = 0; i < response.data.newChatData.length; i++) {
        const element = response.data.newChatData[i];
        newMessages.push(element);
    }
    if((messages.length  + newMessages.length) < 10) {
        const arr = messages.concat(newMessages);
        localStorage.setItem('messages', JSON.stringify(arr))
    }
    else {
        messages = messages.slice((messages.length  + newMessages.length)-10);
        const arr = messages.concat(newMessages);
        localStorage.setItem('messages', JSON.stringify(arr))
    }
}

function parseJwt(token) {
    if (!token) {
        console.log("Not a token");
        return;
    }
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  }

  function checkMessagesInLS(arr) {

  }
