async function sendChat(event) {
    try {
        event.preventDefault()
        const message = event.target.message.value;
        const obj = {message}
        await axios.post('http://localhost:3000/user/chatapp', obj);
    } catch (error) {
        console.log(error.message);
    }
}