let messages = [];
let count = 0;
const allChat = document.getElementById('all-chat');

async function sendChat(event) {
    try {
        event.preventDefault()
        const message = event.target.message.value;
        const obj = {message: message};
        const response = await axios.post(`http://localhost:3000/chat/send-chat/${localStorage.getItem('activeGroup')}`, obj, {headers: {'Authorization': localStorage.getItem('token')}});
        if(messages.length < 10) {
            messages.push(response.data.userChat);
        }   
        else {
            messages = messages.slice(1);
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
        childElm.classList = " p-1 rounded";
        childElm.style = "background-color: lightgray;";
    }
    else {
        childElm.classList = " p-1";
    }
    childElm.innerHTML = `<b>${data.name}</b> : ${data.message}`;
    parentElm.appendChild(childElm);
    count++;
}

storeMessageInLocalStorage();
window.addEventListener('DOMContentLoaded', () => { 
    setInterval(() => {
        if(count === 1)
            count = 1;
            else
            count = 0;
        const msg = JSON.parse(localStorage.getItem('messages'));
        const allChat = document.getElementById('all-chat');
        if(msg) {
            const chatBody = document.getElementById('chat-display-area');
            chatBody.innerHTML="";
            for (let i = 0; i < msg.length; i++) {
                const element = msg[i];
                showChat(element);
            }
            allChat.style.display = 'block';
        }
        else {
            
        }
        updateChat();
    }, 1000)
});

async function storeMessageInLocalStorage() {
    const response = await axios.get(`http://localhost:3000/chat/get-chat/${localStorage.getItem('activeGroup')}`);
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
    const response = await axios.get(`http://localhost:3000/chat/get-chat/${localStorage.getItem('activeGroup')}/?lastMessageId=${lastMessageId}`); 
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
        localStorage.setItem('messages', JSON.stringify(arr));
    }
}

const createGroupBtn = document.getElementById('create-group-btn');
const createGroupForm = document.getElementById('create-group-form');
createGroupBtn.addEventListener('click', () => {
    if(createGroupForm.style.display === 'none') {
        createGroupBtn.textContent = 'Exit';
        createGroupForm.style.display = 'block';
        
    }
    else {
        createGroupBtn.textContent = 'Create new group';
        createGroupForm.style.display = 'none';
    }  
})

const joinGroupBtn = document.getElementById('join-group-btn');
const joinGroupForm = document.getElementById('join-group-form');
joinGroupBtn.addEventListener('click', () => {
    if(joinGroupForm.style.display === 'none') {
        joinGroupBtn.textContent = 'Exit';
        joinGroupForm.style.display = 'block';
    }
    else {
        joinGroupBtn.textContent = 'Join new group';
        joinGroupForm.style.display = 'none';
    }  
})

const showGroupsBtn = document.getElementById('show-groups-btn');
const showGroupsBody = document.getElementById('user-groups');
showGroupsBtn.addEventListener('click', () => {
    getGroups();
    if(JSON.stringify(localStorage.getItem('messages')) === null || JSON.stringify(localStorage.getItem('messages')) === undefined) {
        document.getElementById('all-chat').style.display = "block";
    }
    if(showGroupsBody.style.display === 'none') {
        showGroupsBtn.textContent = 'Exit';
        showGroupsBody.style.display = 'block';
        
    }
    else {
        allChat.style.display = 'none';
        showGroupsBtn.textContent = 'My group';
        showGroupsBody.style.display = 'none';
        localStorage.removeItem('activeGroup');
        localStorage.removeItem('messages');
        document.getElementById('chat-display-area').innerHTML = "";

    }  
})

async function sendCreateGroupData(event) {
    event.preventDefault();
    try {
        const groupName = event.target.name.value;
        const obj = {groupName};
        await axios.post('http://localhost:3000/group/create-group', obj, {headers: {'Authorization': localStorage.getItem('token')}});
        alert("Group created");
    } catch (error) {
        alert("Couln't create the group or it already exists.");
    }
}

async function sendJoinGroupData(event) {
    event.preventDefault();
    try {
        const groupName = event.target.name.value;
        await axios.post('http://localhost:3000/group/join-group', {groupName}, {headers: {'Authorization': localStorage.getItem('token')}});
        alert('Group joined');
    } catch (error) {
        if(error.response.status === 409)
        alert('You are already in the group');
        else
        alert("Group doesn't exist");
    }
}

async function getGroups() {
    try {
        const userGroups = document.getElementById('user-groups');
        userGroups.innerHTML="";
        const response = await axios.get('http://localhost:3000/group/get-groups', {headers: {'Authorization': localStorage.getItem('token')}});
        for (let i = 0; i < response.data.groups.length; i++) {
            const group = response.data.groups[i];
            const btn = document.createElement('input');
            btn.type = 'button';
            btn.value = group.name;
            btn.id = group.name;
            btn.classList = 'p-1 m-1 btn btn-outline-dark';
            userGroups.appendChild(btn);
            switchGroup(btn);
        }
    } catch (error) {
        alert(error.message);
    }
}

function switchGroup(btn) {
    btn.onclick = (e) => {
        e.preventDefault();
        if(allChat.style.display === "block") {
            allChat.style.display = "none";
            btn.classList = 'p-1 m-1 btn btn-outline-dark';
            localStorage.removeItem('activeGroup');
            document.getElementById('chat-display-area').innerHTML = "";
            messages = [];
            localStorage.removeItem('messages')
        }
        else {
            btn.classList = 'p-1 m-1 btn btn-outline-dark';
            allChat.style.display = "block";
            btn.classList = 'p-1 m-1 btn btn-dark';
            localStorage.setItem('activeGroup', btn.value);
            storeMessageInLocalStorage();
            
        }
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


