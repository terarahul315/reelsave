/* ==========================================================
   REELSAVE — PRO JS (CAROUSEL + PHOTO + CAPTION + HISTORY)
============================================================= */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((err) => {
      console.log("Service Worker registration failed:", err);
    });
  });
}

function switchCategory(type) {
    const heroTitle = document.getElementById("heroTitle");
    const heroSubtitle = document.getElementById("heroSubtitle");
    const cardTitle = document.getElementById("cardTitle");
    const cardSubtitle = document.getElementById("cardSubtitle");
    const urlInput = document.getElementById("urlInput");
    const headingIcon = document.getElementById("headingIcon");
    const stepsHeading = document.getElementById("stepsHeading");

    document.querySelectorAll(".tab-chip").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".nav-icon-circle").forEach(i => i.classList.remove("active"));

    if (type === 'audio') {
        document.getElementById("tabAudio")?.classList.add("active");
        if (heroTitle) heroTitle.innerHTML = 'Instagram Audio <br><span class="gradient-text">Downloader (MP3)</span>';
        if (heroSubtitle) heroSubtitle.textContent = "Turn any Instagram reel into a high quality MP3 audio. Paste the link and save trending songs offline.";
        if (cardTitle) cardTitle.textContent = "Paste Reel Link for Audio";
        if (cardSubtitle) cardSubtitle.textContent = "Extract and download background music.";
        if (urlInput) urlInput.placeholder = "Paste Reel link to extract MP3...";
        if (headingIcon) headingIcon.textContent = "🎵";
        if (stepsHeading) stepsHeading.textContent = "Steps to Download Instagram Audio";
    } else if (type === 'story') {
        document.getElementById("tabStory")?.classList.add("active");
        if (heroTitle) heroTitle.innerHTML = 'Instagram Story & Photo <br><span class="gradient-text">Downloader HD</span>';
        if (heroSubtitle) heroSubtitle.textContent = "Download Instagram stories, highlights, and full-resolution photos directly to your device without watermark.";
        if (cardTitle) cardTitle.textContent = "Paste Story or Photo Link";
        if (cardSubtitle) cardSubtitle.textContent = "Enter public story or post URL below.";
        if (urlInput) urlInput.placeholder = "Paste Story or Photo link here...";
        if (headingIcon) headingIcon.textContent = "📸";
        if (stepsHeading) stepsHeading.textContent = "Steps to Download Instagram Stories";
    } else {
        document.getElementById("tabReels")?.classList.add("active");
        if (heroTitle) heroTitle.innerHTML = 'Instagram Reels <br><span class="gradient-text">Download HD</span>';
        if (heroSubtitle) heroSubtitle.textContent = "Download Instagram reels video in High Quality with our user-friendly tool. Save your favorite videos in seconds — no app required.";
        if (cardTitle) cardTitle.textContent = "Paste Your Link";
        if (cardSubtitle) cardSubtitle.textContent = "Enter a supported Instagram URL below.";
        if (urlInput) urlInput.placeholder = "Paste link here...";
        if (headingIcon) headingIcon.textContent = "▶";
        if (stepsHeading) stepsHeading.textContent = "Steps to Download Reels From Instagram";
    }
}

function resetDownloaderUI() {
    const urlInput = document.getElementById("urlInput");
    const resultContainer = document.getElementById("resultContainer");
    const videoPreview = document.getElementById("videoPreview");
    const message = document.getElementById("message");
    const captionBox = document.getElementById("dynamicCaptionBox");
    const carouselGrid = document.getElementById("dynamicCarouselGrid");
    const videoWrapper = document.querySelector(".video-wrapper");
    const actionGroup = document.querySelector(".download-action-group");

    if (urlInput) urlInput.value = "";
    if (videoPreview) {
        videoPreview.pause();
        videoPreview.removeAttribute("src");
        videoPreview.load();
    }
    if (captionBox) captionBox.remove();
    if (carouselGrid) carouselGrid.remove();
    if (videoWrapper) videoWrapper.classList.remove("hidden");
    if (actionGroup) actionGroup.classList.remove("hidden");
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
    const downloaderCard = document.querySelector(".downloader-card");

    const resultContainer = document.getElementById("resultContainer");
    const videoPreview = document.getElementById("videoPreview");
    const videoWrapper = document.querySelector(".video-wrapper");
    const actionGroup = document.querySelector(".download-action-group");
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
        const captionBox = document.getElementById("dynamicCaptionBox");
        if (captionBox) captionBox.remove();
        const carouselGrid = document.getElementById("dynamicCarouselGrid");
        if (carouselGrid) carouselGrid.remove();

        if (videoWrapper) videoWrapper.classList.remove("hidden");
        if (actionGroup) actionGroup.classList.remove("hidden");
        if (downloadServer1) downloadServer1.removeAttribute("href");
        if (downloadServer2) downloadServer2.removeAttribute("href");
        if (downloadAudioBtn) downloadAudioBtn.removeAttribute("href");
        if (resultContainer) resultContainer.classList.add("hidden");
    }

    function extractMediaItems(data) {
        const items = [];
        const addIfValid = (obj) => {
            if (!obj || typeof obj !== "object") return;
            const mediaUrl = obj.media || obj.video_url || obj.download_url || obj.url ||
                Object.values(obj).find(v => typeof v === "string" && v.startsWith("http") && !v.includes("instagram.com/p/"));
            if (mediaUrl) {
                const isVideo = mediaUrl.includes(".mp4") || (obj.type && obj.type.toLowerCase().includes("video"));
                items.push({ url: mediaUrl, isVideo });
            }
        };

        if (data.data && Array.isArray(data.data)) {
            data.data.forEach(addIfValid);
        } else if (Array.isArray(data)) {
            data.forEach(addIfValid);
        } else if (data.data && typeof data.data === "object") {
            addIfValid(data.data);
        } else {
            addIfValid(data);
        }
        return items;
    }

    function extractCaption(data) {
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
            return data.data[0].caption || data.data[0].title || data.data[0].description || "";
        }
        if (data.data && typeof data.data === "object") {
            return data.data.caption || data.data.title || "";
        }
        return data.caption || data.title || "";
    }

    // RECENT DOWNLOADS HISTORY
    function saveToHistory(url) {
        try {
            let history = JSON.parse(localStorage.getItem("reelsave_history") || "[]");
            history = history.filter(item => item !== url);
            history.unshift(url);
            history = history.slice(0, 5);
            localStorage.setItem("reelsave_history", JSON.stringify(history));
            renderHistory();
        } catch (e) {}
    }

    function renderHistory() {
        const existing = document.getElementById("recentHistoryBox");
        if (existing) existing.remove();

        let history = [];
        try {
            history = JSON.parse(localStorage.getItem("reelsave_history") || "[]");
        } catch (e) {}

        if (!history.length || !downloaderCard) return;

        const box = document.createElement("div");
        box.id = "recentHistoryBox";
        box.className = "recent-history-box";
        box.innerHTML = `
            <div class="recent-header">
                <span>🕒 Recent Links</span>
                <button type="button" class="recent-clear-btn" id="clearHistoryBtn">Clear</button>
            </div>
            <div class="recent-list">
                ${history.map(link => `
                    <div class="recent-item">
                        <span class="recent-url">${link}</span>
                        <button type="button" class="recent-reload-btn" data-url="${link}">Load</button>
                    </div>
                `).join("")}
            </div>
        `;

        downloaderCard.insertAdjacentElement("afterend", box);

        document.getElementById("clearHistoryBtn").addEventListener("click", () => {
            localStorage.removeItem("reelsave_history");
            box.remove();
        });

        box.querySelectorAll(".recent-reload-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                if (urlInput) {
                    urlInput.value = btn.getAttribute("data-url");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    form.dispatchEvent(new Event("submit", { cancelable: true }));
                }
            });
        });
    }

    renderHistory();

    // PASTE BUTTON
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

    // FORM SUBMIT
    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            resetResult();

            const enteredLink = urlInput.value.trim();

            if (!enteredLink) {
                showMessage("Please enter an Instagram link.", "error");
                return;
            }
            if (!enteredLink.includes("instagram.com")) {
                showMessage("Please enter a valid Instagram URL.", "error");
                return;
            }

            downloadBtn.disabled = true;
            downloadBtn.innerHTML = 'Processing Media... <span>⏳</span>';
            showMessage("Fetching media from Instagram...", "info");

            try {
                const apiUrl = `/api/download?url=${encodeURIComponent(enteredLink)}`;
                const response = await fetch(apiUrl);
                const data = await response.json();

                if (data.error || data.message) {
                    throw new Error(data.error || data.message);
                }

                const mediaItems = extractMediaItems(data);
                const captionText = extractCaption(data);

                if (mediaItems.length === 0) {
                    throw new Error("Media not found. Please verify the post is from a public account.");
                }

                // MULTI-ITEM CAROUSEL OR SINGLE PHOTO
                if (mediaItems.length > 1 || !mediaItems[0].isVideo) {
                    if (videoWrapper) videoWrapper.classList.add("hidden");
                    if (actionGroup) actionGroup.classList.add("hidden");

                    const grid = document.createElement("div");
                    grid.id = "dynamicCarouselGrid";

                    grid.innerHTML = `
                        <div class="carousel-grid">
                            ${mediaItems.map((item, idx) => `
                                <div class="carousel-card">
                                    ${item.isVideo
                                        ? `<video src="${item.url}" controls playsinline></video>`
                                        : `<img src="${item.url}" alt="Instagram media ${idx + 1}" loading="lazy">`
                                    }
                                    <a href="${item.url}" download="ReelSave_${idx + 1}.${item.isVideo ? 'mp4' : 'jpg'}" target="_blank" class="carousel-dl-btn">
                                        ⬇ Download ${item.isVideo ? 'Video' : 'Photo'} ${mediaItems.length > 1 ? '#' + (idx + 1) : 'HD'}
                                    </a>
                                </div>
                            `).join("")}
                        </div>
                        <button type="button" class="btn-download-again" onclick="resetDownloaderUI()">
                            ⤺ Download Another
                        </button>
                    `;
                    resultContainer.prepend(grid);
                } else {
                    // SINGLE VIDEO (REEL)
                    const videoUrl = mediaItems[0].url;
                    if (videoPreview) videoPreview.src = videoUrl;
                    if (downloadServer1) {
                        downloadServer1.href = videoUrl;
                        downloadServer1.download = "ReelSave_HD_Video.mp4";
                    }
                    if (downloadServer2) {
                        downloadServer2.href = videoUrl;
                        downloadServer2.download = "ReelSave_HD_Video.mp4";
                    }
                    if (downloadAudioBtn) {
                        downloadAudioBtn.href = videoUrl;
                        downloadAudioBtn.download = "ReelSave_Audio.mp3";
                    }
                }

                // CAPTION BOX
                if (captionText && resultContainer) {
                    const capDiv = document.createElement("div");
                    capDiv.id = "dynamicCaptionBox";
                    capDiv.className = "caption-box";
                    capDiv.innerHTML = `
                        <div class="caption-header">
                            <span>📝 Caption & Hashtags</span>
                            <button type="button" class="btn-copy-caption" id="copyCapBtn">Copy</button>
                        </div>
                        <div class="caption-text" id="capTextContent"></div>
                    `;
                    capDiv.querySelector("#capTextContent").textContent = captionText;
                    resultContainer.appendChild(capDiv);

                    capDiv.querySelector("#copyCapBtn").addEventListener("click", async () => {
                        try {
                            await navigator.clipboard.writeText(captionText);
                            capDiv.querySelector("#copyCapBtn").textContent = "Copied!";
                            setTimeout(() => {
                                capDiv.querySelector("#copyCapBtn").textContent = "Copy";
                            }, 1800);
                        } catch (e) {}
                    });
                }

                if (resultContainer) resultContainer.classList.remove("hidden");
                saveToHistory(enteredLink);

                downloadBtn.disabled = false;
                downloadBtn.innerHTML = 'Get Video <span>→</span>';
                showMessage(`✓ ${mediaItems.length} item(s) ready to download!`, "success");

            } catch (error) {
                console.error("Download Error:", error);
                downloadBtn.disabled = false;
                downloadBtn.innerHTML = 'Get Video <span>→</span>';
                resetResult();
                showMessage("Error: " + error.message, "error");
            }
        });
    }

    // FAQ ACCORDION
    document.querySelectorAll(".faq-toggle").forEach((button) => {
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

    // PWA INSTALL
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
