async function login(event) {
    try {
        event.preventDefault()
        const email = event.target.email.value;
        const password = event.target.password.value;
        const obj = {email, password}
        const response = await axios.post('http://localhost:3000/user/login', obj);
        const token = response.data.token;
        localStorage.setItem('token', token);
        alert('Successfully login.');
        window.location.href = "http://127.0.0.1:5500/frontend/Home/home.html"
    } catch (error) {
        alert("User not found");
    }
}