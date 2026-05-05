const BASE_URL = "http://localhost:1337";
const BOOKS_ENDPOINTS = BASE_URL + "/api/books?populate=cover";

const booksContainer = document.querySelector("#books-container");

let books = [];

axios
    .get("http://localhost:1337/api/books?populate=cover")
    .then((response) => {
        books = response.data.data;

        console.log(books);
    })
    .catch((error) => {
        console.log(error);
    });
