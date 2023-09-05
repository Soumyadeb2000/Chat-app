async function signup(event) {
    try {
        event.preventDefault()
        const name = event.target.name.value;
        const email = event.target.email.value;
        const phone = event.target.phone.value;
        const password = event.target.password.value;
        const obj = {name, email, phone, password}
        await axios.post('http://localhost:3000/ChatApp/user/signup', obj);
        window.location.href = "../Login/login.html"
    } catch (error) {
        alert("User already exists, Please Login.")
    }
}