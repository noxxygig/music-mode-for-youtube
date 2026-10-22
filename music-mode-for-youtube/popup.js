const DEF = { enabled: false, saver: true, hideRecs: true };
chrome.storage.sync.get(DEF, (v) => {
  for (const k in DEF) {
    const c = document.getElementById(k);
    c.checked = v[k];
    c.onchange = () => chrome.storage.sync.set({ [k]: c.checked });
  }
});
