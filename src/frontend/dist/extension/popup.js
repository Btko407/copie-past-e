// Copie Past-e Smart Post — Extension Popup
// Shows connection status based on when content-bridge.js last ran on a
// Copie Past-e page (ext_connected + lastSeen stored in chrome.storage.local).

"use strict";

const CONNECTED_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

const statusDot = document.getElementById("status-dot");
const statusText = document.getElementById("status-text");

chrome.storage.local.get(["ext_connected", "lastSeen"], (result) => {
  const { ext_connected, lastSeen } = result;
  const now = Date.now();
  const isRecent = lastSeen && now - lastSeen < CONNECTED_WINDOW_MS;

  if (ext_connected && isRecent) {
    statusDot.className = "status-dot dot-green";
    statusText.textContent = "Connected to Copie Past-e";
    statusText.classList.add("connected");
  } else {
    statusDot.className = "status-dot dot-red";
    statusText.textContent = "Open Copie Past-e to connect";
    statusText.classList.remove("connected");
  }
});
