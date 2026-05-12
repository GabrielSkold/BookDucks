const BASE_URL = "http://localhost:1337";

const getToken = () => {
    return localStorage.getItem("authToken");
};

const getAuthHeaders = () => {
    return {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    };
};

const getCurrentUser = async () => {
    const response = await axios.get(
        `${BASE_URL}/api/users/me?populate=readingList.cover`,
        getAuthHeaders(),
    );

    return response.data;
};

const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = "login.html";
};

const setupLogoutButton = () => {
    const logoutBtn = document.querySelector("#logout-btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }
};

const fetchTheme = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/theme`);
        const theme = response.data.data;

        document.body.classList.remove(
            "theme-dark",
            "theme-light",
            "theme-blue",
        );

        document.body.classList.add(`theme-${theme.themeName}`);
    } catch (error) {
        console.error("Failed to fetch theme:", error);
    }
};
