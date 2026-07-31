/* ============ 记账 ============ */
const EXP_CATS = ['餐饮', '购物', '通勤', '娱乐', '居住', '医疗', '人情', '其他'];
const INC_CATS = ['工资', '理财收益', '副业', '其他'];
function render_ledger() {
  const all = store.g('ledger', []);
  const m = S.ledMonth;
  const list = all.filter(x => x.date.slice(0, 7) === m).sort((a, b) => b.date.localeCompare(a.date));
  const inc = list.filter(x => x.type === '收入').reduce((a, b) => a + b.amt, 0);
  const exp = list.filter(x => x.type === '支出').reduce((a, b) => a + b.amt, 0);
  const byCat = {};
  list.filter(x => x.type === '支出').forEach(x => byCat[x.cat] = (byCat[x.cat] || 0) + x.amt);
  return `
  <div class="page-title">🧾 记账</div>
  <div class="page-sub">每一笔都清清楚楚</div>
  <div class="card">
    <div class="row"><input type="month" value="${m}" onchange="S.ledMonth=this.value;render()"></div>
    <div class="stat-grid" style="margin-top:10px">
      <div class="stat"><div class="num" style="color:#3f9d6b">¥${inc.toFixed(0)}</div><div class="lb">本月收入</div></div>
      <div class="stat"><div class="num pk">¥${exp.toFixed(0)}</div><div class="lb">本月支出</div></div>
      <div class="stat"><div class="num">¥${(inc - exp).toFixed(0)}</div><div class="lb">本月结余</div></div>
    </div>
  </div>
  <div class="card"><h3>➕ 记一笔</h3>
    <div class="row">
      <select id="ldType" onchange="render_ledger_cats(this.value)"><option>支出</option><option>收入</option></select>
      <select id="ldCat">${EXP_CATS.map(c => `<option>${c}</option>`).join('')}</select>
      <input type="number" id="ldAmt" placeholder="金额 ¥">
    </div>
    <div class="row mt">
      <input type="date" id="ldDate" value="${today()}">
      <input class="grow" id="ldNote" placeholder="备注(选填)">
      <button class="btn" onclick="addLedger()">记账 ➕</button>
    </div>
  </div>
  ${Object.keys(byCat).length ? `<div class="card"><h3>📊 本月支出分类</h3>
    ${Object.entries(byCat).sort((a, b) => b[1] - a[1]).map(([c, v]) => {
      const pct = exp ? Math.round(v / exp * 100) : 0;
      return `<div style="margin-bottom:8px"><div class="row" style="justify-content:space-between"><span>${c}</span><span class="li-sub">¥${v.toFixed(0)} · ${pct}%</span></div><div class="bar"><i style="width:${pct}%"></i></div></div>`;
    }).join('')}</div>` : ''}
  <div class="card"><h3>本月明细（${list.length} 笔）</h3>
    ${list.map(x => `<div class="list-item"><div class="li-main">
      <span class="tag ${x.type === '收入' ? 'g' : 'p'}">${x.type}</span><span class="tag b">${x.cat}</span><b>¥${x.amt}</b>
      <div class="li-sub">${x.date}${x.note ? ' · ' + esc(x.note) : ''}</div></div>
      <button class="btn sm warn" onclick="delLedger('${x.id}')">删</button></div>`).join('') || '<div class="empty">本月还没有账目</div>'}
  </div>`;
}
function render_ledger_cats(type) {
  const cats = type === '收入' ? INC_CATS : EXP_CATS;
  $('#ldCat').innerHTML = cats.map(c => `<option>${c}</option>`).join('');
}
function addLedger() {
  const amt = +$('#ldAmt').value; if (!amt || amt <= 0) return;
  const all = store.g('ledger', []);
  all.push({ id: uid(), date: $('#ldDate').value || today(), type: $('#ldType').value, cat: $('#ldCat').value, amt, note: $('#ldNote').value.trim() });
  store.s('ledger', all); render();
}
function delLedger(id) { if (!confirm('删除这笔账？')) return; store.s('ledger', store.g('ledger', []).filter(x => x.id !== id)); render(); }

/* ============ 理财计划 ============ */
function finData() {
  return store.g('fin', { goal: 1000, budget: 3000, cat: { 餐饮: 800, 购物: 600, 通勤: 300, 娱乐: 300, 其他: 500 }, plans: [], rev: [] });
}
function render_finance() {
  const f = finData();
  const all = store.g('ledger', []);
  const m = thisMonth();
  const mList = all.filter(x => x.date.slice(0, 7) === m);
  const inc = mList.filter(x => x.type === '收入').reduce((a, b) => a + b.amt, 0);
  const exp = mList.filter(x => x.type === '支出').reduce((a, b) => a + b.amt, 0);
  const bal = inc - exp;
  const savePct = f.goal ? Math.min(100, Math.round(Math.max(0, bal) / f.goal * 100)) : 0;
  const budPct = f.budget ? Math.round(exp / f.budget * 100) : 0;
  const byCat = {};
  mList.filter(x => x.type === '支出').forEach(x => byCat[x.cat] = (byCat[x.cat] || 0) + x.amt);
  return `
  <div class="page-title">💰 理财计划</div>
  <div class="page-sub">收支可控 · 理性消费 · 稳步攒钱（联动记账数据）</div>

  <div class="card"><h3>🎯 本月目标（${m}）</h3>
    <div class="row">
      <span class="li-sub">月存钱目标</span><input type="number" value="${f.goal}" style="width:90px" onchange="setFin('goal',this.value)">
      <span class="li-sub">月支出预算</span><input type="number" value="${f.budget}" style="width:90px" onchange="setFin('budget',this.value)">
    </div>
    <div style="margin-top:12px">
      <div class="row" style="justify-content:space-between"><span>存钱进度（本月结余 ¥${bal.toFixed(0)}）</span><span class="li-sub">${savePct}% / 目标 ¥${f.goal}</span></div>
      <div class="bar"><i style="width:${savePct}%"></i></div>
    </div>
    <div style="margin-top:10px">
      <div class="row" style="justify-content:space-between"><span>预算使用（已支出 ¥${exp.toFixed(0)}）</span>
        <span class="li-sub">${budPct}% / 预算 ¥${f.budget} ${exp > f.budget ? '<span class="tag r">⚠ 已超支</span>' : ''}</span></div>
      <div class="bar"><i class="${exp > f.budget ? 'over' : ''}" style="width:${Math.min(100, budPct)}%"></i></div>
    </div>
  </div>

  <div class="card"><h3>🍱 分类消费预算</h3>
    ${Object.keys(f.cat).map(c => {
      const spent = byCat[c] || 0, bud = f.cat[c] || 0;
      const pct = bud ? Math.round(spent / bud * 100) : 0;
      return `<div style="margin-bottom:10px">
        <div class="row" style="justify-content:space-between"><span>${c} ${spent > bud && bud > 0 ? '<span class="tag r">超支 ¥' + (spent - bud).toFixed(0) + '</span>' : ''}</span>
        <span class="row"><span class="li-sub">¥${spent.toFixed(0)} /</span><input type="number" value="${bud}" style="width:70px;padding:4px 6px" onchange="setFinCat('${c}',this.value)"></span></div>
        <div class="bar"><i class="${spent > bud && bud > 0 ? 'over' : ''}" style="width:${Math.min(100, pct)}%"></i></div>
      </div>`;
    }).join('')}
  </div>

  <div class="card"><h3>🐷 攒钱计划</h3>
    <div class="row"><input class="grow" id="fpName" placeholder="计划名称(如：旅行基金)"><select id="fpType"><option>短期</option><option>中长期</option></select></div>
    <div class="row mt"><input type="number" id="fpTarget" placeholder="目标金额"><button class="btn" onclick="addFinPlan()">制定计划 ➕</button></div>
    ${f.plans.map(p => {
      const pct = p.target ? Math.min(100, Math.round(p.saved / p.target * 100)) : 0;
      return `<div style="margin:12px 0 4px">
        <div class="row" style="justify-content:space-between"><span><span class="tag ${p.type === '短期' ? 'b' : 'p'}">${p.type}</span><b>${esc(p.name)}</b></span>
        <span class="li-sub">¥${p.saved} / ¥${p.target} · ${pct}%</span></div>
        <div class="bar"><i style="width:${pct}%"></i></div>
        <div class="row mt"><input type="number" id="fpAdd_${p.id}" placeholder="本次存入 ¥" style="width:110px">
          <button class="btn sm" onclick="saveFinPlan('${p.id}')">存入 💰</button>
          <button class="btn sm warn" onclick="delFinPlan('${p.id}')">删</button></div>
      </div>`;
    }).join('') || '<div class="empty">还没有攒钱计划，定一个小目标吧～</div>'}
  </div>

  <div class="card"><h3>📝 月度理财复盘</h3>
    <textarea id="fnRev" rows="2" placeholder="本月消费习惯 / 目标完成情况复盘…"></textarea>
    <div class="row mt"><button class="btn pink" onclick="addFinRev()">保存复盘 ➕</button></div>
    ${f.rev.slice().reverse().map(r => `<div class="list-item"><div class="li-main" style="white-space:pre-wrap">${esc(r.text)}<div class="li-sub">${r.month}</div></div><button class="btn sm warn" onclick="delFinRev('${r.id}')">删</button></div>`).join('') || '<div class="empty">暂无复盘记录</div>'}
  </div>`;
}
function setFin(k, v) { const f = finData(); f[k] = Math.max(0, +v || 0); store.s('fin', f); render(); }
function setFinCat(c, v) { const f = finData(); f.cat[c] = Math.max(0, +v || 0); store.s('fin', f); render(); }
function addFinPlan() {
  const n = $('#fpName').value.trim(), t = +$('#fpTarget').value || 0; if (!n || !t) return;
  const f = finData(); f.plans.push({ id: uid(), name: n, type: $('#fpType').value, target: t, saved: 0 }); store.s('fin', f); render();
}
function saveFinPlan(id) { const f = finData(); const p = f.plans.find(x => x.id === id); const v = +$('#fpAdd_' + id).value || 0; if (p && v) p.saved += v; store.s('fin', f); render(); }
function delFinPlan(id) { if (!confirm('删除这个攒钱计划？')) return; const f = finData(); f.plans = f.plans.filter(x => x.id !== id); store.s('fin', f); render(); }
function addFinRev() { const t = $('#fnRev').value.trim(); if (!t) return; const f = finData(); f.rev.push({ id: uid(), text: t, month: thisMonth() }); store.s('fin', f); render(); }
function delFinRev(id) { const f = finData(); f.rev = f.rev.filter(x => x.id !== id); store.s('fin', f); render(); }

/* ============ 日程日历 ============ */
/* ============ 节日（公历固定 / 农历 / 移动公历 / 24节气） ============ */
const FESTIVALS = [
  { m: 1, d: 1, name: '元旦', kind: '公历' },
  { m: 2, d: 14, name: '情人节', kind: '公历' },
  { m: 3, d: 8, name: '妇女节', kind: '公历' },
  { m: 5, d: 1, name: '劳动节', kind: '公历' },
  { m: 6, d: 1, name: '儿童节', kind: '公历' },
  { m: 9, d: 10, name: '教师节', kind: '公历' },
  { m: 10, d: 1, name: '国庆节', kind: '公历' },
  { m: 12, d: 25, name: '圣诞节', kind: '公历' },
  { m: 5, nth: 2, weekday: 0, name: '母亲节', kind: '移动' },
  { m: 6, nth: 3, weekday: 0, name: '父亲节', kind: '移动' },
  { m: 1, d: 1, name: '春节', kind: '农历', lunar: true },
  { m: 1, d: 15, name: '元宵节', kind: '农历', lunar: true },
  { m: 2, d: 2, name: '龙抬头', kind: '农历', lunar: true },
  { m: 5, d: 5, name: '端午节', kind: '农历', lunar: true },
  { m: 7, d: 7, name: '七夕节', kind: '农历', lunar: true },
  { m: 7, d: 15, name: '中元节', kind: '农历', lunar: true },
  { m: 8, d: 15, name: '中秋节', kind: '农历', lunar: true },
  { m: 9, d: 9, name: '重阳节', kind: '农历', lunar: true },
  { m: 12, d: 8, name: '腊八节', kind: '农历', lunar: true },
  { m: 12, d: 23, name: '小年', kind: '农历', lunar: true }
];
/* 第 nth 个 weekday(0=日) 的公历日期 */
function nthWeekdayDate(y, m, nth, wd) {
  const first = new Date(y, m - 1, 1).getDay();
  const day = 1 + ((wd - first + 7) % 7) + (nth - 1) * 7;
  return new Date(y, m - 1, day);
}
function nextFestivalDate(f) {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  if (f.kind === '公历') {
    let t = new Date(now.getFullYear(), f.m - 1, f.d);
    if (t < now) t = new Date(now.getFullYear() + 1, f.m - 1, f.d);
    return t;
  }
  if (f.kind === '移动') {
    let t = nthWeekdayDate(now.getFullYear(), f.m, f.nth, f.weekday);
    if (t < now) t = nthWeekdayDate(now.getFullYear() + 1, f.m, f.nth, f.weekday);
    return t;
  }
  if (f.kind === '节气') {
    return new Date(f.year, f.m - 1, f.d);
  }
  // 农历
  const y0 = now.getFullYear();
  for (const y of [y0, y0 + 1]) {
    const md = SL.monthDays(y, f.m); if (md < 1) continue;
    const r = SL.lunar2solar(y, f.m, Math.min(f.d, md), false);
    if (!r) continue;
    const t = new Date(r.y, r.m - 1, r.d);
    if (t >= now) return t;
  }
  return null;
}

function render_calendar() {
  const evs = store.g('cal', []);
  const y = S.calY, m = S.calM;
  const first = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const evDates = new Set(evs.map(e => e.date));
  let cells = '<div class="cal-wd">日</div><div class="cal-wd">一</div><div class="cal-wd">二</div><div class="cal-wd">三</div><div class="cal-wd">四</div><div class="cal-wd">五</div><div class="cal-wd">六</div>';
  for (let i = 0; i < first; i++) cells += '<div></div>';
  const termMap = {};
  if (typeof SL !== 'undefined' && SL.solarTerm) { for (const t of SL.solarTerm(y)) termMap[t.month + '-' + t.day] = t.name; }
  for (let d = 1; d <= days; d++) {
    const ds = y + '-' + pad(m + 1) + '-' + pad(d);
    const L = (typeof SL !== 'undefined') ? SL.solar2lunar(y, m + 1, d) : null;
    const lunarText = L ? (L.IDayCn === '初一' ? L.IMonthCn : L.IDayCn) : '';
    let fest = termMap[(m + 1) + '-' + d] || '';
    if (!fest && L) {
      for (const f of FESTIVALS) {
        if (!f.lunar && f.m === m + 1 && f.d === d) { fest = f.name; break; }
        if (f.lunar && f.m === L.lMonth && f.d === L.lDay) { fest = f.name; break; }
      }
    }
    const sub = fest ? `<span class="cal-fest">${fest}</span>` : (lunarText ? `<span class="cal-lunar">${lunarText}</span>` : '');
    cells += `<div class="cal-day ${ds === today() ? 'today' : ''} ${ds === S.calSel ? 'sel' : ''}" onclick="S.calSel='${ds}';render()"><span class="cal-num">${d}</span>${sub}${evDates.has(ds) ? '<span class="dot"></span>' : ''}</div>`;
  }
  const dayEvs = evs.filter(e => e.date === S.calSel).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  const now = new Date(); now.setHours(0, 0, 0, 0);
  let festAll = FESTIVALS.slice();
  if (typeof SL !== 'undefined' && SL.solarTerm) {
    for (const yy of [now.getFullYear(), now.getFullYear() + 1]) {
      for (const t of SL.solarTerm(yy)) festAll.push({ name: t.name, year: t.year, m: t.month, d: t.day, kind: '节气' });
    }
  }
  const festList = festAll.map(f => { const date = nextFestivalDate(f); return { ...f, date, days: date ? Math.round((date - now) / 864e5) : null }; })
    .filter(f => f.days != null && f.days >= 0)
    .sort((a, b) => a.days - b.days);
  const festCards = festList.slice(0, 8).map(f => `
    <div class="fest-card">
      <div><div class="fest-name">${f.name}<span class="fest-kind ${f.kind === '节气' ? 'term' : (f.kind === '农历' ? 'lun' : '')}">${f.kind}</span></div><div class="fest-date">${f.date.getFullYear()}-${pad(f.date.getMonth() + 1)}-${pad(f.date.getDate())}</div></div>
      <div class="fest-days">${f.days === 0 ? '今天 🎉' : (f.days < 0 ? '已过' : f.days + ' 天后')}</div>
    </div>`).join('');
  return `
  <div class="page-title">📅 日程日历</div>
  <div class="page-sub">安排在手，心中不慌 · 农历与节日已标注</div>
  <div class="card">
    <div class="row" style="justify-content:space-between">
      <button class="btn sm ghost" onclick="calNav(-1)">◀ 上月</button>
      <b>${y} 年 ${m + 1} 月</b>
      <button class="btn sm ghost" onclick="calNav(1)">下月 ▶</button>
    </div>
    <div class="cal-grid" style="margin-top:10px">${cells}</div>
    <div class="cal-legend"><span class="cal-fest">粉字</span> 节日 / 节气 · <span class="cal-lunar">小字</span> 农历日期</div>
  </div>
  <div class="card"><h3>🏮 传统节日提醒</h3>${festCards || '<div class="empty">暂无</div>'}</div>
  <div class="card"><h3>📌 ${S.calSel} 的日程</h3>
    <div class="row"><input type="time" id="cvTime"><input class="grow" id="cvText" placeholder="日程内容…"><button class="btn" onclick="addCal()">添加 ➕</button></div>
    ${dayEvs.map(e => `<div class="list-item"><div class="li-main">${e.time ? '<span class="tag b">' + e.time + '</span>' : ''}${esc(e.text)}</div><button class="btn sm warn" onclick="delCal('${e.id}')">删</button></div>`).join('') || '<div class="empty">当天暂无日程</div>'}
  </div>`;
}
function calNav(d) {
  let m = S.calM + d, y = S.calY;
  if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; }
  S.calM = m; S.calY = y; render();
}
function addCal() {
  const t = $('#cvText').value.trim(); if (!t) return;
  const evs = store.g('cal', []);
  evs.push({ id: uid(), date: S.calSel, time: $('#cvTime').value, text: t });
  store.s('cal', evs); render();
}
function delCal(id) { store.s('cal', store.g('cal', []).filter(x => x.id !== id)); render(); }

/* ============ 周复盘 & 月复盘 ============ */
const WEEK_FIELDS = ['本周工作总结', '学习进度', '生活收获', '运动计划执行情况', '理财消费情况', '存在问题', '下周改进计划', '下周核心目标'];
const MONTH_FIELDS = ['月度工作成果', '技能学习进度', '运动计划落地情况', '理财预算执行与收支总结', '个人成长亮点', '月度不足', '下月规划与目标'];
function renderReview(kind) {
  const isW = kind === 'weekly';
  const fields = isW ? WEEK_FIELDS : MONTH_FIELDS;
  const key = isW ? 'weekly' : 'monthly';
  const label = isW ? isoWeek(today()) : thisMonth();
  const recs = store.g(key, []);
  return `
  <div class="page-title">${isW ? '🗓️ 周复盘' : '🌙 月复盘'}</div>
  <div class="page-sub">${isW ? '每周自我迭代，越来越好' : '月度全方位复盘，长期成长追踪'}</div>
  <div class="card"><h3>📝 新建复盘（${label}）</h3>
    ${fields.map((f, i) => `<div class="rev-field"><label>${f}</label><textarea id="rv_${i}" rows="2" placeholder="写下${f}…"></textarea></div>`).join('')}
    <button class="btn" onclick="saveReview('${key}','${label}')">保存本${isW ? '周' : '月'}复盘 ✔</button>
  </div>
  <div class="card"><h3>📚 历史复盘归档（${recs.length}）</h3>
    ${recs.slice().reverse().map(r => `<details class="rev-item"><summary>${r.label} <span class="li-sub">${r.date}</span></summary>
      <div class="rev-view">${fields.map(f => r.data[f] ? `<b>${f}</b>${esc(r.data[f])}` : '').join('')}</div>
      <div class="row mt"><button class="btn sm warn" onclick="delReview('${key}','${r.id}')">删除这份复盘</button></div>
    </details>`).join('') || '<div class="empty">暂无历史复盘</div>'}
  </div>`;
}
function render_weekly() { return renderReview('weekly'); }
function render_monthly() { return renderReview('monthly'); }
function saveReview(key, label) {
  const fields = key === 'weekly' ? WEEK_FIELDS : MONTH_FIELDS;
  const data = {}; let has = false;
  fields.forEach((f, i) => { const v = $('#rv_' + i).value.trim(); data[f] = v; if (v) has = true; });
  if (!has) return;
  const recs = store.g(key, []);
  recs.push({ id: uid(), label, date: today(), data });
  store.s(key, recs); render();
}
function delReview(key, id) { if (!confirm('删除这份复盘？')) return; store.s(key, store.g(key, []).filter(x => x.id !== id)); render(); }

/* ============ 开屏 & 初始化 ============ */
function initSplash() {
  const d = new Date();
  const wd = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][d.getDay()];
  $('#spDate').textContent = d.getFullYear() + ' 年 ' + (d.getMonth() + 1) + ' 月 ' + d.getDate() + ' 日 · ' + wd;
  let qi = Math.floor(Math.random() * QUOTES.length);
  const setQ = () => { $('#spQuote').style.opacity = 0; setTimeout(() => { $('#spQuote').textContent = QUOTES[qi % QUOTES.length]; $('#spQuote').style.opacity = 1; qi++; }, 350); };
  $('#spQuote').textContent = QUOTES[qi % QUOTES.length]; qi++;
  const timer = setInterval(setQ, 4000);
  $('#spEnter').onclick = () => { clearInterval(timer); $('#splash').style.display = 'none'; go('home'); render(); };
}
(function init() {
  /* 每日登录自动打卡 */
  const ci = store.g('checkin', []);
  if (!ci.includes(today())) { ci.push(today()); store.s('checkin', ci); }
  initSplash();
  render();
})();
