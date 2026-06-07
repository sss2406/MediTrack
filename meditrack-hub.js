/**
 * MediTrack Enhanced Hub — Drop-in feature launcher
 * Add <script src="meditrack-hub.js"></script> to any MediTrack page
 */
(function () {
  'use strict';

  // Authentication Check
  const session = JSON.parse(
    localStorage.getItem('mt_session') || 'null'
  );

  if (!session || session.expires < Date.now()) {
    localStorage.removeItem('mt_session');
    localStorage.removeItem('mt_user');
    if (!window.location.pathname.includes('auth.html')) {
      window.location.href = './auth.html';
    }
    return;
  }

  const MT = {
    version: '2.0.0',
    user: JSON.parse(localStorage.getItem('mt_user') || 'null'),
    lang: localStorage.getItem('mt_lang') || 'en',
    theme: localStorage.getItem('mt_theme') || 'light',
    i18n: {
      en: { hub: 'MediTrack Hub', ai: 'AI Assistant', ocr: 'Scan Rx', analytics: 'Analytics', sos: 'SOS', voice: 'Voice', settings: 'Settings', login: 'Login', logout: 'Logout', close: 'Close', loading: 'Loading…' },
      ta: { hub: 'மெடிட்ராக் ஹப்', ai: 'AI உதவியாளர்', ocr: 'Rx ஸ்கேன்', analytics: 'பகுப்பாய்வு', sos: 'SOS', voice: 'குரல்', settings: 'அமைப்புகள்', login: 'உள்நுழை', logout: 'வெளியேறு', close: 'மூடு', loading: 'ஏற்றுகிறது…' },
      hi: { hub: 'मेडीट्रैक हब', ai: 'AI सहायक', ocr: 'Rx स्कैन', analytics: 'विश्लेषण', sos: 'SOS', voice: 'आवाज़', settings: 'सेटिंग्स', login: 'लॉग इन', logout: 'लॉग आउट', close: 'बंद करें', loading: 'लोड हो रहा है…' }
    },
    t(key) { return (MT.i18n[MT.lang] || MT.i18n.en)[key] || key; }
  };

  // ── CSS ────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    :root{--mt-bg:#0f172a;--mt-surface:#1e293b;--mt-card:#243447;--mt-accent:#06b6d4;--mt-accent2:#8b5cf6;--mt-success:#10b981;--mt-danger:#ef4444;--mt-warn:#f59e0b;--mt-text:#f1f5f9;--mt-muted:#94a3b8;--mt-border:#334155;--mt-radius:14px;--mt-shadow:0 8px 32px rgba(0,0,0,.45);}
    body.mt-light-mode{--mt-bg:#f0f9ff;--mt-surface:#ffffff;--mt-card:#e0f2fe;--mt-text:#0f172a;--mt-muted:#475569;--mt-border:#bae6fd;}
    #mt-fab{position:fixed;bottom:28px;right:28px;z-index:9999;width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,var(--mt-accent),var(--mt-accent2));border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(6,182,212,.5);transition:transform .2s,box-shadow .2s;color:#fff;font-size:26px;}
    #mt-fab:hover{transform:scale(1.1);box-shadow:0 6px 28px rgba(6,182,212,.7);}
    #mt-fab .mt-pulse{position:absolute;top:-3px;right:-3px;width:14px;height:14px;background:var(--mt-danger);border-radius:50%;border:2px solid var(--mt-bg);animation:mt-pulse 1.5s infinite;}
    @keyframes mt-pulse{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.3);opacity:.7;}}
    #mt-overlay{position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,.6);backdrop-filter:blur(6px);display:none;align-items:flex-end;justify-content:center;}
    #mt-overlay.open{display:flex;}
    #mt-panel{background:var(--mt-bg);border-radius:28px 28px 0 0;width:100%;max-width:520px;max-height:90vh;overflow:hidden;display:flex;flex-direction:column;animation:mt-slide .3s ease;}
    @keyframes mt-slide{from{transform:translateY(100%);}to{transform:translateY(0);}}
    #mt-panel-header{padding:20px 24px 12px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--mt-border);}
    #mt-panel-header h2{margin:0;font-size:18px;font-weight:700;color:var(--mt-text);letter-spacing:-.3px;}
    #mt-panel-header span{font-size:11px;color:var(--mt-accent);background:rgba(6,182,212,.15);padding:3px 10px;border-radius:20px;margin-left:8px;}
    #mt-close-btn{background:none;border:1px solid var(--mt-border);color:var(--mt-muted);width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;}
    #mt-close-btn:hover{background:var(--mt-surface);color:var(--mt-text);}
    #mt-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:20px;overflow-y:auto;}
    .mt-tile{background:var(--mt-surface);border:1px solid var(--mt-border);border-radius:var(--mt-radius);padding:18px 12px 14px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:8px;transition:all .2s;text-decoration:none;}
    .mt-tile:hover{background:var(--mt-card);border-color:var(--mt-accent);transform:translateY(-2px);box-shadow:0 4px 16px rgba(6,182,212,.2);}
    .mt-tile .mt-icon{font-size:28px;}
    .mt-tile .mt-label{font-size:12px;font-weight:600;color:var(--mt-text);text-align:center;letter-spacing:.3px;}
    .mt-tile .mt-desc{font-size:10px;color:var(--mt-muted);text-align:center;}
    .mt-tile.sos{border-color:var(--mt-danger);background:rgba(239,68,68,.1);}
    .mt-tile.sos .mt-icon{animation:mt-pulse 1s infinite;}
    #mt-modal{position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.7);backdrop-filter:blur(8px);display:none;align-items:center;justify-content:center;padding:20px;}
    #mt-modal.open{display:flex;}
    #mt-modal-inner{background:var(--mt-bg);border-radius:20px;width:100%;max-width:600px;max-height:88vh;overflow-y:auto;position:relative;}
    #mt-modal-inner .mt-modal-header{padding:20px 24px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--mt-border);position:sticky;top:0;background:var(--mt-bg);z-index:1;}
    #mt-modal-inner .mt-modal-header h3{margin:0;font-size:17px;font-weight:700;color:var(--mt-text);}
    #mt-modal-body{padding:20px 24px 28px;}
    .mt-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:10px;border:none;cursor:pointer;font-size:14px;font-weight:600;transition:all .2s;}
    .mt-btn-primary{background:var(--mt-accent);color:#fff;}
    .mt-btn-primary:hover{filter:brightness(1.1);}
    .mt-btn-secondary{background:var(--mt-surface);color:var(--mt-text);border:1px solid var(--mt-border);}
    .mt-btn-danger{background:var(--mt-danger);color:#fff;}
    .mt-input{width:100%;padding:10px 14px;border-radius:10px;border:1px solid var(--mt-border);background:var(--mt-surface);color:var(--mt-text);font-size:14px;outline:none;box-sizing:border-box;margin-top:4px;}
    .mt-input:focus{border-color:var(--mt-accent);}
    .mt-label-text{font-size:13px;color:var(--mt-muted);display:block;margin-top:14px;}
    .mt-chat-bubble{padding:10px 14px;border-radius:14px;max-width:85%;font-size:14px;line-height:1.5;margin:6px 0;}
    .mt-chat-bubble.user{background:var(--mt-accent);color:#fff;align-self:flex-end;margin-left:auto;}
    .mt-chat-bubble.ai{background:var(--mt-surface);color:var(--mt-text);border:1px solid var(--mt-border);}
    .mt-chat-area{display:flex;flex-direction:column;gap:4px;min-height:200px;max-height:340px;overflow-y:auto;padding:12px 0;}
    .mt-badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;}
    .mt-badge-success{background:rgba(16,185,129,.15);color:var(--mt-success);}
    .mt-badge-danger{background:rgba(239,68,68,.15);color:var(--mt-danger);}
    .mt-badge-warn{background:rgba(245,158,11,.15);color:var(--mt-warn);}
    .mt-score-ring{display:flex;flex-direction:column;align-items:center;gap:4px;}
    .mt-score-ring canvas{border-radius:50%;}
    .mt-stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px;}
    .mt-stat-card{background:var(--mt-surface);border:1px solid var(--mt-border);border-radius:12px;padding:14px;}
    .mt-stat-card .val{font-size:22px;font-weight:700;color:var(--mt-text);}
    .mt-stat-card .lbl{font-size:11px;color:var(--mt-muted);margin-top:2px;}
    .mt-progress{height:6px;background:var(--mt-border);border-radius:4px;overflow:hidden;margin-top:8px;}
    .mt-progress-bar{height:100%;border-radius:4px;background:var(--mt-accent);transition:width .6s;}
    #mt-sos-countdown{font-size:48px;font-weight:900;color:var(--mt-danger);text-align:center;animation:mt-pulse 1s infinite;}
    .mt-lang-btn{padding:6px 14px;border-radius:8px;border:1px solid var(--mt-border);background:var(--mt-surface);color:var(--mt-text);cursor:pointer;font-size:13px;}
    .mt-lang-btn.active{border-color:var(--mt-accent);color:var(--mt-accent);}
    .mt-achievement{display:flex;align-items:center;gap:12px;padding:12px;background:var(--mt-surface);border-radius:12px;border:1px solid var(--mt-border);margin-top:10px;}
    .mt-achievement .badge-icon{font-size:28px;}
    .mt-achievement .badge-info{flex:1;}
    .mt-achievement .badge-info .title{font-size:14px;font-weight:700;color:var(--mt-text);}
    .mt-achievement .badge-info .desc{font-size:12px;color:var(--mt-muted);}
    @media(max-width:420px){#mt-grid{grid-template-columns:repeat(2,1fr);}#mt-panel{max-height:95vh;}}
  `;
  document.head.appendChild(style);

  // Apply saved theme
  if (MT.theme === 'light') document.body.classList.add('mt-light-mode');

  // ── FAB ────────────────────────────────────────────────────────────
  const fab = document.createElement('button');
  fab.id = 'mt-fab';
  fab.innerHTML = `⚕️<span class="mt-pulse"></span>`;
  fab.setAttribute('aria-label', 'Open MediTrack Hub');
  document.body.appendChild(fab);

  // ── Overlay / Panel ────────────────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.id = 'mt-overlay';
  overlay.innerHTML = `
    <div id="mt-panel">
      <div id="mt-panel-header">
        <div style="display:flex;align-items:center;gap:8px;">
          <h2>${MT.t('hub')}</h2>
          <span>v2.0</span>
        </div>
        <button id="mt-close-btn" aria-label="${MT.t('close')}">✕</button>
      </div>
      <div id="mt-grid">
        <div class="mt-tile" data-feature="ai">
          <div class="mt-icon">🤖</div>
          <div class="mt-label">${MT.t('ai')}</div>
          <div class="mt-desc">Gemini-powered</div>
        </div>
        <div class="mt-tile" data-feature="ocr">
          <div class="mt-icon">📷</div>
          <div class="mt-label">${MT.t('ocr')}</div>
          <div class="mt-desc">Scan prescription</div>
        </div>
        <div class="mt-tile" data-feature="analytics">
          <div class="mt-icon">📊</div>
          <div class="mt-label">${MT.t('analytics')}</div>
          <div class="mt-desc">Health trends</div>
        </div>
        <div class="mt-tile" data-feature="interactions">
          <div class="mt-icon">⚠️</div>
          <div class="mt-label">Drug Check</div>
          <div class="mt-desc">Interaction alert</div>
        </div>
        <div class="mt-tile" data-feature="voice">
          <div class="mt-icon">🎙️</div>
          <div class="mt-label">${MT.t('voice')}</div>
          <div class="mt-desc">Voice commands</div>
        </div>
        <div class="mt-tile" data-feature="settings">
          <div class="mt-icon">⚙️</div>
          <div class="mt-label">${MT.t('settings')}</div>
          <div class="mt-desc">Theme & language</div>
        </div>
        <div class="mt-tile sos" data-feature="sos">
          <div class="mt-icon">🆘</div>
          <div class="mt-label">${MT.t('sos')}</div>
          <div class="mt-desc">Emergency alert</div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // ── Modal ─────────────────────────────────────────────────────────
  const modal = document.createElement('div');
  modal.id = 'mt-modal';
  modal.innerHTML = `<div id="mt-modal-inner"><div class="mt-modal-header"><h3 id="mt-modal-title">Feature</h3><button id="mt-modal-close" class="mt-btn mt-btn-secondary" style="padding:6px 14px;">✕ Close</button></div><div id="mt-modal-body"></div></div>`;
  document.body.appendChild(modal);

  // ── Event listeners ────────────────────────────────────────────────
  fab.addEventListener('click', () => overlay.classList.add('open'));
  document.getElementById('mt-close-btn').addEventListener('click', () => overlay.classList.remove('open'));
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });
  document.getElementById('mt-modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  document.querySelectorAll('.mt-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      overlay.classList.remove('open');
      openFeature(tile.dataset.feature);
    });
  });

  function openModal(title, html) {
    document.getElementById('mt-modal-title').textContent = title;
    document.getElementById('mt-modal-body').innerHTML = html;
    modal.classList.add('open');
  }
  function closeModal() {
    modal.classList.remove('open');
    document.getElementById('mt-modal-body').innerHTML = '';
    if (MT._voiceRecog) { MT._voiceRecog.stop(); MT._voiceRecog = null; }
  }

  // ── FEATURES ───────────────────────────────────────────────────────
  function openFeature(name) {
    const features = { ai, ocr, analytics, interactions, voice, settings, sos };
    if (features[name]) features[name]();
  }

  // 1. AI Medicine Assistant ──────────────────────────────────────────
  function ai() {
    openModal('🤖 AI Medicine Assistant', `
      <p style="color:var(--mt-muted);font-size:13px;margin-bottom:12px;">Ask about medicines, side effects, dosage, interactions & more.</p>
      <div class="mt-chat-area" id="mt-chat"></div>
      <div style="display:flex;gap:8px;margin-top:12px;">
        <input id="mt-ai-input" class="mt-input" style="flex:1;margin:0;" placeholder="e.g. Side effects of Metformin…" />
        <button class="mt-btn mt-btn-primary" id="mt-ai-send">Send</button>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;">
        ${['What is Aspirin?','Paracetamol overdose?','Metformin side effects','Food to avoid with Warfarin'].map(q=>`<button class="mt-btn mt-btn-secondary" style="font-size:11px;padding:5px 10px;" onclick="document.getElementById('mt-ai-input').value='${q}';document.getElementById('mt-ai-send').click();">${q}</button>`).join('')}
      </div>
    `);
    addChat('ai', '👋 Hello! I\'m your AI Medicine Assistant. Ask me anything about medicines, dosage, side effects, or health recommendations.');
    document.getElementById('mt-ai-send').addEventListener('click', sendAI);
    document.getElementById('mt-ai-input').addEventListener('keydown', e => { if (e.key === 'Enter') sendAI(); });

    async function sendAI() {
      const inp = document.getElementById('mt-ai-input');
      const q = inp.value.trim();
      if (!q) return;
      inp.value = '';
      addChat('user', q);
      addChat('ai', '⏳ Thinking…', 'typing');

      const GEMINI_KEY = localStorage.getItem('mt_gemini_key') || '';
      if (!GEMINI_KEY) {
        replaceTyping('⚠️ Please add your Gemini API key in Settings → AI Key.');
        return;
      }
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: `You are a professional medicine assistant. Answer concisely and safely. Always recommend consulting a doctor. Question: ${q}` }] }] })
        });
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
        replaceTyping(text);
      } catch (e) {
        replaceTyping('❌ Error reaching AI. Check your API key and internet connection.');
      }
    }
    function addChat(role, text, id) {
      const chat = document.getElementById('mt-chat');
      if (!chat) return;
      const d = document.createElement('div');
      d.className = `mt-chat-bubble ${role}`;
      if (id) d.id = `mt-${id}`;
      d.textContent = text;
      chat.appendChild(d);
      chat.scrollTop = chat.scrollHeight;
    }
    function replaceTyping(text) {
      const t = document.getElementById('mt-typing');
      if (t) t.textContent = text;
    }
  }

  // 2. OCR Prescription Scanner ──────────────────────────────────────
  function ocr() {
    openModal('📷 OCR Prescription Scanner', `
      <p style="color:var(--mt-muted);font-size:13px;">Upload a prescription image to extract medicine names automatically.</p>
      <input type="file" id="mt-ocr-file" accept="image/*" class="mt-input" style="padding:8px;" />
      <button class="mt-btn mt-btn-primary" style="margin-top:12px;" id="mt-ocr-btn">🔍 Scan Prescription</button>
      <div id="mt-ocr-result" style="margin-top:16px;"></div>
    `);
    document.getElementById('mt-ocr-btn').addEventListener('click', async () => {
      const file = document.getElementById('mt-ocr-file').files[0];
      const res = document.getElementById('mt-ocr-result');
      if (!file) { res.innerHTML = '<p style="color:var(--mt-warn);">Please select an image first.</p>'; return; }
      res.innerHTML = '<p style="color:var(--mt-muted);">⏳ Loading OCR engine… (first load may take 15s)</p>';

      if (!window.Tesseract) {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
        document.head.appendChild(s);
        await new Promise(r => s.onload = r);
      }
      try {
        const { data: { text } } = await Tesseract.recognize(file, 'eng', { logger: m => { if (m.status === 'recognizing text') res.innerHTML = `<p style="color:var(--mt-muted);">📖 Reading... ${Math.round(m.progress * 100)}%</p>`; } });
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 2);
        const medKeywords = /mg|ml|tablet|capsule|syrup|injection|cream|gel|drop|dose|daily|twice|thrice|tab|cap/i;
        const meds = lines.filter(l => medKeywords.test(l));
        res.innerHTML = `
          <div style="background:var(--mt-surface);border-radius:12px;border:1px solid var(--mt-border);padding:16px;">
            <p style="font-size:13px;font-weight:700;color:var(--mt-text);margin:0 0 10px;">📋 Extracted Text</p>
            <div style="font-size:12px;color:var(--mt-muted);max-height:120px;overflow-y:auto;font-family:monospace;">${lines.join('<br>')}</div>
            ${meds.length ? `<p style="font-size:13px;font-weight:700;color:var(--mt-success);margin:14px 0 8px;">💊 Detected Medicines</p>
            ${meds.map(m=>`<div style="background:rgba(16,185,129,.1);border-radius:8px;padding:8px 12px;margin:4px 0;font-size:13px;color:var(--mt-text);display:flex;justify-content:space-between;align-items:center;">${m}<span class="mt-badge mt-badge-success">✓ Detected</span></div>`).join('')}` : '<p style="color:var(--mt-warn);font-size:13px;margin-top:12px;">⚠️ No clear medicine entries detected. Try a clearer image.</p>'}
          </div>
        `;
      } catch (e) {
        res.innerHTML = '<p style="color:var(--mt-danger);">❌ OCR failed. Try a clearer, well-lit image.</p>';
      }
    });
  }

  // 3. Analytics Dashboard ──────────────────────────────────────────
  function analytics() {
    openModal('📊 Real Health Analytics', `
      <div id="mt-analytics-content">
        <p style="text-align:center;color:var(--mt-muted);">Loading patient data...</p>
      </div>
    `);

    fetch("https://script.google.com/macros/s/AKfycbz4MGPFA_qdPuFMyn04_524T_rXId6KebEKIvfWFUXc-wyU-r4jObBQS960T7HcrxY9/exec")
      .then(res => res.json())
      .then(records => {
        if (!records || !records.length) {
          document.getElementById('mt-analytics-content').innerHTML = "<p>No patient records found.</p>";
          return;
        }

        const totalPatients = records.length;
        let totalSugar = 0, totalHR = 0, totalWeight = 0, totalSpo2 = 0;
        let male = 0, female = 0;
        const hrTrend = [];

        records.forEach(r => {
          totalSugar += Number(r.blood_sugar || 0);
          totalHR += Number(r.heart_rate || 0);
          totalWeight += Number(r.weight || 0);
          totalSpo2 += Number(r.spo2 || 0);
          hrTrend.push(Number(r.heart_rate || 0));
          if ((r.gender || '').toLowerCase() === 'male') male++;
          if ((r.gender || '').toLowerCase() === 'female') female++;
        });

        const avgSugar = (totalSugar / totalPatients).toFixed(1);
        const avgHR = (totalHR / totalPatients).toFixed(1);
        const avgWeight = (totalWeight / totalPatients).toFixed(1);
        const avgSpo2 = (totalSpo2 / totalPatients).toFixed(1);
        const latest = records[records.length - 1];

        document.getElementById('mt-analytics-content').innerHTML = `
          <div class="mt-stat-grid">
            <div class="mt-stat-card"><div class="val">${totalPatients}</div><div class="lbl">Patients</div></div>
            <div class="mt-stat-card"><div class="val">${avgSugar}</div><div class="lbl">Avg Blood Sugar</div></div>
            <div class="mt-stat-card"><div class="val">${avgHR}</div><div class="lbl">Avg Heart Rate</div></div>
            <div class="mt-stat-card"><div class="val">${avgSpo2}%</div><div class="lbl">Avg SpO₂</div></div>
            <div class="mt-stat-card"><div class="val">${avgWeight} kg</div><div class="lbl">Avg Weight</div></div>
            <div class="mt-stat-card"><div class="val">${male}/${female}</div><div class="lbl">Male / Female</div></div>
          </div>
          <div style="margin-top:20px;padding:15px;background:var(--mt-surface);border-radius:12px;border:1px solid var(--mt-border);">
            <h4 style="color:var(--mt-text);margin-bottom:10px;">Latest Patient Record</h4>
            <p style="color:var(--mt-text);font-size:13px;margin:4px 0;"><strong>Name:</strong> ${latest.name || '-'}</p>
            <p style="color:var(--mt-text);font-size:13px;margin:4px 0;"><strong>Medicine:</strong> ${latest.medicine_name || '-'}</p>
            <p style="color:var(--mt-text);font-size:13px;margin:4px 0;"><strong>Blood Pressure:</strong> ${latest.blood_pressure || '-'}</p>
            <p style="color:var(--mt-text);font-size:13px;margin:4px 0;"><strong>Heart Rate:</strong> ${latest.heart_rate || '-'}</p>
            <p style="color:var(--mt-text);font-size:13px;margin:4px 0;"><strong>Blood Sugar:</strong> ${latest.blood_sugar || '-'}</p>
          </div>
          <div style="margin-top:20px;">
            <h4 style="color:var(--mt-text);margin-bottom:10px;">Heart Rate Trend</h4>
            <canvas id="mt-chart-hr"></canvas>
          </div>
        `;

        loadScript('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js', () => {
          new Chart(document.getElementById('mt-chart-hr'), {
            type: 'line',
            data: {
              labels: records.map((_, i) => 'Record ' + (i + 1)),
              datasets: [{
                label: 'Heart Rate',
                data: hrTrend,
                borderColor: '#06b6d4',
                backgroundColor: 'rgba(6,182,212,.1)',
                tension: 0.4,
                fill: true
              }]
            },
            options: { responsive: true, maintainAspectRatio: true }
          });
        });
      })
      .catch(err => {
        document.getElementById('mt-analytics-content').innerHTML =
          `<p style="color:red;">Failed to load analytics.<br>${err.message}</p>`;
      });
  }

  // 4. Drug Interaction Checker ──────────────────────────────────────
  function interactions() {
    const knownInteractions = [
      { drugs: ['warfarin', 'aspirin'], risk: 'HIGH', effect: 'Increased bleeding risk — can cause serious haemorrhage.' },
      { drugs: ['metformin', 'alcohol'], risk: 'HIGH', effect: 'Risk of lactic acidosis — avoid alcohol with Metformin.' },
      { drugs: ['lisinopril', 'potassium'], risk: 'MODERATE', effect: 'Hyperkalemia risk — monitor potassium levels closely.' },
      { drugs: ['simvastatin', 'erythromycin'], risk: 'HIGH', effect: 'Rhabdomyolysis risk — serious muscle damage possible.' },
      { drugs: ['ssri', 'tramadol'], risk: 'HIGH', effect: 'Serotonin syndrome risk — potentially life-threatening.' },
      { drugs: ['ibuprofen', 'naproxen'], risk: 'MODERATE', effect: 'Taking two NSAIDs together increases GI bleed risk.' },
      { drugs: ['digoxin', 'amiodarone'], risk: 'HIGH', effect: 'Digoxin toxicity — can cause fatal cardiac arrhythmia.' },
    ];
    openModal('⚠️ Drug Interaction Checker', `
      <p style="color:var(--mt-muted);font-size:13px;">Enter two or more medicines (comma-separated) to check for dangerous interactions.</p>
      <input id="mt-drug-input" class="mt-input" placeholder="e.g. Warfarin, Aspirin, Metformin" />
      <button class="mt-btn mt-btn-primary" style="margin-top:12px;" id="mt-drug-check">🔍 Check Interactions</button>
      <div id="mt-drug-result" style="margin-top:16px;"></div>
    `);
    document.getElementById('mt-drug-check').addEventListener('click', () => {
      const input = document.getElementById('mt-drug-input').value.toLowerCase();
      const drugs = input.split(',').map(d => d.trim().toLowerCase()).filter(Boolean);
      const res = document.getElementById('mt-drug-result');
      if (drugs.length < 2) { res.innerHTML = '<p style="color:var(--mt-warn);">Please enter at least 2 medicines.</p>'; return; }
      const found = knownInteractions.filter(i => i.drugs.some(d => drugs.some(u => u.includes(d) || d.includes(u))) && i.drugs.filter(d => drugs.some(u => u.includes(d) || d.includes(u))).length >= 2);
      if (!found.length) {
        res.innerHTML = `<div style="background:rgba(16,185,129,.1);border-radius:12px;padding:16px;border:1px solid rgba(16,185,129,.3);"><p style="color:var(--mt-success);font-weight:700;margin:0;">✅ No known dangerous interactions detected.</p><p style="color:var(--mt-muted);font-size:12px;margin:8px 0 0;">Always consult your doctor or pharmacist for complete interaction checking.</p></div>`;
        return;
      }
      res.innerHTML = found.map(i => {
        const color = i.risk === 'HIGH' ? 'var(--mt-danger)' : 'var(--mt-warn)';
        const bg = i.risk === 'HIGH' ? 'rgba(239,68,68,.1)' : 'rgba(245,158,11,.1)';
        return `<div style="background:${bg};border-radius:12px;padding:16px;border:1px solid ${color};margin-bottom:10px;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;"><strong style="color:${color};">${i.risk} RISK</strong><span style="font-size:12px;color:var(--mt-muted);">${i.drugs.join(' + ')}</span></div><p style="font-size:14px;color:var(--mt-text);margin:0;">${i.effect}</p></div>`;
      }).join('') + `<p style="font-size:12px;color:var(--mt-muted);margin-top:8px;">⚕️ This is not exhaustive. Always verify with your pharmacist.</p>`;
    });
  }

  // 5. Voice Assistant ──────────────────────────────────────────────
  // BUG FIX: the original voice() function had JS code written inside the HTML
  // template string — the backtick closing the template was missing, causing a
  // syntax error that crashed the entire script and prevented the hub from loading.
  function voice() {
    openModal('🎙️ Voice Assistant', `
      <p style="color:var(--mt-muted);font-size:13px;margin-bottom:16px;">Use voice commands to navigate MediTrack hands-free.</p>
      <div style="text-align:center;margin:20px 0;">
        <button id="mt-voice-btn" class="mt-btn mt-btn-primary" style="width:80px;height:80px;border-radius:50%;font-size:32px;justify-content:center;">🎙️</button>
        <p id="mt-voice-status" style="color:var(--mt-muted);font-size:13px;margin-top:12px;">Tap to start listening</p>
      </div>
      <div style="background:var(--mt-surface);border-radius:12px;border:1px solid var(--mt-border);padding:14px;margin-bottom:14px;">
        <p id="mt-voice-text" style="color:var(--mt-text);font-size:16px;min-height:28px;text-align:center;margin:0;font-style:italic;">…</p>
      </div>
      <p style="font-size:13px;font-weight:700;color:var(--mt-text);margin-bottom:8px;">💬 Available Commands</p>
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--mt-border);font-size:13px;"><span style="color:var(--mt-accent);font-family:monospace;">"open ai assistant"</span><span style="color:var(--mt-muted);">Opens AI chat</span></div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--mt-border);font-size:13px;"><span style="color:var(--mt-accent);font-family:monospace;">"show analytics"</span><span style="color:var(--mt-muted);">Opens health analytics</span></div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--mt-border);font-size:13px;"><span style="color:var(--mt-accent);font-family:monospace;">"check interactions"</span><span style="color:var(--mt-muted);">Drug interaction checker</span></div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--mt-border);font-size:13px;"><span style="color:var(--mt-accent);font-family:monospace;">"emergency sos"</span><span style="color:var(--mt-muted);">Activates SOS</span></div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:13px;"><span style="color:var(--mt-accent);font-family:monospace;">"toggle theme"</span><span style="color:var(--mt-muted);">Switch dark/light mode</span></div>
    `);

    // JS runs here, OUTSIDE the template string
    const btn = document.getElementById('mt-voice-btn');
    const statusEl = document.getElementById('mt-voice-status');
    const textEl = document.getElementById('mt-voice-text');
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) { statusEl.textContent = '❌ Voice not supported in this browser. Try Chrome.'; btn.disabled = true; return; }
    let recog = new SpeechRec();
    MT._voiceRecog = recog;
    recog.continuous = false; recog.lang = 'en-US'; recog.interimResults = true;
    let listening = false;
    btn.addEventListener('click', () => {
      if (listening) { recog.stop(); listening = false; btn.textContent = '🎙️'; statusEl.textContent = 'Tap to start listening'; return; }
      recog.start(); listening = true; btn.textContent = '⏹️'; statusEl.textContent = '🔴 Listening…';
    });
    recog.onresult = e => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join('').toLowerCase();
      textEl.textContent = transcript;
      if (e.results[e.results.length - 1].isFinal) {
        const cmds = {
          'open ai assistant': () => { closeModal(); ai(); },
          'show analytics': () => { closeModal(); analytics(); },
          'check interactions': () => { closeModal(); interactions(); },
          'emergency sos': () => { closeModal(); sos(); },
          'toggle theme': toggleTheme
        };
        const match = Object.keys(cmds).find(k => transcript.includes(k));
        if (match) { cmds[match](); statusEl.textContent = `✅ Command recognized: "${match}"`; }
        else { statusEl.textContent = '❓ Command not recognized. Try again.'; }
        listening = false; btn.textContent = '🎙️';
      }
    };
    recog.onerror = () => { statusEl.textContent = '❌ Error. Please try again.'; listening = false; btn.textContent = '🎙️'; };
  }

  // 6. Settings ────────────────────────────────────────────────────
  function settings() {
    openModal('⚙️ Settings', `
      <div style="display:flex;flex-direction:column;gap:18px;">
        <div><p style="font-size:14px;font-weight:700;color:var(--mt-text);margin:0 0 10px;">🌐 Language</p><div style="display:flex;gap:8px;"><button class="mt-lang-btn ${MT.lang==='en'?'active':''}" data-l="en">🇬🇧 English</button><button class="mt-lang-btn ${MT.lang==='ta'?'active':''}" data-l="ta">🇮🇳 தமிழ்</button><button class="mt-lang-btn ${MT.lang==='hi'?'active':''}" data-l="hi">🇮🇳 हिंदी</button></div></div>
        <div><p style="font-size:14px;font-weight:700;color:var(--mt-text);margin:0 0 10px;">🎨 Theme</p><div style="display:flex;gap:8px;"><button class="mt-btn ${MT.theme==='dark'?'mt-btn-primary':'mt-btn-secondary'}" id="mt-dark-btn">🌙 Dark</button><button class="mt-btn ${MT.theme==='light'?'mt-btn-primary':'mt-btn-secondary'}" id="mt-light-btn">☀️ Light</button></div></div>
        <div><p style="font-size:14px;font-weight:700;color:var(--mt-text);margin:0 0 8px;">🔑 Gemini API Key</p><p style="font-size:12px;color:var(--mt-muted);margin:0 0 8px;">Required for AI Assistant. Get free key at <a href="https://aistudio.google.com/apikey" style="color:var(--mt-accent);" target="_blank">aistudio.google.com</a></p><input id="mt-gemini-key" class="mt-input" type="password" placeholder="AIza…" value="${localStorage.getItem('mt_gemini_key')||''}" /><button class="mt-btn mt-btn-primary" style="margin-top:8px;" id="mt-save-key">💾 Save Key</button></div>
        <div><p style="font-size:14px;font-weight:700;color:var(--mt-text);margin:0 0 8px;">🚨 Emergency Contact</p><input id="mt-emer-name" class="mt-input" placeholder="Contact name" value="${JSON.parse(localStorage.getItem('mt_emergency')||'{}').name||''}" /><input id="mt-emer-phone" class="mt-input" style="margin-top:8px;" placeholder="Phone number" value="${JSON.parse(localStorage.getItem('mt_emergency')||'{}').phone||''}" /><button class="mt-btn mt-btn-primary" style="margin-top:8px;" id="mt-save-emer">💾 Save Contact</button></div>
        <div><p style="font-size:14px;font-weight:700;color:var(--mt-text);margin:0 0 8px;">🗑️ Clear All Data</p><button class="mt-btn mt-btn-danger" id="mt-clear-btn">⚠️ Clear All MediTrack Data</button></div>
      </div>
    `);
    document.querySelectorAll('.mt-lang-btn').forEach(b => b.addEventListener('click', () => { MT.lang = b.dataset.l; localStorage.setItem('mt_lang', MT.lang); alert('Language updated! Refresh to apply.'); }));
    document.getElementById('mt-dark-btn').addEventListener('click', () => { MT.theme = 'dark'; localStorage.setItem('mt_theme', 'dark'); document.body.classList.remove('mt-light-mode'); });
    document.getElementById('mt-light-btn').addEventListener('click', () => { MT.theme = 'light'; localStorage.setItem('mt_theme', 'light'); document.body.classList.add('mt-light-mode'); });
    document.getElementById('mt-save-key').addEventListener('click', () => { localStorage.setItem('mt_gemini_key', document.getElementById('mt-gemini-key').value.trim()); alert('✅ API key saved!'); });
    document.getElementById('mt-save-emer').addEventListener('click', () => { localStorage.setItem('mt_emergency', JSON.stringify({ name: document.getElementById('mt-emer-name').value, phone: document.getElementById('mt-emer-phone').value })); alert('✅ Emergency contact saved!'); });
    // BUG FIX: was [[...]] (array inside array) — keys were never iterated, nothing got removed
    document.getElementById('mt-clear-btn').addEventListener('click', () => {
      if (confirm('⚠️ This will delete ALL MediTrack data. Continue?')) {
        ['mt_metrics', 'mt_user', 'mt_gemini_key', 'mt_emergency', 'mt_reminders', 'mt_session'].forEach(k => localStorage.removeItem(k));
        closeModal();
        alert('✅ All data cleared.');
        window.location.href = './auth.html';
      }
    });
  }

  // 7. SOS Emergency ───────────────────────────────────────────────
  function sos() {
    const em = JSON.parse(localStorage.getItem('mt_emergency') || '{}');
    // BUG FIX: read reminders to get current medicines instead of hardcoding 'Not Available'
    const reminders = JSON.parse(localStorage.getItem('mt_reminders') || '[]');
    const meds = reminders.length ? reminders.map(r => r.medicine).join(', ') : 'Not on record';
    const metrics = JSON.parse(localStorage.getItem('mt_metrics') || '{}');
    let countdown = 5;
    openModal('🆘 Emergency SOS', `
      <div style="text-align:center;padding:20px 0;">
        <div id="mt-sos-countdown" style="font-size:64px;font-weight:900;color:var(--mt-danger);animation:mt-pulse 1s infinite;">5</div>
        <p style="color:var(--mt-muted);font-size:14px;">Alert sending in 5 seconds…</p>
        <button class="mt-btn mt-btn-secondary" style="margin-top:10px;" id="mt-sos-cancel">✕ Cancel</button>
      </div>
      <div style="background:rgba(239,68,68,.1);border-radius:12px;border:1px solid var(--mt-danger);padding:16px;margin-top:10px;">
        <p style="font-size:13px;font-weight:700;color:var(--mt-danger);margin:0 0 8px;">🆘 Alert Details</p>
        <p style="font-size:12px;color:var(--mt-text);margin:4px 0;">👤 Contact: ${em.name || '(Set in Settings)'}</p>
        <p style="font-size:12px;color:var(--mt-text);margin:4px 0;">📞 Phone: ${em.phone || '(Set in Settings)'}</p>
        <p style="font-size:12px;color:var(--mt-text);margin:4px 0;">💊 Medications: ${meds}</p>
        ${metrics.bp ? `<p style="font-size:12px;color:var(--mt-text);margin:4px 0;">🩸 BP: ${metrics.bp}</p>` : ''}
      </div>
      <div style="margin-top:14px;display:flex;gap:8px;">
        <button class="mt-btn mt-btn-danger" style="flex:1;" onclick="navigator.geolocation&&navigator.geolocation.getCurrentPosition(p=>alert('📍 Location: '+p.coords.latitude.toFixed(4)+', '+p.coords.longitude.toFixed(4)))">📍 Share Location</button>
        <button class="mt-btn" style="flex:1;background:var(--mt-warn);color:#fff;" onclick="window.open('tel:${em.phone||'108'}')">📞 Call ${em.phone||'108'}</button>
      </div>
    `);
    const counter = document.getElementById('mt-sos-countdown');
    const timer = setInterval(() => {
      countdown--;
      if (counter) counter.textContent = countdown;
      if (countdown <= 0) {
        clearInterval(timer);
        if (counter) counter.textContent = '🆘';
        const smsText = encodeURIComponent(`🆘 MEDICAL EMERGENCY from MediTrack\nMedications: ${meds}\n${metrics.bp ? 'BP: ' + metrics.bp : ''}`);
        if (em.phone) window.open(`sms:${em.phone}?body=${smsText}`);
        else alert('⚠️ No emergency contact set! Please go to Settings to add one.');
      }
    }, 1000);
    document.getElementById('mt-sos-cancel').addEventListener('click', () => { clearInterval(timer); closeModal(); });
  }

  // ── Helper: load external script ──────────────────────────────────
  function loadScript(src, cb) {
    if (document.querySelector(`script[src="${src}"]`)) { if (window.Chart) cb(); else setTimeout(() => loadScript(src, cb), 100); return; }
    const s = document.createElement('script');
    s.src = src; s.onload = cb;
    document.head.appendChild(s);
  }
  function toggleTheme() { MT.theme = MT.theme === 'dark' ? 'light' : 'dark'; localStorage.setItem('mt_theme', MT.theme); document.body.classList.toggle('mt-light-mode'); }

  // ── PWA Service Worker Registration ───────────────────────────────
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  console.log(`%c⚕️ MediTrack Hub v${MT.version} loaded`, 'color:#06b6d4;font-weight:bold;font-size:14px;');
})();
