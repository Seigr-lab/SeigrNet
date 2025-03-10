document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Drag & Drop Initialized");

    function startDragging(icon, shiftX, shiftY) {
        const desktopContainer = document.getElementById("desktop-container");
        const containerRect = desktopContainer.getBoundingClientRect();
        const iconSize = 80;

        function moveAt(x, y) {
            let newLeft = x - shiftX;
            let newTop = y - shiftY;

            // Keep icons inside desktop container
            newLeft = Math.max(0, Math.min(containerRect.width - iconSize, newLeft));
            newTop = Math.max(0, Math.min(containerRect.height - iconSize, newTop));

            icon.style.left = `${newLeft}px`;
            icon.style.top = `${newTop}px`;
        }

        function onMouseMove(event) {
            moveAt(event.clientX - containerRect.left, event.clientY - containerRect.top);
        }

        document.addEventListener("mousemove", onMouseMove);

        document.addEventListener("mouseup", function stopDragging() {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", stopDragging);
        }, { once: true });
    }

    document.querySelectorAll(".icon").forEach(icon => {
        icon.addEventListener("mousedown", (event) => {
            event.preventDefault();

            let rect = icon.getBoundingClientRect();
            let shiftX = event.clientX - rect.left;
            let shiftY = event.clientY - rect.top;

            icon.style.position = "absolute";
            icon.style.zIndex = "5"; // Ensure icons stay behind windows

            startDragging(icon, shiftX, shiftY);
        });

        icon.addEventListener("dblclick", () => {
            let file = icon.getAttribute("data-file");
            openWindow(file, icon.querySelector("span").innerText);
        });

        icon.addEventListener("dragstart", (event) => {
            event.preventDefault();
        });
    });
});
