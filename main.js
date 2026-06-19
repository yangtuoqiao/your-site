document.addEventListener("DOMContentLoaded", () => {

  let books = [];

  // 🚨 GitHub Pages 正确写法（关键修复）
  fetch("./books.json")
    .then(res => {
      if (!res.ok) {
        throw new Error("HTTP错误 " + res.status);
      }
      return res.json();
    })
    .then(data => {
      books = data;
      renderBooks(books);
    })
    .catch(err => {
      console.error("JSON加载失败：", err);
    });

  const input = document.getElementById("searchInput");

  input.addEventListener("input", function () {
    const keyword = this.value.toLowerCase().trim();

    const filtered = books.filter(book =>
      book.title.toLowerCase().includes(keyword)
    );

    renderBooks(filtered);
  });

  function renderBooks(list) {
    const container = document.getElementById("list");

    if (!container) return;

    container.innerHTML = list.length
      ? list.map(book => `
          <div class="book">
            <span>${book.title}</span>
            <a href="${book.file}" download>下载</a>
          </div>
        `).join("")
      : `<p style="text-align:center;">没有找到结果</p>`;
  }

});