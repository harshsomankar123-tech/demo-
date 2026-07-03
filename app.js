// State Variables for Presentation and Prototype
let currentSlideIndex = 0;

const userState = {
  age: null,
  isAdult: null,
  consents: {
    essential: true,       // Core streaming (mandatory)
    personalization: true, // Behavioral recommendations (optional)
    targetedAds: true,     // Personalized advertising (optional)
    dataSharing: true      // Third-party shares (optional)
  },
  consentLanguage: 'en',   // 'en' or 'hi'
  vpcMethod: null,         // 'upi' or 'digilocker'
  vpcCompleted: false,
  hasAccount: false,
  guestPassActive: false,
  guestPassTimer: null
};

// Mock Dashboard Telemetry Data (Dynamic updates based on user interaction!)
const dashboardData = {
  consentHealthRate: 86.4,
  activeUsers: 55000000,
  vpcCompletionRate: 81.2,
  signupsTotal: 12000,
  dropoffs: 280,
  consentOptOutPercent: 13.6
};

// Translations for bilingual consent notices
const translations = {
  en: {
    noticeTitle: "Data Protection & Consent Notice",
    noticeBody: "In accordance with the India DPDP Act 2023, we require your explicit consent to process your personal data. Below, you can customize how Spotify manages your listening history, device details, and sharing behavior. You may change or revoke these settings at any time in your Privacy Settings.",
    mandatoryTitle: "1. Core Audio Streaming (Essential)",
    mandatoryDesc: "Required to register your account, manage subscriptions, stream music, and cache files locally. This is necessary to deliver the basic streaming contract.",
    recsTitle: "2. Listening History & Personalization",
    recsDesc: "Enable tracking of your play/skip history, search queries, and artist preferences. Toggling this off switches Spotify to generic, contextual playlists.",
    adsTitle: "3. Personalized Advertising",
    adsDesc: "Allows Spotify and advertising partners to profile your interests to deliver targeted audio ads. Toggling this off switches you to non-personalized contextual ads.",
    sharingTitle: "4. Third-Party Data Sharing",
    sharingDesc: "Enable sharing profile indicators with partners (e.g., social integrations, hardware devices). We never sell raw contact information.",
    btnAgreeAll: "Agree & Proceed",
    btnConfirmCustom: "Confirm Selected Choices"
  },
  hi: {
    noticeTitle: "डेटा सुरक्षा और सहमति सूचना",
    noticeBody: "भारत DPDP अधिनियम 2023 के अनुसार, हमें आपके व्यक्तिगत डेटा को संसाधित करने के लिए आपकी स्पष्ट सहमति की आवश्यकता है। नीचे, आप यह कस्टमाइज़ कर सकते हैं कि स्पॉटिफ़ाई आपके सुनने के इतिहास, डिवाइस विवरण और साझा करने के व्यवहार को कैसे प्रबंधित करता है। आप इन सेटिंग्स को किसी भी समय बदल या रद्द कर सकते हैं।",
    mandatoryTitle: "1. कोर ऑडियो स्ट्रीमिंग (आवश्यक)",
    mandatoryDesc: "आपके खाते को पंजीकृत करने, सदस्यता प्रबंधित करने, संगीत स्ट्रीम करने और फ़ाइलों को संग्रहीत करने के लिए आवश्यक है।",
    recsTitle: "2. सुनने का इतिहास और वैयक्तिकरण",
    recsDesc: "आपके प्ले/स्किप इतिहास, खोज और कलाकार प्राथमिकताओं की ट्रैकिंग सक्षम करें। इसे बंद करने पर स्पॉटिफ़ाई जेनेरिक प्लेलिस्ट पर स्विच हो जाएगा।",
    adsTitle: "3. वैयक्तिकृत विज्ञापन",
    adsDesc: "स्पॉटिफ़ाई और विज्ञापन भागीदारों को लक्षित विज्ञापन देने के लिए आपकी रुचियों को प्रोफाइल करने की अनुमति देता है। इसे बंद करने पर आपको गैर-वैयक्तिकृत विज्ञापन दिखेंगे।",
    sharingTitle: "4. तीसरे पक्ष के साथ डेटा साझा करना",
    sharingDesc: "भागीदारों (जैसे सामाजिक एकीकरण, हार्डवेयर डिवाइस) के साथ प्रोफाइल संकेतक साझा करना सक्षम करें।",
    btnAgreeAll: "सभी स्वीकार करें और आगे बढ़ें",
    btnConfirmCustom: "चुने हुए विकल्पों की पुष्टि करें"
  }
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupPresentation();
  setupPrototypeFlows();
  renderDashboardCharts();
  updateDashboardKPIs();
  addAuditLog("DBSync: Compliance telemetry stream active.", "success");
  addAuditLog("Notice Audit: Default English/Hindi legal notice verified.", "info");
});

// 1. App Shell Sidebar Navigation
function setupNavigation() {
  const navItems = document.querySelectorAll(".nav-item");
  const views = document.querySelectorAll(".content-view");

  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const targetViewId = item.getAttribute("data-target");

      navItems.forEach(nav => nav.classList.remove("active"));
      views.forEach(view => view.classList.remove("active"));

      item.classList.add("active");
      document.getElementById(targetViewId).classList.add("active");

      // Trigger redraw of charts if switching to Dashboard
      if (targetViewId === "dashboard-view") {
        renderDashboardCharts();
      }
    });
  });
}

// 2. Slide Presentation Deck Engine
function setupPresentation() {
  const viewer = document.getElementById("slide-viewer");
  const dotsContainer = document.getElementById("slide-dots");
  const prevBtn = document.getElementById("btn-prev");
  const nextBtn = document.getElementById("btn-next");

  // Create dot indicators
  slidesData.forEach((slide, idx) => {
    const dot = document.createElement("div");
    dot.classList.add("slide-dot");
    if (idx === 0) dot.classList.add("active");
    dot.addEventListener("click", () => renderSlide(idx));
    dotsContainer.appendChild(dot);
  });

  prevBtn.addEventListener("click", () => {
    if (currentSlideIndex > 0) renderSlide(currentSlideIndex - 1);
  });

  nextBtn.addEventListener("click", () => {
    if (currentSlideIndex < slidesData.length - 1) renderSlide(currentSlideIndex + 1);
  });

  // Render first slide
  renderSlide(0);

  // PDF Export Trigger
  document.getElementById("btn-pdf-export").addEventListener("click", () => {
    const printWindow = window.open("", "_blank");
    let slidesHtml = "";
    
    slidesData.forEach(slide => {
      slidesHtml += `
        <div class="print-slide">
          <div class="print-header">
            <h2>${slide.title}</h2>
            <h4>${slide.subtitle}</h4>
          </div>
          <div class="print-body">
            ${slide.content}
          </div>
        </div>
      `;
    });

    printWindow.document.write(`
      <html>
        <head>
          <title>Spotify India - DPDP Case Study Deck</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap');
            body {
              background: #fff !important;
              color: #000 !important;
              font-family: 'Inter', sans-serif;
              padding: 0 !important;
              margin: 0 !important;
            }
            .print-slide {
              width: 100%;
              min-height: 100vh;
              page-break-after: always;
              break-after: page;
              padding: 50px;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              border-bottom: 1px solid #eee;
            }
            .print-header h2 {
              font-family: 'Outfit', sans-serif;
              color: #1db954 !important;
              font-size: 26px;
              margin: 0 0 4px 0;
            }
            .print-header h4 {
              color: #666 !important;
              font-size: 14px;
              margin: 0 0 24px 0;
              font-weight: 400;
            }
            .print-body {
              font-size: 13px;
              line-height: 1.6;
              flex-grow: 1;
            }
            .slide-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
            }
            .slide-col h3 {
              font-family: 'Outfit', sans-serif;
              border-bottom: 2px solid #1db954;
              padding-bottom: 6px;
              margin: 0 0 12px 0;
              font-size: 16px;
              color: #000;
            }
            .slide-col ul {
              padding-left: 20px;
            }
            .slide-col li {
              margin-bottom: 8px;
            }
            .badge {
              display: inline-block;
              padding: 3px 8px;
              border-radius: 12px;
              font-size: 9px;
              font-weight: bold;
              text-transform: uppercase;
              margin-top: 8px;
            }
            .badge.green { background: #d1e7dd; color: #0f5132; }
            .badge.red { background: #f8d7da; color: #842029; }
            .badge.yellow { background: #fff3cd; color: #664d03; }
            .slide-footer-notes {
              margin-top: auto;
              border-top: 1px dashed #ddd;
              padding-top: 12px;
              font-size: 11px;
              color: #666;
            }
            .personas-container {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
            }
            .persona-card {
              border: 1px solid #ddd;
              padding: 20px;
              border-radius: 12px;
              background: #f8f9fa;
            }
            .persona-header {
              display: flex;
              align-items: center;
              gap: 12px;
              margin-bottom: 12px;
              border-bottom: 1px solid #eee;
              padding-bottom: 8px;
            }
            .persona-avatar {
              font-size: 24px;
            }
            .persona-tag {
              font-size: 10px;
              color: #1db954;
              font-weight: bold;
              text-transform: uppercase;
            }
            .persona-body p {
              margin: 0 0 8px 0;
            }
            .compliance-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            .compliance-table th, .compliance-table td {
              border: 1px solid #dee2e6;
              padding: 10px 14px;
              text-align: left;
            }
            .compliance-table th {
              background-color: #f1f3f5;
              font-weight: 600;
            }
            .pillars-grid {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 20px;
              margin-top: 20px;
            }
            .pillar-card {
              border: 1px solid #dee2e6;
              padding: 20px;
              border-radius: 12px;
              background-color: #f8f9fa;
            }
            .pillar-num {
              font-size: 36px;
              font-weight: bold;
              color: rgba(29, 185, 84, 0.15);
              float: right;
              line-height: 1;
            }
            .pillar-card h4 {
              margin: 0 0 8px 0;
              color: #1db954;
            }
            .pillar-card p {
              margin: 0;
              color: #555;
            }
            .metric-highlight-box {
              border: 1px solid #c3e6cb;
              background-color: #d4edda;
              padding: 24px;
              border-radius: 12px;
              height: 80%;
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
            .metric-label {
              font-size: 10px;
              font-weight: bold;
              color: #155724;
              letter-spacing: 1px;
              margin-bottom: 8px;
            }
            .metric-value {
              font-size: 22px;
              font-weight: 800;
              color: #155724;
              margin-bottom: 12px;
            }
            .metric-desc {
              margin: 0;
              color: #155724;
            }
            .metric-list {
              display: flex;
              flex-direction: column;
              gap: 12px;
            }
            .metric-item {
              border: 1px solid #dee2e6;
              padding: 12px;
              border-radius: 8px;
              background: #f8f9fa;
            }
            .metric-num {
              font-size: 20px;
              font-weight: bold;
              color: #1db954;
            }
            .metric-item strong {
              display: block;
              margin-top: 4px;
            }
            .metric-item p {
              margin: 4px 0 0 0;
              color: #666;
            }
            .success-criteria-grid {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 20px;
              margin-top: 20px;
            }
            .sc-card {
              border: 1px solid #dee2e6;
              padding: 20px;
              border-radius: 12px;
              background: #f8f9fa;
              text-align: center;
            }
            .sc-card h4 {
              margin: 0 0 8px 0;
              color: #666;
              text-transform: uppercase;
              font-size: 11px;
            }
            .sc-target {
              font-size: 22px;
              font-weight: 800;
              color: #1db954;
              margin-bottom: 12px;
            }
            .sc-card p {
              margin: 0;
              color: #555;
            }
            .tree-root {
              border: 1px solid #f5c6cb;
              background-color: #f8d7da;
              color: #721c24;
              padding: 12px;
              border-radius: 8px;
              text-align: center;
              font-weight: bold;
              max-width: 320px;
              margin: 0 auto 24px;
            }
            .tree-branches {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 20px;
            }
            .tree-branch {
              border: 1px solid #dee2e6;
              padding: 16px;
              border-radius: 8px;
              background: #f8f9fa;
            }
            .tree-branch h5 {
              margin: 0 0 10px 0;
              border-bottom: 1px solid #eee;
              padding-bottom: 4px;
              color: #1db954;
            }
            .tree-branch ul {
              margin: 0;
              padding-left: 16px;
              color: #555;
            }
            .tree-branch li {
              margin-bottom: 6px;
            }
            .mock-dash-preview {
              border: 1px solid #dee2e6;
              background: #f8f9fa;
              border-radius: 12px;
              padding: 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .bar-chart-preview {
              display: flex;
              justify-content: space-around;
              align-items: flex-end;
              height: 100px;
              width: 100%;
              border-bottom: 1px solid #dee2e6;
              margin-bottom: 12px;
            }
            .bar-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              width: 50px;
            }
            .bar {
              width: 30px;
              background-color: #1db954;
              border-radius: 4px 4px 0 0;
              text-align: center;
              font-weight: bold;
              font-size: 10px;
              padding-top: 4px;
              color: white;
            }
            .rollout-phases {
              display: flex;
              flex-direction: column;
              gap: 16px;
            }
            .phase-step {
              border: 1px solid #dee2e6;
              padding: 16px 16px 16px 40px;
              border-radius: 8px;
              position: relative;
              background: #f8f9fa;
            }
            .phase-step::before {
              content: "";
              position: absolute;
              left: 18px;
              top: 22px;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background-color: #1db954;
            }
            .phase-step h5 {
              margin: 0 0 4px 0;
            }
            .phase-step p {
              margin: 0;
              color: #555;
            }
            .rollout-warning-alert {
              border: 1px solid #ffeeba;
              background-color: #fff3cd;
              color: #856404;
              padding: 12px 16px;
              border-radius: 8px;
              margin-top: 16px;
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${slidesHtml}
        </body>
      </html>
    `);
    printWindow.document.close();
  });
}

function renderSlide(index) {
  currentSlideIndex = index;
  const slide = slidesData[index];
  
  // Update view
  document.getElementById("slide-title").innerText = slide.title;
  document.getElementById("slide-subtitle").innerText = slide.subtitle;
  document.getElementById("slide-body-content").innerHTML = slide.content;

  // Update dots
  const dots = document.querySelectorAll(".slide-dot");
  dots.forEach((dot, idx) => {
    if (idx === index) dot.classList.add("active");
    else dot.classList.remove("active");
  });

  // Toggle button disable states
  document.getElementById("btn-prev").disabled = (index === 0);
  document.getElementById("btn-next").disabled = (index === slidesData.length - 1);
}

// 3. Interactive Clickable Prototype State Logic
function setupPrototypeFlows() {
  // Flow selector buttons
  const flowBtns = document.querySelectorAll(".flow-btn");
  flowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      flowBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const flowType = btn.getAttribute("data-flow");
      triggerFlow(flowType);
    });
  });

  // Interactive buttons inside phone screen
  
  // Screen 1: Age verification submit
  document.getElementById("age-submit").addEventListener("click", () => {
    const ageInput = document.getElementById("input-age").value;
    if (!ageInput || ageInput <= 0) {
      showToast("Please enter a valid age", "error");
      return;
    }
    
    userState.age = parseInt(ageInput);
    if (userState.age >= 18) {
      userState.isAdult = true;
      transitionPhoneScreen("screen-adult-consent");
      showToast("Age Verified: 18+. Showing DPDP consent notice.", "info");
      addAuditLog(`Age Verification: Age ${userState.age} (Adult). Granular Consent workflow initiated.`, "info");
    } else {
      userState.isAdult = false;
      transitionPhoneScreen("screen-minor-parent-details");
      showToast("Under-18 detected. Verifiable Parental Consent required.", "warning");
      addAuditLog(`Age Verification: Age ${userState.age} (Minor). Launching Verifiable Parental Consent (VPC) gateway.`, "warning");
    }
  });

  // Screen 2: Language translation toggle on adult consent notice
  const langPills = document.querySelectorAll(".lang-pill");
  langPills.forEach(pill => {
    pill.addEventListener("click", () => {
      langPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      userState.consentLanguage = pill.getAttribute("data-lang");
      updateConsentNoticeText();
    });
  });

  // Accept all adult consents
  document.getElementById("btn-consent-agree-all").addEventListener("click", () => {
    userState.consents.personalization = true;
    userState.consents.targetedAds = true;
    userState.consents.dataSharing = true;
    userState.hasAccount = true;
    
    transitionPhoneScreen("screen-spotify-home");
    renderSpotifyHomeFeed();
    showToast("Account Created. All consents granted.", "success");
    addAuditLog("Granular Consent: Core Streaming + Personalization + Targeted Ads + Data Sharing granted.", "success");
    
    // Telemetry Sync
    dashboardData.consentHealthRate = 87.8;
    dashboardData.consentOptOutPercent = 12.2;
    updateDashboardKPIs();
  });

  // Customize adult consents (shows toggles first)
  document.getElementById("btn-consent-custom").addEventListener("click", () => {
    const personalizeToggle = document.getElementById("toggle-personalize").checked;
    const adsToggle = document.getElementById("toggle-ads").checked;
    const sharingToggle = document.getElementById("toggle-sharing").checked;

    userState.consents.personalization = personalizeToggle;
    userState.consents.targetedAds = adsToggle;
    userState.consents.dataSharing = sharingToggle;
    userState.hasAccount = true;

    transitionPhoneScreen("screen-spotify-home");
    renderSpotifyHomeFeed();
    showToast("Account Created. Customized consents saved.", "success");
    addAuditLog(`Granular Consent: Customized toggles. Personalization=${personalizeToggle}, TargetedAds=${adsToggle}, PartnerSync=${sharingToggle}.`, "success");

    // Telemetry Sync: if user opted out of tracking, adjust metrics
    if (!personalizeToggle || !adsToggle) {
      dashboardData.consentHealthRate = 85.1;
      dashboardData.consentOptOutPercent = 14.9;
    }
    updateDashboardKPIs();
  });

  // Screen 3: Under-18 Parent Details Submit
  document.getElementById("parent-details-submit").addEventListener("click", () => {
    const parentEmail = document.getElementById("input-parent-email").value;
    const parentMobile = document.getElementById("input-parent-mobile").value;

    if (!parentEmail && !parentMobile) {
      showToast("Please provide Parent's Email or Mobile Number", "error");
      return;
    }

    // Move to Parental verification checkout simulation
    transitionPhoneScreen("screen-parent-vpc");
    showToast("Parent Consent Notification simulated. UPI Gateway launched.", "info");
    addAuditLog(`VPC Request: Approval token link generated and sent to parent contact details.`, "info");
  });

  // VPC UPI payment approval simulator
  const upiOptions = document.querySelectorAll(".upi-option");
  upiOptions.forEach(opt => {
    opt.addEventListener("click", () => {
      const upiApp = opt.getAttribute("data-app");
      showToast(`Initiating ₹1 verification via ${upiApp.toUpperCase()}...`, "info");
      addAuditLog(`UPI VPC Gateway: Initializing ₹1.00 refundable auth transaction using GPay/PhonePe API...`, "info");
      
      // Simulate quick checkout approval spinner
      opt.style.borderColor = "var(--spotify-green)";
      setTimeout(() => {
        userState.vpcCompleted = true;
        userState.vpcMethod = "upi";
        userState.consents.personalization = false; // Under-18: Strict block of behavioral profiling
        userState.consents.targetedAds = false;     // Under-18: Strict block of targeted ads
        userState.hasAccount = true;

        transitionPhoneScreen("screen-spotify-home");
        renderSpotifyHomeFeed();
        showToast("Verifiable Parental Consent Approved. Refundable ₹1 transaction complete.", "success");
        addAuditLog("UPI VPC Gateway: Adult signature verified. Refundable transaction successfully reconciled.", "success");
        addAuditLog("DBSync: Minor profile locked in Teen Mode. Behavioral tracking and targeted ads DISABLED (DPA Section 9).", "success");

        // Telemetry Sync
        dashboardData.vpcCompletionRate = 82.5;
        updateDashboardKPIs();
      }, 1500);
    });
  });

  // DigiLocker alternate verification simulation
  document.getElementById("digilocker-vpc-trigger").addEventListener("click", () => {
    showToast("Connecting to DigiLocker sandbox API...", "info");
    addAuditLog("DigiLocker VPC: Connecting to Digital Locker ID provider endpoints...", "info");
    setTimeout(() => {
      userState.vpcCompleted = true;
      userState.vpcMethod = "digilocker";
      userState.consents.personalization = false; 
      userState.consents.targetedAds = false;     
      userState.hasAccount = true;

      transitionPhoneScreen("screen-spotify-home");
      renderSpotifyHomeFeed();
      showToast("Parent Identity Verified via DigiLocker token audit.", "success");
      addAuditLog("DigiLocker VPC: Valid adult identity token received. Verification successful.", "success");
      addAuditLog("DBSync: Minor profile initialized in protected Teen Mode (DPA Section 9 compliance).", "success");
      
      dashboardData.vpcCompletionRate = 81.9;
      updateDashboardKPIs();
    }, 1500);
  });

  // Edge case: Teen guest pass option (Active for 48 hours contextual only)
  document.getElementById("btn-guest-pass").addEventListener("click", () => {
    userState.guestPassActive = true;
    userState.consents.personalization = false;
    userState.consents.targetedAds = false;
    userState.hasAccount = true;

    transitionPhoneScreen("screen-spotify-home");
    renderSpotifyHomeFeed();
    showToast("48-Hour Guest Pass Activated. Complete VPC before expiry to avoid suspension.", "warning");
    addAuditLog("Guest Pass: Activated temporary 48h token. VPC mapping is PENDING approval.", "warning");
    
    dashboardData.dropoffs += 5; // Simulates minor dropoffs if they forget later
    updateDashboardKPIs();
  });

  // Spotify Settings Center Navigation
  document.getElementById("nav-tab-settings").addEventListener("click", () => {
    if (!userState.hasAccount) {
      showToast("Please sign up first to access Settings.", "warning");
      return;
    }
    transitionPhoneScreen("screen-spotify-settings");
  });

  document.getElementById("nav-tab-home").addEventListener("click", () => {
    if (!userState.hasAccount) {
      transitionPhoneScreen("screen-age-gate");
      return;
    }
    transitionPhoneScreen("screen-spotify-home");
    renderSpotifyHomeFeed();
  });

  // Settings Items clicks
  document.getElementById("settings-privacy-center").addEventListener("click", () => {
    transitionPhoneScreen("screen-privacy-center-details");
    
    // Set current toggle states in settings panel
    document.getElementById("settings-toggle-personalize").checked = userState.consents.personalization;
    document.getElementById("settings-toggle-ads").checked = userState.consents.targetedAds;
    document.getElementById("settings-toggle-sharing").checked = userState.consents.dataSharing;

    // For under-18 users, lock toggles as disabled because DPDP prohibits profiling children
    if (!userState.isAdult) {
      document.getElementById("settings-toggle-personalize").disabled = true;
      document.getElementById("settings-toggle-ads").disabled = true;
      document.getElementById("settings-toggle-sharing").disabled = true;
      document.getElementById("minor-settings-notice").style.display = "block";
    } else {
      document.getElementById("settings-toggle-personalize").disabled = false;
      document.getElementById("settings-toggle-ads").disabled = false;
      document.getElementById("settings-toggle-sharing").disabled = false;
      document.getElementById("minor-settings-notice").style.display = "none";
    }
  });

  // Privacy Center save change triggers
  const privacyToggles = ["personalize", "ads", "sharing"];
  privacyToggles.forEach(toggleName => {
    document.getElementById(`settings-toggle-${toggleName}`).addEventListener("change", (e) => {
      const state = e.target.checked;
      
      if (toggleName === "personalize") {
        userState.consents.personalization = state;
        showToast(`Personalization recommendations ${state ? "Enabled" : "Disabled"}. Feed will reset.`, "info");
        addAuditLog(`DBSync: User updated preferences. Recommendation Profiling=${state ? "ENABLED" : "DISABLED"}.`, "warning");
      } else if (toggleName === "ads") {
        userState.consents.targetedAds = state;
        showToast(`Targeted ads ${state ? "Enabled" : "Disabled (switching to context ads)"}.`, "info");
        addAuditLog(`DBSync: User updated preferences. Personalized Targeted Ads=${state ? "ENABLED" : "DISABLED"}.`, "warning");
      } else if (toggleName === "sharing") {
        userState.consents.dataSharing = state;
        showToast(`Third-party data sharing ${state ? "Enabled" : "Disabled"}.`, "info");
        addAuditLog(`DBSync: User updated preferences. Third-Party Data Sync=${state ? "ENABLED" : "DISABLED"}.`, "warning");
      }

      // Live metrics update based on settings toggles
      if (!userState.consents.personalization) {
        dashboardData.consentHealthRate = Math.max(70, dashboardData.consentHealthRate - 0.5);
      } else {
        dashboardData.consentHealthRate = Math.min(88, dashboardData.consentHealthRate + 0.5);
      }
      updateDashboardKPIs();
    });
  });

  // Right to Portability (Data Download)
  document.getElementById("btn-data-export").addEventListener("click", () => {
    showToast("Export request submitted. Secure download link sent to registered email.", "success");
    addAuditLog("Data Request: Portability export package (JSON schema format) triggered for user UUID-5592.", "success");
  });

  // Right to Erasure (Delete Account)
  document.getElementById("btn-data-erasure").addEventListener("click", () => {
    if (confirm("Under Section 12 of India DPDP Act, you have the Right to Erasure. This will permanently delete your Spotify account and listening data. Proceed?")) {
      userState.hasAccount = false;
      userState.age = null;
      userState.isAdult = null;
      userState.vpcCompleted = false;
      userState.guestPassActive = false;
      
      transitionPhoneScreen("screen-age-gate");
      showToast("Account and data completely erased from Spotify databases.", "success");
      addAuditLog("Data Request: Erasure executed. Deleted database records for user UUID-5592 (DPA Section 12).", "danger");
      
      // Update Dashboard
      dashboardData.activeUsers -= 1;
      dashboardData.consentHealthRate = 86.4;
      updateDashboardKPIs();
    }
  });

  // Settings Back buttons
  document.getElementById("btn-back-settings").addEventListener("click", () => {
    transitionPhoneScreen("screen-spotify-home");
  });

  document.getElementById("btn-back-privacy").addEventListener("click", () => {
    transitionPhoneScreen("screen-spotify-settings");
  });
}

function triggerFlow(flowType) {
  // Resets state and sends user to respective screen
  userState.hasAccount = false;
  userState.age = null;
  userState.isAdult = null;
  userState.vpcCompleted = false;
  userState.guestPassActive = false;
  
  if (flowType === "adult") {
    document.getElementById("input-age").value = "24";
    transitionPhoneScreen("screen-age-gate");
    showToast("Adult Flow selected. Tap 'Verify Age'.", "info");
  } else if (flowType === "teen") {
    document.getElementById("input-age").value = "15";
    transitionPhoneScreen("screen-age-gate");
    showToast("Teen Flow selected. Tap 'Verify Age'.", "info");
  } else if (flowType === "privacy") {
    // Force log in to an adult profile with full settings active
    userState.age = 28;
    userState.isAdult = true;
    userState.hasAccount = true;
    userState.consents.personalization = true;
    userState.consents.targetedAds = true;
    transitionPhoneScreen("screen-spotify-settings");
    showToast("Privacy Center Flow selected. Tap 'DPDP Privacy Center'.", "info");
  }
}

function transitionPhoneScreen(screenId) {
  const screens = document.querySelectorAll(".screen-view");
  screens.forEach(s => s.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");

  // Sync nav tab highlights
  const navHome = document.getElementById("nav-tab-home");
  const navSettings = document.getElementById("nav-tab-settings");

  if (screenId === "screen-spotify-home") {
    navHome.classList.add("active");
    navSettings.classList.remove("active");
  } else if (screenId === "screen-spotify-settings" || screenId === "screen-privacy-center-details") {
    navHome.classList.remove("active");
    navSettings.classList.add("active");
  }
}

function updateConsentNoticeText() {
  const lang = userState.consentLanguage;
  const t = translations[lang];

  document.getElementById("notice-title").innerText = t.noticeTitle;
  document.getElementById("notice-body").innerText = t.noticeBody;
  
  document.getElementById("txt-mandatory-title").innerText = t.mandatoryTitle;
  document.getElementById("txt-mandatory-desc").innerText = t.mandatoryDesc;

  document.getElementById("txt-recs-title").innerText = t.recsTitle;
  document.getElementById("txt-recs-desc").innerText = t.recsDesc;

  document.getElementById("txt-ads-title").innerText = t.adsTitle;
  document.getElementById("txt-ads-desc").innerText = t.adsDesc;

  document.getElementById("txt-sharing-title").innerText = t.sharingTitle;
  document.getElementById("txt-sharing-desc").innerText = t.sharingDesc;

  document.getElementById("btn-consent-agree-all").innerText = t.btnAgreeAll;
  document.getElementById("btn-consent-custom").innerText = t.btnConfirmCustom;
}

function renderSpotifyHomeFeed() {
  const feed = document.getElementById("spotify-home-feed");
  let contentHtml = "";

  if (userState.isAdult) {
    if (userState.consents.personalization) {
      // Adult + Personalization ON
      contentHtml = `
        <div class="privacy-banner-alert">
          <span>🛡️ <strong>Personalized Experience:</strong> Tracking Active.</span>
          <button class="privacy-banner-btn" onclick="document.getElementById('nav-tab-settings').click(); document.getElementById('settings-privacy-center').click();">Opt-Out</button>
        </div>
        
        <h4 class="spotify-section-title">Your Daily Mixes</h4>
        <div class="spotify-grid">
          <div class="spotify-card">
            <div class="spotify-card-img grad-1">🔥</div>
            <div class="spotify-card-title">Daily Mix 1<br><small>Arijit Singh, Pritam</small></div>
          </div>
          <div class="spotify-card">
            <div class="spotify-card-img grad-2">🎧</div>
            <div class="spotify-card-title">Discover Weekly<br><small>Curated for you</small></div>
          </div>
        </div>

        <h4 class="spotify-section-title">Recently Played</h4>
        <div class="spotify-album-row">
          <div class="spotify-album-card">
            <div class="spotify-album-img grad-5">💿</div>
            <div class="spotify-album-title">Kabir Singh</div>
            <div class="spotify-album-sub">Sachet Tandon</div>
          </div>
          <div class="spotify-album-card">
            <div class="spotify-album-img grad-3">✨</div>
            <div class="spotify-album-title">Love Beats</div>
            <div class="spotify-album-sub">Various Artists</div>
          </div>
        </div>
      `;
    } else {
      // Adult + Personalization OFF (Compliance Contextual Mode)
      contentHtml = `
        <div class="privacy-banner-alert" style="background-color: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3);">
          <span>🔒 <strong>Contextual Mode:</strong> Listening history not tracked.</span>
          <button class="privacy-banner-btn" onclick="document.getElementById('nav-tab-settings').click(); document.getElementById('settings-privacy-center').click();">Opt-In</button>
        </div>
        
        <h4 class="spotify-section-title">Popular in India 🇮🇳</h4>
        <div class="spotify-grid">
          <div class="spotify-card">
            <div class="spotify-card-img grad-4">📈</div>
            <div class="spotify-card-title">India Top 50<br><small>Daily Charts</small></div>
          </div>
          <div class="spotify-card">
            <div class="spotify-card-img grad-6">🌎</div>
            <div class="spotify-card-title">Global Hot Hits<br><small>Trending Hits</small></div>
          </div>
        </div>

        <h4 class="spotify-section-title">Browse Mood Stations</h4>
        <div class="spotify-album-row">
          <div class="spotify-album-card">
            <div class="spotify-album-img grad-7">🌧️</div>
            <div class="spotify-album-title">Rainy Days</div>
            <div class="spotify-album-sub">Chill Acoustic</div>
          </div>
          <div class="spotify-album-card">
            <div class="spotify-album-img grad-8">☕</div>
            <div class="spotify-album-title">Cafe Music</div>
            <div class="spotify-album-sub">Jazz instrumentals</div>
          </div>
        </div>
      `;
    }
  } else {
    // Minor/Teen (Strict Contextual & VPC Protections)
    const alertColor = userState.guestPassActive ? "var(--color-warning)" : "var(--spotify-green)";
    const alertText = userState.guestPassActive ? "⚠️ <strong>Guest Pass (48h):</strong> Verification Pending." : "🛡️ <strong>Teen Mode:</strong> VPC Active. Tracking Off.";
    
    contentHtml = `
      <div class="privacy-banner-alert" style="background-color: rgba(18,18,24,0.5); border-color: ${alertColor};">
        <span>${alertText}</span>
        ${userState.guestPassActive ? `<button class="privacy-banner-btn" onclick="transitionPhoneScreen('screen-parent-vpc')">Verify Now</button>` : ''}
      </div>
      
      <h4 class="spotify-section-title">Top Charts (Teen Protected)</h4>
      <div class="spotify-grid">
        <div class="spotify-card">
          <div class="spotify-card-img grad-6">🚀</div>
          <div class="spotify-card-title">Viral 50 India<br><small>Contextual Popularity</small></div>
        </div>
        <div class="spotify-card">
          <div class="spotify-card-img grad-5">🎵</div>
          <div class="spotify-card-title">Teen Anthem Radio<br><small>Censored & Curated</small></div>
        </div>
      </div>

      <h4 class="spotify-section-title">Context Discovery Radios</h4>
      <div class="spotify-album-row">
        <div class="spotify-album-card">
          <div class="spotify-album-img grad-4">📚</div>
          <div class="spotify-album-title">Study Lofi Beats</div>
          <div class="spotify-album-sub">No-Profiling Loop</div>
        </div>
        <div class="spotify-album-card">
          <div class="spotify-album-img grad-8">⚡</div>
          <div class="spotify-album-title">Workout Cardio</div>
          <div class="spotify-album-sub">Upbeat Hits</div>
        </div>
      </div>
    `;
  }
  
  feed.innerHTML = contentHtml;
}

// 4. Live Telemetry Dashboard Updates
function updateDashboardKPIs() {
  document.getElementById("dash-kpi-chr").innerText = `${dashboardData.consentHealthRate.toFixed(1)}%`;
  document.getElementById("dash-kpi-vpc").innerText = `${dashboardData.vpcCompletionRate.toFixed(1)}%`;
  document.getElementById("dash-kpi-users").innerText = (dashboardData.activeUsers / 1000000).toFixed(1) + "M";
}

function renderDashboardCharts() {
  const chartWrapper = document.getElementById("trend-chart-wrapper");
  if (!chartWrapper) return;

  // Custom inline SVG rendering to keep it dependency-free & highly responsive
  chartWrapper.innerHTML = `
    <svg class="svg-chart" viewBox="0 0 500 200">
      <defs>
        <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--spotify-green)" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="var(--spotify-green)" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      
      <!-- Grid lines -->
      <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
      <line x1="40" y1="70" x2="480" y2="70" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
      <line x1="40" y1="120" x2="480" y2="120" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
      <line x1="40" y1="170" x2="480" y2="170" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
      
      <!-- Trend Line / Area (CHR over 6 Weeks post-launch) -->
      <!-- Coordinates mapped for: W1:88%, W2:87.5%, W3:72.5% (The 15% Drop!), W4:76%, W5:82%, W6:86.4% -->
      <path class="area" d="M 40 170 L 40 50 L 128 52 L 216 112 L 304 98 L 392 74 L 480 56 L 480 170 Z" />
      <path class="line" d="M 40 50 L 128 52 L 216 112 L 304 98 L 392 74 L 480 56" />
      
      <!-- Highlight the Drop at Week 3 -->
      <circle class="dot" cx="216" cy="112" r="5" stroke="var(--color-danger)" />
      
      <!-- Labels -->
      <text x="40" y="190" fill="var(--text-muted)" font-size="10" text-anchor="middle">Wk 1</text>
      <text x="128" y="190" fill="var(--text-muted)" font-size="10" text-anchor="middle">Wk 2</text>
      <text x="216" y="190" fill="var(--color-danger)" font-size="10" text-anchor="middle" font-weight="bold">Wk 3 (Drop!)</text>
      <text x="304" y="190" fill="var(--text-muted)" font-size="10" text-anchor="middle">Wk 4</text>
      <text x="392" y="190" fill="var(--text-muted)" font-size="10" text-anchor="middle">Wk 5</text>
      <text x="480" y="190" fill="var(--text-muted)" font-size="10" text-anchor="middle">Wk 6 (Now)</text>
      
      <text x="35" y="54" fill="var(--text-muted)" font-size="9" text-anchor="end">88%</text>
      <text x="35" y="116" fill="var(--text-muted)" font-size="9" text-anchor="end">72%</text>
    </svg>
  `;

  // Draw the segmentation bar chart next to it
  const segWrapper = document.getElementById("seg-chart-wrapper");
  if (!segWrapper) return;
  segWrapper.innerHTML = `
    <div style="width: 100%; display: flex; flex-direction: column; gap: 14px; margin-top: 10px;">
      <div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
          <span>Adults (Granular Profiling Enabled)</span>
          <strong style="color: var(--spotify-green)">86.4%</strong>
        </div>
        <div style="height: 8px; background-color: var(--bg-tertiary); border-radius: 4px; overflow: hidden;">
          <div style="height: 100%; width: 86.4%; background-color: var(--spotify-green); border-radius: 4px;"></div>
        </div>
      </div>
      <div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
          <span>Teens (Protected Contextual Discovery)</span>
          <strong style="color: var(--color-info)">72.8%</strong>
        </div>
        <div style="height: 8px; background-color: var(--bg-tertiary); border-radius: 4px; overflow: hidden;">
          <div style="height: 100%; width: 72.8%; background-color: var(--color-info); border-radius: 4px;"></div>
        </div>
      </div>
      <div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
          <span>Explicit Opt-Out (Context Mode Only)</span>
          <strong style="color: var(--color-danger)">13.6%</strong>
        </div>
        <div style="height: 8px; background-color: var(--bg-tertiary); border-radius: 4px; overflow: hidden;">
          <div style="height: 100%; width: 13.6%; background-color: var(--color-danger); border-radius: 4px;"></div>
        </div>
      </div>
    </div>
  `;
}

// Toast System
function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  
  toast.className = "toast-notification show"; // Reset classes
  if (type === "success") toast.classList.add("toast-success");
  if (type === "warning") toast.classList.add("toast-warning");
  if (type === "error") toast.classList.add("toast-error");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}

// Live Audit Logger for Telemetry Dashboard
function addAuditLog(message, type = "info") {
  const container = document.getElementById("dash-log-container");
  if (!container) return;

  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0];

  let tagClass = "tag-info";
  let tagText = "INFO";
  if (type === "success") { tagClass = "tag-success"; tagText = "SUCCESS"; }
  if (type === "warning") { tagClass = "tag-warn"; tagText = "WARN"; }
  if (type === "error" || type === "danger") { tagClass = "tag-danger"; tagText = "ERROR"; }

  const entry = document.createElement("div");
  entry.className = "log-entry";
  entry.innerHTML = `<span class="log-time">[${timeStr}]</span> <span class="log-tag ${tagClass}">${tagText}</span> ${message}`;
  
  container.appendChild(entry);
  container.scrollTop = container.scrollHeight; // Auto-scroll
}
