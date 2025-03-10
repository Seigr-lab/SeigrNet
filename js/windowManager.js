document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Window Manager Loaded");

    function openWindow(file, title) {
        let existingWindow = document.getElementById(`${file}-window`);
        if (existingWindow) {
            bringWindowToFront(existingWindow);
            return; // Prevent duplicate windows
        }

        let win = document.createElement("div");
        win.classList.add("window");
        win.id = `${file}-window`;
        win.style.position = "absolute";
        win.style.left = `${Math.min(100 + Math.random() * 300, window.innerWidth - 320)}px`;
        win.style.top = `${Math.min(100 + Math.random() * 200, window.innerHeight - 250)}px`;
        win.style.zIndex = "100"; // Make sure windows always stay on top

        win.innerHTML = `
            <div class="window-header">
                <span>${title}</span>
                <button class="close-btn" data-file="${file}">✖</button>
            </div>
            <div class="window-content" id="${file}-content">Loading...</div>
        `;

        document.getElementById("window-container").appendChild(win);

        bringWindowToFront(win);
        makeDraggable(win);
        makeResizable(win);

        let closeBtn = win.querySelector(".close-btn");
        if (closeBtn) {
            closeBtn.addEventListener("click", function(event) {
                event.stopPropagation();
                closeWindow(file);
            });
        }

        // ✅ Windows now block interaction with icons underneath
        win.addEventListener("mousedown", function(event) {
            event.stopPropagation();
            bringWindowToFront(win);
        });

        win.addEventListener("mouseover", function(event) {
            event.stopPropagation();
        });

        // ✅ Load Content
        if (file === "audio") {
            embedBandcamp(win);
        } else {
            fetch(`./${file}.md`)
                .then(response => {
                    if (!response.ok) throw new Error(`Failed to load ${file}`);
                    return response.text();
                })
                .then(text => {
                    document.getElementById(`${file}-content`).innerHTML = `
                        <div class="markdown-container">${marked.parse(text)}</div>
                    `;
                    fixMailtoLinks();
                })
                .catch(() => {
                    document.getElementById(`${file}-content`).innerHTML = `
                        <div class="error-message"><p style="color:red;">Failed to load content.</p></div>
                    `;
                });
        }
    }

    function closeWindow(file) {
        let windowElement = document.getElementById(`${file}-window`);
        if (windowElement) {
            windowElement.remove();
        }
    }

    function bringWindowToFront(win) {
        document.querySelectorAll(".window").forEach(w => w.style.zIndex = "10");
        win.style.zIndex = "200"; // Make sure active window is always at the front
    }

    function makeDraggable(win) {
        let header = win.querySelector(".window-header");
        let shiftX, shiftY;
        let isDragging = false;

        function onMouseMove(event) {
            if (!isDragging) return;
            win.style.left = `${Math.max(0, Math.min(event.clientX - shiftX, window.innerWidth - win.offsetWidth))}px`;
            win.style.top = `${Math.max(0, Math.min(event.clientY - shiftY, window.innerHeight - win.offsetHeight))}px`;
        }

        header.addEventListener("mousedown", function(event) {
            event.preventDefault();
            isDragging = true;
            shiftX = event.clientX - win.getBoundingClientRect().left;
            shiftY = event.clientY - win.getBoundingClientRect().top;
            bringWindowToFront(win);

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", function() {
                isDragging = false;
                document.removeEventListener("mousemove", onMouseMove);
            }, { once: true });
        });

        header.style.cursor = "grab";
    }

    function makeResizable(win) {
        win.style.resize = "both";
        win.style.overflow = "auto";
    }

    function fixMailtoLinks() {
        document.querySelectorAll('.markdown-container a[href^="mailto:"]').forEach(link => {
            link.addEventListener("click", function(event) {
                event.stopPropagation();
            });
        });
    }

    window.openWindow = openWindow;
    window.closeWindow = closeWindow;
});
