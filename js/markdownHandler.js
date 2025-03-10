fetch(`./${file}.md`)
    .then(response => {
        if (!response.ok) throw new Error(`Failed to load ${file}`);
        return response.text();
    })
    .then(text => {
        let parsedMarkdown = marked.parse(text.replace(/\n/g, "  \n")); // Forces line breaks
        
        // Ensure email is properly displayed
        parsedMarkdown = parsedMarkdown.replace(
            /\[sonisk@seigr\.net\]\(mailto:sonisk@seigr\.net\)/g,
            `<a href="mailto:sonisk@seigr.net" style="text-decoration: none; color: #fff;">sonisk@seigr.net</a>`
        );

        let contentDiv = document.getElementById(`${file}-content`);
        contentDiv.innerHTML = `
            <div class="markdown-container">
                <div style="max-width: 600px; word-wrap: break-word;">
                    ${parsedMarkdown}
                </div>
            </div>
        `;
    })
    .catch(error => {
        let contentDiv = document.getElementById(`${file}-content`);
        contentDiv.innerHTML = `
            <div class="error-message">
                <p style="color:red;">Failed to load content.</p>
            </div>
        `;
    });
