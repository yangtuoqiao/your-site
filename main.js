// 务必改成你自己的信息
const GITHUB_USER = "yangtuoqiao";
const GITHUB_REPO = "your-site";
const BRANCH = "main";

// 等待页面全部加载完成再绑定事件（你之前缺少DOM就绪判断，大概率元素还没加载完就绑定失败）
window.addEventListener("DOMContentLoaded", function(){
    const searchInput = document.getElementById("searchInput");
    const resultBox = document.getElementById("list");

    // 回车搜索
    searchInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            searchTxtFile();
        }
    });

    async function searchTxtFile() {
        const keyword = searchInput.value.trim().toLowerCase();
        resultBox.innerHTML = "<p class='tip-text'>正在加载仓库文件列表...</p >";

        if (!keyword) {
            resultBox.innerHTML = "<p class='tip-text'>请输入小说关键词再回车</p >";
            return;
        }

        try {
            const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/git/trees/${BRANCH}?recursive=1`;
            const res = await fetch(url);

            if (!res.ok) {
                throw new Error(`接口请求失败，状态码：${res.status}`);
            }

            const data = await res.json();
            if (!data.tree) {
                throw new Error("仓库无文件或分支名称错误");
            }

            const allTxt = data.tree.filter(item => {
                const path = item.path.toLowerCase();
                return path.endsWith(".txt");
            });

            const matchFiles = allTxt.filter(item => item.path.toLowerCase().includes(keyword));

            if (matchFiles.length === 0) {
                resultBox.innerHTML = `<p class='tip-text'>共找到${allTxt.length}个TXT文件，无匹配关键词「${keyword}」</p >`;
                return;
            }

            let html = "";
            matchFiles.forEach(file => {
                const raw = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${BRANCH}/${file.path}`;
                const fileName = file.path.split("/").pop();
                html += `
                    <div class="file-item">
                        <span>${file.path}</span>
                        <a class="download-txt" href=" " download="${fileName}">下载TXT</a >
                    </div>
                `;
            });
            resultBox.innerHTML = html;

        } catch (err) {
            resultBox.innerHTML = `
                <p class='tip-text'>
                    加载失败：${err.message}<br>
                    1. 检查用户名/仓库名/分支名<br>
                    2. 切换手机热点重试GitHub接口<br>
                    3. 仓库必须公开且存在txt文件
                </p >`;
            console.error(err);
        }
    }
})