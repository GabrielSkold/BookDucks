const profileTitle = document.querySelector("#profile-title");
const loggedInUserText = document.querySelector("#logged-in-user");
const readingListContainer = document.querySelector("#reading-list-container");

const sortTitleBtn = document.querySelector("#sort-title-btn");
const sortAuthorBtn = document.querySelector("#sort-author-btn");

let readingList = [];

const init = async () => {
    setupLogoutButton();
    fetchTheme();
    await loadProfile();
};

const loadProfile = async () => {
    try {
        const user = await getCurrentUser();

        profileTitle.textContent = `${user.username}'s Profile`;
        loggedInUserText.textContent = `Logged in as: ${user.username}`;

        readingList = user.readingList || [];

        renderReadingList(readingList);
    } catch (error) {
        console.error("Failed to load profile:", error);
        alert("You need to login first");
        window.location.href = "login.html";
    }
};

const renderReadingList = (list) => {
    readingListContainer.innerHTML = "";

    if (list.length === 0) {
        readingListContainer.innerHTML = `<p class="empty-message">Your reading list is empty.</p>`;

        return;
    }

    list.forEach((book) => {
        const bookItem = document.createElement("div");
        bookItem.classList.add("reading-item");

        bookItem.innerHTML = `
            <p><strong>${book.title}</strong></p>
            <p>${book.author}</p>
            <button class="remove-btn">Remove</button>
        `;

        const removeBtn = bookItem.querySelector(".remove-btn");

        removeBtn.addEventListener("click", async () => {
            await removeBookFromReadingList(book.id);
            await loadProfile();
        });

        readingListContainer.append(bookItem);
    });
};

const removeBookFromReadingList = async (bookId) => {
    const user = await getCurrentUser();

    const updatedBookIds = user.readingList
        .filter((book) => book.id !== bookId)
        .map((book) => book.id);

    await axios.put(
        `${BASE_URL}/api/users/${user.id}`,
        {
            readingList: updatedBookIds,
        },
        getAuthHeaders(),
    );
};

sortTitleBtn.addEventListener("click", () => {
    readingList.sort((a, b) => a.title.localeCompare(b.title));
    renderReadingList(readingList);
});

sortAuthorBtn.addEventListener("click", () => {
    readingList.sort((a, b) => a.author.localeCompare(b.author));
    renderReadingList(readingList);
});

init();
