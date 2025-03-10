function embedBandcamp(win) {
    let contentDiv = document.getElementById(`${win.id}-content`);
    contentDiv.innerHTML = `
        <div class="bandcamp-container">
            <h2>🎵 My Portfolio</h2>
            <iframe style="border: 0; width: 100%; height: 180px;" 
                src="https://bandcamp.com/EmbeddedPlayer/album=3513425101/size=large/bgcol=333333/linkcol=e32c14/artwork=small/transparent=true/" 
                seamless>
            </iframe>
        </div>
    `;

    win.style.width = "420px";
    win.style.height = "250px";
}
