const BASE_URL = "http://localhost:1337";
const BOOKS_ENDPOINTS = BASE_URL + "/api/books?populate=cover";
const READING_LIST_KEY = "readingList";

const booksContainer = document.querySelector("#books-container");
const readingListBtn = document.querySelector("#reading-list-btn");

let books = [];
let readingList = [];

const init = () => {
    loadFromLocalStorage();
    fetchBooks();
};

readingListBtn.addEventListener("click", () => {
    renderReadinglist();
});

const fetchBooks = () => {
    axios
        .get(BOOKS_ENDPOINTS)
        .then((response) => {
            books = response.data.data;
            renderBooks(books);
        })
        .catch((error) => {
            console.error("Failed to fetch books:", error);
        });
};

const renderBooks = () => {
    booksContainer.innerHTML = "";

    books.forEach((book) => {
        // console.log(book);

        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");
        const title = book.title;
        const author = book.author;
        const publishedDate = book.publishedDate;
        const imageUrl = getCoverUrl(book);
        const pageCount = book.pages;

        bookCard.innerHTML = `
        <h2>Title: ${title}</h2>
        <p>Author: ${author}</p>
        <img src="${imageUrl}" alt="${title}">
        <p>Published: ${publishedDate}</p>`;

        bookCard.addEventListener("click", () => {
            bookDetails(book);
        });

        booksContainer.append(bookCard);
    });
};

const bookDetails = (book) => {
    booksContainer.innerHTML = "";

    const bookDetails = document.createElement("div");
    bookDetails.classList.add("book-details");

    const title = book.title;
    const author = book.author;
    const publishedDate = book.publishedDate;
    const imageUrl = getCoverUrl(book);
    const pageCount = book.pages;

    bookDetails.innerHTML = `
    <button id="back-btn">← Back</button>
    <img src="${imageUrl}" alt="${title}">
    <h1>Title: ${title}</h1>
    <p>Author: ${author}</p>
    <p>Pages: ${pageCount}</p>
    <p>Published: ${publishedDate}</p>
    <button id="save-btn">Save to reading list</button>
    <button id="remove-btn">Remove from reading list</button>
    `;

    booksContainer.append(bookDetails);

    const backBtn = document.querySelector("#back-btn");

    backBtn.addEventListener("click", () => {
        renderBooks(books);
    });

    const saveBook = document.querySelector("#save-btn");

    saveBook.addEventListener("click", () => {
        const alreadySaved = readingList.some((savedBook) => {
            return savedBook.id === book.id;
        });

        if (alreadySaved) {
            alert(`${book.title} is already in your reading list`);
            return;
        }

        saveBook.textContent = "Saved ✓";
        readingList.push(book);
        saveToLocalStorage();
    });

    const removeBook = document.querySelector("#remove-btn");

    removeBook.addEventListener("click", () => {
        const index = readingList.findIndex((savedBook) => {
            return savedBook.id === book.id;
        });

        if (index === -1) {
            alert(`${book.title} is not in your reading list`);
            return;
        }

        readingList.splice(index, 1);
        alert(`${book.title} removed from reading list`);
        console.log(readingList);
    });
};

const renderReadinglist = () => {
    booksContainer.innerHTML = "";

    const readingListHeader = document.createElement("h1");
    readingListHeader.innerText = "Reading List";

    const sortByTitleBtn = document.createElement("button");
    const sortByAuthorBtn = document.createElement("button");

    sortByAuthorBtn.textContent = "Sort by Author";
    sortByTitleBtn.textContent = "Sort by Title";

    booksContainer.append(readingListHeader, sortByAuthorBtn, sortByTitleBtn);

    sortByTitleBtn.addEventListener("click", () => {
        readingList.sort((a, b) => {
            return a.title.localeCompare(b.title);
        });

        renderReadinglist();
    });

    sortByAuthorBtn.addEventListener("click", () => {
        readingList.sort((a, b) => {
            return a.author.localeCompare(b.author);
        });

        renderReadinglist();
    });

    readingList.forEach((book) => {
        const bookItem = document.createElement("div");
        bookItem.classList.add("reading-item");

        bookItem.innerHTML = `
        <p>${book.title}</p>
        <p>${book.author}</p>
        <button class="remove-btn">Remove</button>
        `;

        const removeBtn = bookItem.querySelector(".remove-btn");
        removeBtn.addEventListener("click", () => {
            readingList = readingList.filter((savedBook) => {
                return savedBook.id !== book.id;
            });
            saveToLocalStorage();
            renderReadinglist();
        });

        booksContainer.append(bookItem);
    });
};

const getCoverUrl = (book) => {
    if (book.cover && book.cover.url) {
        return BASE_URL + book.cover.url;
    } else {
        return "images/placeholder.png";
    }
};

const saveToLocalStorage = () => {
    localStorage.setItem(READING_LIST_KEY, JSON.stringify(readingList));
};

const loadFromLocalStorage = () => {
    const data = localStorage.getItem(READING_LIST_KEY);

    if (data) {
        readingList = JSON.parse(data);
    }
};

init();
