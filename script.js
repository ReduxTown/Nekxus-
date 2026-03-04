// Username Generator
const themes = {
  cool: ["Shadow", "Nexus", "Phantom", "Rage", "Vortex", "Blaze", "Frost", "Nova", "Zero", "Rizz", "Sigma", "Omega"],
  funny: ["Skibidi", "Ohio", "Rizzler", "Gyatt", "Fanum", "Tax", "Mog", "Brainrot", "Cooked", "Creeper", "Noob", "Pro"],
  og: ["xX", "Xx", "_", "YT", "TV", "OG", "420", "69", "X", "Z", "K", ""],
  anime: ["Kawaii", "Senpai", "Neko", "Chan", "Kun", "Sama", "Dark", "Yami", "Hikari", "Akuma", "Tenshi"]
};

function generateUsernames() {
  const theme = document.getElementById("theme").value;
  const count = parseInt(document.getElementById("count").value) || 10;
  const list = document.getElementById("usernameList");
  list.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const adj = themes[theme][Math.floor(Math.random() * themes[theme].length)];
    const noun = themes[theme][Math.floor(Math.random() * themes[theme].length)];
    const num = Math.random() > 0.6 ? Math.floor(Math.random() * 100) : "";
    const name = adj + noun + num;
    const div = document.createElement("div");
    div.innerHTML = `<span>${name}</span><button onclick="navigator.clipboard.writeText('${name}')">Copy</button>`;
    list.appendChild(div);
  }
}

// Roblox Availability Checker (public endpoint - client-side safe)
async function checkRobloxUsername() {
  const name = document.getElementById("checkName").value.trim();
  const resultEl = document.getElementById("checkResult");
  if (!name || name.length < 3) {
    resultEl.textContent = "Enter a valid username (3+ chars)";
    resultEl.style.color = "orange";
    return;
  }

  resultEl.textContent = "Checking...";
  resultEl.style.color = "white";

  try {
    // Public endpoint (no auth needed)
    const res = await fetch(`https://auth.roblox.com/v2/usernames/users?username=${encodeURIComponent(name)}`, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });
    const data = await res.json();

    if (data.code === 0 && data.data && data.data.length > 0) {
      resultEl.textContent = "❌ Taken";
      resultEl.style.color = "#ff5555";
    } else if (data.code === 10) {  // Usually means available / invalid format handled
      resultEl.textContent = "✅ Available!";
      resultEl.style.color = "#55ff55";
    } else {
      resultEl.textContent = "⚠️ " + (data.message || "Unknown response");
      resultEl.style.color = "orange";
    }
  } catch (err) {
    resultEl.textContent = "Error — Roblox may be rate-limiting. Try again later.";
    resultEl.style.color = "orange";
  }
}

// Password Generator
function generatePassword() {
  const length = parseInt(document.getElementById("passLength").value);
  document.getElementById("lengthValue").textContent = length;

  const useSymbols = document.getElementById("useSymbols").checked;
  const useNumbers = document.getElementById("useNumbers").checked;
  const usePassphrase = document.getElementById("usePassphrase").checked;

  let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (useNumbers) chars += "0123456789";
  if (useSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

  let pass = "";

  if (usePassphrase) {
    // Simple diceware-like (you can expand word list)
    const words = ["apple", "banana", "cat", "dog", "elephant", "fox", "guitar", "house", "ice", "joker", "kite", "lemon"];
    for (let i = 0; i < Math.max(3, Math.floor(length / 6)); i++) {
      pass += words[Math.floor(Math.random() * words.length)] + (Math.random() > 0.5 ? "-" : "");
    }
    pass = pass.slice(0, length);
  } else {
    for (let i = 0; i < length; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }

  document.getElementById("passwordDisplay").textContent = pass;
  window.lastPassword = pass; // for copy
}

function copyPassword() {
  if (window.lastPassword) {
    navigator.clipboard.writeText(window.lastPassword);
    alert("Password copied!");
  }
}

// Display Name Styler (basic mappings)
const styleMaps = {
  bold: str => str.split('').map(c => {
    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCharCode(0x1D400 + code - 65);
    if (code >= 97 && code <= 122) return String.fromCharCode(0x1D41A + code - 97);
    return c;
  }).join(''),
  italic: str => str.split('').map(c => {
    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCharCode(0x1D434 + code - 65);
    if (code >= 97 && code <= 122) return String.fromCharCode(0x1D44E + code - 97);
    return c;
  }).join(''),
  small: str => str.toUpperCase().split('').map(c => {
    const map = "🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉";
    const idx = c.charCodeAt(0) - 65;
    return idx >= 0 && idx < 26 ? map[idx] : c;
  }).join(''),
  circle: str => str.toLowerCase().split('').map(c => {
    const map = "ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ";
    const idx = c.charCodeAt(0) - 97;
    return idx >= 0 && idx < 26 ? map[idx] : c;
  }).join('')
};

function styleDisplayName() {
  const input = document.getElementById("styleInput").value;
  document.getElementById("styledPreview").textContent = input; // default
}

function applyStyle(type) {
  const input = document.getElementById("styleInput").value;
  if (!input) return;
  const styled = styleMaps[type](input);
  document.getElementById("styledPreview").textContent = styled;
  navigator.clipboard.writeText(styled);
}

// Local Planner
function savePlanner() {
  const notes = document.getElementById("plannerNotes").value;
  localStorage.setItem("altPlanner", notes);
  document.getElementById("plannerStatus").textContent = "Saved in browser!";
}

function clearPlanner() {
  localStorage.removeItem("altPlanner");
  document.getElementById("plannerNotes").value = "";
  document.getElementById("plannerStatus").textContent = "Cleared.";
}

// Load saved notes on start
window.onload = () => {
  const saved = localStorage.getItem("altPlanner");
  if (saved) document.getElementById("plannerNotes").value = saved;
};
