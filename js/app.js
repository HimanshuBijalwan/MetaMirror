document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const form = document.getElementById('metaForm');
    const title = document.getElementById('title');
    const metaDescription = document.getElementById('metaDescription');
    const canonicalUrl = document.getElementById('canonicalUrl');
    const ogTitle = document.getElementById('ogTitle');
    const ogDescription = document.getElementById('ogDescription');
    const ogImage = document.getElementById('ogImage');
    const twitterTitle = document.getElementById('twitterTitle');
    const twitterDescription = document.getElementById('twitterDescription');
    const twitterImageInput = document.getElementById('twitterImageInput');
    
    // Preview elements
    const serpTitle = document.getElementById('serpTitle');
    const serpUrl = document.getElementById('serpUrl');
    const serpDescription = document.getElementById('serpDescription');
    const fbTitle = document.getElementById('fbTitle');
    const fbDescription = document.getElementById('fbDescription');
    const fbUrl = document.getElementById('fbUrl');
    const fbImage = document.getElementById('fbImage');
    const twitterPreviewTitle = document.getElementById('twitterPreviewTitle');
    const twitterPreviewDescription = document.getElementById('twitterPreviewDescription');
    const twitterPreviewUrl = document.getElementById('twitterPreviewUrl');
    const twitterImage = document.getElementById('twitterImage');

    // Character count elements
    const titleCharCount = document.getElementById('titleCharCount');
    const descCharCount = document.getElementById('descCharCount');

    // Constants
    const MAX_TITLE_LENGTH = 60;
    const MAX_DESC_LENGTH = 160;

    // Update character counts and show warnings
    function updateCharCount(element, count, max) {
        if (count >= max) {
            element.className = 'text-sm text-red-600 mt-1';
        } else {
            element.className = 'text-sm text-gray-500 mt-1';
        }
        element.textContent = `${count}/${max} characters`;
    }

    // Update SERP Preview
    function updateSerpPreview() {
        serpTitle.textContent = title.value || 'Your Page Title';
        serpUrl.textContent = canonicalUrl.value || 'www.example.com';
        serpDescription.textContent = metaDescription.value || 'Your page description will appear here. Make it compelling and informative.';
    }

    // Update Facebook Preview
    function updateFacebookPreview() {
        fbTitle.textContent = ogTitle.value || title.value || 'Your Page Title';
        fbDescription.textContent = ogDescription.value || metaDescription.value || 'Your page description will appear here.';
        fbUrl.textContent = canonicalUrl.value || 'www.example.com';
        if (ogImage.value) {
            fbImage.style.backgroundImage = `url(${ogImage.value})`;
            fbImage.innerHTML = '';
        } else {
            fbImage.style.backgroundImage = 'none';
            fbImage.innerHTML = '<div class="placeholder-image w-100 h-100 d-flex flex-column align-items-center justify-content-center" style="height:100%;width:100%;text-align:center;"><i class="bi bi-card-image" style="font-size:4rem;"></i><span style="font-size:1.5rem;font-weight:900;">No image provided</span><small style="font-size:1.15rem;">Add an image URL to preview</small></div>';
        }
    }

    // Update Twitter Preview
    async function updateTwitterPreview() {
        twitterPreviewTitle.textContent = twitterTitle.value || ogTitle.value || title.value || 'Your Page Title';
        twitterPreviewDescription.textContent = twitterDescription.value || ogDescription.value || metaDescription.value || 'Your page description will appear here.';
        twitterPreviewUrl.textContent = canonicalUrl.value || 'www.example.com';
        if (twitterImageInput.value) {
            const isValid = await validateImageUrl(twitterImageInput.value);
            if (isValid) {
                twitterImage.style.backgroundImage = `url(${twitterImageInput.value})`;
                twitterImage.innerHTML = '';
            } else {
                twitterImage.style.backgroundImage = 'none';
                twitterImage.innerHTML = '<div class="placeholder-image w-100 h-100"><i class="bi bi-exclamation-triangle"></i><span>Invalid image URL</span></div>';
            }
        } else {
            twitterImage.style.backgroundImage = 'none';
            twitterImage.innerHTML = '<div class="placeholder-image w-100 h-100 d-flex flex-column align-items-center justify-content-center" style="height:100%;width:100%;text-align:center;"><i class="bi bi-card-image" style="font-size:4rem;"></i><span style="font-size:1.5rem;font-weight:900;">No image provided</span><small style="font-size:1.15rem;">Add an image URL to preview</small></div>';
        }
    }

    // Pixel width calculation helper
    function getTextPixelWidth(text, font) {
        const canvas = getTextPixelWidth.canvas || (getTextPixelWidth.canvas = document.createElement("canvas"));
        const context = canvas.getContext("2d");
        context.font = font;
        return context.measureText(text).width;
    }

    // Update pixel info for Title and Description
    function updatePixelInfo() {
        const titleText = title.value || '';
        const descText = metaDescription.value || '';
        // Google uses Arial, 20px for title (desktop), 16px for mobile
        const titleDesktopPx = Math.round(getTextPixelWidth(titleText, '20px Arial'));
        const titleMobilePx = Math.round(getTextPixelWidth(titleText, '16px Arial'));
        // Google uses Arial, 14px for description (desktop), 12px for mobile
        const descDesktopPx = Math.round(getTextPixelWidth(descText, '14px Arial'));
        const descMobilePx = Math.round(getTextPixelWidth(descText, '12px Arial'));
        // Limits
        const titleDesktopLimit = 600;
        const titleMobileLimit = 400;
        const descDesktopLimit = 960;
        const descMobileLimit = 680;
        // Elements
        const titlePixelInfo = document.getElementById('titlePixelInfo');
        const descPixelInfo = document.getElementById('descPixelInfo');
        // Title pixel info
        let titlePixelMsg = `Desktop: ${titleDesktopPx}px / ${titleDesktopLimit}px`;
        if (titleDesktopPx >= titleDesktopLimit) titlePixelMsg += ' ⚠️';
        titlePixelMsg += ` | Mobile: ${titleMobilePx}px / ${titleMobileLimit}px`;
        if (titleMobilePx >= titleMobileLimit) titlePixelMsg += ' ⚠️';
        titlePixelInfo.textContent = titlePixelMsg;
        titlePixelInfo.style.color = (titleDesktopPx >= titleDesktopLimit || titleMobilePx >= titleMobileLimit) ? '#dc2626' : '#6b7280';
        // Description pixel info
        let descPixelMsg = `Desktop: ${descDesktopPx}px / ${descDesktopLimit}px`;
        if (descDesktopPx >= descDesktopLimit) descPixelMsg += ' ⚠️';
        descPixelMsg += ` | Mobile: ${descMobilePx}px / ${descMobileLimit}px`;
        if (descMobilePx >= descMobileLimit) descPixelMsg += ' ⚠️';
        descPixelInfo.textContent = descPixelMsg;
        descPixelInfo.style.color = (descDesktopPx >= descDesktopLimit || descMobilePx >= descMobileLimit) ? '#dc2626' : '#6b7280';
    }

    // Live meta tag code generation
    const metaCodeBlock = document.getElementById('metaCodeBlock');
    // Update meta tag code generation with comments and extra tags
    function updateMetaCodeBlock() {
        const titleVal = title.value || '';
        const descVal = metaDescription.value || '';
        const canonicalVal = canonicalUrl.value || '';
        const ogTitleVal = ogTitle.value || titleVal;
        const ogDescVal = ogDescription.value || descVal;
        const ogImageVal = ogImage.value || '';
        const twitterTitleVal = twitterTitle.value || ogTitleVal;
        const twitterDescVal = twitterDescription.value || ogDescVal;
        const twitterImageVal = twitterImageInput.value || ogImageVal;
        let metaTags = '';
        // COMMON TAGS
        metaTags += '<!-- COMMON TAGS -->\n';
        metaTags += '<meta charset="UTF-8">\n';
        metaTags += '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
        metaTags += '<meta http-equiv="X-UA-Compatible" content="IE=edge">\n';
        metaTags += '<meta name="robots" content="index, follow">\n';
        // Search Engine
        metaTags += '\n<!-- Search Engine -->\n';
        if (titleVal) metaTags += `<title>${titleVal}</title>\n`;
        if (canonicalVal) metaTags += `<link rel="canonical" href="${canonicalVal}">\n`;
        if (descVal) metaTags += `<meta name="description" content="${descVal}">\n`;
        // Schema.org for Google
        metaTags += '\n<!-- Schema.org for Google -->\n';
        metaTags += `<meta itemprop="name" content="${titleVal}">\n`;
        metaTags += `<meta itemprop="description" content="${descVal}">\n`;
        if (ogImageVal) metaTags += `<meta itemprop="image" content="${ogImageVal}">\n`;
        // Open Graph
        metaTags += '\n<!-- Open Graph general (Facebook, Pinterest & Google+) -->\n';
        if (ogTitleVal) metaTags += `<meta property="og:title" content="${ogTitleVal}">\n`;
        if (ogDescVal) metaTags += `<meta property="og:description" content="${ogDescVal}">\n`;
        if (ogImageVal) metaTags += `<meta property="og:image" content="${ogImageVal}">\n`;
        if (canonicalVal) metaTags += `<meta property="og:url" content="${canonicalVal}">\n`;
        metaTags += `<meta property="og:type" content="website">\n`;
        // Twitter
        metaTags += '\n<!-- Twitter -->\n';
        metaTags += `<meta name="twitter:card" content="summary_large_image">\n`;
        if (twitterTitleVal) metaTags += `<meta name="twitter:title" content="${twitterTitleVal}">\n`;
        if (twitterDescVal) metaTags += `<meta name="twitter:description" content="${twitterDescVal}">\n`;
        if (twitterImageVal) metaTags += `<meta name="twitter:image" content="${twitterImageVal}">\n`;
        if (canonicalVal) metaTags += `<meta name="twitter:url" content="${canonicalVal}">\n`;
        metaCodeBlock.textContent = metaTags.trim();
    }

    // Copy meta tags to clipboard
    const copyMetaBtn = document.getElementById('copyMetaBtn');
    const copyMetaFeedback = document.getElementById('copyMetaFeedback');
    copyMetaBtn.addEventListener('click', () => {
        const text = metaCodeBlock.textContent;
        navigator.clipboard.writeText(text).then(() => {
            copyMetaFeedback.style.display = 'inline';
            setTimeout(() => { copyMetaFeedback.style.display = 'none'; }, 1200);
        });
    });

    // Pixel width calculation for OG and Twitter fields
    function updateOGTwitterPixelInfo() {
        // OG Title: 60 chars/600px, OG Desc: 110 chars/1100px (Facebook best practice)
        // Twitter Title: 70 chars/600px, Twitter Desc: 200 chars/1000px (Twitter best practice)
        const ogTitleText = ogTitle.value || '';
        const ogDescText = ogDescription.value || '';
        const twitterTitleText = twitterTitle.value || '';
        const twitterDescText = twitterDescription.value || '';
        const ogTitlePx = Math.round(getTextPixelWidth(ogTitleText, '20px Arial'));
        const ogDescPx = Math.round(getTextPixelWidth(ogDescText, '16px Arial'));
        const twitterTitlePx = Math.round(getTextPixelWidth(twitterTitleText, '20px Arial'));
        const twitterDescPx = Math.round(getTextPixelWidth(twitterDescText, '16px Arial'));
        // Limits
        const ogTitleLimit = 600, ogDescLimit = 1100;
        const twitterTitleLimit = 600, twitterDescLimit = 1000;
        // Elements
        const ogTitlePixelInfo = document.getElementById('ogTitlePixelInfo');
        const ogDescPixelInfo = document.getElementById('ogDescPixelInfo');
        const twitterTitlePixelInfo = document.getElementById('twitterTitlePixelInfo');
        const twitterDescPixelInfo = document.getElementById('twitterDescPixelInfo');
        // OG Title
        let ogTitleMsg = `Pixel: ${ogTitlePx}px / ${ogTitleLimit}px`;
        if (ogTitlePx >= ogTitleLimit) ogTitleMsg += ' ⚠️';
        ogTitlePixelInfo.textContent = ogTitleMsg;
        ogTitlePixelInfo.style.color = ogTitlePx >= ogTitleLimit ? '#dc2626' : '#6b7280';
        // OG Desc
        let ogDescMsg = `Pixel: ${ogDescPx}px / ${ogDescLimit}px`;
        if (ogDescPx >= ogDescLimit) ogDescMsg += ' ⚠️';
        ogDescPixelInfo.textContent = ogDescMsg;
        ogDescPixelInfo.style.color = ogDescPx >= ogDescLimit ? '#dc2626' : '#6b7280';
        // Twitter Title
        let twitterTitleMsg = `Pixel: ${twitterTitlePx}px / ${twitterTitleLimit}px`;
        if (twitterTitlePx >= twitterTitleLimit) twitterTitleMsg += ' ⚠️';
        twitterTitlePixelInfo.textContent = twitterTitleMsg;
        twitterTitlePixelInfo.style.color = twitterTitlePx >= twitterTitleLimit ? '#dc2626' : '#6b7280';
        // Twitter Desc
        let twitterDescMsg = `Pixel: ${twitterDescPx}px / ${twitterDescLimit}px`;
        if (twitterDescPx >= twitterDescLimit) twitterDescMsg += ' ⚠️';
        twitterDescPixelInfo.textContent = twitterDescMsg;
        twitterDescPixelInfo.style.color = twitterDescPx >= twitterDescLimit ? '#dc2626' : '#6b7280';
    }

    // Update SERP, Facebook, Twitter previews and meta code block on every input
    form.addEventListener('input', async (e) => {
        const target = e.target;
        // Prevent typing beyond max length (for paste or programmatic input)
        if (target === title && target.value.length > MAX_TITLE_LENGTH) {
            target.value = target.value.slice(0, MAX_TITLE_LENGTH);
        } else if (target === metaDescription && target.value.length > MAX_DESC_LENGTH) {
            target.value = target.value.slice(0, MAX_DESC_LENGTH);
        }
        // Update character counts
        if (target === title) {
            updateCharCount(titleCharCount, target.value.length, MAX_TITLE_LENGTH);
        } else if (target === metaDescription) {
            updateCharCount(descCharCount, target.value.length, MAX_DESC_LENGTH);
        }
        // Update pixel info
        updatePixelInfo();
        // Update previews
        updateSerpPreview();
        updateFacebookPreview();
        await updateTwitterPreview();
        // Update meta code block
        updateMetaCodeBlock();
        updateOGTwitterPixelInfo();
    });

    // Clear Data button functionality
    const clearFormBtn = document.getElementById('clearFormBtn');
    clearFormBtn.addEventListener('click', () => {
        form.reset();
        updateCharCount(titleCharCount, 0, MAX_TITLE_LENGTH);
        updateCharCount(descCharCount, 0, MAX_DESC_LENGTH);
        updatePixelInfo();
        updateOGTwitterPixelInfo();
        updateSerpPreview();
        updateFacebookPreview();
        updateTwitterPreview();
        updateMetaCodeBlock();
    });

    // Initialize previews and meta code block
    updateSerpPreview();
    updateFacebookPreview();
    updateTwitterPreview();
    updatePixelInfo();
    updateMetaCodeBlock();
    updateOGTwitterPixelInfo();

    // Image URL validation
    function validateImageUrl(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

    // Add image validation
    async function validateImages() {
        const images = [
            { input: ogImage, warning: 'og-image-warning' },
            { input: twitterImageInput, warning: 'twitter-image-warning' }
        ];

        for (const { input, warning } of images) {
            if (input.value) {
                const isValid = await validateImageUrl(input.value);
                let warningEl = document.getElementById(warning);
                
                if (!warningEl) {
                    warningEl = document.createElement('div');
                    warningEl.id = warning;
                    input.parentNode.appendChild(warningEl);
                }

                if (!isValid) {
                    warningEl.textContent = 'Invalid image URL';
                    warningEl.className = 'warning-message';
                } else {
                    warningEl.textContent = '';
                }
            }
        }
    }

    ogImage.addEventListener('blur', validateImages);
    twitterImageInput.addEventListener('blur', validateImages);
});
