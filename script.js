/*
  Paste the bot's Discord installation URL below.

  Example:
  https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot%20applications.commands&permissions=...
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
