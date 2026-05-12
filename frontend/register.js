const registerUsernameInput = document.querySelector("#register-username");
const registerEmailInput = document.querySelector("#register-email");
const registerPasswordInput = document.querySelector("#register-password");
const registerBtn = document.querySelector("#register-btn");

registerBtn.addEventListener("click", async () => {
    const username = registerUsernameInput.value;
    const email = registerEmailInput.value;
    const password = registerPasswordInput.value;

    try {
        const response = await axios.post(
            `${BASE_URL}/api/auth/local/register`,
            {
                username,
                email,
                password,
            },
        );

        localStorage.setItem("authToken", response.data.jwt);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        window.location.href = "index.html";
    } catch (error) {
        console.error("Registration failed:", error);
        alert("Registration failed");
    }
});
fetchTheme();
