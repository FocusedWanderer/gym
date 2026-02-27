// === SHARE/SYNC ===
function generateSummary() {
  const dateKey = new Date().toISOString().slice(0, 10);
  const today = state.logs[dateKey] || {};
  const icons = { workout: '🏋️ Worked Out', creatine: '💊 Creatine', rehab: '🩹 Rehab', sleep: '😴 Slept Well', water: '💧 Hydration', protein: '🥩 Protein' };
  const items = Object.entries(today).filter(([,v]) => v).map(([k]) => icons[k] || k);
  
  // Count completed sets
  const setKeys = Object.keys(state.sets).filter(k => k.startsWith(dateKey) && state.sets[k]);
  const setCount = setKeys.length;
  
  let msg = `📊 Gym Log ${dateKey}\n`;
  if (items.length > 0) msg += items.join(' | ') + '\n';
  if (setCount > 0) msg += `✅ ${setCount} sets completed\n`;
  if (state.streak > 0) msg += `🔥 ${state.streak} day streak\n`;
  if (items.length === 0 && setCount === 0) msg += 'No activity logged yet today.\n';
  return msg;
}

function shareSummary() {
  const msg = generateSummary();
  if (navigator.share) {
    navigator.share({ text: msg }).catch(() => fallbackCopy(msg));
  } else {
    fallbackCopy(msg);
  }
}

function fallbackCopy(msg) {
  navigator.clipboard.writeText(msg).then(() => {
    const btn = document.getElementById('share-btn');
    btn.textContent = '✅ Copied! Paste in #health';
    setTimeout(() => { btn.textContent = '📤 Share Summary'; }, 2000);
  }).catch(() => {
    prompt('Copy this and paste in #health:', msg);
  });
}
