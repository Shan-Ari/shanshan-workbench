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
  { id: 'reboot', ic: '🔄', nm: '人生重启' },
  { id: 'habit', ic: '🌿', nm: '习惯打卡' },
  { id: 'plan', ic: '📝', nm: '每日计划' },
  { id: 'calendar', ic: '📅', nm: '日程日历' },
  { id: 'express', ic: '💬', nm: '表达能力' },
  { id: 'inspire', ic: '💡', nm: '灵感补给站' },
  { id: 'pet', ic: '🐱', nm: '宠物记录' },
  { id: 'kuaidi', ic: 'kuaidi', nm: '快递记录' },
  { id: 'finance', ic: '💰', nm: '理财计划' },
  { id: 'clip', ic: '🎬', nm: '剪辑创作' },
  { id: 'sport', ic: '💪', nm: '运动计划' },
  { id: 'weekly', ic: '🗓️', nm: '周复盘' },
  { id: 'monthly', ic: '🌙', nm: '月复盘' }
];
/* 页面临时状态 */
const S = { planDate: today(), planEdit: null, noteEdit: null, sentEdit: null, poemView: null, ledMonth: thisMonth(), calY: new Date().getFullYear(), calM: new Date().getMonth(), calSel: today(), petTab: 'bath', clipTab: 'notes', petSupplyLog: 'all', petSnackLog: 'all', cdEdit: null, repayEdit: null, repayPlan: null, loanEdit: null, loanPlan: null, acctEdit: null, habitEdit: null, habitHeat: 'all', habitTab: 'check', habitLog: { habit: 'all', from: '', to: '', kw: '', open: false }, ledTab: 'main', calTab: 'main',
  /* 灵感补给站 / 表达 临时态 */
  quoteIdx: 0, insTab: 'good', insSeed: null, insAll: false, expTab: 'daily' };

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
  { id: 'reboot', ic: 'reboot', nm: '人生重启' },
  { id: 'habit', ic: 'habit', nm: '习惯打卡' },
  { id: 'plan', ic: 'plan', nm: '每日计划' },
  { id: 'calendar', ic: 'calendar', nm: '日程日历' },
  { id: 'express', ic: 'express', nm: '表达能力' },
  { id: 'inspire', ic: 'inspire', nm: '灵感补给站' },
  { id: 'pet', ic: 'pet', nm: '宠物记录' },
  { id: 'kuaidi', ic: 'kuaidi', nm: '快递记录' },
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
function addWater(ml, tm, type, note) {
  const amount = +ml || 0; if (!amount) return;
  const now = new Date();
  const time = tm || (pad(now.getHours()) + ':' + pad(now.getMinutes()));
  const arr = waterList();
  arr.push({ id: uid(), date: today(), time, ml: amount, type: type || '水', note: (note || '').trim() });
  store.s('water', arr);
  const ck = store.g('waterCk', []); if (!ck.includes(today())) { ck.push(today()); store.s('waterCk', ck); }
  render();
}
function addWaterCustom() {
  const ml = +$('#wtMl').value || 0;
  if (!ml) { alert('请填写喝水量(ml)'); return; }
  addWater(ml, $('#wtTime').value || null, S.waterType || '水', $('#wtNote').value || '');
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
      ${[100, 200, 300, 500].map(v => `<button class="btn sm ghost" onclick="addWater(${v}, null, S.waterType || '水')">+${v}ml</button>`).join('')}
    </div>
    <div class="row mt" style="flex-wrap:wrap">
      <select id="wtType" class="grow" onchange="S.waterType=this.value">
        ${['水','咖啡','茶','奶茶','饮料','果汁','牛奶'].map(o => `<option value="${o}" ${(S.waterType||'水')===o?'selected':''}>${o}</option>`).join('')}
      </select>
      <input type="time" id="wtTime" value="${nowT}" style="max-width:120px">
      <input type="number" class="grow" id="wtMl" placeholder="喝水量 (ml)">
      <button class="btn" onclick="addWaterCustom()">记录 ➕</button>
    </div>
    <div class="row mt">
      <input id="wtNote" class="grow" placeholder="备注（可选，如：冰美式无糖 / 给同事带的）">
    </div>
    <div class="row mt">
      <span class="li-sub">每日目标</span>
      <input type="number" id="wtGoal" value="${goal}" style="max-width:110px">
      <span class="li-sub">ml</span>
      <button class="btn sm ghost" onclick="setWaterGoal()">保存目标</button>
    </div>
    ${td.length ? `<div style="margin-top:8px">${td.map(w => `<div class="list-item"><div class="li-main"><span class="tag b">${esc(w.time)}</span> <span class="tag">${esc(w.type||'水')}</span> ${w.ml} ml${w.note? ' · '+esc(w.note):''}</div><button class="btn sm warn" onclick="delWater('${w.id}')">删</button></div>`).join('')}</div>` : '<div class="empty">今天还没喝水记录，先来一杯吧 🥛</div>'}
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
  if ((S.planSub || 'free') === 'routine') return render_routine();
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
  ${planSubBar()}

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

/* ============ 每日计划 · 固定日程（子分类） ============
   内容固定（8 项作息），区间 明天 ~ 2026-09-30；每天有已完成/待完成，跨天后折叠，带完成热力图。 */
const ROUTINE_ITEMS = [
  { id: 'r0', ic: '🛏️', t: '起床', time: '7:30' },
  { id: 'r1', ic: '🆎', t: '外语学习', time: '8:30-9:30' },
  { id: 'r2', ic: '💻', t: '上课', time: '10:00-11:00' },
  { id: 'r3', ic: '📚', t: '看书', time: '14:00-15:00' },
  { id: 'r4', ic: '💻', t: '上课', time: '15:30-17:00' },
  { id: 'r5', ic: '💻', t: '上课', time: '17:30-19:00' },
  { id: 'r6', ic: '💻', t: '上课', time: '21:00-22:00' },
  { id: 'r7', ic: '😴', t: '睡觉', time: '23:30' }
];
const ROUTINE_END = '2026-09-30';
const WK_CN2 = ['日', '一', '二', '三', '四', '五', '六'];
function dayAdd(s, n) { const p = String(s).split('-'); const d = new Date(+p[0], +p[1] - 1, +p[2]); d.setDate(d.getDate() + n); return fmt(d); }
function rtState() { return store.g('routine', { days: {}, collapsed: {} }); }
function rtSave(st) { store.s('routine', st); }
function rtDoneCount(d, date) { const day = (d.days[date]) || {}; return ROUTINE_ITEMS.filter(it => day[it.id]).length; }
let rtActiveDay = null;
function rtCollapsed(d, date) { const c = d.collapsed && d.collapsed[date]; if (c === undefined) return rtActiveDay ? (date !== rtActiveDay) : true; return !!c; }
function rtHeatOpen(d) { return !!d.heatOpen; }
function planSubBar() {
  const cur = S.planSub || 'free';
  return '<div class="rb-tabs" style="margin:4px 0 14px"><button class="rb-tab ' + (cur === 'free' ? 'on' : '') + '" onclick="planSwitchSub(\'free\')">自由计划</button><button class="rb-tab ' + (cur === 'routine' ? 'on' : '') + '" onclick="planSwitchSub(\'routine\')">固定日程</button></div>';
}
function planSwitchSub(sub) { S.planSub = sub; render(); }
function routineEnsureStyle() {
  if (document.getElementById('rt-style')) return;
  const s = document.createElement('style'); s.id = 'rt-style';
  s.textContent = `
.rt-hm{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px}
.rt-cell{width:46px;height:48px;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:11px;color:#6b5555;cursor:pointer;border:1px solid #f0e6da}
.rt-cell .rt-d{font-weight:700;font-size:13px;line-height:1.1}
.rt-cell .rt-c{font-size:10px;color:#8a7a7a;margin-top:1px}
.rt-cell.today{outline:2px solid #F9E79F;outline-offset:1px}
.rt-legend{display:flex;gap:6px;align-items:center;font-size:11px;color:#9a8a8a;margin:6px 0 14px;flex-wrap:wrap}
.rt-lg{width:14px;height:14px;border-radius:4px;border:1px solid #f0e6da}
.rt-sect{font-size:13px;color:#6b5555;margin:12px 0 6px;font-weight:600}
.rt-row{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:12px;background:#faf6ef;margin-bottom:7px;cursor:pointer}
.rt-row.on{background:#eaf6ef}
.rt-box{width:20px;height:20px;border-radius:6px;border:2px solid #d8c8b8;display:flex;align-items:center;justify-content:center;font-size:13px;color:#fff;flex:none}
.rt-row.on .rt-box{background:#B8E0D2;border-color:#B8E0D2}
.rt-t{flex:1;line-height:1.3}
.rt-time{font-size:12px;color:#9a8a8a}
.rt-dayhead{display:flex;align-items:center;gap:8px;margin-bottom:10px}
.rt-dayhead b{font-size:15px;color:#6b5555}`;
  document.head.appendChild(s);
}
function rtColor(ratio) {
  if (ratio <= 0) return '#f0e8dc';
  if (ratio < 0.5) return '#d9ecdf';
  if (ratio < 1) return '#b9e2c6';
  return '#8fd6a6';
}
function render_routine() {
  routineEnsureStyle();
  const start = dayAdd(today(), 1);
  const end = ROUTINE_END;
  const d = rtState();
  const seq = [];
  let cur = start;
  while (cur <= end) { seq.push(cur); cur = dayAdd(cur, 1); }
  if (!seq.length) return '<div class="page-title">📝 每日计划</div>' + planSubBar() + '<div class="card"><div class="empty">固定日程区间（' + start + ' ~ ' + end + '）已结束或未开始。</div></div>';
  rtActiveDay = seq.includes(today()) ? today() : seq[0];
  let totalDone = 0;
  seq.forEach(dt => { totalDone += rtDoneCount(d, dt); });
  const cells = seq.map(dt => {
    const done = rtDoneCount(d, dt);
    const dt2 = new Date(dt + 'T00:00:00');
    const wk = WK_CN2[dt2.getDay()];
    const pend = ROUTINE_ITEMS.length - done;
    return '<div class="rt-cell ' + (dt === today() ? 'today' : '') + '" style="background:' + rtColor(done / ROUTINE_ITEMS.length) + '" title="' + dt + ' 周' + wk + ' · 已完成 ' + done + '/' + ROUTINE_ITEMS.length + '，待完成 ' + pend + '" onclick="routineFocus(\'' + dt + '\')"><div class="rt-d">' + (+dt.slice(8)) + '</div><div class="rt-c">' + done + '/' + ROUTINE_ITEMS.length + '</div></div>';
  }).join('');
  const legend = '<div class="rt-legend"><span>完成度</span>' +
    [['#f0e8dc', '0'], ['#d9ecdf', '<50%'], ['#b9e2c6', '50-99%'], ['#8fd6a6', '全完成']].map(x => '<span class="rt-lg" style="background:' + x[0] + '"></span>' + x[1]).join('') +
    '<span style="margin-left:8px">点格子可展开当天</span></div>';
  const cards = seq.map(dt => {
    const day = (d.days[dt]) || {};
    const done = rtDoneCount(d, dt);
    const pend = ROUTINE_ITEMS.length - done;
    const collapsed = rtCollapsed(d, dt);
    const isToday = dt === today();
    const wk = WK_CN2[new Date(dt + 'T00:00:00').getDay()];
    const doneItems = ROUTINE_ITEMS.filter(it => day[it.id]);
    const pendItems = ROUTINE_ITEMS.filter(it => !day[it.id]);
    const rowOf = it => '<div class="rt-row ' + (day[it.id] ? 'on' : '') + '" onclick="routineToggle(\'' + dt + '\',\'' + it.id + '\')"><span class="rt-box">' + (day[it.id] ? '✓' : '') + '</span><span class="rt-t">' + it.ic + ' ' + it.t + ' <span class="rt-time">' + it.time + '</span></span></div>';
    const body = collapsed
      ? '<div class="rb-summary"><span class="rb-sp">已完成 ' + done + ' / ' + ROUTINE_ITEMS.length + ' · 待完成 ' + pend + '</span></div>'
      : '<div class="rt-sect">✅ 已完成（' + doneItems.length + '）</div>' + (doneItems.length ? doneItems.map(rowOf).join('') : '<div class="empty" style="padding:6px">暂无</div>') +
        '<div class="rt-sect">⏳ 待完成（' + pendItems.length + '）</div>' + (pendItems.length ? pendItems.map(rowOf).join('') : '<div class="empty" style="padding:6px">今日全部完成 🎉</div>');
    return '<div class="card rb-day ' + (isToday ? 'rb-today ' : '') + (collapsed ? 'collapsed' : '') + '">' +
      '<div class="rt-dayhead" onclick="routineToggleCollapse(\'' + dt + '\')"><b>' + dt.slice(5) + '</b><span class="li-sub">周' + wk + '</span>' +
      (done === ROUTINE_ITEMS.length ? '<span class="tag g">全完成</span>' : '<span class="tag ' + (isToday ? 'y' : 'r') + '">待 ' + pend + '</span>') +
      '<span class="rb-caret" style="margin-left:auto">' + (collapsed ? '▸' : '▾') + '</span></div>' + body + '</div>';
  }).join('');
  const heatOpen = rtHeatOpen(d);
  const heatCard = '<div class="card" style="padding:14px 16px"><div class="rt-dayhead" style="margin-bottom:' + (heatOpen ? '10px' : '0') + '" onclick="routineToggleHeat()"><b>📊 完成热力图</b><span class="rb-caret" style="margin-left:auto">' + (heatOpen ? '▾' : '▸') + '</span></div>' + (heatOpen ? (cells + legend) : '') + '</div>';
  return '<div class="page-title">📝 每日计划</div>' + planSubBar() +
    '<div class="page-sub">固定日程 ' + start + ' ~ ' + end + ' · 共 ' + seq.length + ' 天 · 累计完成 ' + totalDone + ' 项</div>' +
    heatCard + cards;
}
function routineToggle(dt, id) { const d = rtState(); d.days[dt] = d.days[dt] || {}; d.days[dt][id] = !d.days[dt][id]; rtSave(d); render(); }
function routineToggleCollapse(dt) { const d = rtState(); d.collapsed = d.collapsed || {}; d.collapsed[dt] = !rtCollapsed(d, dt); rtSave(d); render(); }
function routineFocus(dt) { const d = rtState(); d.collapsed = d.collapsed || {}; d.collapsed[dt] = false; rtSave(d); render(); }
function routineToggleHeat() { const d = rtState(); d.heatOpen = !rtHeatOpen(d); rtSave(d); render(); }

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

/* ============ 人生重启 ============ */
/* ============ 30天人生重启计划 ============ */
const PROJECT50 = [
  { k: 'wake', t: '8:00 起床 🛏️', d: '每天 8:00 起床，开启自律的一天' },
  { k: 'sleep', t: '0:30 以前睡觉 😴', d: '每天 0:30 前入睡' },
  { k: 'study', t: '固定学习 1 小时 🎯', d: '每天固定学习 1 小时' },
  { k: 'workout', t: '锻炼 45+ 分钟 🏃‍♀️', d: '每天运动 45 分钟以上' },
  { k: 'read', t: '阅读 10 页书 📚', d: '每天读 10 页书（纸质 / 电子均可）' },
  { k: 'skill', t: '学新技能 1 小时 🎥', d: '每天花 1 小时学习一项新技能' },
  { k: 'diet', t: '健康饮食 🍚', d: '早餐 + 午餐 晚餐任选' },
  { k: 'water', t: '喝 2 升水 🥛', d: '每天喝够 2 升' },
  { k: 'plan', t: '规划次日 📃', d: '每晚规划好第二天的安排' },
  { k: 'track', t: '记录进度', d: '每天写日志 / 记录今日进度' }
];
function p50() { return store.g('p50', { start: null, days: {} }); }
function saveP50(o) { store.s('p50', o); }
function todayP50Tasks() { const o = p50(); return o.days[today()] || {}; }
function setP50Start() {
  const d = $('#p50Start').value;
  if (!d) { alert('请选择开始日期'); return; }
  const o = p50(); o.start = d; saveP50(o); render();
}
function toggleP50(k) {
  const o = p50();
  o.days[today()] = o.days[today()] || {};
  o.days[today()][k] = !o.days[today()][k];
  if (!o.days[today()][k]) o.days[today()].done = false;
  saveP50(o); render();
}
function p50Ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
function p50Streak() {
  const o = p50(); const days = o.days; let s = 0;
  let d = new Date();
  if (!(days[today()] && days[today()].done)) d.setDate(d.getDate() - 1);
  while (true) {
    const ds = p50Ymd(d);
    if (days[ds] && days[ds].done) { s++; d.setDate(d.getDate() - 1); } else break;
  }
  return s;
}
function completeP50() {
  const tk = todayP50Tasks();
  if (!PROJECT50.every(x => tk[x.k])) { alert('还有任务没勾选完成，PROJECT 50 要求当天 10 项全部完成才算成功一天'); return; }
  const o = p50();
  o.days[today()] = o.days[today()] || {};
  o.days[today()].done = true;
  if (!o.start) o.start = today();
  saveP50(o); render();
}
function undoP50() { const o = p50(); if (o.days[today()]) o.days[today()].done = false; saveP50(o); render(); }
function render_p50() {
  const o = p50(); const tk = todayP50Tasks();
  const doneTodayAll = PROJECT50.every(x => tk[x.k]);
  const doneCount = PROJECT50.filter(x => tk[x.k]).length;
  const streak = p50Streak();
  const pct = Math.round(streak / 50 * 100);
  const start = o.start;
  let dayIdx = null;
  if (start) {
    const diff = Math.round((new Date(today()) - new Date(start)) / 86400000) + 1;
    if (diff >= 1 && diff <= 50) dayIdx = diff;
  }
  let tip = '';
  if (start) {
    if (dayIdx >= 1 && dayIdx <= 50) tip = `今天第 ${dayIdx} 天 · 还剩 ${50 - dayIdx} 天`;
    else if (dayIdx < 1) tip = '还没到开始日';
    else tip = '50 天计划已结束 🎉';
  } else tip = '设置开始日期后，会自动标记今天是第几天';
  const sd = start ? start.split('-') : null;
  const base = sd ? new Date(+sd[0], +sd[1] - 1, +sd[2]) : null;
  const list = PROJECT50.map(x => {
    const on = tk[x.k];
    return `<div class="todo ${on ? 'done' : ''}">
      <div class="ck" onclick="toggleP50('${x.k}')">${on ? '✓' : ''}</div>
      <div style="flex:1;min-width:0"><div class="li-main">${esc(x.t)}</div><div class="li-sub">${esc(x.d)}</div></div>
    </div>`;
  }).join('');
  const grid = Array.from({ length: 50 }, (_, i) => {
    const dd = i + 1;
    const ds = base ? p50Ymd(new Date(base.getFullYear(), base.getMonth(), base.getDate() + (dd - 1))) : null;
    const done = ds && o.days[ds] && o.days[ds].done;
    const isToday = dd === dayIdx;
    return `<div class="rb-cell ${done ? 'done' : ''} ${isToday ? 'today' : ''}">
      <div class="rb-d">D${dd}</div>
      <div class="rb-ck">${done ? '✓' : (isToday ? '今' : '')}</div>
    </div>`;
  }).join('');
  return `
  <div class="page-title">🔥 PROJECT 50 天自律计划</div>
  <div class="page-sub">连续 50 天，每天完成 10 项自律任务 · 漏一天清零（外网 Project 50）</div>
  <div class="card">
    <div class="row" style="justify-content:space-between"><div><b>连续 ${streak} / 50 天</b></div><div class="li-sub">${pct}% 完成度</div></div>
    <div class="bar"><div class="bar-fill" style="width:${pct}%"></div></div>
    <div class="row mt">
      <span class="li-sub">开始日期</span>
      <input type="date" id="p50Start" value="${start || ''}" style="max-width:170px">
      <button class="btn sm" onclick="setP50Start()">${start ? '重设' : '开始'}</button>
      <span class="li-sub">${tip}</span>
    </div>
  </div>
  <div class="card">
    <h3>📌 今日 10 项（${doneCount}/${PROJECT50.length}）</h3>
    ${list}
    <div class="row mt">
      ${tk.done ? `<button class="btn ghost" onclick="undoP50()">今日已完成 ✓（撤销）</button>` : `<button class="btn pink" onclick="completeP50()">${doneTodayAll ? '完成今日挑战 ✔' : '完成今日（需勾满全部）'}</button>`}
    </div>
  </div>
  <div class="card"><h3>🗓 50天总览</h3>
    <div class="rb-grid">${grid}</div>
  </div>
  <div class="card"><h3>📖 规则说明</h3>
    <div class="poem-sec">PROJECT 50 是连续 50 天的自律挑战，每天必须完成这 ${PROJECT50.length} 项任务：<b>${PROJECT50.map(x => esc(x.t)).join('、')}</b>。<b>任何一天没全部完成，连续天数清零、从头再来。</b></div>
  </div>`;
}

const REBOOT30 = [
  { d: 1, theme: '断舍离启动', act: '整理一个角落，扔掉/捐赠 10 件不用的东西' },
  { d: 2, theme: '早睡早起', act: '比平时早睡 30 分钟，固定一个起床时间' },
  { d: 3, theme: '喝水打卡', act: '喝够 8 杯水，今天戒掉含糖饮料' },
  { d: 4, theme: '动起来', act: '快走/慢跑/跳绳 20 分钟' },
  { d: 5, theme: '数字排毒', act: '睡前 1 小时不碰手机，换成看书' },
  { d: 6, theme: '感恩日记', act: '写下今天 3 件值得感恩的小事' },
  { d: 7, theme: '联系老友', act: '给一位很久没联系的朋友发条消息' },
  { d: 8, theme: '好好吃饭', act: '自己动手做一顿饭，少点一次外卖' },
  { d: 9, theme: '阅读时光', act: '读一本想读已久的书，至少 30 分钟' },
  { d: 10, theme: '静心冥想', act: '闭眼深呼吸，冥想 10 分钟' },
  { d: 11, theme: '理清财务', act: '记一整天的账，看清钱都去哪了' },
  { d: 12, theme: '学点新东西', act: '花 30 分钟学一项新技能/新工具' },
  { d: 13, theme: '断网半天', act: '选半天远离社交媒体，感受 offline' },
  { d: 14, theme: '手机大扫除', act: '删掉不用的 APP 和重复照片' },
  { d: 15, theme: '善待身体', act: '做一组拉伸，或给自己按个摩' },
  { d: 16, theme: '表达感谢', act: '当面或发消息感谢一个人' },
  { d: 17, theme: '定下目标', act: '写下本月最想完成的 3 个目标' },
  { d: 18, theme: '晨间仪式', act: '固定一套属于自己的晨间流程' },
  { d: 19, theme: '宠爱自己', act: '做一件纯粹让自己开心的小事' },
  { d: 20, theme: '周中复盘', act: '回顾本周得失，记下一句感悟' },
  { d: 21, theme: '小小善意', act: '为别人做一件不经意的善事' },
  { d: 22, theme: '控屏计划', act: '给手机设一个每日使用时长上限' },
  { d: 23, theme: '深度专注', act: '选一件重要的事，专注做 2 小时' },
  { d: 24, theme: '亲近自然', act: '去公园或户外走一走，晒晒太阳' },
  { d: 25, theme: '衣橱断舍离', act: '清理出不再穿的衣物，捐赠或处理' },
  { d: 26, theme: '理财入门', act: '读一篇理财/储蓄文章，记一个知识点' },
  { d: 27, theme: '写给未来', act: '给一个月后的自己写一封信' },
  { d: 28, theme: '清零拖延', act: '处理掉一件一直拖着的小事' },
  { d: 29, theme: '复盘变化', act: '回顾这 29 天，写下自己的变化' },
  { d: 30, theme: '庆祝 & 启程', act: '庆祝完成，设定下一个 30 天目标' }
];
function reboot30() { return store.g('reboot30', { start: null, done: {}, notes: {} }); }
function saveReboot30(o) { store.s('reboot30', o); }
function setReboot30Start() {
  const d = $('#rbStart').value;
  if (!d) { alert('请选择开始日期'); return; }
  const o = reboot30(); o.start = d; saveReboot30(o); render();
}
function toggleReboot30(d) {
  const o = reboot30(); o.done[d] = !o.done[d]; saveReboot30(o); render();
}
function saveReboot30Note(d) {
  const o = reboot30(); o.notes[d] = $('#rbNote' + d).value; saveReboot30(o);
}
function render_reboot() {
  if ((S.rebootTab || '30') === 'p50') return render_p50();
  const o = reboot30();
  const doneCount = Object.keys(o.done).filter(k => o.done[k]).length;
  const pct = Math.round(doneCount / 30 * 100);
  const start = o.start;
  let dayIdx = null;
  if (start) {
    const diff = Math.round((new Date(today()) - new Date(start)) / 86400000) + 1;
    if (diff >= 1 && diff <= 30) dayIdx = diff;
  }
  const viewDay = (S.rebootDay && S.rebootDay >= 1 && S.rebootDay <= 30) ? S.rebootDay : (dayIdx || 1);
  const v = REBOOT30[viewDay - 1];
  const grid = REBOOT30.map(x => {
    const done = o.done[x.d];
    const isToday = x.d === dayIdx;
    const isView = x.d === viewDay;
    return `<div class="rb-cell ${done ? 'done' : ''} ${isToday ? 'today' : ''} ${isView ? 'view' : ''}" onclick="S.rebootDay=${x.d};render()">
      <div class="rb-d">D${x.d}</div>
      <div class="rb-t">${esc(x.theme)}</div>
      <div class="rb-ck">${done ? '✓' : (isToday ? '今' : '')}</div>
    </div>`;
  }).join('');
  let tip = '';
  if (start) {
    if (dayIdx >= 1 && dayIdx <= 30) tip = `今天第 ${dayIdx} 天 · 还剩 ${30 - dayIdx} 天`;
    else if (dayIdx < 1) tip = '还没到开始日';
    else tip = '30 天计划已结束 🎉';
  } else tip = '设置开始日期后，会自动标记今天是第几天';
  return `
  <div class="page-title">🔄 30天人生重启计划</div>
  <div class="page-sub">用 30 天微小行动，重启你想要的人生</div>
  <div class="subtabs">
    <button class="btn ${(S.rebootTab || '30') === '30' ? 'pink' : 'ghost'}" onclick="S.rebootTab='30';S.rebootDay=1;render()">🌱 30天计划</button>
    <button class="btn ${(S.rebootTab || '30') === 'p50' ? 'pink' : 'ghost'}" onclick="S.rebootTab='p50';render()">🔥 PROJECT 50</button>
  </div>

  <div class="card">
    <div class="row" style="justify-content:space-between">
      <div><b>第 ${doneCount} / 30 天</b> 已完成</div>
      <div class="li-sub">${pct}% 完成度</div>
    </div>
    <div class="bar"><div class="bar-fill" style="width:${pct}%"></div></div>
    <div class="row mt">
      <span class="li-sub">开始日期</span>
      <input type="date" id="rbStart" value="${start || ''}" style="max-width:170px">
      <button class="btn sm" onclick="setReboot30Start()">${start ? '重设' : '开始'}</button>
      <span class="li-sub">${tip}</span>
    </div>
  </div>

  <div class="card">
    <h3>📌 第 ${v.d} 天 · ${esc(v.theme)}</h3>
    <div class="poem-sec"><b>今日行动：</b>${esc(v.act)}</div>
    <div class="row mt">
      <button class="btn ${o.done[v.d] ? 'ghost' : 'pink'}" onclick="toggleReboot30(${v.d})">${o.done[v.d] ? '已完成 ✓（撤销）' : '打卡完成 ✓'}</button>
    </div>
    <div class="row mt">
      <input class="grow" id="rbNote${v.d}" placeholder="今日笔记（可选）" value="${esc(o.notes[v.d] || '')}" onchange="saveReboot30Note(${v.d})">
    </div>
  </div>

  <div class="card"><h3>🗓 30天总览</h3>
    <div class="rb-grid">${grid}</div>
  </div>`;
}
