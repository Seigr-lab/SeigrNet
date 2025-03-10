function loadMarkdown(file, win) {
    fetch(`./${file}.md`)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load ${file}`);
            return response.text();
        })
        .then(text => {
            document.getElementById(`${file}-content`).innerHTML = `
                <div class="markdown-container">
                    ${marked.parse(text)}
                </div>
            `;
        })
        .catch(error => {
            document.getElementById(`${file}-content`).innerHTML = `
                <div class="error-message"><p style="color:red;">Failed to load content.</p></div>
            `;
        });
}
