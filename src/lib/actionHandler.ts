export const handleAction = (intent: string): boolean => {
  const normalized = intent.toLowerCase().trim();

  // Basic open intents
  if (normalized.includes("open netflix")) {
    window.open("https://netflix.com", "_blank");
    return true;
  }
  if (normalized.includes("open disney") || normalized.includes("open disney plus")) {
    window.open("https://disneyplus.com", "_blank");
    return true;
  }
  if (normalized.includes("open google docs") || normalized.includes("open docs")) {
    window.open("https://docs.google.com", "_blank");
    return true;
  }

  // Lockdown mode simulation
  if (normalized.includes("send email") || normalized.includes("delete database")) {
    const pwd = prompt("Lockdown Mode: Please enter APP_PASSWORD to proceed.");
    // In a real app we'd verify this against env or backend. 
    // Here we just do a mock check.
    if (!pwd || pwd.trim() === "") {
        console.warn("Access Denied");
        return true;
    }
    alert("Action Authorized! Executing...");
    return true;
  }

  // Spotify / study mode
  if (normalized.includes("study mode") || normalized.includes("focus mode")) {
    window.open("https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wzrS", "_blank");
    alert("Study Mode Activated. Spotify Lo-Fi started (if logged in). Notifications paused.");
    return true;
  }

  // If no action matched, return false
  return false;
};
