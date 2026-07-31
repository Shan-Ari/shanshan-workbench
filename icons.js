/* ============ 手绘插画风 PNG 图标 ============
   图标由 AI 生成，统一莫兰迪色系、圆润可爱风格。
   文件位置：shanshan-workbench/icons/<id>.png
*/
function icon(id) {
  return `<img src="icons/${id}.png" class="ic-img" alt="" onerror="this.style.display='none'">`;
}
if (typeof module !== 'undefined' && module.exports) module.exports = { icon };
