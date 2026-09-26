const uploadButton = document.querySelector(".upload-btn");

const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = ".txt,.html,.htm";
fileInput.style.display = "none";

document.body.appendChild(fileInput);

uploadButton.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    const book = {
      id: Date.now(),
      name: file.name,
      type: file.type,
      size: file.size,
      content: reader.result,
      addedAt: new Date().toISOString(),
      progress: 0
    };

    const books = JSON.parse(
      localStorage.getItem("nightreader-books") || "[]"
    );

    books.push(book);

    localStorage.setItem(
      "nightreader-books",
      JSON.stringify(books)
    );

    alert(`"${file.name}" has been added to your library.`);
  };

  reader.readAsText(file);
});
