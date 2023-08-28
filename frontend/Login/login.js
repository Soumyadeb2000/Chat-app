async function login(event) {
    try {
        event.preventDefault()
        const email = event.target.email.value;
        const password = event.target.password.value;
        const obj = {email, password}
        await axios.post('http://localhost:3000/user/login', obj);
        alert('Successfully login.')
    } catch (error) {
        alert("User not found")
    }
}