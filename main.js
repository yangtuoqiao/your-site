// ===================== 修改成你自己仓库信息 =====================
const GITHUB_USER = "yangtuoqiao";
const GITHUB_REPO = "your-site";
const BRANCH = "main";
// =================================================================

const searchInput = document.getElementById("searchInput");
const resultBox = document.getElementById("list");

// 回车触发搜索
searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        searchTxtFile();
    }
});

async function searchTxtFile() {
    const keyword = searchInput.value.trim().toLowerCase();
    resultBox.innerHTML = "<p class='tip-text'>加载中，请稍等...</p >";

    if (!keyword) {
        resultBox.innerHTML = "<p class='tip-text'>请输入小说/文件关键词</p >";
        return;
    }

    try {
        // 请求仓库全部文件
        const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/git/trees/${BRANCH}?recursive=1`);
        const data = await res.json();

        if (!data.tree) throw new Error("仓库读取失败");

        // 只筛选 .txt 文件、匹配关键词
        const txtFiles = data.tree.filter(item => {
            const fileName = item.path.toLowerCase();
            return fileName.endsWith(".txt") && fileName.includes(keyword);
        });

        if (txtFiles.length === 0) {
            resultBox.innerHTML = "<p class='tip-text'>未找到匹配的TXT小说文件</p >";
            return;
        }

        // 渲染搜索列表
        let html = "";
        txtFiles.forEach(file => {
            const downloadUrl = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${BRANCH}/${file.path}`;
            const fileName = file.path.split("/").pop();
            html += `
                <div class="file-item">
                    <span>${file.path}</span>
                    <a class="download-txt" href=" " download="${fileName}">下载TXT小说</a >
                </div>
            `;
        });
        resultBox.innerHTML = html;

    } catch (err) {
        resultBox.innerHTML = `<p class='tip-text'>读取失败：${err.message}<br>网络波动，切换手机热点重试</p >`;
        console.error(err);
    }
}