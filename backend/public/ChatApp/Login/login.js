async function login(event) {
    try {
        event.preventDefault()
        const email = event.target.email.value;
        const password = event.target.password.value;
        const obj = {email, password}
        const response = await axios.post('http://65.0.81.231:3000/ChatApp/user/login', obj);
        const token = response.data.token;
        localStorage.setItem('token', token);
        window.location.href = "../Home/home.html"
    } catch (error) {
        alert("User not found");
    }
}