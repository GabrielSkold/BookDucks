const BOOKS_ENDPOINT = `${BASE_URL}/api/books?populate=cover`;

const booksContainer = document.querySelector("#books-container");
const loggedInUserText = document.querySelector("#logged-in-user");

let books = [];

const init = () => {
    setupLogoutButton();
    updateUserText();
    fetchBooks();
    fetchTheme();
};

const updateUserText = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && loggedInUserText) {
        loggedInUserText.textContent = `Logged in as: ${user.username}`;
    }
};

const fetchBooks = async () => {
    try {
        const response = await axios.get(BOOKS_ENDPOINT);
        books = response.data.data;
        renderBooks();
    } catch (error) {
        console.error("Failed to fetch books:", error);
    }
};

const renderBooks = () => {
    booksContainer.innerHTML = "";

    books.forEach((book) => {
        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");

        const imageUrl = getCoverUrl(book);

        bookCard.innerHTML = `
            <h2>Title: ${book.title}</h2>
            <p>Author: ${book.author}</p>
            <p>Pages: ${book.pages}</p>
            <img src="${imageUrl}" alt="${book.title}">
            <p>Published: ${book.publishedDate}</p>
        `;

        bookCard.addEventListener("click", () => {
            renderBookDetails(book);
        });

        booksContainer.append(bookCard);
    });
};

const renderBookDetails = (book) => {
    booksContainer.innerHTML = "";

    const bookDetails = document.createElement("div");
    bookDetails.classList.add("book-details");

    const imageUrl = getCoverUrl(book);

    bookDetails.innerHTML = `
        <div class="details-image-section">
            <button id="back-btn">← Back</button>

            <img src="${imageUrl}" alt="${book.title}">
        </div>

        <div class="details-info-section">
            <h1>${book.title}</h1>

            <p><strong>Author:</strong> ${book.author}</p>

            <p><strong>Pages:</strong> ${book.pages}</p>

            <p><strong>Published:</strong> ${book.publishedDate}</p>
        </div>

        <div class="details-actions-section">
            <button id="save-btn">Save to reading list</button>
        </div>
    `;

    booksContainer.append(bookDetails);

    document.querySelector("#back-btn").addEventListener("click", () => {
        renderBooks();
    });

    document.querySelector("#save-btn").addEventListener("click", async () => {
        await saveBookToReadingList(book);
    });
};

const saveBookToReadingList = async (book) => {
    try {
        const user = await getCurrentUser();

        const currentBooks = user.readingList || [];

        const alreadySaved = currentBooks.some((savedBook) => {
            return savedBook.id === book.id;
        });

        if (alreadySaved) {
            alert(`${book.title} is already in your reading list`);
            return;
        }

        const updatedBookIds = currentBooks.map((savedBook) => savedBook.id);
        updatedBookIds.push(book.id);

        await axios.put(
            `${BASE_URL}/api/users/${user.id}`,
            {
                readingList: updatedBookIds,
            },
            getAuthHeaders(),
        );

        alert(`${book.title} saved!`);
    } catch (error) {
        console.error("Failed to save book:", error);
        alert("You need to be logged in to save books");
    }
};

const getCoverUrl = (book) => {
    if (book.cover && book.cover.url) {
        return BASE_URL + book.cover.url;
    }

    return "images/placeholder.png";
};

init();
