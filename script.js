// ---------------------
// Username Generator
// ---------------------
const themes = {
  cool: ["Shadow", "Nexus", "Phantom", "Rage", "Vortex", "Blaze", "Frost", "Nova", "Zero", "Rizz", "Sigma", "Omega", "Kwfobb", "Elite", "Ghost"],
  funny: ["Skibidi", "Ohio", "Rizzler", "Gyatt", "Fanum", "Tax", "Mog", "Brainrot", "Cooked", "Creeper", "Noob", "Pro", "KwfobbJr"],
  og: ["xX", "Xx", "_", "YT", "TV", "OG", "420", "69", "X", "Z", "K", "Kwfobb", ""],
  anime: ["Kawaii", "Senpai", "Neko", "Chan", "Kun", "Sama", "Dark", "Yami", "Hikari", "Akuma", "Tenshi", "KwfobbKun"]
};

function generateUsernames() {
  const theme = document.getElementById("theme").value;
  const count = parseInt(document.getElementById("count").value) || 12;
  const list = document.getElementById("usernameList");
  list.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const a = themes[theme][Math.floor(Math.random() * themes[theme].length)];
    const b = themes[theme][Math.floor(Math.random() * themes[theme].length)];
    const num = Math.random() > 0.5 ? Math.floor(Math.random() * 999) : "";
    const name = a + b + num;
    const div = document.createElement("div");
    div.innerHTML = `<span>${name}</span><button onclick="navigator.clipboard.writeText('${name}').then(()=>alert('Copied!'))">Copy</button>`;
    list.appendChild(div);
  }
}

// ---------------------
// Roblox Username → ID + Presence Tracker
// ---------------------
async function trackRobloxPlayer() {
  const input = document.getElementById("trackInput").value.trim();
  const result = document.getElementById("trackerResult");
  if (!input) { result.textContent = "Enter username or UserID"; result.style.color = "orange"; return; }

  result.innerHTML = "Loading <span class='loading'>⏳</span>"; result.style.color = "white";

  try {
    let userId;

    // Step 1: If input looks like username, resolve to ID
    if (isNaN(input)) {
      const res = await fetch(`https://www.roblox.com/users/profile?username=${encodeURIComponent(input)}`);
      if (!res.redirected) throw new Error("User not found");
      const url = new URL(res.url);
      userId = url.pathname.split('/')[2];
      if (!userId) throw new Error("Couldn't resolve username");
    } else {
      userId = input;
    }

    // Step 2: Get presence (POST to presence API)
    const presRes = await fetch("https://presence.roblox.com/v1/presence/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userIds: [parseInt(userId)] })
    });

    if (!presRes.ok) throw new Error("Presence API error: " + presRes.status);

    const data = await presRes.json();
    const presence = data.userPresences?.[0];

    if (!presence) {
      result.textContent = "No presence data (possibly restricted)";
      result.style.color = "orange";
      return;
    }

    let status = "Offline";
    let extra = "";
    if (presence.userPresenceType === 1) status = "Online (Website)";
    else if (presence.userPresenceType === 2) {
      status = "In Game";
      extra = presence.lastLocation ? ` - ${presence.lastLocation}` : "";
    }
    else if (presence.userPresenceType === 3) status = "In Studio";
    else if (presence.userPresenceType === 0) status = "Offline";

    result.innerHTML = `
      <strong>UserID:</strong> ${userId}<br>
      <strong>Status:</strong> ${status}${extra}<br>
      <small>(Limited by privacy settings — may show minimal info if not friends)</small>
    `;
    result.style.color = status.includes("Offline") ? "#ff5555" : "#55ff55";
  } catch (err) {
    result.textContent = "Error: " + err.message + " (rate-limit or privacy block?)";
    result.style.color = "#ff5555";
  }
}

// ---------------------
// Password Generator + Strength
// ---------------------
function generatePassword() {
  const len = parseInt(document.getElementById("passLength").value);
  const sym = document.getElementById("useSymbols").checked;
  const num = document.getElementById("useNumbers").checked;
  const phrase = document.getElementById("usePassphrase").checked;

  let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (num) chars += "0123456789";
  if (sym) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

  let pass = "";
  if (phrase) {
    const words = ["apple","banana","cat","dog","elephant","fox","guitar","house","ice","joker","kite","lemon","kwfobb","sigma","rizz"];
    for (let i = 0; i < Math.max(3, Math.floor(len / 7)); i++) {
      pass += words[Math.floor(Math.random() * words.length)] + (Math.random() > 0.4 ? "-" : "");
    }
    pass = pass.slice(0, len);
  } else {
    for (let i = 0; i < len; i++) pass += chars[Math.floor(Math.random() * chars.length)];
  }

  document.getElementById("passwordDisplay").textContent = pass;
  window.lastPass = pass;

  // Fake strength (real zxcvbn would need <script src="https://cdn.jsdelivr.net/npm/zxcvbn@4.4.2/dist/zxcvbn.min.js"></script>)
  const strength = pass.length > 20 ? "Very Strong" : pass.length > 12 ? "Strong" : "Medium";
  document.getElementById("strengthMeter").textContent = `Strength: ${strength}`;
}

function copyPassword() {
  if (window.lastPass) navigator.clipboard.writeText(window.lastPass).then(() => alert("Copied!"));
}

// ---------------------
// Fancy Styler (expanded)
// ---------------------
const styleMaps = {
  bold: s => s.split('').map(c => { const code = c.charCodeAt(0); if (code >= 65 && code <= 90) return String.fromCharCode(0x1D400 + code - 65); if (code >= 97 && code <= 122) return String.fromCharCode(0x1D41A + code - 97); return c; }).join(''),
  italic: s => s.split('').map(c => { const code = c.charCodeAt(0); if (code >= 65 && code <= 90) return String.fromCharCode(0x1D434 + code - 65); if (code >= 97 && code <= 122) return String.fromCharCode(0x1D44E + code - 97); return c; }).join(''),
  small: s => s.toUpperCase().split('').map(c => { const map = "🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉"; const i = c.charCodeAt(0) - 65; return (i >= 0 && i < 26) ? map[i] : c; }).join(''),
  circle: s => s.toLowerCase().split('').map(c => { const map = "ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ"; const i = c.charCodeAt(0) - 97; return (i >= 0 && i < 26) ? map[i] : c; }).join(''),
  zalgo: s => s.split('').map(c => c + "̷̸̶̵̴̨̳̲̱̰̯̮̭̬̫̪̩̇̈̃̂̌̊̍̎̏̐̑̒̓̔̽".charAt(Math.floor(Math.random()*20))).join(''),
  super: s => s.split('').map(c => { const map = "⁰¹²³⁴⁵⁶⁷⁸⁹ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖ۹ʳˢᵗᵘᵛʷˣʸᶻ"; return map[c.charCodeAt(0) - 48] || c; }).join('')
};

function applyStyle(type) {
  const txt = document.getElementById("styleInput").value;
  if (!txt) return;
  const styled = styleMaps[type](txt);
  document.getElementById("styledPreview").textContent = styled;
  navigator.clipboard.writeText(styled);
}

// ---------------------
// Webhook Sender (enhanced with custom embed)
// ---------------------
function saveWebhook() {
  const url = document.getElementById("webhookUrl").value.trim();
  if (!url.startsWith("https://discord.com/api/webhooks/")) {
    document.getElementById("webhookStatus").textContent = "Invalid webhook!"; 
    document.getElementById("webhookStatus").style.color = "#ff5555";
    return;
  }
  localStorage.setItem("userWebhook", url);
  document.getElementById("maskedWebhook").textContent = url.slice(0, 50) + "...";
  document.getElementById("webhookStatus").textContent = "Webhook saved (browser only)!";
  document.getElementById("webhookStatus").style.color = "#55ff55";
}

function clearWebhook() {
  localStorage.removeItem("userWebhook");
  document.getElementById("maskedWebhook").textContent = "None saved";
  document.getElementById("webhookStatus").textContent = "Cleared.";
}

async function sendDiscordMessage() {
  const webhook = localStorage.getItem("userWebhook");
  const status = document.getElementById("sendStatus");
  if (!webhook) { status.textContent = "No webhook saved!"; status.style.color = "orange"; return; }

  const content = document.getElementById("msgContent").value.trim();
  const title = document.getElementById("embedTitle").value.trim();
  const desc = document.getElementById("embedDesc").value.trim();
  const color = parseInt(document.getElementById("embedColor").value.replace("#", "0x"), 16) || 0x7289da;

  const payload = {
    content: content || null,
    embeds: title || desc ? [{
      title: title || null,
      description: desc || null,
      color: color,
      footer: { text: "Sent from Ace's Toolkit • " + new Date().toLocaleString() }
    }] : undefined
  };

  status.textContent = "Sending..."; status.style.color = "white";

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    status.textContent = res.ok ? "✅ Message sent!" : "❌ Failed: " + res.status;
    status.style.color = res.ok ? "#55ff55" : "#ff5555";
  } catch (e) {
    status.textContent = "Error: " + e.message;
    status.style.color = "#ff5555";
  }
}

// ---------------------
// Planner & Init
// ---------------------
function savePlanner() {
  localStorage.setItem("altPlanner", document.getElementById("plannerNotes").value);
  document.getElementById("plannerStatus").textContent = "Saved!";
}
function clearPlanner() {
  localStorage.removeItem("altPlanner");
  document.getElementById("plannerNotes").value = "";
  document.getElementById("plannerStatus").textContent = "Cleared.";
}

window.onload = () => {
  const notes = localStorage.getItem("altPlanner");
  if (notes) document.getElementById("plannerNotes").value = notes;
  const wb = localStorage.getItem("userWebhook");
  if (wb) document.getElementById("maskedWebhook").textContent = wb.slice(0, 50) + "...";
};
