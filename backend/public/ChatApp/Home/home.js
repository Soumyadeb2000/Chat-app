let messages = [];
let count = 0;
const allChat = document.getElementById('all-chat');
const sendMediaForm = document.getElementById('send-media-form');

async function checkAdmin(group) {
   const response = await axios.get(`http://13.232.181.11:3000/ChatApp/group/check-admin/${group}`, {headers: {'Authorization': localStorage.getItem('token')}});
   localStorage.setItem(group, response.data.isAdmin);
}

async function sendChat(event) {
    try {
        event.preventDefault()
        const message = event.target.message.value;
        const obj = {message: message};
        const response = await axios.post(`http://13.232.181.11:3000/ChatApp/chat/send-chat/${localStorage.getItem('activeGroup')}`, obj, {headers: {'Authorization': localStorage.getItem('token')}});
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

async function sendMediaChat(event) {
    event.preventDefault();
    const form = document.getElementById('media-chat');
    const url = `http://13.232.181.11:3000/ChatApp/chat/get-multimedia-chat/${localStorage.getItem('activeGroup')}`;
    const formData = new FormData(form);
    const header = new Headers();
    header.append('Authorization', localStorage.getItem('token'));
    const reqInit = {
        method: 'POST',
        headers: header,
        body: formData
    }
    await fetch(url, reqInit);

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
    if(data.message.substring(0,25) === "https://chatappbucket1234") {
        const start = data.message.lastIndexOf("/") + 1;
        const fileName = data.message.substring(start, data.message.length);
        childElm.innerHTML = `<b>${data.name}</b> : <a href="${data.message}">${fileName}</a>`;
    }
    else {
        childElm.innerHTML = `<b>${data.name}</b> : ${data.message}`;
    }
    
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
        if(msg) {
            const chatBody = document.getElementById('chat-display-area');
            chatBody.innerHTML="";
            for (let i = 0; i < msg.length; i++) {
                const element = msg[i];
                showChat(element);
            }
            allChat.style.display = 'block';
            sendMediaForm.style.display = 'block';
        }
        else {
            
        }
        updateChat();
    }, 1000)
});

async function storeMessageInLocalStorage() {
    const token = localStorage.getItem('token');
    const user = parseJwt(token)
    const response = await axios.get(`http://13.232.181.11:3000/ChatApp/chat/get-chat/${localStorage.getItem('activeGroup')}`);
    for (let i = 0; i < response.data.chatData.length; i++) {
        const element = response.data.chatData[i];
        if(element.name === user.name) {
            element.name = "Me"
        }
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
    const response = await axios.get(`http://13.232.181.11:3000/ChatApp/chat/get-chat/${localStorage.getItem('activeGroup')}/?lastMessageId=${lastMessageId}`); 
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

async function addToGroup(event) {
    try {
        event.preventDefault();
        const name = event.target.name.value;
        await axios.post('http://13.232.181.11:3000/ChatApp/admin/add-member', {name, group: localStorage.getItem('activeGroup')});  
    } catch (error) {
        console.log(error.message);
    }
}

const createGroupBtn = document.getElementById('create-group-btn');
const createGroupForm = document.getElementById('create-group-form');
createGroupBtn.addEventListener('click', () => {
    if(createGroupForm.style.display === 'none') {
        createGroupBtn.textContent = 'Exit';
        createGroupForm.style.display = 'block';
        allChat.style.display = 'none';
        sendMediaForm.style.display = 'none';
    }
    else {
        createGroupBtn.textContent = 'Create new group';
        createGroupForm.style.display = 'none';
    }  
})


const showGroupsBtn = document.getElementById('show-groups-btn');
const showGroupsBody = document.getElementById('user-groups');
const addToGroupBtn = document.getElementById('add-to-group-btn');
const addToGroupForm = document.getElementById('add-to-group-form');
showGroupsBtn.addEventListener('click', () => {
    allChat.style.display = 'none';
    sendMediaForm.style.display = 'none';
    getGroups(showGroupsBtn.textContent);
    if(JSON.stringify(localStorage.getItem('messages')) === null || JSON.stringify(localStorage.getItem('messages')) === undefined) {
        document.getElementById('all-chat').style.display = "none";
    }
    if(showGroupsBody.style.display === 'none') {
        showGroupsBtn.textContent = 'Exit';
        showGroupsBody.style.display = 'block';
    }
    else {
        document.getElementById('exit-groups-btn').style.display = 'none';
        allChat.style.display = 'none';
        sendMediaForm.style.display = 'none';
        showGroupsBtn.textContent = 'My groups';
        showGroupsBody.style.display = 'none';
        localStorage.removeItem('activeGroup');
        localStorage.removeItem('messages');
        document.getElementById('chat-display-area').innerHTML = "";
        document.getElementById('all-chat').style.display = "none";
        addToGroupBtn.style.display = 'none';
        addToGroupForm.style.display = 'none';
        document.getElementById('show-members-area').innerHTML = '';
    }  
})

async function sendCreateGroupData(event) {
    event.preventDefault();
    try {
        const groupName = event.target.name.value;
        const obj = {groupName};
        await axios.post('http://13.232.181.11:3000/ChatApp/group/create-group', obj, {headers: {'Authorization': localStorage.getItem('token')}});
        alert("Group created");
        localStorage.setItem(groupName, true);
    } catch (error) {
        alert("Couln't create the group or it already exists.");
    }
}

async function getGroups(groupName) {
    try {
        const userGroups = document.getElementById('user-groups');
        userGroups.innerHTML="";
        if(groupName === 'My groups') {
            const response = await axios.get('http://13.232.181.11:3000/ChatApp/group/get-groups', {headers: {'Authorization': localStorage.getItem('token')}});
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
        }
    } catch (error) {
        alert(error.message);
    }
}

function switchGroup(btn) {
    btn.onclick = () => {
        const backBtn = document.getElementById('exit-groups-btn')
        backBtn.style.display = 'block';
        const userGroups = document.getElementById('user-groups')
        userGroups.style.display = 'none';

        document.getElementById('exit-groups-btn').onclick = () => {
            userGroups.style.display = 'block';
            backBtn.style.display = 'none';
            document.getElementById('show-members-area').style.display = 'none';
            allChat.style.display = "none";
            sendMediaForm.style.display = 'none';
            btn.classList = 'p-1 m-1 btn btn-outline-dark';
            localStorage.removeItem('activeGroup');
            document.getElementById('chat-display-area').innerHTML = "";
            messages = [];
            localStorage.removeItem('messages')
            addToGroupBtn.style.display = 'none';
            addToGroupForm.style.display = 'none';
            document.getElementById('show-members-area').style.display = 'none';
            document.getElementById('show-members-area').innerHTML = '';
        }

        if(allChat.style.display === "block") {
            allChat.style.display = "none";
            sendMediaForm.style.display = 'none';
            btn.classList = 'p-1 m-1 btn btn-outline-dark';
            localStorage.removeItem('activeGroup');
            document.getElementById('chat-display-area').innerHTML = "";
            messages = [];
            localStorage.removeItem('messages')
            addToGroupBtn.style.display = 'none';
            addToGroupForm.style.display = 'none';
            document.getElementById('show-members-area').style.display = 'none';
            document.getElementById('show-members-area').innerHTML = '';

        }
        else {
            allChat.style.display = "block";
            sendMediaForm.style.display = 'block';
            btn.classList = 'p-1 m-1 btn btn-dark';
            localStorage.setItem('activeGroup', btn.value);
            addToGroupBtn.style.display = 'block';
            storeMessageInLocalStorage();
            checkAdmin(btn.value)
            document.getElementById('show-members-area').style.display = 'block';
            showMembers(btn.value);
        }
    }
}

addToGroupBtn.addEventListener('click', () => {
    if(addToGroupBtn.textContent === "Add member") {
        addToGroupForm.style.display = 'block';
        addToGroupBtn.textContent = 'Close';

    }
    else {
        addToGroupBtn.textContent = "Add member";
        addToGroupForm.style.display = 'none';
    }
});

async function showMembers(group) {
    await new Promise ((resolve, reject) => {
        resolve( checkAdmin(group));
    })    
    const isAdmin = localStorage.getItem(group);
    console.log(isAdmin);
    const response = await axios.get(`http://13.232.181.11:3000/ChatApp/group/get-members/?group=${group}`);
    for (let i = 0; i < response.data.users.length; i++) {
        const parentElm = document.getElementById('show-members-area');
        const childElm = document.createElement('li');
        const removeBtn = document.createElement('input');
        const makeAdminBtn = document.createElement('input');
        const userData = response.data.users[i];
        const userName = response.data.users[i].user.name;
        childElm.textContent = userName;
        parentElm.appendChild(childElm);
        if(isAdmin === "true") {
            if(userData.isAdmin) {
                removeBtn.type = 'button';
                removeBtn.value = 'Remove';
                removeBtn.id = userData.userId;
                removeBtn.classList = 'btn btn-danger btn-sm p-0 m-1';
                childElm.appendChild(removeBtn);
                removeBtn.onclick = async () => {
                    removeMemberFromGroup(removeBtn, group);
                }
            }
            else {
                removeBtn.type = 'button';
                removeBtn.value = 'Remove';
                removeBtn.id = userData.userId;
                removeBtn.classList = 'btn btn-danger btn-sm p-0 m-1';
                childElm.appendChild(removeBtn);
                removeBtn.onclick = async () => {
                    removeMemberFromGroup(removeBtn, group);
                }
    
                makeAdminBtn.type = 'button';
                makeAdminBtn.value = 'Make admin';
                makeAdminBtn.id = userData.userId;
                makeAdminBtn.classList = 'btn btn-secondary btn-sm p-0 m-1';
                childElm.appendChild(makeAdminBtn);
                makeAdminBtn.onclick = async () => {
                    makeMemberAdmin(makeAdminBtn, group);
                    alert(`${userName} has been created an Admin of ${group}`)
                }
            }
        }  
    }   
}

async function makeMemberAdmin(btn, group) {
    const userId = btn.id;
    try {
        axios.put(`http://13.232.181.11:3000/ChatApp/admin/make-admin/${userId}?group=${group}`);
        childElm.removeChild(makeAdminBtn);
    } catch (error) {
        alert(`Failed to remove ${user.name}`);
    } 
}

async function removeMemberFromGroup(btn, group) {
    try {
        const userId = btn.id;
        axios.delete(`http://13.232.181.11:3000/ChatApp/admin/remove-member/${userId}/?group=${group}`);
        const parentElm = btn.parentElement.parentElement;
        const childElm = btn.parentElement;
        parentElm.removeChild(childElm);
        alert(`Member removed`)
    } catch (error) {
        alert(`Failed to remove`);
    } 
}

function parseJwt(token) {
    if (!token) {
      return;
    }
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  }