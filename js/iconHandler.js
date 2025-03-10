function initializeIcons() {
    const icons = document.querySelectorAll(".icon");
    const iconSize = 80;
    const padding = 20;
    const desktopContainer = document.getElementById("desktop-container");
    const containerWidth = desktopContainer.clientWidth;
    const containerHeight = desktopContainer.clientHeight;
    const usedPositions = [];

    icons.forEach(icon => {
        let left, top, attempts = 0, maxAttempts = 50;
        let positionFound = false;

        while (!positionFound && attempts < maxAttempts) {
            left = Math.floor(Math.random() * (containerWidth - iconSize - padding));
            top = Math.floor(Math.random() * (containerHeight - iconSize - padding));

            if (!isOverlapping(left, top)) {
                positionFound = true;
                usedPositions.push({ left, top });
            }
            attempts++;
        }

        icon.style.left = `${left}px`;
        icon.style.top = `${top}px`;
    });

    function isOverlapping(left, top) {
        return usedPositions.some(pos =>
            Math.abs(pos.left - left) < iconSize + padding &&
            Math.abs(pos.top - top) < iconSize + padding
        );
    }
}
