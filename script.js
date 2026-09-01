const DISCORD_INVITE_URL = "https://discord.com/oauth2/authorize?client_id=1500929703324811475";

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
