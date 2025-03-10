document.addEventListener("DOMContentLoaded", () => {
    if (typeof marked === "undefined") {
        console.error("🚨 Marked.js is not loaded. Markdown parsing will not work!");
        return;
    } else {
        console.log("✅ Marked.js is loaded.");
    }

    initializeIcons();
});
