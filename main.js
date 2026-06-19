let books = [];

fetch("books.json")
  .then(res => res.json())
  .then(data => {
    books = data;
    renderBooks(books);
  })
  .catch(err => {
    console.log("JSON加载失败：", err);
  });


const input = document.getElementById("searchInput");

input.addEventListener("input", function () {
  const keyword = this.value.toLowerCase();

  const filtered = books.filter(book =>
    book.title.toLowerCase().includes(keyword)
  );

  renderBooks(filtered);
});

function renderBooks(list) {
  const container = document.getElementById("list");

  container.innerHTML = list.map(book => `
    <div class="book">
      <span>${book.title}</span>
      <a href="${book.file}" download>下载</a>
    </div>
  `).join("");
}