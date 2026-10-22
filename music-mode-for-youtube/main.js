// Runs in the page context to reach the player API (data saver).
window.addEventListener('message', (e) => {
  if (e.source !== window || !e.data || e.data.ytmm !== 'quality' || !e.data.low) return;
  const p = document.getElementById('movie_player');
  try { if (p && p.setPlaybackQualityRange) p.setPlaybackQualityRange('tiny', 'tiny'); } catch (_) {}
});
