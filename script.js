const uploadButton = document.querySelector(".upload-btn");
const booksContainer = document.querySelector(".books");
const searchInput = document.querySelector(".search");

const fileInput = document.createElement("input");

fileInput.type = "file";
fileInput.accept = ".txt,.html,.htm";
fileInput.style.display = "none";

document.body.appendChild(fileInput);


// ==============================
// STORAGE
// ==============================

function getBooks() {
  return JSON.parse(
    localStorage.getItem("nightreader-books") || "[]"
  );
}

function saveBooks(books) {
  localStorage.setItem(
    "nightreader-books",
    JSON.stringify(books)
  );
}


// ==============================
// UPLOAD
// ==============================

uploadButton.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {

    const books = getBooks();

    const book = {
      id: Date.now(),
      name: file.name,
      type: file.type,
      size: file.size,
      content: reader.result,
      addedAt: new Date().toISOString(),
      progress: 0
    };

    books.push(book);

    saveBooks(books);

    renderBooks();

    alert(`"${file.name}" added to your library.`);
  };

  reader.readAsText(file);

  fileInput.value = "";
});


// ==============================
// RENDER LIBRARY
// ==============================

function renderBooks(searchTerm = "") {

  const books = getBooks();

  const filteredBooks = books.filter(book =>
    book.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  booksContainer.innerHTML = "";

  if (filteredBooks.length === 0) {

    booksContainer.innerHTML = `
      <div style="
        grid-column: 1 / -1;
        padding: 50px 20px;
        text-align: center;
        color: #8e96a6;
      ">
        <div style="font-size: 40px; margin-bottom: 12px;">
          📚
        </div>

        <div style="
          font-size: 17px;
          color: #f2f4f8;
          margin-bottom: 6px;
        ">
          Your library is empty
        </div>

        <div style="font-size: 13px;">
          Upload a book to start reading.
        </div>
      </div>
    `;

    return;
  }


  filteredBooks.forEach(book => {

    const article = document.createElement("article");

    article.className = "book";

    const progress = Math.round(book.progress || 0);

    article.innerHTML = `
      <div class="book-image">
        📖
      </div>

      <div class="book-title" title="${escapeHTML(book.name)}">
        ${escapeHTML(book.name)}
      </div>

      <div class="book-author">
        ${progress}% read
      </div>
    `;

    article.addEventListener("click", () => {
      openBook(book.id);
    });

    booksContainer.appendChild(article);
  });
}


// ==============================
// SEARCH
// ==============================

searchInput.addEventListener("input", () => {

  renderBooks(searchInput.value);

});


// ==============================
// OPEN BOOK
// ==============================

function openBook(bookId) {

  const books = getBooks();

  const book = books.find(
    item => item.id === bookId
  );

  if (!book) return;

  alert(
    `Opening "${book.name}"\n\n` +
    `The reader will be connected here next.`
  );
}


// ==============================
// SECURITY HELPER
// ==============================

function escapeHTML(value) {

  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


// ==============================
// START APP
// ==============================

renderBooks();
