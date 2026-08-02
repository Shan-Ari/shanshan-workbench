/* ============ 原始 emoji 图标 ============
   回归项目最早的 emoji 图标样式：天然多彩、跨平台一致、零外部依赖。
   配合 style.css 中各 .ic 容器的圆形浅色底，呈现「emoji + 色块」的经典观感。
*/
const ICON_EMOJI = {
  home: '🏠', plan: '📝', english: '🔤', pet: '🐱', clip: '🎬', book: '📚',
  poem: '🏮', note: '✏️', sport: '💪', finance: '💰', ledger: '🧾', repay: '💳',
  habit: '🌿', calendar: '📅', countdown: '⏳', weekly: '🗓️', monthly: '🌙',
  coffee: '☕', read: '📖', bear: '🧸', plant: '🪴', headphone: '🎧', leaf: '🍃',
  inspire: '💡', express: '💬', foreign: '🌐'
};
function icon(id) {
  return `<span class="emoji-ic">${ICON_EMOJI[id] || '•'}</span>`;
}
if (typeof module !== 'undefined' && module.exports) module.exports = { icon };
