// Register Service Worker for PWA / Chrome Install
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((err) => {
      console.log("Service Worker registration failed:", err);
    });
  });
}

/* ====================================================
   REELSAVE — FINAL MATCHED JAVASCRIPT (SERVER 1 & 2)
======================================================= */

// Download Again Button Handler (Global Scope)
function resetDownloaderUI() {
    const urlInput = document.getElementById("urlInput");
    const resultContainer = document.getElementById("resultContainer");
    const videoPreview = document.getElementById("videoPreview");
    const message = document.getElementById("message");

    if (urlInput) urlInput.value = "";
    if (videoPreview) {
        videoPreview.pause();
        videoPreview.removeAttribute("src");
        videoPreview.load();
    }
    if (resultContainer) resultContainer.classList.add("hidden");
    if (message) {
        message.textContent = "";
        message.className = "message";
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}


document.addEventListener("DOMContentLoaded", () => {

    // EXACT WORKING API DETAILS
    const RAPID_API_KEY  = "c226f9c559msh6075143f957b67cp1c488cjsn50c46061a4cb"; 
    const RAPID_API_HOST = "instagram-downloader-scraper-reels-igtv-posts-stories.p.rapidapi.com";

    const form = document.getElementById("downloadForm");
    const urlInput = document.getElementById("urlInput");
    const pasteBtn = document.getElementById("pasteBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const message = document.getElementById("message");

    const resultContainer = document.getElementById("resultContainer");
    const videoPreview = document.getElementById("videoPreview");
    const downloadServer1 = document.getElementById("downloadServer1");
    const downloadServer2 = document.getElementById("downloadServer2");
    const installBtn = document.getElementById("installBtn");


    /* --------------------------
       SHOW MESSAGE
    -------------------------- */
    function showMessage(text, type = "info") {
        if (!message) return;
        message.textContent = text;
        message.className = "message " + type;
    }


    /* --------------------------
       RESET VIDEO RESULT
    -------------------------- */
    function resetResult() {
        if (videoPreview) {
            videoPreview.pause();
            videoPreview.removeAttribute("src");
            videoPreview.load();
        }

        if (downloadServer1) downloadServer1.removeAttribute("href");
        if (downloadServer2) downloadServer2.removeAttribute("href");

        if (resultContainer) {
            resultContainer.classList.add("hidden");
        }
    }


    /* --------------------------
       PASTE BUTTON
    -------------------------- */
    if (pasteBtn) {
        pasteBtn.addEventListener("click", async () => {
            try {
                if (!navigator.clipboard || !navigator.clipboard.readText) {
                    throw new Error("Clipboard unavailable");
                }

                const copiedText = await navigator.clipboard.readText();

                if (!copiedText.trim()) {
                    showMessage("Your clipboard is empty.", "error");
                    return;
                }

                urlInput.value = copiedText.trim();
                showMessage("Link pasted successfully.", "success");

            } catch (error) {
                showMessage("Please paste your link manually.", "error");
                urlInput.focus();
            }
        });
    }


    /* --------------------------
       FORM SUBMISSION (LIVE API CALL)
    -------------------------- */
    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            resetResult();

            const enteredLink = urlInput.value.trim();

            if (!enteredLink) {
                showMessage("Please enter an Instagram Reel link.", "error");
                return;
            }

            if (!enteredLink.includes("instagram.com")) {
                showMessage("Please enter a valid Instagram URL.", "error");
                return;
            }

            // Loading State
            downloadBtn.disabled = true;
            downloadBtn.innerHTML = 'Downloading Reel... <span>⏳</span>';
            showMessage("Fetching high-quality video from Instagram...", "info");

            try {
                const apiUrl = `https://${RAPID_API_HOST}/scraper?url=${encodeURIComponent(enteredLink)}`;

                const response = await fetch(apiUrl, {
                    method: "GET",
                    headers: {
                        "x-rapidapi-key": RAPID_API_KEY,
                        "x-rapidapi-host": RAPID_API_HOST
                    }
                });

                const data = await response.json();

                if (data.message) {
                    throw new Error(data.message);
                }

                // Video link extract karna (data.data[0] se)
                let videoUrl = null;

                if (data.data && Array.isArray(data.data) && data.data.length > 0) {
                    const firstItem = data.data[0];
                    for (const key in firstItem) {
                        if (typeof firstItem[key] === "string" && firstItem[key].startsWith("http")) {
                            videoUrl = firstItem[key];
                            break;
                        }
                    }
                } else if (data.data && typeof data.data === "object") {
                    for (const key in data.data) {
                        if (typeof data.data[key] === "string" && data.data[key].startsWith("http")) {
                            videoUrl = data.data[key];
                            break;
                        }
                    }
                } else if (data.url || data.video_url || data.media) {
                    videoUrl = data.url || data.video_url || data.media;
                }

                if (!videoUrl) {
                    throw new Error("Video link not found. Please verify the Reel is from a public account.");
                }

                // Dono Server Buttons aur Player me Link set karein (No Null Error)
                if (videoPreview) {
                    videoPreview.src = videoUrl;
                }

                if (downloadServer1) {
                    downloadServer1.href = videoUrl;
                    downloadServer1.download = "ReelSave_HD_Video.mp4";
                }

                if (downloadServer2) {
                    downloadServer2.href = videoUrl;
                    downloadServer2.download = "ReelSave_HD_Video.mp4";
                }

                if (resultContainer) {
                    resultContainer.classList.remove("hidden");
                }

                downloadBtn.disabled = false;
                downloadBtn.innerHTML = 'Continue <span>→</span>';
                showMessage("✓ Video ready! Tap DOWNLOAD below.", "success");

            } catch (error) {
                console.error("Download Error:", error);
                downloadBtn.disabled = false;
                downloadBtn.innerHTML = 'Continue <span>→</span>';
                resetResult();

                showMessage("Error: " + error.message, "error");
            }
        });
    }


    /* --------------------------
       FAQ ACCORDION
    -------------------------- */
    const faqButtons = document.querySelectorAll(".faq-toggle");

    faqButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const currentCard = button.closest(".faq-card");
            const isAlreadyOpen = currentCard.classList.contains("active");

            document.querySelectorAll(".faq-card").forEach((card) => {
                card.classList.remove("active");
                const toggle = card.querySelector(".faq-toggle");
                if (toggle) toggle.setAttribute("aria-expanded", "false");
            });

            if (!isAlreadyOpen) {
                currentCard.classList.add("active");
                button.setAttribute("aria-expanded", "true");
            }
        });
    });


    /* --------------------------
       PWA INSTALL BUTTON
    -------------------------- */
    let deferredInstallPrompt = null;

    window.addEventListener("beforeinstallprompt", (event) => {
        event.preventDefault();
        deferredInstallPrompt = event;
        if (installBtn) installBtn.hidden = false;
    });

    if (installBtn) {
        installBtn.addEventListener("click", async () => {
            if (!deferredInstallPrompt) return;
            deferredInstallPrompt.prompt();
            await deferredInstallPrompt.userChoice;
            deferredInstallPrompt = null;
            installBtn.hidden = true;
        });
    }

    window.addEventListener("appinstalled", () => {
        if (installBtn) installBtn.hidden = true;
        showMessage("ReelSave has been installed.", "success");
    });


    /* --------------------------
       INPUT CHANGE
    -------------------------- */
    if (urlInput) {
        urlInput.addEventListener("input", () => {
            if (message && message.textContent) {
                message.textContent = "";
                message.className = "message";
            }
            resetResult();
        });
    }

});
