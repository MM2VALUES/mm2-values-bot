const snapshot = {
  date: "31 August 2026",
  items: {
    candy: 85,
    bat: 120,
    watergun: 225
  },
  recentChanges: [
    { name: "Chroma Constellation", delta: 1000 },
    { name: "Evergreen", delta: 100 },
    { name: "Vampires Gun", delta: 100 },
    { name: "Corrupt", delta: -25 },
    { name: "Turkey", delta: -25 },
    { name: "Luger", delta: -2 }
  ]
};

document.querySelectorAll("[data-value]").forEach(el => {
  const key = el.dataset.value;
  if (snapshot.items[key] !== undefined) {
    el.textContent = snapshot.items[key].toLocaleString("en-GB");
  }
});

const give = snapshot.items.candy + snapshot.items.bat;
const get = snapshot.items.watergun;
const diff = get - give;

document.getElementById("giveTotal").textContent = give.toLocaleString("en-GB");
document.getElementById("getTotal").textContent = get.toLocaleString("en-GB");

const verdict = document.getElementById("tradeVerdict");
const difference = document.getElementById("tradeDifference");

if (diff > 0) {
  verdict.textContent = "W";
  difference.textContent = `+${diff.toLocaleString("en-GB")}`;
} else if (diff < 0) {
  verdict.textContent = "L";
  difference.textContent = diff.toLocaleString("en-GB");
} else {
  verdict.textContent = "F";
  difference.textContent = "0";
}

const updateRows = document.getElementById("updateRows");
snapshot.recentChanges.slice(0, 5).forEach(change => {
  const row = document.createElement("div");
  row.className = "update-row";

  const direction = change.delta > 0 ? "up" : "down";
  const sign = change.delta > 0 ? "+" : "";

  row.innerHTML = `
    <strong>${change.name}</strong>
    <span>Value</span>
    <span>${change.delta > 0 ? "increased" : "decreased"}</span>
    <b class="${direction}">${sign}${change.delta.toLocaleString("en-GB")}</b>
  `;
  updateRows.appendChild(row);
});

const tickerTrack = document.getElementById("tickerTrack");
const tickerItems = [...snapshot.recentChanges, ...snapshot.recentChanges];
tickerItems.forEach(change => {
  const item = document.createElement("span");
  item.className = `ticker-item ${change.delta > 0 ? "up" : "down"}`;
  item.innerHTML = `<strong>${change.name}</strong><b>${change.delta > 0 ? "+" : ""}${change.delta.toLocaleString("en-GB")}</b>`;
  tickerTrack.appendChild(item);
});

const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");

menuButton.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});

mobileMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("in-view");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".command-card,.lookup-demo,.updates-card,.setup-panel,.discord-preview").forEach(el => {
  observer.observe(el);
});
