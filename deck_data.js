const slidesData = [
  {
    id: 1,
    title: "1. Problem Statement",
    subtitle: "Spotify India: Personalization vs. Privacy Compliance",
    content: `
      <div class="slide-grid">
        <div class="slide-col">
          <h3>The Challenge</h3>
          <p>Spotify's core product value relies heavily on <strong>behavioral profiling</strong> (Discover Weekly, Daily Mixes) and <strong>personalized ads</strong>. However, India's <strong>DPDP Act 2023</strong> mandates explicit, granular, and revocable consent. More critically, Section 9 <strong>prohibits all behavioral tracking and targeted advertising for children (under 18)</strong>, requiring Verifiable Parental Consent (VPC).</p>
          <div class="badge green">Compliance Focus: Spotify India</div>
        </div>
        <div class="slide-col">
          <h3>Why It Matters</h3>
          <ul>
            <li><strong>Legal & Financial Risk:</strong> Penalties under DPDP can reach up to ₹250 Crores for failure to prevent data breaches or processing children's data without VPC.</li>
            <li><strong>User Trust:</strong> India has 55M+ active users. Teens represent a massive user cohort that drives organic growth; driving them away with friction is a business risk.</li>
            <li><strong>The Core Trade-off:</strong> How to implement friction-free parental verification and granular consent while preserving the magic of music discovery.</li>
          </ul>
        </div>
      </div>
      <div class="slide-footer-notes">
        <strong>Key Assumptions:</strong> (1) 22% of active Spotify India users are under 18. (2) Music recommendation indexing is legally classified as "behavioral monitoring" under Section 9.
      </div>
    `
  },
  {
    id: 2,
    title: "2. Target Personas",
    subtitle: "Understanding Our Stakeholders' Gaps & Needs",
    content: `
      <div class="personas-container">
        <div class="persona-card">
          <div class="persona-header">
            <span class="persona-avatar">🧑</span>
            <div>
              <h4>Aarav Mehta, 15</h4>
              <span class="persona-tag">The Teenager</span>
            </div>
          </div>
          <div class="persona-body">
            <p><strong>Context:</strong> High school student in Mumbai, loves sharing music on Instagram, listens to hip-hop 3 hours a day.</p>
            <p><strong>Pain Point:</strong> Worries that parental consent will lock him out of Spotify or ruin his music suggestions. Has zero patience for complex verification flows.</p>
            <p><strong>Goal:</strong> Instant access to songs, playlist sharing, and finding cool new tracks.</p>
          </div>
        </div>
        
        <div class="persona-card">
          <div class="persona-header">
            <span class="persona-avatar">👩</span>
            <div>
              <h4>Meera Mehta, 42</h4>
              <span class="persona-tag">The Parent</span>
            </div>
          </div>
          <div class="persona-body">
            <p><strong>Context:</strong> Aarav's mother. Tech-literate, uses UPI for groceries, cautious about online safety and spam.</p>
            <p><strong>Pain Point:</strong> Reluctant to upload ID documents (Aadhaar/PAN) or credit cards to random apps. Fears hidden subscriptions.</p>
            <p><strong>Goal:</strong> Give quick, secure approval for her son's streaming app without digital leakage.</p>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 3,
    title: "3. Current Experience vs. DPDP Gap Analysis",
    subtitle: "Where Spotify India Falls Short of Regulatory Standards",
    content: `
      <div class="slide-table-container">
        <table class="compliance-table">
          <thead>
            <tr>
              <th>Product Feature</th>
              <th>Current Experience (Pre-DPDP)</th>
              <th>DPDP Act Requirement</th>
              <th>Gap & Risk Level</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Consent Collection</strong></td>
              <td>Pre-checked checkmarks and single "Agree to T&C" button during signup.</td>
              <td>Consent must be free, specific, informed, unconditional, and unambiguous (Section 6).</td>
              <td><span class="badge red">Critical Gap</span> Non-compliant default consent mechanisms.</td>
            </tr>
            <tr>
              <td><strong>Minor's Data & Ads</strong></td>
              <td>Tracks listening history of under-18s to serve targeted audio/banner ads.</td>
              <td>No behavioral monitoring, profiling, or targeted advertising directed at children (Section 9).</td>
              <td><span class="badge red">Critical Gap</span> Severe statutory violation; high penalty risk.</td>
            </tr>
            <tr>
              <td><strong>Parental Consent</strong></td>
              <td>Self-declared age screen. Under-18s can easily input fake birth years.</td>
              <td>Verifiable Parental Consent (VPC) required for processing minor's data (Section 9).</td>
              <td><span class="badge yellow">High Gap</span> Age-gating easily bypassed. No validation.</td>
            </tr>
            <tr>
              <td><strong>Rights Revocation</strong></td>
              <td>Requires navigating deep help links or emailing support to withdraw consent or delete data.</td>
              <td>Withdrawing consent must be as easy as giving it (Section 6(4)). Data erasure on request.</td>
              <td><span class="badge yellow">Medium Gap</span> High friction rights execution.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  },
  {
    id: 4,
    title: "4. Proposed Solution: The Three Pillars",
    subtitle: "Bringing Spotify India into Full Compliance with Minimal Friction",
    content: `
      <div class="pillars-grid">
        <div class="pillar-card">
          <div class="pillar-num">01</div>
          <h4>Granular Consent Flow</h4>
          <p>Introducing a bilingual (Hindi/English) onboarding modal for users 18+ to opt-in to profiling and personalization separately from core streaming agreement.</p>
        </div>
        <div class="pillar-card">
          <div class="pillar-num">02</div>
          <h4>Refundable ₹1 UPI Verification</h4>
          <p>Industry-first VPC flow. Parents authenticate using their UPI app (GPay, PhonePe, Paytm). The ₹1 charge verifies 18+ bank-linked identity and is refunded instantly.</p>
        </div>
        <div class="pillar-card">
          <div class="pillar-num">03</div>
          <h4>Contextual discovery Mode</h4>
          <p>For children (<18), recommendation engines swap to contextual variables (mood, local charts, time-of-day) instead of tracking historical behavior. Ads are contextual-only.</p>
        </div>
      </div>
    `
  },
  {
    id: 5,
    title: "5. Success Metrics & Telemetry",
    subtitle: "Measuring Compliance, User Experience, and Business Guardrails",
    content: `
      <div class="slide-grid">
        <div class="slide-col">
          <div class="metric-highlight-box">
            <span class="metric-label">NORTH STAR METRIC</span>
            <div class="metric-value">Consent Health Rate (CHR)</div>
            <p class="metric-desc">% of Monthly Active Users (MAU) operating under active, compliant consent (or verified parental consent for minors) without opting out of personalized music services.</p>
          </div>
        </div>
        <div class="slide-col">
          <h3>Supporting & Guardrail Metrics</h3>
          <div class="metric-list">
            <div class="metric-item">
              <span class="metric-num">90%</span>
              <div>
                <strong>VPC Completion Rate (Supporting)</strong>
                <p>Share of under-18 signups completing parental verification within the 48-hour grace period.</p>
              </div>
            </div>
            <div class="metric-item">
              <span class="metric-num">&lt;3%</span>
              <div>
                <strong>Sign-up Drop-off Rate (Guardrail)</strong>
                <p>Increase in registration abandonment due to the new granular consent screens.</p>
              </div>
            </div>
            <div class="metric-item">
              <span class="metric-num">&gt;85%</span>
              <div>
                <strong>Ad-supported Engagement (Guardrail)</strong>
                <p>Retention rate of ad-supported listeners in Contextual Mode vs. standard personalized mode.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 6,
    title: "6. Success Criteria & Target Goals",
    subtitle: "Definition of a Successful DPDP Implementation",
    content: `
      <div class="success-criteria-grid">
        <div class="sc-card">
          <h4>Compliance Goal</h4>
          <div class="sc-target">100% Compliant</div>
          <p>Transition 100% of the active Indian user base to valid DPDP-compliant consent contracts within 90 days of launch, with zero regulatory audits flagged.</p>
        </div>
        <div class="sc-card">
          <h4>VPC Onboarding Goal</h4>
          <div class="sc-target">&gt;82% Conversion</div>
          <p>Achieve an 82% parental consent success rate for users self-identifying as under 18, optimizing the 48-hour grace period to prevent cohort drop-offs.</p>
        </div>
        <div class="sc-card">
          <h4>Ad Revenue Preservation</h4>
          <div class="sc-target">&lt;4% Revenue Dip</div>
          <p>Limit CPM drop-offs for under-18 contextual audio ads compared to historical behavioral-targeted ads by packaging demographic and contextual playlists effectively.</p>
        </div>
      </div>
    `
  },
  {
    id: 7,
    title: "7. Diagnostic Thinking: Post-Launch Metric Drop",
    subtitle: "Hypothesis Tree: Analyzing a 15% Drop in CHR at Week 3",
    content: `
      <div class="diagnostic-tree-container">
        <div class="tree-root"><strong>15% Drop in Consent Health Rate (CHR)</strong></div>
        <div class="tree-branches">
          <div class="tree-branch">
            <h5>1. Technical Failure (Telemetry/APIs)</h5>
            <ul>
              <li><strong>Hypothesis T1:</strong> UPI VPC payment gateway timeout rate increased (checkout page hangs).</li>
              <li><strong>Hypothesis T2:</strong> Local storage session-sync bug is auto-revoking consent settings on Android devices.</li>
              <li><em>Data to Analyze:</em> API success logs from payment partners, JS console error rates segmented by app version.</li>
            </ul>
          </div>
          <div class="tree-branch">
            <h5>2. UX Friction / Communication</h5>
            <ul>
              <li><strong>Hypothesis U1:</strong> Translation of consent toggles in Hindi is leading to high opt-outs (confusion on 'profiling').</li>
              <li><strong>Hypothesis U2:</strong> The SMS parent-link expires too quickly (e.g., 2 hours instead of 48 hours grace period).</li>
              <li><em>Data to Analyze:</em> Funnel completion rates segmented by Language setting; OTP expiry timestamps.</li>
            </ul>
          </div>
          <div class="tree-branch">
            <h5>3. External Factors</h5>
            <ul>
              <li><strong>Hypothesis E1:</strong> Viral tech creator publishes a "Get ad-free Spotify by toggling off tracking" video.</li>
              <li><strong>Hypothesis E2:</strong> Indian privacy group releases public advisory urging users to deny recommendation consent on all apps.</li>
              <li><em>Data to Analyze:</em> Web and social media listening (referral traffic, YouTube spikes, Twitter trends).</li>
            </ul>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 8,
    title: "8. Compliance Health Monitor Dashboard",
    subtitle: "Continuous Telemetry for the DPDP Experience",
    content: `
      <div class="slide-grid">
        <div class="slide-col">
          <h3>Monitoring Strategy</h3>
          <p>A real-time product dashboard is essential to trace compliance metrics and quickly catch onboarding friction. We trace metrics across three dimensions:</p>
          <ul>
            <li><strong>Consent Status:</strong> Tracks what percentage of active users have enabled/disabled recommendation profiling and targeted ads.</li>
            <li><strong>Parental Verification Funnel:</strong> Shows where parents drop off during the UPI / DigiLocker verification flow.</li>
            <li><strong>Cohort Performance:</strong> Compares active streaming time and playlist saves between users in Contextual Mode vs. Standard Mode.</li>
          </ul>
          <div class="badge green">Interactive dashboard available in the 'Dashboard' tab!</div>
        </div>
        <div class="slide-col">
          <div class="mock-dash-preview">
            <div class="bar-chart-preview">
              <div class="bar-container"><div class="bar animate-bar" style="height: 86%;"><span>86%</span></div><small>Adults</small></div>
              <div class="bar-container"><div class="bar animate-bar" style="height: 72%;"><span>72%</span></div><small>Teens (VPC)</small></div>
              <div class="bar-container"><div class="bar animate-bar" style="height: 14%;"><span>14%</span></div><small>Opt-out</small></div>
            </div>
            <p class="center-text"><strong>Consent Distribution Cohorts</strong></p>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 9,
    title: "9. Rollout & Experimentation Plan",
    subtitle: "Minimizing Business Risk While Ensuring Statutory Compliance",
    content: `
      <div class="rollout-phases">
        <div class="phase-step">
          <h5>Phase 1: Internal Alpha & Sandbox (Weeks 1-2)</h5>
          <p>Deploy UPI VPC and bilingual consent toggles to employees and closed developer sandbox. Focus: Load testing verification endpoints.</p>
        </div>
        <div class="phase-step">
          <h5>Phase 2: Regional Beta & Optimization (Weeks 3-5)</h5>
          <p>Rollout to 5% of ad-supported users in Tier-2/3 cities in Maharashtra & Karnataka. <strong>A/B test onboarding copy and visual styling</strong> (compliance itself is not testable, but UX is).</p>
        </div>
        <div class="phase-step">
          <h5>Phase 3: National Launch & Grace Period (Weeks 6-8)</h5>
          <p>Launch to 100% of Indian users. Provide existing users with a 30-day "grace period prompt" to review consents rather than blocking access instantly, avoiding churn.</p>
        </div>
      </div>
      <div class="rollout-warning-alert">
        <strong>Compliance Testing Guardrail:</strong> Control group (no consent notice) is legally prohibited. We A/B test layout variants only (e.g., progressive onboarding vs. full-screen blocking modals).
      </div>
    `
  },
  {
    id: 10,
    title: "10. Risks, Trade-offs & Edge Cases",
    subtitle: "Strategic Decisions and accepted Product Compromises",
    content: `
      <div class="slide-table-container">
        <table class="compliance-table">
          <thead>
            <tr>
              <th>Risk / Edge Case</th>
              <th>Description</th>
              <th>Strategic Trade-off Accepted</th>
              <th>Mitigation Plan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Onboarding Friction</strong></td>
              <td>UPI VPC verification adds 2 steps for teens, leading to signup drop-offs.</td>
              <td><strong>Regulatory compliance is prioritized</strong> over absolute raw registration volume.</td>
              <td>Offer a 48-hour guest pass (with contextual music only) while VPC is pending parent approval.</td>
            </tr>
            <tr>
              <td><strong>Contextual Recommendation Quality</strong></td>
              <td>Under-18s cannot be profiled, resulting in poorer music recommendations.</td>
              <td><strong>User profiling is restricted</strong>. We trade automated personal recommendations for legal safety.</td>
              <td>Introduce active contextual inputs (e.g., mood sliders, interactive theme radio stations) that do not store history.</td>
            </tr>
            <tr>
              <td><strong>Ad Monetization Drop</strong></td>
              <td>No behavioral advertising for children decreases premium ad rates (CPM).</td>
              <td><strong>Slower ad-revenue growth</strong> accepted for the under-18 segment.</td>
              <td>Sell premium Sponsorship takeovers on massive curated playlists (e.g., 'Bollywood Hits') that reach teens contextually.</td>
            </tr>
            <tr>
              <td><strong>Consent Revocation Abuse</strong></td>
              <td>Users opting out of recommendations complaining that Spotify is "broken" or "bad".</td>
              <td><strong>Absolute transparency</strong> over recommendation engines is accepted.</td>
              <td>Show a clear warning in the settings center: "Disabling personalization will reset your Discover Weekly."</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { slidesData };
}
