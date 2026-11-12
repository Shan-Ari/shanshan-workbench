/* ============ 记账 · 多账本（按参考模板重做） ============ */
const LED_BOOK_ICONS = ['📒', '💰', '🏦', '💳', '🐷', '🎯', '🏠', '💼', '🧾', '✈️'];
const LED_BOOK_COLORS = ['#cdc1ff', '#c6e7ff', '#ffc5c5', '#a0d683', '#feee91', '#ffc96f', '#f975aa', '#a8df8e', '#618264', '#d4f6ff'];
const LED_CATS = [
  ['餐饮', '🍚', '#FFE0D2'], ['水果', '🍉', '#FFE9C9'], ['零食', '🍪', '#FFE3E0'],
  ['美妆', '💄', '#F9DCE8'], ['烟酒', '🍺', '#E8E2FF'], ['日常', '🏠', '#DDEBFF'],
  ['购物', '🛍️', '#FFDCE6'], ['交通', '🚦', '#D9EFE3'], ['娱乐', '🎮', '#E3E0FF'],
  ['社交', '🤝', '#FFE7CF'], ['装修', '🔨', '#E6E2DC'], ['旅游', '🧭', '#D9EEF7'],
  ['医疗', '🩺', '#FFDCD9'], ['学习', '📚', '#E4E9FF'], ['其他', '🧩', '#ECE6F5']
];
const LED_INC_CATS = [
  ['工资', '💰', '#D9EFE3'], ['理财', '📈', '#DDEBFF'], ['副业', '💡', '#FFE9C9'],
  ['红包', '🧧', '#FFDCD9'], ['其他', '🧩', '#ECE6F5']
];

function ledBooks() {
  const b = store.g('ledBooks', null);
  if (b && b.length) return b;
  return [
    { id: 'default', name: '总览', icon: '📒', color: '#cdc1ff' },
    { id: 'debt', name: '负债', icon: '💳', color: '#ffc5c5' }
  ];
}
function ledCurBook() {
  const id = store.g('ledCurBook', 'default');
  return ledBooks().find(b => b.id === id) || ledBooks()[0];
}
function ledSetBook(id) { store.s('ledCurBook', id); S.ledBookOpen = false; S.ledView = 'main'; render(); }
function ledAllRecords() { return store.g('ledger', []); }
function ledRecords() {
  const id = ledCurBook().id;
  return ledAllRecords().filter(x => (x.bookId || 'default') === id);
}
function ledBookBalance(id) {
  return ledAllRecords().filter(x => (x.bookId || 'default') === id)
    .reduce((s, x) => s + (x.type === '收入' ? x.amt : x.type === '支出' ? -x.amt : 0), 0);
}
function ledMonthList() {
  const m = S.ledMonth || thisMonth();
  return ledRecords().filter(x => x.date.slice(0, 7) === m).sort((a, b) => b.date.localeCompare(a.date));
}
function ledBookAcctTotal() {
  const bal = ledAccounts().reduce((s, a) => s + (+a.init || 0), 0);
  return bal + ledBookBalance(ledCurBook().id);
}
function ledNavBar() {
  const tabs = [['main', '🧾 账单'], ['cal', '📅 日历']];
  const cur = S.ledTab || 'main';
  return `<div class="ld-nav">${tabs.map(t => `<button class="ld-nav-btn ${cur === t[0] ? 'on' : ''}" onclick="S.ledTab='${t[0]}';S.ledView='main';render()">${t[1]}</button>`).join('')}</div>`;
}
function ledShell(inner, bare) {
  if (bare) return `<div class="led-page">${inner}${ledDrawerHtml()}</div>`;
  const b = ledCurBook();
  return `<div class="led-page">
    <div class="ld-top">
      <button class="ld-book-btn" onclick="S.ledBookOpen=true;render()"><span class="ld-book-ic" style="background:${b.color}">${b.icon}</span>${esc(b.name)} ▾</button>
      <div class="ld-month"><button onclick="ledShiftMonth(-1)">‹</button><b>${(S.ledMonth || thisMonth()).replace('-', ' 年 ')} 月</b><button onclick="ledShiftMonth(1)">›</button></div>
      <button class="ld-tool" onclick="S.ledView='books';render()">⚙</button>
    </div>
    ${inner}${ledDrawerHtml()}</div>`;
}
function ledShiftMonth(d) {
  const m = S.ledMonth || thisMonth();
  const dt = new Date(+m.slice(0, 4), +m.slice(5, 7) - 1 + d, 1);
  S.ledMonth = dt.getFullYear() + '-' + pad(dt.getMonth() + 1);
  render();
}

/* ---------- 账本抽屉（图 1） ---------- */
function ledDrawerHtml() {
  if (!S.ledBookOpen) return '';
  const books = ledBooks(), all = ledAllRecords(), cur = ledCurBook().id;
  const inc = all.filter(x => x.type === '收入').reduce((s, x) => s + x.amt, 0);
  const exp = all.filter(x => x.type === '支出').reduce((s, x) => s + x.amt, 0);
  return `<div class="ld-mask" onclick="S.ledBookOpen=false;render()"></div>
  <div class="ld-drawer">
    <div class="ld-drawer-head"><b>总账本</b><button onclick="S.ledView='books';S.ledBookOpen=false;render()">🔧</button></div>
    <div class="ld-drawer-stats">
      <div><b>${all.length}</b><span>笔数</span></div>
      <div><b>${inc.toFixed(2)}</b><span>收入</span></div>
      <div><b>${exp.toFixed(2)}</b><span>支出</span></div>
    </div>
    <div class="ld-group-title">👤 个人账本 <span>${books.length}</span></div>
    <div class="ld-book-list">${books.map(b => `<div class="ld-book-card ${cur === b.id ? 'on' : ''}" onclick="ledSetBook('${b.id}')">
      <span class="ld-book-ic lg" style="background:${b.color}">${b.icon}</span>
      <span class="ld-book-name">${esc(b.name)}</span>
      <span class="ld-book-bal"><i>结余</i><b>${ledBookBalance(b.id).toFixed(2)}</b></span>
    </div>`).join('')}</div>
    <button class="ld-book-manage" onclick="S.ledView='books';S.ledBookOpen=false;render()">¥ 账本管理</button>
  </div>`;
}
/* ---------- 账本管理 ---------- */
function ledBooksHtml() {
  const books = ledBooks();
  return `<div class="ld-subhead"><button class="ld-back" onclick="S.ledView='main';render()">‹</button><b>账本管理</b></div>
  <div class="ld-card">
    <div class="ld-card-title">我的账本（${books.length}）</div>
    ${books.map(b => `<div class="ld-book-row">
      <span class="ld-book-ic" style="background:${b.color}">${b.icon}</span>
      <input value="${esc(b.name)}" onchange="ledRenameBook('${b.id}',this.value)">
      <button class="ld-mini" onclick="ledCycleBook('${b.id}','icon')">换图标</button>
      <button class="ld-mini" onclick="ledCycleBook('${b.id}','color')">换色</button>
      ${books.length > 1 ? `<button class="ld-mini warn" onclick="ledDelBook('${b.id}')">删</button>` : ''}
    </div>`).join('')}
    <div class="ld-add-book">
      <input id="ldNewBook" placeholder="新账本名称，如：旅行 / 副业">
      <button onclick="ledAddBook()">＋ 新建账本</button>
    </div>
  </div>
  <div class="ld-card"><div class="ld-card-title">说明</div>
    <div class="li-sub">切换账本后，账单、统计与日历都只显示该账本的记录；旧记录自动归入「总览」。还款与其他管理暂为全账本共用。</div>
  </div>`;
}
function ledRenameBook(id, v) {
  const b = ledBooks(), x = b.find(y => y.id === id);
  if (x && v && v.trim()) { x.name = v.trim(); store.s('ledBooks', b); }
  render();
}
function ledCycleBook(id, key) {
  const b = ledBooks(), x = b.find(y => y.id === id); if (!x) return;
  const arr = key === 'icon' ? LED_BOOK_ICONS : LED_BOOK_COLORS;
  x[key] = arr[(arr.indexOf(x[key]) + 1) % arr.length];
  store.s('ledBooks', b); render();
}
function ledAddBook() {
  const el = document.getElementById('ldNewBook');
  const v = el ? el.value.trim() : '';
  if (!v) { alert('请填写账本名称'); return; }
  const b = ledBooks();
  b.push({ id: uid(), name: v, icon: LED_BOOK_ICONS[b.length % LED_BOOK_ICONS.length], color: LED_BOOK_COLORS[b.length % LED_BOOK_COLORS.length] });
  store.s('ledBooks', b); render();
}
function ledDelBook(id) {
  const b = ledBooks(); if (b.length <= 1) return;
  if (!confirm('删除这个账本？账本里的记录会保留并移入「总览」。')) return;
  store.s('ledBooks', b.filter(x => x.id !== id));
  const all = ledAllRecords();
  all.forEach(x => { if ((x.bookId || 'default') === id) x.bookId = 'default'; });
  store.s('ledger', all);
  if (store.g('ledCurBook', 'default') === id) store.s('ledCurBook', 'default');
  render();
}

/* ---------- 记账主页 ---------- */
function ledMainHtml() {
  const list = ledMonthList();
  const inc = list.filter(x => x.type === '收入').reduce((s, x) => s + x.amt, 0);
  const exp = list.filter(x => x.type === '支出').reduce((s, x) => s + x.amt, 0);
  const byCat = {};
  list.filter(x => x.type === '支出').forEach(x => byCat[x.cat] = (byCat[x.cat] || 0) + x.amt);
  const days = {};
  list.forEach(x => { (days[x.date] = days[x.date] || []).push(x); });
  const dates = Object.keys(days).sort((a, b) => b.localeCompare(a));
  return `<div class="ld-summary">
    <div class="ld-summary-label">本月结余</div>
    <div class="ld-summary-main">¥${(inc - exp).toFixed(2)}</div>
    <div class="ld-summary-row"><span>收入 <b>¥${inc.toFixed(2)}</b></span><span>支出 <b>¥${exp.toFixed(2)}</b></span></div>
    <div class="ld-summary-row"><span>笔数 <b>${list.length}</b></span><span>账本余额 <b>¥${ledBookAcctTotal().toFixed(2)}</b></span></div>
  </div>
  <button class="ld-add-btn" onclick="${ldIsDebtBook() ? "S.ledView='debt';render()" : "S.ledView='add';S.ledType='支出';S.ledAmt='';render()"}">${ldIsDebtBook() ? '＋ 新增借入 / 借出' : '＋ 记一笔'}</button>
  ${ledQuickEntries()}
  ${Object.keys(byCat).length ? `<div class="ld-card"><div class="ld-card-title">本月支出分类</div>
    ${Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([c, v]) => `<div class="ld-cat-bar"><span>${esc(c)}</span><div class="ld-track"><i style="width:${exp ? Math.round(v / exp * 100) : 0}%"></i></div><b>¥${v.toFixed(0)}</b></div>`).join('')}</div>` : ''}
  <div class="ld-card"><div class="ld-card-title">每日明细（${list.length} 笔）</div>
    ${dates.length ? dates.map(d => {
      const items = days[d].slice().sort((a, b) => (b.id || '').localeCompare(a.id || ''));
      const de = items.filter(x => x.type === '支出').reduce((s, x) => s + x.amt, 0);
      const di = items.filter(x => x.type === '收入').reduce((s, x) => s + x.amt, 0);
      const wd = WD_SHORT[new Date(d + 'T00:00:00').getDay()];
      S.ledOpen = S.ledOpen || {};
      const open = (d === today()) ? (S.ledOpen[d] !== false) : !!S.ledOpen[d];
      return `<div class="ld-day">
        <div class="ld-day-head" onclick="toggleLedDay('${d}')"><span>${d.slice(5)} <i>周${wd}</i></span>
          <span>支出 <b>¥${de.toFixed(0)}</b>${di ? ` · 收入 <b>¥${di.toFixed(0)}</b>` : ''} <i>${open ? '▾' : '▸'}</i></span></div>
        <div class="ld-day-body" style="display:${open ? 'block' : 'none'}">${items.map(x => `<div class="ld-item">
          <span class="ld-item-tag ${x.type === '收入' ? 'inc' : ''}">${esc(x.cat)}</span>
          <span class="ld-item-note">${esc(x.note || '')}</span>
          <b class="${x.type === '收入' ? 'inc' : ''}">${x.type === '收入' ? '+' : '-'}¥${(+x.amt).toFixed(2)}</b>
          <button class="ld-del" onclick="delLedger('${x.id}')">删</button></div>`).join('')}</div>
      </div>`;
    }).join('') : '<div class="ld-empty">本月还没有账目，点上方「记一笔」开始吧～</div>'}
  </div>`;
}
function toggleLedDay(d) {
  S.ledOpen = S.ledOpen || {};
  const open = (d === today()) ? (S.ledOpen[d] !== false) : !!S.ledOpen[d];
  S.ledOpen[d] = !open;
  render();
}

/* ---------- 记一笔：分类图标 + 数字键盘（图 10） ---------- */
function ledCats() { return (S.ledType === '收入') ? LED_INC_CATS : LED_CATS; }
function ledAmount() { return S.ledAmt || '0'; }
function ledKey(k) {
  let s = S.ledAmt || '';
  if (k === 'del') s = s.slice(0, -1);
  else if (k === 'clear') s = '';
  else if (k === '.') { if (!s.includes('.')) s = (s || '0') + '.'; }
  else { if (s.includes('.') && s.split('.')[1].length >= 2) return; if (s === '0') s = ''; s += k; }
  S.ledAmt = s; render();
}
function ledSave(again) {
  const amt = +(S.ledAmt || 0);
  if (!amt) { alert('请输入金额'); return; }
  const all = ledAllRecords(), bookId = ledCurBook().id;
  const names = ledAccounts().map(a => a.name);
  const date = S.ledDate || today(), acct = names.includes(S.ledAcct) ? S.ledAcct : (names[0] || '');
  if (S.ledType === '转账') {
    const to = names.includes(S.ledToAcct) ? S.ledToAcct : (names[1] || names[0] || '');
    all.push({ id: uid(), date: date, type: '支出', cat: '转账', amt: amt, note: '转出至 ' + to, acct: acct, bookId: bookId });
    all.push({ id: uid(), date: date, type: '收入', cat: '转账', amt: amt, note: '从 ' + acct + ' 转入', acct: to, bookId: bookId });
  } else {
    all.push({ id: uid(), date: date, type: S.ledType || '支出', cat: S.ledCat || '其他', amt: amt, note: (S.ledNote || '').trim(), acct: acct, bookId: bookId });
  }
  store.s('ledger', all);
  S.ledAmt = ''; S.ledNote = ''; S.ledView = again ? 'add' : 'main';
  if (!again) S.ledTab = 'main';
  render();
}
function ledAddHtml() {
  const type = S.ledType || '支出';
  const cats = type === '转账' ? [] : ledCats();
  const keys = [['1', '1'], ['2', '2'], ['3', '3'], ['⌫', 'del'], ['4', '4'], ['5', '5'], ['6', '6'], ['清空', 'clear'], ['7', '7'], ['8', '8'], ['9', '9'], ['保存', 'save'], ['再记', 'again'], ['0', '0'], ['.', '.']];
  return `<div class="ld-add-head">
    <button class="ld-back" onclick="S.ledView='main';render()">‹</button>
    <div class="ld-type-tabs">${[['支出', '支出'], ['收入', '收入'], ['转账', '转账']].map(t => `<button class="${type === t[0] ? 'on' : ''}" onclick="S.ledType='${t[0]}';S.ledCat='';render()">${t[0]}</button>`).join('')}</div>
    <button class="ld-tool" onclick="S.ledView='books';render()">⚙</button>
  </div>
  ${type === '转账' ? `<div class="ld-card ld-transfer">
    <div class="ld-card-title">账户互转</div>
    <div class="row"><select onchange="S.ledAcct=this.value">${ldAcctOpts(S.ledAcct || (ledAccounts()[0] || {}).name)}</select>
      <span>→</span><select onchange="S.ledToAcct=this.value">${ldAcctOpts(S.ledToAcct || (ledAccounts()[1] || {}).name)}</select></div>
  </div>` : `<div class="ld-cat-grid">${cats.map(c => `<button class="ld-cat ${S.ledCat === c[0] ? 'on' : ''}" onclick="S.ledCat='${c[0]}';render()">
    <span class="ld-cat-ic" style="background:${c[2]}">${c[1]}</span><i>${c[0]}</i></button>`).join('')}</div>`}
  <div class="ld-input-line"><input id="ldNote" placeholder="点击输入备注或分类名" value="${esc(S.ledNote || '')}" oninput="S.ledNote=this.value"><b>¥${ledAmount()}</b></div>
  <div class="ld-tag-row">
    <span>📒 ${esc(ledCurBook().name)}</span>
    <input type="date" value="${S.ledDate || today()}" onchange="S.ledDate=this.value">
    <select onchange="S.ledAcct=this.value">${ldAcctOpts(S.ledAcct || (ledAccounts()[0] || {}).name)}</select>
  </div>
  <div class="ld-keypad">${keys.map(k => `<button class="ld-key ${k[1] === 'save' ? 'save' : ''} ${k[1] === 'again' ? 'again' : ''}" onclick="${k[1] === 'save' ? 'ledSave(false)' : k[1] === 'again' ? 'ledSave(true)' : `ledKey('${k[1]}')`}">${k[0]}</button>`).join('')}</div>`;
}

/* ---------- 日历月视图（图 5） ---------- */
function ledLunarDay(y, m, d) {
  try { const l = SL.solar2lunar(y, m, d); return l.IDayCn === '初一' ? l.IMonthCn : l.IDayCn; }
  catch (e) { return ''; }
}
function ledCalHtml() {
  const m = S.ledMonth || thisMonth();
  const y = +m.slice(0, 4), mo = +m.slice(5, 7);
  const first = new Date(y, mo - 1, 1).getDay(), days = new Date(y, mo, 0).getDate();
  const recs = ledRecords().filter(x => x.date.slice(0, 7) === m);
  const byDate = {};
  recs.forEach(x => {
    const o = byDate[x.date] || (byDate[x.date] = { exp: 0, inc: 0, items: [] });
    o.items.push(x); if (x.type === '支出') o.exp += x.amt; else o.inc += x.amt;
  });
  const inc = recs.filter(x => x.type === '收入').reduce((s, x) => s + x.amt, 0);
  const exp = recs.filter(x => x.type === '支出').reduce((s, x) => s + x.amt, 0);
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const dnum = i - first + 1;
    if (dnum < 1 || dnum > days) { cells.push('<div class="ld-cal-cell out"></div>'); continue; }
    const ds = y + '-' + pad(mo) + '-' + pad(dnum);
    const o = byDate[ds];
    const sel = (S.ledCalSel || today()) === ds;
    cells.push(`<div class="ld-cal-cell ${sel ? 'sel' : ''} ${ds === today() ? 'today' : ''}" onclick="S.ledCalSel='${ds}';render()">
      <b>${dnum}</b><i>${ledLunarDay(y, mo, dnum)}</i>${o && o.exp ? '<span class="ld-flag"></span>' : ''}</div>`);
  }
  const selDs = S.ledCalSel || today(), selO = byDate[selDs];
  return `<div class="ld-card ld-cal">
    <div class="ld-cal-wd">${['日', '一', '二', '三', '四', '五', '六'].map(w => `<span>${w}</span>`).join('')}</div>
    <div class="ld-cal-grid">${cells.join('')}</div>
    <div class="ld-cal-foot"><span>月结余 <b>¥${(inc - exp).toFixed(2)}</b></span><span>日均支出 <b>¥${(exp / Math.max(1, days)).toFixed(2)}</b></span></div>
  </div>
  <div class="ld-card"><div class="ld-card-title">${selDs.slice(5)} · 当日账单</div>
    ${selO ? selO.items.map(x => `<div class="ld-item"><span class="ld-item-tag ${x.type === '收入' ? 'inc' : ''}">${esc(x.cat)}</span>
      <span class="ld-item-note">${esc(x.note || '')}</span><b class="${x.type === '收入' ? 'inc' : ''}">${x.type === '收入' ? '+' : '-'}¥${(+x.amt).toFixed(2)}</b>
      <button class="ld-del" onclick="delLedger('${x.id}')">删</button></div>`).join('') : '<div class="ld-empty">这天还没有账目</div>'}
  </div>`;
}

/* ============ 记账 · 负债 / 资产 / 存钱 / 购物（参考模板） ============ */
const LED_DEF_ACCTS = [
  { name: '微信', icon: '💬', color: '#5FBF6A' },
  { name: '邮政储蓄银行', icon: '🏦', color: '#4E9E5C' },
  { name: '支付宝', icon: '🅰️', color: '#3FA8E8' },
  { name: '工商银行', icon: '🏛️', color: '#D9584E' },
  { name: '招商银行', icon: '🏧', color: '#D9484E' },
  { name: '建设银行', icon: '🏦', color: '#2E5FB8' }
];
const LED_PLAN_TYPES = [
  { id: '12m', name: '12月存钱', per: 1000, count: 12, step: false, icon: '12' },
  { id: '52w', name: '52周存钱', per: 10, count: 52, step: true, icon: '52' },
  { id: '365d', name: '365天存钱', per: 1, count: 365, step: true, icon: '365' },
  { id: 'fixed', name: '定额存钱', per: 100, count: 12, step: false, icon: '🔒' },
  { id: 'free', name: '自由存钱', per: 0, count: 0, step: false, icon: '🔓' }
];
const LDM = n => { const v = (+n || 0).toFixed(2); const q = v.split('.'); return q[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + q[1]; };
function ldF() { return S.ldForm || (S.ldForm = {}); }
function ldIsDebtBook() { const b = ledCurBook(); return b.id === 'debt' || b.kind === 'debt'; }
function ldAcctOpts(cur) {
  return ledAccounts().map(a => `<option value="${esc(a.name)}" ${cur === a.name ? 'selected' : ''}>${esc(a.name)}</option>`).join('');
}
function ldAcct(name) { return ledAccounts().find(a => a.name === name) || { icon: '💳', color: '#cdc1ff' }; }

/* ---------- 账户（所有资金动作都写 ledger，余额自动联动） ---------- */
function ledAccounts() {
  const a = store.g('ledAccounts', null);
  if (a && a.length) return a;
  const base = store.g('acctBase', {});
  return LED_DEF_ACCTS.map(x => Object.assign({}, x, { init: +base[x.name] || 0 }));
}
function ledSaveAccounts(a) { store.s('ledAccounts', a); }
function ledAcctBal(name) {
  const a = ledAccounts().find(x => x.name === name);
  const init = a ? (+a.init || 0) : 0;
  return init + ledAllRecords().reduce((s, x) => s + (x.acct === name ? (x.type === '收入' ? x.amt : x.type === '支出' ? -x.amt : 0) : 0), 0);
}
function ledTotalAssets() { return ledAccounts().reduce((s, a) => s + ledAcctBal(a.name), 0); }
function ldPush(o) {
  const all = ledAllRecords();
  all.push(Object.assign({ id: uid(), date: today(), bookId: ledCurBook().id }, o));
  store.s('ledger', all);
}

/* ---------- 借入 / 借出（本金与利息分开记录） ---------- */
function ledDebts() { return store.g('ledDebts', []); }
function ledSaveDebts(a) { store.s('ledDebts', a); }
function ledDebtTotal(d) { return (+d.principal || 0) + (+d.interest || 0); }
function ledDebtPaid(d) {
  const l = d.logs || [];
  return {
    principal: l.reduce((s, x) => s + (+x.principal || 0), 0),
    interest: l.reduce((s, x) => s + (+x.interest || 0), 0)
  };
}
function ledDebtRemain(d) {
  const p = ledDebtPaid(d);
  return Math.max(0, ledDebtTotal(d) - p.principal - p.interest);
}
function ledDebtLiability() {
  return ledDebts().filter(d => d.kind === 'in' && d.countInTotal !== false).reduce((s, d) => s + ledDebtRemain(d), 0);
}
function ledDebtLent() {
  return ledDebts().filter(d => d.kind === 'out').reduce((s, d) => s + ledDebtRemain(d), 0);
}
function ledDebtKind() { return S.ledDebtKind || 'in'; }
function ledDebtOpen(kind) {
  S.ledDebtKind = kind; S.ledView = 'debt'; S.ldForm = {}; render();
}
function ledDebtAdd(kind, appendId) {
  S.ledDebtKind = kind || 'in'; S.ledDebtAppend = appendId || null;
  const d = appendId ? ledDebts().find(x => x.id === appendId) : null;
  S.ldForm = d ? { person: d.person, acct: d.acct, countInTotal: d.countInTotal !== false } : {};
  S.ledView = 'debtAdd'; render();
}
function ledDebtSave() {
  const f = ldF(), person = (f.person || '').trim();
  const principal = +f.principal || 0;
  if (!person || !principal) { alert('请填写对方名称和借款本金'); return; }
  const interest = +f.interest || 0;
  const kind = ledDebtKind(), date = f.date || today();
  const acct = f.acct || (ledAccounts()[0] || {}).name || '';
  const arr = ledDebts();
  if (S.ledDebtAppend) {
    const d = arr.find(x => x.id === S.ledDebtAppend);
    if (d) { d.principal = (+d.principal || 0) + principal; d.interest = (+d.interest || 0) + interest; }
    S.ledDebtAppend = null;
  } else {
    arr.push({
      id: uid(), kind: kind, person: person, principal: principal, interest: interest,
      date: date, dueDate: f.dueDate || '', acct: acct, bookId: 'debt',
      countInTotal: f.countInTotal !== false, note: f.note || '', logs: []
    });
  }
  ledSaveDebts(arr);
  ldPush({
    date: date, type: kind === 'in' ? '收入' : '支出', cat: kind === 'in' ? '借入' : '借出',
    amt: principal, note: person + ' · 本金', acct: acct, bookId: 'debt', src: 'debt'
  });
  S.ledView = 'debt'; S.ldForm = {}; render();
}
function ledDebtDetail(id) { S.ledDebtId = id; S.ledView = 'debtDetail'; render(); }
function ledDebtRepayOpen(id) { S.ledDebtId = id; S.ldForm = {}; S.ledView = 'debtRepay'; render(); }
function ledDebtRepaySave() {
  const arr = ledDebts(), d = arr.find(x => x.id === S.ledDebtId); if (!d) return;
  const f = ldF(), p = +f.principal || 0, it = +f.interest || 0;
  if (!p && !it) { alert('请填写还款金额或利息'); return; }
  const date = f.date || today(), acct = f.acct || d.acct;
  d.logs = d.logs || [];
  d.logs.push({ id: uid(), date: date, principal: p, interest: it, acct: acct, note: f.note || '' });
  ledSaveDebts(arr);
  if (p) ldPush({ date: date, type: '支出', cat: '还款', amt: p, note: d.person + ' · 本金', acct: acct, bookId: 'debt', src: 'debtRepay' });
  if (it) ldPush({ date: date, type: '支出', cat: '利息支出', amt: it, note: d.person + ' · 利息', acct: acct, bookId: 'debt', src: 'debtRepay' });
  S.ledView = 'debtDetail'; S.ldForm = {}; render();
}
function ledDebtDel(id) {
  if (!confirm('删除这笔借入/借出记录？')) return;
  ledSaveDebts(ledDebts().filter(x => x.id !== id));
  S.ledView = 'debt'; render();
}
function ledDebtList() { return ledDebts().filter(d => d.kind === ledDebtKind()).slice().reverse(); }

/* ---------- 存钱计划 ---------- */
function ledPlans() { return store.g('ledSavePlans', []); }
function ledSavePlans(a) { store.s('ledSavePlans', a); }
function ledPlanItems(p) {
  const n = +p.count || 0; if (!n) return [];
  const arr = [], base = new Date((p.start || today()) + 'T00:00:00');
  for (let i = 1; i <= n; i++) {
    const amt = p.step ? (+p.per || 0) * i : (+p.per || 0);
    const d = new Date(base);
    if (p.type === '52w') d.setDate(d.getDate() + 7 * (i - 1));
    else if (p.type === '365d') d.setDate(d.getDate() + (i - 1));
    else d.setMonth(d.getMonth() + (i - 1));
    arr.push({ i: i, amt: amt, date: fmt(d) });
  }
  return arr;
}
function ledPlanLogs(p) { return p.logs || []; }
function ledPlanSaved(p) { return ledPlanLogs(p).reduce((s, x) => s + (+x.amt || 0), 0); }
function ledPlanTotal(p) {
  const t = LED_PLAN_TYPES.find(x => x.id === p.type);
  if (p.type === 'free') return +p.target || 0;
  const n = +p.count || 0;
  return p.step ? (+p.per || 0) * n * (n + 1) / 2 : (+p.per || 0) * n;
}
function ledPlanCreate(typeId) {
  const t = LED_PLAN_TYPES.find(x => x.id === typeId) || LED_PLAN_TYPES[4];
  S.ldForm = { name: t.name, type: t.id, per: t.per, count: t.count, step: !!t.step, target: 0, start: today(), from: (ledAccounts()[0] || {}).name || '', to: (ledAccounts()[1] || {}).name || '' };
  S.ledPlanEditing = null; S.ledPlanForm = true; render();
}
function ledPlanSave() {
  const f = ldF(), name = (f.name || '').trim();
  if (!name) { alert('请填写计划名称'); return; }
  const arr = ledPlans();
  const obj = {
    id: S.ledPlanEditing || uid(), name: name, type: f.type || 'free',
    per: +f.per || 0, count: +f.count || 0, step: !!f.step, target: +f.target || 0,
    start: f.start || today(), from: f.from || '', to: f.to || '', logs: []
  };
  if (obj.type === 'free') { obj.count = 0; obj.step = false; }
  const i = arr.findIndex(x => x.id === obj.id);
  if (i >= 0) { obj.logs = arr[i].logs || []; arr[i] = obj; } else arr.push(obj);
  ledSavePlans(arr);
  S.ledPlanForm = false; S.ledPlanEditing = null; S.ldForm = {}; render();
}
function ledPlanOpen(id) { S.ledPlanId = id; S.ledPlanTab = 'todo'; S.ledView = 'saveDetail'; render(); }
function ledPlanDel(id) {
  if (!confirm('删除这个存钱计划？')) return;
  ledSavePlans(ledPlans().filter(x => x.id !== id));
  S.ledView = 'save'; render();
}
function ledDepositOpen(item) {
  S.ldForm = { amt: item ? item.amt : '', date: today() };
  S.ledDepositItem = item ? item.i : null;
  S.ledDeposit = true; render();
}
function ledDepositSave() {
  const arr = ledPlans(), p = arr.find(x => x.id === S.ledPlanId); if (!p) return;
  const f = ldF(), amt = +f.amt || 0;
  if (!amt) { alert('请填写存入金额'); return; }
  const date = f.date || today();
  const from = f.from || p.from || (ledAccounts()[0] || {}).name;
  const to = f.to || p.to || (ledAccounts()[1] || {}).name;
  p.logs = p.logs || [];
  p.logs.push({ id: uid(), date: date, amt: amt, item: S.ledDepositItem, from: from, to: to, note: f.note || '' });
  ledSavePlans(arr);
  ldPush({ date: date, type: '支出', cat: '存钱', amt: amt, note: p.name + ' · 转出', acct: from, src: 'save' });
  ldPush({ date: date, type: '收入', cat: '存钱', amt: amt, note: p.name + ' · 存入', acct: to, src: 'save' });
  S.ledDeposit = false; S.ledDepositItem = null; S.ldForm = {}; render();
}

/* ---------- 购物清单（完成时生成支出账单） ---------- */
function ledShop() { return store.g('ledShop', []); }
function ledSaveShop(a) { store.s('ledShop', a); }
function ledShopAdd() {
  const f = ldF(), name = (f.shopName || '').trim();
  if (!name) { alert('请填写要买的东西'); return; }
  const arr = ledShop();
  arr.push({ id: uid(), name: name, price: +f.shopPrice || 0, acct: f.shopAcct || (ledAccounts()[0] || {}).name, cat: f.shopCat || '购物', done: false, date: today() });
  ledSaveShop(arr); S.ldForm = {}; render();
}
function ledShopDone(id) {
  const arr = ledShop(), it = arr.find(x => x.id === id); if (!it || it.done) return;
  it.done = true; it.doneDate = today(); ledSaveShop(arr);
  ldPush({ type: '支出', cat: it.cat || '购物', amt: +it.price || 0, note: '购物清单 · ' + it.name, acct: it.acct, src: 'shop', date: it.doneDate });
  render();
}
function ledShopDel(id) { ledSaveShop(ledShop().filter(x => x.id !== id)); render(); }

/* ---------- 页面：借入 / 借出列表（图 1） ---------- */
function ledDebtHtml() {
  const kind = ledDebtKind(), list = ledDebtList();
  const total = list.reduce((s, d) => s + ledDebtTotal(d), 0);
  const remain = list.reduce((s, d) => s + ledDebtRemain(d), 0);
  const paid = total - remain;
  const interestPaid = list.reduce((s, d) => s + ledDebtPaid(d).interest, 0);
  const pct = total ? Math.round(paid / total * 100) : 0;
  return `<div class="ld2-head"><button class="ld-back" onclick="S.ledView='main';render()">‹</button>
    <div class="ld-type-tabs"><button class="${kind === 'in' ? 'on' : ''}" onclick="ledDebtOpen('in')">借入</button><button class="${kind === 'out' ? 'on' : ''}" onclick="ledDebtOpen('out')">借出</button></div>
    <button class="ld-tool" onclick="S.ledView='books';render()">⋯</button></div>
  <div class="ld2-hero">
    <div class="ld2-hero-label">剩余未${kind === 'in' ? '还' : '收'}</div>
    <div class="ld2-hero-row"><div class="ld2-hero-num">${LDM(remain)}</div><div class="ld2-ring">${pct}.0%<i>还款进度</i></div></div>
    <div class="ld2-hero-sub">共 ${list.length} 笔 · 利息支出 ${LDM(interestPaid)}</div>
    <div class="ld2-mini"><div><b>${LDM(total)}</b><span>总${kind === 'in' ? '借入' : '借出'}</span></div>
      <div><b>${LDM(paid)}</b><span>已还</span></div><div><b>${LDM(remain)}</b><span>剩余未${kind === 'in' ? '还' : '收'}</span></div></div>
  </div>
  <div class="ld2-list">${list.length ? list.map(d => {
    const p = ledDebtPaid(d), a = ldAcct(d.acct);
    return `<div class="ld2-debt" onclick="ledDebtDetail('${d.id}')">
      <span class="ld2-avatar" style="background:${a.color}">${esc(d.person.slice(0, 1))}</span>
      <span class="ld2-debt-main"><b>${esc(d.person)}</b><i>${kind === 'in' ? '借入' : '借出'} ${LDM(ledDebtTotal(d))}</i></span>
      <span class="ld2-debt-right"><b>${LDM(ledDebtRemain(d))}</b><i>剩余未${kind === 'in' ? '还' : '收'}</i></span>
      <div class="ld2-debt-foot">🕐 ${esc(d.date)}${d.interest ? ' · 利息 ' + LDM(d.interest) : ''} · 已还本金 ${LDM(p.principal)} / 利息 ${LDM(p.interest)}</div>
    </div>`;
  }).join('') : `<div class="ld-empty">还没有${kind === 'in' ? '借入' : '借出'}记录，点右下角 ＋ 新增</div>`}</div>
  <button class="ld2-fab" onclick="ledDebtAdd('${kind}')">＋</button>
  <div class="ld2-fabhint">新增${kind === 'in' ? '借入' : '借出'}</div>`;
}
/* ---------- 新增借入 / 借出（图 2 / 图 3，额外加利息） ---------- */
function ldRow(label, inner, req) {
  return `<div class="ld2-row"><span>${label}${req ? '<em>*</em>' : ''}</span>${inner}</div>`;
}
function ledDebtAddHtml() {
  const f = ldF(), kind = ledDebtKind(), append = !!S.ledDebtAppend;
  return `<div class="ld2-head"><button class="ld-back" onclick="S.ledView='debt';render()">‹</button>
    <b class="ld2-title">${append ? '追加' : '添加'}${kind === 'in' ? '借入' : '借出'}</b><button class="ld2-save-top" onclick="ledDebtSave()">保存</button></div>
  <div class="ld2-tip">＊为必填项，其他为选填项 · 本金与利息分开记录</div>
  <div class="ld2-card">${ldRow(kind === 'in' ? '出借人' : '借款人', `<input placeholder="点击输入" value="${esc(f.person || '')}" oninput="ldF().person=this.value">`, true)}
    ${ldRow('借款本金', `<input type="number" placeholder="0.00" value="${esc(f.principal || '')}" oninput="ldF().principal=this.value">`)}
    ${ldRow('利息金额', `<input type="number" placeholder="0.00（可与本金分开还）" value="${esc(f.interest || '')}" oninput="ldF().interest=this.value">`)}
    ${ldRow('借款日期', `<input type="date" value="${esc(f.date || today())}" oninput="ldF().date=this.value">`, true)}
    ${ldRow('还款日期', `<input type="date" value="${esc(f.dueDate || '')}" oninput="ldF().dueDate=this.value">`)}</div>
  <div class="ld2-card">${ldRow('记录账本', `<span class="ld2-value">负债 ›</span>`, true)}
    ${ldRow(kind === 'in' ? '借入账户' : '借出账户', `<select onchange="ldF().acct=this.value">${ldAcctOpts(f.acct || (ledAccounts()[0] || {}).name)}</select>`)}
    ${ldRow('图片', `<span class="ld2-value">无 ›</span>`)}
    ${ldRow(`计入总${kind === 'in' ? '借入' : '借出'}`, `<label class="ld2-switch"><input type="checkbox" ${f.countInTotal !== false ? 'checked' : ''} onchange="ldF().countInTotal=this.checked"><i></i></label>`)}
    ${ldRow('备注', `<textarea rows="2" placeholder="点击输入…" oninput="ldF().note=this.value">${esc(f.note || '')}</textarea>`)}</div>
  <button class="ld2-primary" onclick="ledDebtSave()">确定</button>`;
}
/* ---------- 借入详情（图 4） ---------- */
function ledDebtDetailHtml() {
  const d = ledDebts().find(x => x.id === S.ledDebtId);
  if (!d) return `<div class="ld2-head"><button class="ld-back" onclick="S.ledView='debt';render()">‹</button><b class="ld2-title">记录不存在</b></div>`;
  const p = ledDebtPaid(d), total = ledDebtTotal(d), remain = ledDebtRemain(d);
  const paid = p.principal + p.interest, pct = total ? Math.round(paid / total * 100) : 0;
  const a = ldAcct(d.acct);
  const logs = (d.logs || []).slice().reverse().map(x => `<div class="ld2-log"><span>●</span>
    <div><b>还款 · 本金 ${LDM(x.principal)} / 利息 ${LDM(x.interest)}</b><i>${esc(x.date)} ${esc(x.note || '')}</i></div>
    <em>-${LDM(x.principal + x.interest)}</em></div>`).join('');
  return `<div class="ld2-head"><button class="ld-back" onclick="S.ledView='debt';render()">‹</button><b class="ld2-title">${d.kind === 'in' ? '借入' : '借出'}详情</b>
    <button class="ld-tool" onclick="ledDebtDel('${d.id}')">⋯</button></div>
  <div class="ld2-card ld2-detail">
    <div class="ld2-person"><span class="ld2-avatar" style="background:${a.color}">${esc(d.person.slice(0, 1))}</span><b>${esc(d.person)} ›</b></div>
    <div class="ld2-remain-label">剩余借款（本金 ${LDM((+d.principal || 0) - p.principal)} + 利息 ${LDM((+d.interest || 0) - p.interest)}）</div>
    <div class="ld2-remain">${LDM(remain)}</div>
    <div class="ld2-prog-label">还款进度 <span>${LDM(paid)} / ${LDM(total)}</span></div>
    <div class="ld2-prog"><i style="width:${pct}%"></i></div>
    <div class="ld2-mini"><div><b>${LDM(total)}</b><span>总借入</span></div><div><b>${LDM(paid)}</b><span>已还</span></div><div><b>${LDM(p.interest)}</b><span>利息支出</span></div></div>
    <div class="ld2-split">已还本金 <b>${LDM(p.principal)}</b> · 已还利息 <b>${LDM(p.interest)}</b></div>
  </div>
  <div class="ld2-card">${ldRow('记录账本', '<span class="ld2-value">负债 ›</span>')}</div>
  <div class="ld2-section">借款动态</div>
  <div class="ld2-card"><div class="ld2-log"><span>●</span><div><b>初始${d.kind === 'in' ? '借入' : '借出'}</b><i>${esc(d.date)} · 本金 ${LDM(d.principal)} · 利息 ${LDM(d.interest)}</i></div><em class="inc">+${LDM(total)}</em></div>${logs}</div>
  <div class="ld2-bottom"><button class="ld2-ghost" onclick="ledDebtRepayOpen('${d.id}')">还款</button><button class="ld2-primary" onclick="ledDebtAdd('${d.kind}','${d.id}')">追加${d.kind === 'in' ? '借入' : '借出'}</button></div>`;
}
/* ---------- 还款（图 5，本金 / 利息分别记录） ---------- */
function ledDebtRepayHtml() {
  const f = ldF(), d = ledDebts().find(x => x.id === S.ledDebtId);
  return `<div class="ld2-head"><button class="ld-back" onclick="S.ledView='debtDetail';render()">‹</button><b class="ld2-title">还款</b><button class="ld2-save-top" onclick="ledDebtRepaySave()">保存</button></div>
  <div class="ld2-card">${ldRow('还款本金', `<input type="number" placeholder="0.00" value="${esc(f.principal || '')}" oninput="ldF().principal=this.value">`)}
    ${ldRow('利息支出', `<input type="number" placeholder="0.00" value="${esc(f.interest || '')}" oninput="ldF().interest=this.value">`)}
    ${ldRow('记录账本', '<span class="ld2-value">负债 ›</span>', true)}
    ${ldRow('还款账户', `<select onchange="ldF().acct=this.value">${ldAcctOpts(f.acct || (d ? d.acct : ''))}</select>`)}</div>
  <div class="ld2-card">${ldRow('时间', `<input type="date" value="${esc(f.date || today())}" oninput="ldF().date=this.value">`)}
    ${ldRow('图片', '<span class="ld2-value">无 ›</span>')}
    ${ldRow('备注', `<textarea rows="2" placeholder="点击输入…" oninput="ldF().note=this.value">${esc(f.note || '')}</textarea>`)}</div>
  <button class="ld2-primary blue" onclick="ledDebtRepaySave()">保存</button>`;
}

/* ---------- 资产账户（图 6） ---------- */
function ledAssetsHtml() {
  const accts = ledAccounts(), total = ledTotalAssets(), debt = ledDebtLiability(), net = total - debt;
  const f = ldF();
  return `<div class="ld2-head"><button class="ld-back" onclick="S.ledView='main';render()">‹</button><b class="ld2-title">资产账户</b>
    <button class="ld-tool" onclick="S.ledAssetForm=!S.ledAssetForm;render()">＋</button></div>
  <div class="ld2-asset-hero">
    <div class="ld2-asset-label">净资产 👁</div><div class="ld2-asset-num">${LDM(net)}</div>
    <div class="ld2-asset-sub">总资产 ${LDM(total)}　总负债 ${LDM(debt)}</div>
  </div>
  <div class="ld2-grid2">
    <div class="ld2-tile"><span>借入 <b>${LDM(debt)}</b></span><span>借出 <b>${LDM(ledDebtLent())}</b></span></div>
    <div class="ld2-tile"><span>报销 <b>0.00</b></span><span>未报销 <b>0.00</b></span></div>
    <div class="ld2-tile"><span>当前金价 <b>¥853.80 / 克</b></span><span>总克重 <b>0</b></span></div>
    <div class="ld2-tile"><span>定期 <b>0.00</b></span><span>即将到期 <b>0</b></span></div>
  </div>
  <div class="ld2-card"><div class="ld2-card-head">储蓄账户（${accts.length}）<b>${LDM(total)}</b></div>
    ${accts.map(a => `<div class="ld2-acct"><span class="ld2-avatar sm" style="background:${a.color}">${a.icon}</span>
      <b>${esc(a.name)}</b><span class="ld2-acct-bal">${LDM(ledAcctBal(a.name))}</span>
      <button class="ld-del" onclick="ledAccountDel('${esc(a.name)}')">删</button></div>`).join('')}
    ${S.ledAssetForm ? `<div class="ld2-addacct">
      <input id="ldAcctName" placeholder="账户名称，如 交通银行" value="${esc(f.acctName || '')}" oninput="ldF().acctName=this.value">
      <input type="number" placeholder="初始余额" value="${esc(f.acctInit || '')}" oninput="ldF().acctInit=this.value">
      <button onclick="ledAccountAdd()">添加账户</button></div>` : `<button class="ld2-link" onclick="S.ledAssetForm=true;render()">＋ 添加账户</button>`}
  </div>`;
}
function ledAccountAdd() {
  const f = ldF(), name = (f.acctName || '').trim();
  if (!name) { alert('请填写账户名称'); return; }
  const a = ledAccounts();
  if (a.some(x => x.name === name)) { alert('这个账户已存在'); return; }
  a.push({ name: name, icon: '💳', color: '#B49CE8', init: +f.acctInit || 0 });
  ledSaveAccounts(a); S.ledAssetForm = false; S.ldForm = {}; render();
}
function ledAccountDel(name) {
  if (ledAccounts().length <= 1) return;
  if (!confirm('删除账户「' + name + '」？已有账单仍会保留。')) return;
  ledSaveAccounts(ledAccounts().filter(a => a.name !== name)); render();
}

/* ---------- 存钱计划（图 7） ---------- */
function ledSaveHtml() {
  const plans = ledPlans(), f = ldF();
  const saved = plans.reduce((s, p) => s + ledPlanSaved(p), 0);
  const target = plans.reduce((s, p) => s + ledPlanTotal(p), 0);
  return `<div class="ld2-head"><button class="ld-back" onclick="S.ledView='main';render()">‹</button><b class="ld2-title">存钱计划</b>
    <button class="ld-tool" onclick="S.ledPlanForm=!S.ledPlanForm;render()">＋</button></div>
  <div class="ld2-asset-hero small"><div class="ld2-asset-label">累计存入 👁</div><div class="ld2-asset-num">${LDM(saved)}</div>
    <div class="ld2-asset-sub">总目标 ${LDM(target)}　剩余 ${LDM(Math.max(0, target - saved))}</div></div>
  <div class="ld2-section">创建存钱计划</div>
  <div class="ld2-plangrid">${LED_PLAN_TYPES.map(t => `<button class="ld2-plantype" onclick="ledPlanCreate('${t.id}')">
    <span class="ld2-cal">${t.icon}</span><b>${t.name}</b><i>${t.id === 'free' ? '自由定义' : '可存 ' + LDM(t.step ? t.per * t.count * (t.count + 1) / 2 : t.per * t.count)}</i></button>`).join('')}</div>
  ${S.ledPlanForm ? `<div class="ld2-card"><div class="ld2-card-head">自定义计划</div>
    ${ldRow('名称', `<input value="${esc(f.name || '')}" oninput="ldF().name=this.value">`)}
    ${ldRow('类型', `<select onchange="ldF().type=this.value">${LED_PLAN_TYPES.map(t => `<option value="${t.id}" ${f.type === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}</select>`)}
    ${ldRow('每期金额', `<input type="number" value="${esc(f.per || '')}" oninput="ldF().per=this.value">`)}
    ${ldRow('期数', `<input type="number" value="${esc(f.count || '')}" oninput="ldF().count=this.value">`)}
    ${ldRow('目标金额', `<input type="number" value="${esc(f.target || '')}" oninput="ldF().target=this.value">`)}
    ${ldRow('开始日期', `<input type="date" value="${esc(f.start || today())}" oninput="ldF().start=this.value">`)}
    ${ldRow('扣款账户', `<select onchange="ldF().from=this.value">${ldAcctOpts(f.from || (ledAccounts()[0] || {}).name)}</select>`)}
    ${ldRow('存款账户', `<select onchange="ldF().to=this.value">${ldAcctOpts(f.to || (ledAccounts()[1] || {}).name)}</select>`)}
    <button class="ld2-primary" onclick="ledPlanSave()">保存计划</button></div>` : ''}
  <div class="ld2-section">我的存钱计划</div>
  ${plans.length ? plans.map(p => {
    const done = ledPlanSaved(p), t = ledPlanTotal(p);
    return `<div class="ld2-planrow" onclick="ledPlanOpen('${p.id}')"><span class="ld2-avatar">🐷</span>
      <div><b>${esc(p.name)}</b><i>${esc(p.start)} · ${p.type === 'free' ? '自由存钱' : p.count + ' 期'}</i></div>
      <div class="ld2-planright"><b>${LDM(done)}</b><i>${t ? Math.round(done / t * 100) : 0}%</i></div>
      <button class="ld-del" onclick="event.stopPropagation();ledPlanDel('${p.id}')">删</button></div>`;
  }).join('') : '<div class="ld-empty">还没有存钱计划，点上面卡片创建一个吧～</div>'}`;
}
/* ---------- 存钱计划详情（图 8） ---------- */
function ledSaveDetailHtml() {
  const p = ledPlans().find(x => x.id === S.ledPlanId);
  if (!p) return `<div class="ld2-head"><button class="ld-back" onclick="S.ledView='save';render()">‹</button><b class="ld2-title">计划不存在</b></div>`;
  const items = ledPlanItems(p), logs = ledPlanLogs(p), saved = ledPlanSaved(p), total = ledPlanTotal(p);
  const tab = S.ledPlanTab || 'todo';
  const doneItems = logs.map(l => ({ i: l.item, amt: l.amt, date: l.date, done: true }));
  const cells = tab === 'todo' ? items.filter(x => !logs.some(l => l.item === x.i))
    : tab === 'done' ? doneItems : [];
  const f = ldF();
  return `<div class="ld2-head"><button class="ld-back" onclick="S.ledView='save';render()">‹</button><b class="ld2-title">${esc(p.name)}</b><button class="ld-tool" onclick="ledDepositOpen(null)">⋯</button></div>
  <div class="ld2-savehero"><div class="ld2-savehero-top"><span class="ld2-avatar">🐷</span>
    <span><i>${p.type === 'free' ? '自由存钱' : '定额定存'}</i><em>${esc(p.start)} ~ ${items.length ? items[items.length - 1].date : '—'}</em></span>
    <b>${LDM(saved)}</b></div><div class="ld2-savehero-sub">剩余 ${LDM(Math.max(0, total - saved))}</div></div>
  <div class="ld2-savebar">存入 ${LDM(saved)}　<b>已打卡 ${logs.length} 次</b></div>
  <div class="ld2-tabs">${[['todo', '待存入'], ['done', '已存入'], ['out', '取出记录']].map(t => `<button class="${tab === t[0] ? 'on' : ''}" onclick="S.ledPlanTab='${t[0]}';render()">${t[1]}</button>`).join('')}</div>
  ${p.type === 'free' || tab === 'out' ? `<div class="ld2-card"><button class="ld2-primary" onclick="ledDepositOpen(null)">＋ 自由存入</button>
    ${tab === 'out' ? logs.slice().reverse().map(l => `<div class="ld2-item"><span>${esc(l.date)}</span><b>${LDM(l.amt)}</b></div>`).join('') : ''}</div>`
    : `<div class="ld2-plancells">${cells.length ? cells.map(c => `<button class="ld2-plancell ${c.done ? 'done' : ''}" onclick="ledDepositOpen({i:${c.i},amt:${c.amt},date:'${c.date}'})">
      <span class="ld2-badge">${c.done ? '已存入' : '待存入'}</span><b>${LDM(c.amt)}</b><i>${esc(c.date)}</i></button>`).join('')
      : `<div class="ld-empty">${tab === 'todo' ? '全部期数都存完啦 🎉' : '还没有存入记录'}</div>`}</div>`}
  ${S.ledDeposit ? `<div class="ld-mask" onclick="S.ledDeposit=false;render()"></div><div class="ld2-sheet">
    <div class="ld2-sheet-title">存入金额</div><div class="ld2-sheet-amt">${LDM(f.amt || 0)}</div>
    <div class="ld2-card">${ldRow('扣款账户', `<select onchange="ldF().from=this.value">${ldAcctOpts(f.from || p.from || (ledAccounts()[0] || {}).name)}</select>`)}
      ${ldRow('存款账户', `<select onchange="ldF().to=this.value">${ldAcctOpts(f.to || p.to || (ledAccounts()[1] || {}).name)}</select>`)}
      ${ldRow('金额', `<input type="number" value="${esc(f.amt || '')}" oninput="ldF().amt=this.value">`)}
      ${ldRow('记录账本', `<span class="ld2-value">${esc(ledCurBook().name)} ›</span>`)}
      ${ldRow('存入时间', `<input type="date" value="${esc(f.date || today())}" oninput="ldF().date=this.value">`)}
      ${ldRow('备注', `<input placeholder="点击输入…" value="${esc(f.note || '')}" oninput="ldF().note=this.value">`)}</div>
    <div class="ld2-bottom"><button class="ld2-ghost" onclick="S.ledDeposit=false;render()">取消</button><button class="ld2-primary" onclick="ledDepositSave()">存入</button></div>
  </div>` : ''}`;
}

/* ---------- 购物清单 ---------- */
function ledShopHtml() {
  const list = ledShop(), f = ldF();
  const todo = list.filter(x => !x.done), done = list.filter(x => x.done);
  return `<div class="ld2-head"><button class="ld-back" onclick="S.ledView='main';render()">‹</button><b class="ld2-title">购物清单</b>
    <button class="ld-tool" onclick="S.ledView='main';render()">⋯</button></div>
  <div class="ld2-card">${ldRow('要买什么', `<input placeholder="例如：洗衣液" value="${esc(f.shopName || '')}" oninput="ldF().shopName=this.value">`)}
    ${ldRow('预估金额', `<input type="number" placeholder="0.00" value="${esc(f.shopPrice || '')}" oninput="ldF().shopPrice=this.value">`)}
    ${ldRow('付款账户', `<select onchange="ldF().shopAcct=this.value">${ldAcctOpts(f.shopAcct || (ledAccounts()[0] || {}).name)}</select>`)}
    ${ldRow('记账分类', `<select onchange="ldF().shopCat=this.value">${LED_CATS.map(c => `<option value="${c[0]}" ${f.shopCat === c[0] ? 'selected' : ''}>${c[0]}</option>`).join('')}</select>`)}
    <button class="ld2-primary" onclick="ledShopAdd()">＋ 添加待购</button></div>
  <div class="ld2-section">待购买（${todo.length}）</div>
  <div class="ld2-card">${todo.length ? todo.map(x => `<div class="ld2-shop">
    <button class="ld2-check" onclick="ledShopDone('${x.id}')" title="完成并记一笔支出">✓</button>
    <div><b>${esc(x.name)}</b><i>${esc(x.acct)} · ${esc(x.cat)}</i></div><span>${LDM(x.price)}</span>
    <button class="ld-del" onclick="ledShopDel('${x.id}')">删</button></div>`).join('') : '<div class="ld-empty">好像什么都没有～</div>'}</div>
  ${done.length ? `<div class="ld2-section">已完成（${done.length}）· 已自动生成支出账单</div>
    <div class="ld2-card">${done.map(x => `<div class="ld2-shop done"><span class="ld2-check on">✓</span>
      <div><b>${esc(x.name)}</b><i>${esc(x.doneDate || x.date)} 已记账</i></div><span>${LDM(x.price)}</span>
      <button class="ld-del" onclick="ledShopDel('${x.id}')">删</button></div>`).join('')}</div>` : ''}`;
}

/* ---------- 主页快捷入口 ---------- */
function ledQuickEntries() {
  if (ldIsDebtBook()) return '';
  return `<div class="ld2-entries">
    <button onclick="S.ledView='assets';render()"><span>🏦</span><b>资产账户</b><i>${LDM(ledTotalAssets())}</i></button>
    <button onclick="S.ledView='save';render()"><span>🐷</span><b>存钱计划</b><i>${ledPlans().length} 个</i></button>
    <button onclick="S.ledView='shop';render()"><span>🛒</span><b>购物清单</b><i>${ledShop().filter(x => !x.done).length} 待购</i></button>
  </div>`;
}

function render_ledger() {
  if (S.ledTab === 'repay' || S.ledTab === 'loan') S.ledTab = 'main';
  if (S.ledView === 'debt') return ledShell(ledDebtHtml(), true);
  if (S.ledView === 'debtAdd') return ledShell(ledDebtAddHtml(), true);
  if (S.ledView === 'debtDetail') return ledShell(ledDebtDetailHtml(), true);
  if (S.ledView === 'debtRepay') return ledShell(ledDebtRepayHtml(), true);
  if (S.ledView === 'assets') return ledShell(ledAssetsHtml(), true);
  if (S.ledView === 'save') return ledShell(ledSaveHtml(), true);
  if (S.ledView === 'saveDetail') return ledShell(ledSaveDetailHtml(), true);
  if (S.ledView === 'shop') return ledShell(ledShopHtml(), true);
  if (S.ledView === 'add') return ledShell(ledAddHtml(), true);
  if (S.ledView === 'books') return ledShell(ledBooksHtml(), true);
  if (S.ledTab === 'cal') return ledShell(ledNavBar() + ledCalHtml());
  return ledShell(ledNavBar() + ledMainHtml());
}

function delLedger(id) { if (!confirm('删除这笔账？')) return; store.s('ledger', store.g('ledger', []).filter(x => x.id !== id)); render(); }

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

/* 最近的 n 个节日（公历/农历/移动/24节气），日历页与首页共用 */
function festUpcoming(n) {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  let festAll = FESTIVALS.slice();
  if (typeof SL !== 'undefined' && SL.solarTerm) {
    for (const yy of [now.getFullYear(), now.getFullYear() + 1]) {
      for (const t of SL.solarTerm(yy)) festAll.push({ name: t.name, year: t.year, m: t.month, d: t.day, kind: '节气' });
    }
  }
  return festAll.map(f => { const date = nextFestivalDate(f); return { ...f, date, days: date ? Math.round((date - now) / 864e5) : null }; })
    .filter(f => f.days != null && f.days >= 0)
    .sort((a, b) => a.days - b.days)
    .slice(0, n || 8);
}
function festCardHtml(f) {
  return `
    <div class="fest-card">
      <div><div class="fest-name">${f.name}<span class="fest-kind ${f.kind === '节气' ? 'term' : (f.kind === '农历' ? 'lun' : '')}">${f.kind}</span></div><div class="fest-date">${f.date.getFullYear()}-${pad(f.date.getMonth() + 1)}-${pad(f.date.getDate())}</div></div>
      <div class="fest-days">${f.days === 0 ? '今天 🎉' : f.days + ' 天后'}</div>
    </div>`;
}
function calendarTabBar() {
  const tabs = [['main', '📅 日历'], ['cd', '⏳ 倒计时']];
  return `<div class="subtabs">${tabs.map(t => `<button class="btn sm ${S.calTab === t[0] ? 'pink' : 'ghost'}" onclick="S.calTab='${t[0]}';render()">${t[1]}</button>`).join('')}</div>`;
}
function render_calendar() {
  if (S.calTab === 'cd') {
    return `<div class="page-title">📅 日程日历</div>
  <div class="page-sub">安排在手，心中不慌 · 农历与节日已标注</div>
  ${calendarTabBar()}
  ${countdownFrag()}`;
  }
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
  const festCards = festUpcoming(8).map(f => festCardHtml(f)).join('');
  return `
  <div class="page-title">📅 日程日历</div>
  <div class="page-sub">安排在手，心中不慌 · 农历与节日已标注</div>
  ${calendarTabBar()}
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

/* ============ 习惯打卡 ============ */
const FREQS = [['daily', '每日'], ['workday', '工作日'], ['weekend', '周末'], ['weekly', '自定义星期']];
const WD_SHORT = ['日', '一', '二', '三', '四', '五', '六'];
function nowISO() { const d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }
function habitActiveToday(h) {
  const wd = new Date().getDay();
  if (h.freq === 'workday') return wd >= 1 && wd <= 5;
  if (h.freq === 'weekend') return wd === 0 || wd === 6;
  if (h.freq === 'weekly') return (h.days || []).includes(wd);
  return true; // daily
}
function freqLabel(h) {
  if (h.freq === 'daily') return '每日';
  if (h.freq === 'workday') return '工作日';
  if (h.freq === 'weekend') return '周末';
  if (h.freq === 'weekly') return '每周 ' + (h.days || []).map(d => WD_SHORT[d]).join('');
  return '';
}
function habitTodayChecks(h) {
  const t = today();
  return store.g('habitChecks', []).filter(c => c.habitId === h.id && c.ts.slice(0, 10) === t);
}
function habitStreak(h) {
  const byDate = {};
  store.g('habitChecks', []).filter(c => c.habitId === h.id).forEach(c => { const d = c.ts.slice(0, 10); byDate[d] = (byDate[d] || 0) + 1; });
  const set = new Set();
  Object.keys(byDate).forEach(d => { if (byDate[d] >= h.times) set.add(d); });
  return streakOf([...set]);
}
function habitActiveOn(h, dateStr) {
  const wd = new Date(dateStr + 'T00:00:00').getDay();
  if (h.freq === 'workday') return wd >= 1 && wd <= 5;
  if (h.freq === 'weekend') return wd === 0 || wd === 6;
  if (h.freq === 'weekly') return (h.days || []).includes(wd);
  return true;
}
function habitDayRate(dateStr, hid) {
  const habits = store.g('habits', []);
  const checks = store.g('habitChecks', []);
  if (hid && hid !== 'all') {
    const h = habits.find(x => x.id === hid);
    if (!h) return { active: 0, reached: 0, rate: -1 };
    const active = habitActiveOn(h, dateStr) ? 1 : 0;
    const cnt = checks.filter(c => c.habitId === h.id && c.ts.slice(0, 10) === dateStr).length;
    return { active, reached: active && cnt >= h.times ? 1 : 0, rate: active ? (cnt >= h.times ? 1 : 0) : -1 };
  }
  const act = habits.filter(h => habitActiveOn(h, dateStr));
  if (!act.length) return { active: 0, reached: 0, rate: -1 };
  const reached = act.filter(h => {
    const cnt = checks.filter(c => c.habitId === h.id && c.ts.slice(0, 10) === dateStr).length;
    return cnt >= h.times;
  }).length;
  return { active: act.length, reached, rate: reached / act.length };
}
function heatLevel(rate) {
  if (rate < 0) return 0;
  if (rate === 0) return 1;
  if (rate < 0.5) return 2;
  if (rate < 1) return 3;
  return 4;
}
function render_heatmap() {
  const hid = S.habitHeat || 'all';
  const habits = store.g('habits', []);
  const WEEKS = 22;
  const today = new Date();
  const wd0 = (today.getDay() + 6) % 7;
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - wd0 - (WEEKS - 1) * 7);
  const MON = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  let html = '', lastMonth = -1;
  for (let c = 0; c < WEEKS; c++) {
    let monthLabel = '', colCells = '';
    for (let r = 0; r < 7; r++) {
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + c * 7 + r);
      const ds = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
      const rate = habitDayRate(ds, hid);
      const lvl = heatLevel(rate.rate);
      const tip = (d.getMonth() + 1) + '月' + d.getDate() + '日 · ' + (rate.rate < 0 ? '无打卡安排' : '达成 ' + rate.reached + '/' + rate.active);
      colCells += `<div class="heat heat-${lvl}" title="${tip}"></div>`;
      if (r === 0 && d.getMonth() !== lastMonth) { monthLabel = MON[d.getMonth()]; lastMonth = d.getMonth(); }
    }
    html += `<div class="heat-col"><div class="heat-m">${monthLabel}</div>${colCells}</div>`;
  }
  const selOpts = habits.map(h => `<option value="${h.id}" ${hid === h.id ? 'selected' : ''}>${esc(h.name)}</option>`).join('');
  return `
  <div class="card">
    <div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:6px">
      <h3 style="margin:0">📊 打卡热力图</h3>
      <select id="hbHeatSel" onchange="S.habitHeat=this.value;render()">
        <option value="all" ${hid === 'all' ? 'selected' : ''}>全部习惯</option>${selOpts}
      </select>
    </div>
    <div class="li-sub" style="margin:4px 0 8px">近 5 个月打卡完成度（颜色越深代表当天达成习惯越多）</div>
    <div class="heat-wrap"><div class="heat-grid">${html}</div></div>
    <div class="row mt" style="align-items:center;gap:5px">
      <span class="li-sub">少</span>
      <div class="heat heat-1"></div><div class="heat heat-2"></div><div class="heat heat-3"></div><div class="heat heat-4"></div>
      <span class="li-sub">多</span>
      <div class="heat heat-0" style="margin-left:10px"></div><span class="li-sub">无安排</span>
    </div>
  </div>`;
}
/* ============ 打卡记录后台查询 ============ */
function habitLogFiltered() {
  const habits = store.g('habits', []);
  const checks = store.g('habitChecks', []);
  const f = S.habitLog || {};
  let list = checks.map(c => {
    const h = habits.find(x => x.id === c.habitId);
    return { id: c.id, habitId: c.habitId, name: h ? h.name : '（已删除习惯）', date: c.ts.slice(0, 10), time: c.ts.slice(11), ts: c.ts };
  });
  if (f.habit && f.habit !== 'all') list = list.filter(x => x.habitId === f.habit);
  if (f.from) list = list.filter(x => x.date >= f.from);
  if (f.to) list = list.filter(x => x.date <= f.to);
  if (f.kw) list = list.filter(x => x.name.indexOf(f.kw) >= 0);
  list.sort((a, b) => a.ts < b.ts ? 1 : -1);
  return list;
}
function render_habitLog() {
  const checks = store.g('habitChecks', []);
  const habits = store.g('habits', []);
  const f = S.habitLog || {};
  const list = habitLogFiltered();
  const days = new Set(list.map(x => x.date)).size;
  const habitOpts = habits.map(h => `<option value="${h.id}" ${f.habit === h.id ? 'selected' : ''}>${esc(h.name)}</option>`).join('');
  const rows = list.length ? list.map(x => `<div class="log-row">
      <span class="log-date">${x.date}</span>
      <span class="log-name">${esc(x.name)}</span>
      <span class="log-time">${x.time}</span>
      <button class="btn sm warn" onclick="delHabitLog('${x.id}')">删</button>
    </div>`).join('')
    : '<div class="empty">没有匹配的打卡记录</div>';
  return `
  <div class="card">
    <details class="log-box" ${f.open ? 'open' : ''} ontoggle="S.habitLog.open=this.open">
      <summary class="log-sum">📜 打卡记录 · 后台查询 <span class="li-sub">（共 ${checks.length} 条 · 点开筛选查看）</span></summary>
      <div class="row mt" style="flex-wrap:wrap;gap:6px">
        <select id="hlHabit" onchange="S.habitLog.habit=this.value;render()">
          <option value="all" ${f.habit === 'all' ? 'selected' : ''}>全部习惯</option>${habitOpts}
        </select>
        <label class="li-sub">起<input type="date" id="hlFrom" value="${f.from}" onchange="S.habitLog.from=this.value;render()"></label>
        <label class="li-sub">止<input type="date" id="hlTo" value="${f.to}" onchange="S.habitLog.to=this.value;render()"></label>
        <input class="grow" id="hlKw" placeholder="搜索习惯名" value="${esc(f.kw || '')}">
        <button class="btn sm" onclick="S.habitLog.kw=document.getElementById('hlKw').value.trim();render()">查询</button>
        <button class="btn sm ghost" onclick="S.habitLog={habit:'all',from:'',to:'',kw:'',open:true};render()">重置</button>
      </div>
      <div class="row mt" style="flex-wrap:wrap;gap:10px;align-items:center">
        <span class="li-sub">筛选结果：<b>${list.length}</b> 条 · 覆盖 <b>${days}</b> 天</span>
        ${list.length ? `<button class="btn sm ghost" onclick="exportHabitLog()">导出记录 ↓</button>` : ''}
      </div>
      <div class="log-list mt">${rows}</div>
    </details>
  </div>`;
}
function delHabitLog(id) {
  if (!confirm('删除这条打卡记录？')) return;
  store.s('habitChecks', store.g('habitChecks', []).filter(c => c.id !== id));
  render();
}
function exportHabitLog() {
  const list = habitLogFiltered();
  const lines = ['习惯打卡记录导出', '生成时间：' + nowISO(), ''];
  let cur = '';
  list.forEach(x => {
    if (x.date !== cur) { cur = x.date; lines.push(''); lines.push('【' + x.date + '】'); }
    lines.push('  ' + x.time + '  ' + x.name);
  });
  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'habit-log-' + today() + '.txt';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}

/* ============ 开屏 & 初始化 ============ */
function initSplash() {
  $('#spIcons').innerHTML = ['coffee', 'book', 'bear', 'plant', 'headphone', 'leaf'].map(k => `<span>${icon(k)}</span>`).join('');
  const d = new Date();
  const wd = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][d.getDay()];
  $('#spDate').textContent = d.getFullYear() + ' 年 ' + (d.getMonth() + 1) + ' 月 ' + d.getDate() + ' 日 · ' + wd;
  let qi = Math.floor(Math.random() * QUOTES.length);
  const setQ = () => { $('#spQuote').style.opacity = 0; setTimeout(() => { $('#spQuote').textContent = QUOTES[qi % QUOTES.length]; $('#spQuote').style.opacity = 1; qi++; }, 350); };
  $('#spQuote').textContent = QUOTES[qi % QUOTES.length]; qi++;
  const timer = setInterval(setQ, 4000);
  $('#spEnter').onclick = () => { clearInterval(timer); const sp = $('#splash'); sp.style.opacity = '0'; setTimeout(() => { sp.style.display = 'none'; }, 400); go('home'); render(); };
}
(function init() {
  /* 每日登录自动打卡 */
  const ci = store.g('checkin', []);
  if (!ci.includes(today())) { ci.push(today()); store.s('checkin', ci); }
  initSplash();
  render();
})();
