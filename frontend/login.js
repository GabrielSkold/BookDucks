const loginIdentifierInput = document.querySelector("#login-identifier");
const loginPasswordInput = document.querySelector("#login-password");
const loginBtn = document.querySelector("#login-btn");

loginBtn.addEventListener("click", async () => {
    const identifier = loginIdentifierInput.value;
    const password = loginPasswordInput.value;

    try {
        const response = await axios.post(`${BASE_URL}/api/auth/local`, {
            identifier,
            password,
        });

        localStorage.setItem("authToken", response.data.jwt);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        window.location.href = "index.html";
    } catch (error) {
        console.error("Login failed:", error);
        alert("Login failed");
    }
});
fetchTheme();
