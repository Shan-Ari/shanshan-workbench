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
  { id: 'ledger', ic: '🧾', nm: '记账' },
  { id: 'habit', ic: '🌿', nm: '习惯打卡' },
  { id: 'plan', ic: '📝', nm: '每日计划' },
  { id: 'calendar', ic: '📅', nm: '日程日历' },
  { id: 'express', ic: '💬', nm: '表达能力' },
  { id: 'inspire', ic: '💡', nm: '灵感补给站' },
  { id: 'foreign', ic: '🌐', nm: '外语学习' },
  { id: 'pet', ic: '🐱', nm: '宠物记录' },
  { id: 'finance', ic: '💰', nm: '理财计划' },
  { id: 'clip', ic: '🎬', nm: '剪辑创作' },
  { id: 'sport', ic: '💪', nm: '运动计划' },
  { id: 'weekly', ic: '🗓️', nm: '周复盘' },
  { id: 'monthly', ic: '🌙', nm: '月复盘' }
];
/* 页面临时状态 */
const S = { engTab: 'speak', planDate: today(), planEdit: null, noteEdit: null, sentEdit: null, poemView: null, ledMonth: thisMonth(), calY: new Date().getFullYear(), calM: new Date().getMonth(), calSel: today(), petTab: 'bath', clipTab: 'notes', cdEdit: null, repayEdit: null, repayPlan: null, acctEdit: null, habitEdit: null, habitHeat: 'all', ledTab: 'main', calTab: 'main',
  /* 灵感补给站 / 表达 / 外语 临时态 */
  quoteIdx: 0, insTab: 'good', expTab: 'daily', forTab: 'en', krLevel: '初级', krSub: 'forty', jpSub: 'fifty', krSpokenTab: 'daily', jpLevel: '初级', jpSpokenTab: 'daily', chatLog: [] };

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
  { id: 'home', ic: 'home', nm: '首页' },
  { id: 'ledger', ic: 'ledger', nm: '记账' },
  { id: 'habit', ic: 'habit', nm: '习惯打卡' },
  { id: 'plan', ic: 'plan', nm: '每日计划' },
  { id: 'calendar', ic: 'calendar', nm: '日程日历' },
  { id: 'express', ic: 'express', nm: '表达能力' },
  { id: 'inspire', ic: 'inspire', nm: '灵感补给站' },
  { id: 'foreign', ic: 'foreign', nm: '外语学习' },
  { id: 'pet', ic: 'pet', nm: '宠物记录' },
  { id: 'finance', ic: 'finance', nm: '理财计划' },
  { id: 'clip', ic: 'clip', nm: '剪辑创作' },
  { id: 'sport', ic: 'sport', nm: '运动计划' },
  { id: 'weekly', ic: 'weekly', nm: '周复盘' },
  { id: 'monthly', ic: 'monthly', nm: '月复盘' }
];
function buildSidebar() {
  const cur = curPage();
  $('#sidebar').innerHTML = TOP.map(t => `<div class="tb-item ${cur === t.id ? 'active' : ''}" onclick="go('${t.id}')"><span class="ic">${icon(t.ic)}</span><span class="nm">${t.nm}</span></div>`).join('');
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
const WEEK_CN = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
/* 中英双语语录 */
const QUOTES_BI = [
  { zh: '慢慢来，比较快。', en: 'Slow is smooth, and smooth is fast.' },
  { zh: '你积攒的每一份努力，都会在未来某天开花。', en: 'Every effort you save up will bloom someday.' },
  { zh: '日拱一卒，功不唐捐。', en: 'Move one step a day; no effort is ever wasted.' },
  { zh: '生活明朗，万物可爱。', en: 'Life is bright, and everything is lovely.' },
  { zh: '把日子过成自己喜欢的样子。', en: 'Live your days the way you love them.' },
  { zh: '今天的小坚持，是明天的大惊喜。', en: "Today's small persistence is tomorrow's big surprise." },
  { zh: '先完成，再完美。', en: 'Done is better than perfect.' },
  { zh: '温柔半两，从容一生。', en: 'A little gentleness makes a lifetime of ease.' },
  { zh: '心之所向，素履以往。', en: 'Wherever the heart points, walk there in plain shoes.' },
  { zh: '认真生活的人，运气都不会太差。', en: 'Those who live earnestly are rarely short of luck.' },
  { zh: '不必焦虑，你只是还在路上。', en: 'No need to panic — you are simply still on the way.' },
  { zh: '愿你眼里有光，心中有爱。', en: 'May your eyes hold light and your heart hold love.' },
  { zh: '所有的努力，都会有回响。', en: 'Every effort will find its echo.' },
  { zh: '把注意力放在能改变的事情上。', en: 'Put your attention on what you can change.' },
  { zh: '成年人的自由，是自律换来的。', en: 'Freedom for grown-ups is bought with discipline.' },
  { zh: '你不需要很厉害才能开始，但要开始才会很厉害。', en: 'You need not be great to start, but you must start to be great.' },
  { zh: '休息不是偷懒，是为了走更远。', en: 'Rest is not laziness; it is fuel for the long road.' },
  { zh: '与其焦虑未来，不如认真过好今天。', en: 'Rather than fear tomorrow, live today well.' },
  { zh: '风会记得一朵花的香。', en: 'The wind remembers the fragrance of a flower.' },
  { zh: '不着急，好的事情总要慢慢来。', en: 'Take your time — good things unfold slowly.' },
  { zh: '你已经比昨天的自己更好了。', en: 'You are already better than you were yesterday.' },
  { zh: '把每一天都过得值得回忆。', en: 'Make each day worth remembering.' },
  { zh: '光是活着，就已经很勇敢了。', en: 'Simply being alive is already brave.' },
  { zh: '热爱可抵岁月漫长。', en: 'Passion outlasts the longest years.' },
  { zh: '保持热爱，奔赴山海。', en: 'Keep your passion and run toward mountains and seas.' },
  { zh: '踏实一点，日子会给你答案。', en: 'Stay grounded; time will give you the answer.' },
  { zh: '别怕慢，就怕站。', en: 'Do not fear going slow; fear standing still.' },
  { zh: '愿你所求皆如愿，所行化坦途。', en: 'May your wishes come true and your road run smooth.' },
  { zh: '给自己一点耐心，花期各有不同。', en: 'Be patient with yourself; every flower blooms in its own season.' },
  { zh: '认真对待每一个小目标。', en: 'Take every small goal seriously.' }
];
function greetText() {
  const h = new Date().getHours();
  if (h < 5) return '夜深了，早点休息呀 🌙';
  if (h < 9) return '早上好呀，新的一天开始啦 ☀️';
  if (h < 11) return '上午好，今天也要加油 🌿';
  if (h < 14) return '中午好，记得好好吃饭 🍚';
  if (h < 18) return '下午好，喝口水歇一歇 🍵';
  if (h < 22) return '晚上好，今天辛苦啦 🌸';
  return '夜深了，早点休息呀 🌙';
}
function clockStr() { const d = new Date(); return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()); }
function lunarStr() {
  const d = new Date();
  if (typeof SL === 'undefined') return '';
  const l = SL.solar2lunar(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return '农历 ' + (l.isLeap ? '闰' : '') + l.IMonthCn + l.IDayCn;
}
function homeTick() {
  const c = document.getElementById('hClock'); if (!c) return;
  c.textContent = clockStr();
  const g = document.getElementById('hGreet'); if (g) g.textContent = greetText();
}
setInterval(homeTick, 1000);
function nextQuote() { S.quoteIdx = (S.quoteIdx + 1) % QUOTES_BI.length; render(); }

/* ============ 每日喝水 ============ */
function waterList() { return store.g('water', []); }
function waterGoal() { return store.g('waterGoal', 2000); }
function setWaterGoal() {
  const v = +$('#wtGoal').value || 0;
  if (v < 200) { alert('目标建议不少于 200ml'); return; }
  store.s('waterGoal', v); render();
}
function addWater(ml, tm) {
  const amount = +ml || 0; if (!amount) return;
  const now = new Date();
  const time = tm || (pad(now.getHours()) + ':' + pad(now.getMinutes()));
  const arr = waterList();
  arr.push({ id: uid(), date: today(), time, ml: amount });
  store.s('water', arr);
  const ck = store.g('waterCk', []); if (!ck.includes(today())) { ck.push(today()); store.s('waterCk', ck); }
  render();
}
function addWaterCustom() {
  const ml = +$('#wtMl').value || 0;
  if (!ml) { alert('请填写喝水量(ml)'); return; }
  addWater(ml, $('#wtTime').value || null);
}
function delWater(id) { store.s('water', waterList().filter(w => w.id !== id)); render(); }
function waterFrag() {
  const all = waterList();
  const td = all.filter(w => w.date === today()).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  const total = td.reduce((a, b) => a + (+b.ml || 0), 0);
  const goal = waterGoal();
  const pct = Math.min(100, Math.round(total / goal * 100));
  const now = new Date();
  const nowT = pad(now.getHours()) + ':' + pad(now.getMinutes());
  /* 近 7 日 */
  const days = [];
  for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); days.push(fmt(d)); }
  const dayTot = days.map(ds => all.filter(w => w.date === ds).reduce((a, b) => a + (+b.ml || 0), 0));
  const avg7 = Math.round(dayTot.reduce((a, b) => a + b, 0) / 7);
  const hit7 = dayTot.filter(v => v >= goal).length;
  const bars = days.map((ds, i) => {
    const h = Math.max(3, Math.round(Math.min(1, dayTot[i] / goal) * 46));
    return `<div class="wt-col" title="${ds} · ${dayTot[i]}ml"><div class="wt-bar2 ${dayTot[i] >= goal ? 'ok' : ''}" style="height:${h}px"></div><span>${ds.slice(5).replace('-', '/')}</span></div>`;
  }).join('');
  return `
  <div class="card">
    <h3>💧 每日喝水</h3>
    <div class="wt-total"><b>${total}</b><span> / ${goal} ml</span></div>
    <div class="wt-track"><div class="wt-fill" style="width:${pct}%"></div></div>
    <div class="li-sub" style="text-align:center;margin-top:6px">${total >= goal ? '今日目标已达成，好棒 🎉' : '还差 ' + (goal - total) + ' ml，加油喝水呀 ~'} · 已喝 ${td.length} 次</div>
    <div class="wt-quick">
      ${[100, 200, 300, 500].map(v => `<button class="btn sm ghost" onclick="addWater(${v})">+${v}ml</button>`).join('')}
    </div>
    <div class="row mt">
      <input type="time" id="wtTime" value="${nowT}" style="max-width:120px">
      <input type="number" class="grow" id="wtMl" placeholder="喝水量 (ml)">
      <button class="btn" onclick="addWaterCustom()">记录 ➕</button>
    </div>
    <div class="row mt">
      <span class="li-sub">每日目标</span>
      <input type="number" id="wtGoal" value="${goal}" style="max-width:110px">
      <span class="li-sub">ml</span>
      <button class="btn sm ghost" onclick="setWaterGoal()">保存目标</button>
    </div>
    ${td.length ? `<div style="margin-top:8px">${td.map(w => `<div class="list-item"><div class="li-main"><span class="tag b">${w.time}</span> ${w.ml} ml</div><button class="btn sm warn" onclick="delWater('${w.id}')">删</button></div>`).join('')}</div>` : '<div class="empty">今天还没喝水记录，先来一杯吧 🥛</div>'}
    <div class="wt-week">${bars}</div>
    <div class="li-sub" style="text-align:center">近 7 日日均 <b>${avg7}</b> ml · 达标 <b>${hit7}</b> 天 · 连续打卡 <b>${streakOf(store.g('waterCk', []))}</b> 天</div>
  </div>`;
}

function render_home() {
  const d = new Date();
  const q = QUOTES_BI[(dayIdx + (S.quoteIdx || 0)) % QUOTES_BI.length];
  let festCards = '';
  try {
    const fests = (typeof festUpcoming === 'function') ? festUpcoming(3) : [];
    festCards = fests.map(f => (typeof festCardHtml === 'function' ? festCardHtml(f) : '')).join('');
  } catch (e) { console.warn('节日加载失败：', e); }
  return `
  <div class="home-hero">
    <div class="hero-greet" id="hGreet">${greetText()}</div>
    <div class="hero-clock" id="hClock">${clockStr()}</div>
    <div class="hero-date">${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日 · ${WEEK_CN[d.getDay()]}</div>
    <div class="hero-lunar">${lunarStr()}</div>
  </div>

  <div class="card quote-card">
    <div class="quote-zh">${esc(q.zh)}</div>
    <div class="quote-en">${esc(q.en)}</div>
    <div class="row" style="justify-content:center;margin-top:10px;gap:8px">
      <button class="btn sm ghost" onclick="nextQuote()">换一句 🔄</button>
      <button class="btn sm ghost" onclick="speak('${esc(q.en).replace(/'/g, "\\'")}','en-US')">🔊 朗读</button>
    </div>
  </div>

  <div class="card"><h3>🏮 传统节日提醒</h3>${festCards || '<div class="empty">暂无</div>'}
    <div class="row" style="justify-content:center;margin-top:8px"><button class="btn sm ghost" onclick="S.calTab='main';go('calendar')">查看更多节日 →</button></div>
  </div>

  ${waterFrag()}

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

function countdownFrag() {
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
  const toDisp = eMode === 'to' ? '' : 'none';
  const fromDisp = eMode === 'from' ? '' : 'none';
  const lunarDisp = (eMode === 'to' && eCal === 'lunar') ? '' : 'none';
  const solarDisp = (eMode === 'to' && eCal !== 'lunar') ? '' : 'none';
  const repDisp = (eMode === 'to' && eCal !== 'lunar') ? '' : 'none';
  const lm = (edit && edit.cal === 'lunar') ? parseLunarMD(edit.date).m : 1;
  const ld = (edit && edit.cal === 'lunar') ? parseLunarMD(edit.date).d : 1;
  return `
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
function render_countdown() {
  const list = store.g('countdown', []);
  const items = list.map(c => ({ c, info: cdInfo(c) }));
  const tos = items.filter(i => i.info.mode === 'to').sort((a, b) => (a.info.days == null ? 1e9 : a.info.days) - (b.info.days == null ? 1e9 : b.info.days));
  const nearest = tos.length ? tos[0] : null;
  return `
  <div class="page-title">⏳ 倒计时</div>
  <div class="page-sub">${nearest ? '最近：' + esc(nearest.c.title) + ' · 还有 ' + nearest.info.days + ' 天' : '记录每一个值得期待 / 值得纪念的日子'}</div>
  ${countdownFrag()}`;
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
