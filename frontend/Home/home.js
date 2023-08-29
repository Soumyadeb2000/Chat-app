async function sendChat(event) {
    try {
        event.preventDefault()
        const message = event.target.message.value;
        const obj = {message: message};
        const response = await axios.post('http://localhost:3000/chat/send-chat', obj, {headers: {'Authorization': localStorage.getItem('token')}});
        showChat(response.data.userChat);
    } catch (error) {
        console.log(error.message);
    }
}

// let count = 0;
async function showChat(data) {
    const parentElm = document.getElementById('chat-display-area');
    const childElm = document.createElement('p');
    // if(count%2 == 0) {
    //     childElm.classList = "p-1 rounded"
    //     childElm.style = "background-color: lightgray;"
    // }
    childElm.innerHTML = `${data.name} : ${data.message}`;
    parentElm.appendChild(childElm);
    // count++;
}


window.addEventListener('DOMContentLoaded', setInterval(async () => {
    const chatBody = document.getElementById('chat-display-area');
    
    const response = await axios.get('http://localhost:3000/chat/get-chat', {headers: {'Authorization': localStorage.getItem('token')}});
    chatBody.innerHTML="";
    for (let i = 0; i < response.data.chatData.length; i++) {
        const element = response.data.chatData[i];
        console.log(element);
        showChat(element);
    }
}, 1000));



function parseJwt(token) {
    if (!token) {
        console.log("Not a token");
        return;
    }
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  }