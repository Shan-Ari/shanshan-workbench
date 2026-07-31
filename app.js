/* ============ 姗姗工作台 · 核心 ============ */
const $ = s => document.querySelector(s);
const store = {
  g(k, d) { try { const v = JSON.parse(localStorage.getItem('ss_' + k)); return v == null ? d : v; } catch (e) { return d; } },
  s(k, v) { localStorage.setItem('ss_' + k, JSON.stringify(v)); }
};
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const pad = n => String(n).padStart(2, '0');
const fmt = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const today = () => fmt(new Date());
const thisMonth = () => today().slice(0, 7);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const dayIdx = Math.floor(Date.now() / 864e5);

function streakOf(dates) {
  const set = new Set(dates); let n = 0; const d = new Date();
  if (!set.has(fmt(d))) d.setDate(d.getDate() - 1);
  while (set.has(fmt(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function isoWeek(ds) {
  const d = new Date(ds); d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const w1 = new Date(d.getFullYear(), 0, 4);
  return d.getFullYear() + '-W' + pad(1 + Math.round(((d - w1) / 864e5 - 3 + ((w1.getDay() + 6) % 7)) / 7));
}
/* 打卡工具：dates 数组 toggle 今日 */
function ckToday(key) {
  const arr = store.g(key, []);
  if (!arr.includes(today())) { arr.push(today()); store.s(key, arr); }
  render();
}

/* ============ 页面注册 ============ */
const PAGES = [
  { id: 'home', ic: '🏠', nm: '首页' },
  { id: 'plan', ic: '📝', nm: '每日计划' },
  { id: 'english', ic: '🔤', nm: '英语学习' },
  { id: 'pet', ic: '🐱', nm: '宠物记录' },
  { id: 'clip', ic: '🎬', nm: '剪辑创作' },
  { id: 'book', ic: '📚', nm: '读书计划' },
  { id: 'poem', ic: '🏮', nm: '古诗词' },
  { id: 'note', ic: '✏️', nm: '随记笔录' },
  { id: 'sport', ic: '💪', nm: '运动计划' },
  { id: 'finance', ic: '💰', nm: '理财计划' },
  { id: 'ledger', ic: '🧾', nm: '记账' },
  { id: 'repay', ic: '💳', nm: '还款' },
  { id: 'habit', ic: '🌿', nm: '习惯打卡' },
  { id: 'calendar', ic: '📅', nm: '日程日历' },
  { id: 'countdown', ic: '⏳', nm: '倒计时' },
  { id: 'weekly', ic: '🗓️', nm: '周复盘' },
  { id: 'monthly', ic: '🌙', nm: '月复盘' }
];
/* 页面临时状态 */
const S = { engTab: 'speak', planDate: today(), planEdit: null, noteEdit: null, sentEdit: null, poemView: null, ledMonth: thisMonth(), calY: new Date().getFullYear(), calM: new Date().getMonth(), calSel: today(), petTab: 'bath', clipTab: 'notes', cdEdit: null, repayEdit: null, repayPlan: null, acctEdit: null, habitEdit: null, habitHeat: 'all' };

/* ============ 开屏页数据 ============ */
const QUOTES = [
  '慢慢来，比较快。今天也要好好生活呀 🌷',
  '你积攒的每一份努力，都会在未来某天开花 🌸',
  '不必焦虑，日拱一卒，功不唐捐 ✨',
  '生活明朗，万物可爱，你也在慢慢变好 ☁️',
  '把日子过成自己喜欢的样子，就很了不起 🍀',
  '今天的小坚持，是明天的大惊喜 🎁',
  '万事开头难，然后中间难，最后你赢了 💪',
  '温柔半两，从容一生 🌿',
  '心之所向，素履以往 ⛵',
  '认真生活的人，运气都不会太差 🌈',
  '先完成，再完美。行动治愈一切焦虑 📌',
  '愿你眼里有光，心中有爱，手上有活 🕯️'
];

/* ============ 路由 & 顶部固定快捷栏 ============ */
function go(id) { location.hash = '#' + id; }
function curPage() { const h = location.hash.replace('#', ''); return PAGES.some(p => p.id === h) ? h : 'home'; }
/* 顶部常驻快捷栏：4 项常用，吸顶固定、随时跳转 */
const TOP = [
  { id: 'home', ic: '🏠', nm: '首页' },
  { id: 'ledger', ic: '🧾', nm: '记账' },
  { id: 'plan', ic: '✅', nm: '待办' },
  { id: 'habit', ic: '🌿', nm: '打卡' }
];
function buildSidebar() {
  const cur = curPage();
  $('#sidebar').innerHTML = TOP.map(t => `<div class="tb-item ${cur === t.id ? 'active' : ''}" onclick="go('${t.id}')"><span class="ic">${t.ic}</span><span class="nm">${t.nm}</span></div>`).join('');
}
function render() {
  buildSidebar();
  const fn = window['render_' + curPage()];
  if (fn) $('#main').innerHTML = fn();
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', render);

/* ============ 数据备份（导出 / 导入 JSON） ============ */
function backupExport() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    data[k] = localStorage.getItem(k);
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'shanshan-backup-' + new Date().toISOString().slice(0, 10) + '.json';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
  alert('已导出全部数据备份到下载文件夹 ✅');
}
function backupImport(input) {
  const f = input.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = function () {
    try {
      const data = JSON.parse(reader.result);
      for (const k in data) localStorage.setItem(k, data[k]);
      alert('导入成功，页面将刷新以加载数据 ✅');
      location.reload();
    } catch (e) { alert('备份文件格式错误，导入失败'); }
  };
  reader.readAsText(f);
  input.value = '';
}

/* ============ 首页 ============ */
function render_home() {
  const ci = store.g('checkin', []);
  const reads = store.g('read', []);
  const listens = store.g('listen', []);
  const rDates = [...new Set(reads.map(r => r.date))];
  const lDates = [...new Set(listens.map(r => r.date))];
  const rMin = reads.reduce((a, b) => a + (+b.mins || 0), 0);
  const rCnt = reads.reduce((a, b) => a + (+b.count || 0), 0);
  const lMin = listens.reduce((a, b) => a + (+b.mins || 0), 0);
  const recentR = reads.slice(-5).reverse();
  const recentL = listens.slice(-5).reverse();
  const mods = PAGES.filter(p => p.id !== 'home');
  const grid = mods.map((p, i) => {
    const last = i >= mods.length - 2;
    return `<div class="mod-card ${last ? 'last' : ''}" onclick="go('${p.id}')"><span class="ic">${p.ic}</span><span class="nm">${p.nm}</span></div>`;
  }).join('');
  return `
  <div class="page-title">🏠 首页 · 全局导航</div>
  <div class="page-sub">${today()} · 点任意模块即可跳转，随时切换不丢进度</div>

  <div class="card" style="padding:12px">
    <div class="mod-grid">${grid}</div>
  </div>

  <div class="card"><h3>🔥 连续打卡统计</h3>
    <div class="stat-grid">
      <div class="stat"><div class="num">${streakOf(ci)}</div><div class="lb">连续打卡(天)</div></div>
      <div class="stat"><div class="num pk">${ci.length}</div><div class="lb">累计打卡(天)</div></div>
      <div class="stat"><div class="num">${ci.includes(today()) ? '✔' : '—'}</div><div class="lb">今日已登录打卡</div></div>
    </div>
  </div>

  <div class="card"><h3>🌅 晨间阅读统计</h3>
    <div class="stat-grid">
      <div class="stat"><div class="num">${rMin}</div><div class="lb">累计阅读(分钟)</div></div>
      <div class="stat"><div class="num pk">${rCnt}</div><div class="lb">累计阅读(篇)</div></div>
      <div class="stat"><div class="num">${streakOf(rDates)}</div><div class="lb">连续晨读(天)</div></div>
    </div>
    <div class="row mt">
      <input type="number" id="rdMin" placeholder="时长(分)">
      <input type="number" id="rdCnt" placeholder="篇数">
      <button class="btn" onclick="addRead()">晨读打卡 ➕</button>
    </div>
    ${recentR.length ? recentR.map(r => `<div class="list-item"><div class="li-main">${r.date} · 阅读 <b>${r.mins}</b> 分钟 · <b>${r.count}</b> 篇</div></div>`).join('') : '<div class="empty">还没有晨读记录，今天开始吧～</div>'}
  </div>

  <div class="card"><h3>🎧 听力学习统计</h3>
    <div class="stat-grid">
      <div class="stat"><div class="num">${lMin}</div><div class="lb">累计时长(分钟)</div></div>
      <div class="stat"><div class="num pk">${listens.length}</div><div class="lb">学习次数</div></div>
      <div class="stat"><div class="num">${streakOf(lDates)}</div><div class="lb">连续学习(天)</div></div>
    </div>
    <div class="row mt">
      <input type="number" id="lsMin" placeholder="时长(分)">
      <button class="btn pink" onclick="addListen()">听力打卡 ➕</button>
    </div>
    ${recentL.length ? recentL.map(r => `<div class="list-item"><div class="li-main">${r.date} · 练习 <b>${r.mins}</b> 分钟</div></div>`).join('') : '<div class="empty">还没有听力记录～</div>'}
  </div>

  <div class="card" style="padding:12px;text-align:center">
    <div class="li-sub" style="margin-bottom:8px">📦 数据安全（换设备/链接可迁移）</div>
    <div class="row" style="justify-content:center;gap:8px">
      <button class="btn sm ghost" onclick="backupExport()">⬇️ 导出备份</button>
      <button class="btn sm ghost" onclick="document.getElementById('backupFile').click()">⬆️ 导入备份</button>
    </div>
    <input type="file" id="backupFile" accept="application/json" style="display:none" onchange="backupImport(this)">
  </div>`;
}
function addRead() {
  const m = +$('#rdMin').value || 0, c = +$('#rdCnt').value || 0;
  if (!m && !c) return;
  const arr = store.g('read', []); arr.push({ date: today(), mins: m, count: c }); store.s('read', arr); render();
}
function addListen() {
  const m = +$('#lsMin').value || 0; if (!m) return;
  const arr = store.g('listen', []); arr.push({ date: today(), mins: m }); store.s('listen', arr); render();
}

/* ============ 每日计划 ============ */
const PLAN_CATS = ['工作', '学习', '生活', '运动'];
const PRIS = [['高', 'r'], ['中', 'y'], ['低', 'g']];
function render_plan() {
  const all = store.g('plans', []);
  const list = all.filter(p => p.date === S.planDate);
  const overdue = all.filter(p => p.date < today() && !p.done);
  const doneN = list.filter(p => p.done).length;
  const edit = S.planEdit ? all.find(p => p.id === S.planEdit) : null;
  const item = p => {
    const pri = PRIS.find(x => x[0] === p.pri) || PRIS[1];
    return `<div class="todo ${p.done ? 'done' : ''}">
      <div class="ck" onclick="togglePlan('${p.id}')">${p.done ? '✓' : ''}</div>
      <div style="flex:1">
        <div class="li-main">${esc(p.text)}</div>
        <div class="li-sub"><span class="tag b">${p.cat}</span><span class="tag ${pri[1]}">优先级·${p.pri}</span>${p.date !== S.planDate ? '<span class="tag p">' + p.date + '</span>' : ''}</div>
      </div>
      <button class="btn sm ghost" onclick="editPlan('${p.id}')">改</button>
      <button class="btn sm warn" onclick="delPlan('${p.id}')">删</button>
    </div>`;
  };
  return `
  <div class="page-title">📝 每日计划</div>
  <div class="page-sub">当日待办 ${list.length - doneN} 项 · 已完成 ${doneN} 项</div>

  <div class="card">
    <div class="row"><input type="date" value="${S.planDate}" onchange="S.planDate=this.value;S.planEdit=null;render()"><span class="tag b">${S.planDate === today() ? '今天' : S.planDate}</span></div>
    <div class="row mt">
      <input class="grow" id="plText" placeholder="${edit ? '编辑任务内容…' : '新增一条计划…'}" value="${edit ? esc(edit.text) : ''}">
    </div>
    <div class="row mt">
      <select id="plCat">${PLAN_CATS.map(c => `<option ${edit && edit.cat === c ? 'selected' : ''}>${c}</option>`).join('')}</select>
      <select id="plPri">${PRIS.map(p => `<option ${edit && edit.pri === p[0] ? 'selected' : ''}>${p[0]}</option>`).join('')}</select>
      <button class="btn" onclick="savePlan()">${edit ? '保存修改 ✔' : '添加 ➕'}</button>
      ${edit ? '<button class="btn sm ghost" onclick="S.planEdit=null;render()">取消</button>' : ''}
    </div>
  </div>

  <div class="card"><h3>⏳ 待完成</h3>${list.filter(p => !p.done).map(item).join('') || '<div class="empty">当日暂无待办 🎉</div>'}</div>
  <div class="card"><h3>✅ 已完成</h3>${list.filter(p => p.done).map(item).join('') || '<div class="empty">还没有完成的任务</div>'}</div>
  ${overdue.length ? `<div class="card"><h3>🔔 历史未完成提醒</h3>${overdue.map(item).join('')}
    <div class="row mt"><button class="btn sm pink" onclick="moveOverdue()">一键移到今天 →</button></div></div>` : ''}`;
}
function savePlan() {
  const t = $('#plText').value.trim(); if (!t) return;
  const all = store.g('plans', []);
  if (S.planEdit) {
    const p = all.find(x => x.id === S.planEdit);
    if (p) { p.text = t; p.cat = $('#plCat').value; p.pri = $('#plPri').value; }
    S.planEdit = null;
  } else {
    all.push({ id: uid(), date: S.planDate, text: t, cat: $('#plCat').value, pri: $('#plPri').value, done: false });
  }
  store.s('plans', all); render();
}
function togglePlan(id) { const all = store.g('plans', []); const p = all.find(x => x.id === id); if (p) p.done = !p.done; store.s('plans', all); render(); }
function editPlan(id) { S.planEdit = id; render(); }
function delPlan(id) { if (!confirm('删除这条计划？')) return; store.s('plans', store.g('plans', []).filter(x => x.id !== id)); render(); }
function moveOverdue() {
  const all = store.g('plans', []);
  all.forEach(p => { if (p.date < today() && !p.done) p.date = today(); });
  store.s('plans', all); S.planDate = today(); render();
}

/* ============ 倒计时 ============ */
function parseLunarMD(s) { const p = s.split('-'); return { m: +p[0], d: +p[1] }; }
function nextLunarSolar(lm, ld) {
  const y0 = new Date().getFullYear();
  for (const y of [y0, y0 + 1]) {
    const md = SL.monthDays(y, lm); if (md < 1) continue;
    const r = SL.lunar2solar(y, lm, Math.min(ld, md), false);
    if (!r) continue;
    const d = new Date(r.y, r.m - 1, r.d), now = new Date(); now.setHours(0, 0, 0, 0);
    if (d >= now) return d;
  }
  return null;
}
function nextDate(cd) {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  if (cd.cal === 'lunar') { const { m, d } = parseLunarMD(cd.date); return nextLunarSolar(m, d); }
  const [y, m, d] = cd.date.split('-').map(Number);
  if (cd.repeat === 'none') return new Date(y, m - 1, d);
  if (cd.repeat === 'year') {
    let t = new Date(now.getFullYear(), m - 1, d);
    if (t < now) t = new Date(now.getFullYear() + 1, m - 1, d);
    return t;
  }
  let y2 = now.getFullYear(), m2 = now.getMonth();
  let t = new Date(y2, m2, d);
  if (t < now) { m2++; if (m2 > 11) { m2 = 0; y2++; } t = new Date(y2, m2, d); }
  return t;
}
function cdInfo(cd) {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  if (cd.mode === 'from') {
    const s = new Date(cd.date); s.setHours(0, 0, 0, 0);
    return { mode: 'from', days: Math.round((now - s) / 864e5) };
  }
  const t = nextDate(cd);
  return { mode: 'to', days: t ? Math.round((t - now) / 864e5) : null, target: t };
}
function lunarLabel(m, d) { return '农历' + SL.toChinaMonth(m) + SL.toChinaDay(d); }

const CD_TYPES = [['birthday', '生日', 'p'], ['payday', '发工资', 'y'], ['anniversary', '纪念日', 'b'], ['love', '恋爱日', 'r'], ['custom', '自定义', 'g']];
const CD_REPS = [['none', '一次性'], ['year', '每年重复'], ['month', '每月重复']];

function cdToggle() {
  const mode = document.getElementById('cdMode').value;
  const cal = document.getElementById('cdCal').value;
  const toB = document.getElementById('cdToBox'), fromB = document.getElementById('cdFromBox');
  const lunarB = document.getElementById('cdLunarBox'), solarB = document.getElementById('cdSolarBox'), repB = document.getElementById('cdRepBox');
  if (toB) toB.style.display = mode === 'to' ? '' : 'none';
  if (fromB) fromB.style.display = mode === 'from' ? '' : 'none';
  if (lunarB) lunarB.style.display = (mode === 'to' && cal === 'lunar') ? '' : 'none';
  if (solarB) solarB.style.display = (mode === 'to' && cal !== 'lunar') ? '' : 'none';
  if (repB) repB.style.display = (mode === 'to' && cal !== 'lunar') ? '' : 'none';
}

function render_countdown() {
  const list = store.g('countdown', []);
  const items = list.map(c => ({ c, info: cdInfo(c) }));
  const tos = items.filter(i => i.info.mode === 'to').sort((a, b) => (a.info.days == null ? 1e9 : a.info.days) - (b.info.days == null ? 1e9 : b.info.days));
  const froms = items.filter(i => i.info.mode === 'from').sort((a, b) => b.info.days - a.info.days);
  const ordered = [...tos, ...froms];
  const edit = S.cdEdit ? list.find(x => x.id === S.cdEdit) : null;
  const typeOf = t => CD_TYPES.find(x => x[0] === t) || CD_TYPES[4];
  const eMode = edit ? edit.mode : 'to', eCal = edit ? edit.cal : 'solar';
  const item = o => {
    const { c, info } = o; const tg = typeOf(c.type);
    let big, sub;
    if (c.mode === 'from') {
      big = info.days === 0 ? '<span class="cd-today">今天开始 🌱</span>' : `<span class="cd-big">${info.days}</span><span class="cd-unit"> 天</span>`;
      sub = '自 ' + c.date + ' 起 · 已记录';
    } else {
      big = info.days === 0 ? '<span class="cd-today">就是今天 🎉</span>' : (info.days == null ? '<span class="cd-today">暂无</span>' : `<span class="cd-big">${info.days}</span><span class="cd-unit"> 天后</span>`);
      let tgt = info.target ? fmt(info.target) : '';
      if (c.cal === 'lunar') { const { m, d } = parseLunarMD(c.date); tgt = lunarLabel(m, d) + '（' + tgt + '）'; }
      sub = '目标 ' + tgt;
    }
    return `<div class="card cd-item">
      <div class="cd-num">${big}</div>
      <div class="cd-info">
        <div class="li-main">${esc(c.title)}</div>
        <div class="li-sub"><span class="tag ${tg[2]}">${tg[1]}</span><span class="tag">${c.mode === 'from' ? '记录天数' : '倒计时'}</span><span class="tag">${c.cal === 'lunar' ? '农历' : '公历'}</span></div>
        <div class="cd-note">${esc(sub)}</div>
        <div class="row mt" style="gap:6px">
          <button class="btn sm ghost" onclick="editCD('${c.id}')">改</button>
          <button class="btn sm warn" onclick="delCD('${c.id}')">删</button>
        </div>
      </div>
    </div>`;
  };
  const nearest = tos.length ? tos[0] : null;
  const toDisp = eMode === 'to' ? '' : 'none';
  const fromDisp = eMode === 'from' ? '' : 'none';
  const lunarDisp = (eMode === 'to' && eCal === 'lunar') ? '' : 'none';
  const solarDisp = (eMode === 'to' && eCal !== 'lunar') ? '' : 'none';
  const repDisp = (eMode === 'to' && eCal !== 'lunar') ? '' : 'none';
  const lm = (edit && edit.cal === 'lunar') ? parseLunarMD(edit.date).m : 1;
  const ld = (edit && edit.cal === 'lunar') ? parseLunarMD(edit.date).d : 1;
  return `
  <div class="page-title">⏳ 倒计时</div>
  <div class="page-sub">${nearest ? '最近：' + esc(nearest.c.title) + ' · 还有 ' + nearest.info.days + ' 天' : '记录每一个值得期待 / 值得纪念的日子'}</div>

  <div class="card">
    <div class="row"><input class="grow" id="cdTitle" placeholder="${edit ? '编辑名称…' : '事件名称，如 妈妈生日 / 在一起'}" value="${edit ? esc(edit.title) : ''}"></div>
    <div class="row mt">
      <select id="cdType">${CD_TYPES.map(t => `<option value="${t[0]}" ${edit && edit.type === t[0] ? 'selected' : ''}>${t[1]}</option>`).join('')}</select>
      <select id="cdMode" onchange="cdToggle()">
        <option value="to" >倒计时</option>
        <option value="from" ${edit && edit.mode === 'from' ? 'selected' : ''}>记录天数</option>
      </select>
    </div>
    <div id="cdToBox" style="display:${toDisp}">
      <div class="row mt">
        <select id="cdCal" onchange="cdToggle()">
          <option value="solar" ${edit && edit.cal !== 'lunar' ? 'selected' : ''}>公历</option>
          <option value="lunar" ${edit && edit.cal === 'lunar' ? 'selected' : ''}>农历</option>
        </select>
        <span id="cdSolarBox" style="display:${solarDisp}"><input type="date" id="cdDate" value="${edit && edit.cal !== 'lunar' ? edit.date : today()}"></span>
        <span id="cdLunarBox" style="display:${lunarDisp}">
          <select id="cdLM">${Array.from({ length: 12 }, (_, i) => `<option ${i + 1 === lm ? 'selected' : ''}>${i + 1}</option>`).join('')}</select>
          <select id="cdLD">${Array.from({ length: 30 }, (_, i) => `<option ${i + 1 === ld ? 'selected' : ''}>${i + 1}</option>`).join('')}</select>
        </span>
      </div>
      <div class="row mt" id="cdRepBox" style="display:${repDisp}">
        <select id="cdRepeat">${CD_REPS.map(t => `<option value="${t[0]}" ${edit && edit.repeat === t[0] ? 'selected' : ''}>${t[1]}</option>`).join('')}</select>
      </div>
    </div>
    <div id="cdFromBox" style="display:${fromDisp}">
      <div class="row mt"><input type="date" id="cdFrom" value="${edit && edit.mode === 'from' ? edit.date : today()}"></div>
    </div>
    <div class="row mt"><input class="grow" id="cdNote" placeholder="备注(可选)" value="${edit ? esc(edit.note || '') : ''}"></div>
    <div class="row mt">
      <button class="btn ${edit ? 'pink' : ''}" onclick="saveCD()">${edit ? '保存修改 ✔' : '添加 ➕'}</button>
      ${edit ? '<button class="btn sm ghost" onclick="S.cdEdit=null;render()">取消</button>' : ''}
    </div>
  </div>

  ${ordered.length ? ordered.map(item).join('') : '<div class="empty">还没有记录，添加第一个吧～</div>'}
  `;
}
function saveCD() {
  const title = $('#cdTitle').value.trim(); if (!title) return;
  const type = $('#cdType').value, mode = $('#cdMode').value;
  let cal = 'solar', date = '', repeat = 'none';
  if (mode === 'to') {
    cal = $('#cdCal').value;
    if (cal === 'lunar') { date = pad(+$('#cdLM').value) + '-' + pad(+$('#cdLD').value); repeat = 'year'; }
    else { date = $('#cdDate').value; repeat = $('#cdRepeat').value; }
  } else { date = $('#cdFrom').value; cal = 'solar'; }
  const obj = { title, type, mode, cal, date, repeat, note: $('#cdNote').value.trim() };
  const all = store.g('countdown', []);
  if (S.cdEdit) { const i = all.findIndex(x => x.id === S.cdEdit); if (i >= 0) all[i] = { ...all[i], ...obj }; S.cdEdit = null; }
  else all.push({ id: uid(), ...obj });
  store.s('countdown', all); render();
}
function editCD(id) { S.cdEdit = id; render(); }
function delCD(id) { if (!confirm('删除这条记录？')) return; store.s('countdown', store.g('countdown', []).filter(x => x.id !== id)); render(); }
