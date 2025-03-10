function makeResizable(el) {
    const resizeHandle = document.createElement("div");
    resizeHandle.classList.add("resize-handle");
    el.appendChild(resizeHandle);

    let isResizing = false, startX, startY, startWidth, startHeight;

    resizeHandle.addEventListener("mousedown", function(e) {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = el.offsetWidth;
        startHeight = el.offsetHeight;

        function resize(e) {
            if (!isResizing) return;
            el.style.width = `${Math.max(250, startWidth + (e.clientX - startX))}px`;
            el.style.height = `${Math.max(200, startHeight + (e.clientY - startY))}px`;
        }

        document.addEventListener("mousemove", resize);
        document.addEventListener("mouseup", function stopResizing() {
            document.removeEventListener("mousemove", resize);
            document.removeEventListener("mouseup", stopResizing);
            isResizing = false;
        }, { once: true });
    });
}
