/*
  Discord installation link
  -------------------------
  Paste the bot's Discord installation URL below.
*/
const DISCORD_INVITE_URL = "PASTE_YOUR_DISCORD_INSTALL_URL_HERE";

document.querySelectorAll("[data-discord-invite]").forEach(link => {
  link.addEventListener("click", event => {
    if (DISCORD_INVITE_URL.startsWith("PASTE_")) {
      event.preventDefault();
      alert("Add your Discord installation URL in script.js first.");
      return;
    }
  });

  if (!DISCORD_INVITE_URL.startsWith("PASTE_")) {
    link.href = DISCORD_INVITE_URL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
});


/*
  Recent MM2 value changes
  ------------------------
  data/recent-changes.json is refreshed automatically by GitHub Actions.
*/
function formatDelta(value) {
  const number = Number(value);
  const sign = number > 0 ? "+" : "";
  return `${sign}${number.toLocaleString("en-GB")}`;
}

function makeChangeItem(change) {
  const item = document.createElement("span");
  const value = document.createElement("b");

  value.className = Number(change.delta) >= 0 ? "up" : "down";
  value.textContent = formatDelta(change.delta);

  item.append(document.createTextNode(`${change.name} `), value);
  return item;
}

async function loadRecentChanges() {
  const containers = document.querySelectorAll("[data-recent-changes]");
  const sessionLabels = document.querySelectorAll("[data-change-session]");

  if (!containers.length) return;

  try {
    const response = await fetch(
      `data/recent-changes.json?v=${Date.now()}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const changes = Array.isArray(data.changes) ? data.changes : [];

    if (!changes.length) {
      throw new Error("No changes in data file");
    }

    containers.forEach(container => {
      container.replaceChildren();

      changes.slice(0, 8).forEach(change => {
        container.appendChild(makeChangeItem(change));
      });
    });

    sessionLabels.forEach(label => {
      label.textContent = data.session
        ? `MM2Values • ${data.session}`
        : "MM2Values";
    });
  } catch (error) {
    console.warn("Could not load recent MM2 value changes:", error);

    containers.forEach(container => {
      container.textContent = "Recent value changes are temporarily unavailable.";
    });
  }
}

loadRecentChanges();
