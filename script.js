/* ====================================================
   REELSAVE — PRODUCTION JS (VIDEO + AUDIO EXTRACTION)
======================================================= */

// Service Worker for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((err) => {
      console.log("Service Worker registration failed:", err);
    });
  });
}

// Tab Switching (Reels, Audio, Story)
function setMode(mode) {
    const input = document.getElementById("urlInput");
    const cardTitle = document.getElementById("cardTitle");
    const cardSubtitle = document.getElementById("cardSubtitle");
    const tabs = document.querySelectorAll(".tab-btn");

    tabs.forEach(tab => {
        tab.style.background = "rgba(255,255,255,0.07)";
        tab.style.color = "var(--muted)";
        tab.style.border = "1px solid var(--border)";
    });

    if (event && event.target) {
        event.target.style.background = "var(--purple)";
        event.target.style.color = "#fff";
        event.target.style.border = "none";
    }

    if (mode === 'audio') {
        cardTitle.textContent = "Extract Audio (MP3)";
        cardSubtitle.textContent = "Paste any Reel link to extract background music.";
        input.placeholder = "Paste Reel link to extract MP3...";
    } else if (mode === 'story') {
        cardTitle.textContent = "Download Story & Photo";
        cardSubtitle.textContent = "Paste a public Story or Photo link.";
        input.placeholder = "Paste Story or Photo URL...";
    } else {
        cardTitle.textContent = "Paste Reel Link";
        cardSubtitle.textContent = "Enter a public Instagram video URL below.";
        input.placeholder = "Paste Instagram Reel link here...";
    }
}
// Dynamic Category Switcher (Reels, Audio, Story)
function switchCategory(type) {
    const heroTitle = document.getElementById("heroTitle");
    const heroSubtitle = document.getElementById("heroSubtitle");
    const cardTitle = document.getElementById("cardTitle");
    const cardSubtitle = document.getElementById("cardSubtitle");
    const urlInput = document.getElementById("urlInput");
    const headingIcon = document.getElementById("headingIcon");
    const stepsHeading = document.getElementById("stepsHeading");

    // Reset tab active states
    document.querySelectorAll(".tab-chip").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".nav-icon-circle").forEach(i => i.classList.remove("active"));

    if (type === 'audio') {
        document.getElementById("tabAudio").classList.add("active");
        heroTitle.innerHTML = 'Instagram Audio <br><span class="gradient-text">Downloader (MP3)</span>';
        heroSubtitle.textContent = "Turn any Instagram reel into a high quality MP3 audio. Paste the link and save trending songs and voice-overs offline.";
        cardTitle.textContent = "Paste Reel Link for Audio";
        cardSubtitle.textContent = "Extract and download background music in 320kbps.";
        urlInput.placeholder = "Paste Reel link to extract MP3...";
        headingIcon.textContent = "🎵";
        stepsHeading.textContent = "Steps to Download Instagram Audio";
    } else if (type === 'story') {
        document.getElementById("tabStory").classList.add("active");
        heroTitle.innerHTML = 'Instagram Story & Photo <br><span class="gradient-text">Downloader HD</span>';
        heroSubtitle.textContent = "Download Instagram stories, highlights, and full-resolution photos directly to your device without watermark.";
        cardTitle.textContent = "Paste Story or Photo Link";
        cardSubtitle.textContent = "Enter public story or post URL below.";
        urlInput.placeholder = "Paste Story or Photo link here...";
        headingIcon.textContent = "📸";
        stepsHeading.textContent = "Steps to Download Instagram Stories";
    } else {
        document.getElementById("tabReels").classList.add("active");
        heroTitle.innerHTML = 'Instagram Reels <br><span class="gradient-text">Download HD</span>';
        heroSubtitle.textContent = "Download Instagram reels video in High Quality with our user-friendly tool. Save your favorite videos in seconds — no app required.";
        cardTitle.textContent = "Paste Your Link";
        cardSubtitle.textContent = "Enter a supported Instagram URL below.";
        urlInput.placeholder = "Paste link here...";
        headingIcon.textContent = "▶";
        stepsHeading.textContent = "Steps to Download Reels From Instagram";
    }
}


// Download Again Button Handler
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

    const form = document.getElementById("downloadForm");
    const urlInput = document.getElementById("urlInput");
    const pasteBtn = document.getElementById("pasteBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const message = document.getElementById("message");

    const resultContainer = document.getElementById("resultContainer");
    const videoPreview = document.getElementById("videoPreview");
    const downloadServer1 = document.getElementById("downloadServer1");
    const downloadServer2 = document.getElementById("downloadServer2");
    const downloadAudioBtn = document.getElementById("downloadAudioBtn");
    const installBtn = document.getElementById("installBtn");


    function showMessage(text, type = "info") {
        if (!message) return;
        message.textContent = text;
        message.className = "message " + type;
    }

    function resetResult() {
        if (videoPreview) {
            videoPreview.pause();
            videoPreview.removeAttribute("src");
            videoPreview.load();
        }

        if (downloadServer1) downloadServer1.removeAttribute("href");
        if (downloadServer2) downloadServer2.removeAttribute("href");
        if (downloadAudioBtn) downloadAudioBtn.removeAttribute("href");

        if (resultContainer) {
            resultContainer.classList.add("hidden");
        }
    }

    // Paste Button
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

    // Form Submit
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

            downloadBtn.disabled = true;
            downloadBtn.innerHTML = 'Processing Media... <span>⏳</span>';
            showMessage("Fetching video and extracting audio...", "info");

            try {
                const apiUrl = `/api/download?url=${encodeURIComponent(enteredLink)}`;

                const response = await fetch(apiUrl);
                const data = await response.json();

                if (data.error || data.message) {
                    throw new Error(data.error || data.message);
                }

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

                if (videoPreview) videoPreview.src = videoUrl;

                // Video Download Links
                if (downloadServer1) {
                    downloadServer1.href = videoUrl;
                    downloadServer1.download = "ReelSave_HD_Video.mp4";
                }

                if (downloadServer2) {
                    downloadServer2.href = videoUrl;
                    downloadServer2.download = "ReelSave_HD_Video.mp4";
                }

                // Audio MP3 Link (Direct Stream / Audio File)
                if (downloadAudioBtn) {
                    downloadAudioBtn.href = videoUrl;
                    downloadAudioBtn.download = "ReelSave_Audio.mp3";
                }

                if (resultContainer) {
                    resultContainer.classList.remove("hidden");
                }

                downloadBtn.disabled = false;
                downloadBtn.innerHTML = 'Continue <span>→</span>';
                showMessage("✓ Media ready! Choose Video or Audio below.", "success");

            } catch (error) {
                console.error("Download Error:", error);
                downloadBtn.disabled = false;
                downloadBtn.innerHTML = 'Continue <span>→</span>';
                resetResult();

                showMessage("Error: " + error.message, "error");
            }
        });
    }

    // FAQ Accordion
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

    // PWA Install Prompt
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

    // Input Change
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
