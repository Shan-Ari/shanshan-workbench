/* ============ 习惯打卡（按参考模板重做） ============ */
const HB_SPRITE = 'habit-icons.png?v=20261112i';
const HB_COLS = 5, HB_ROWS = 18, HB_ICON_N = HB_COLS * HB_ROWS;
const HB_WD = ['日', '一', '二', '三', '四', '五', '六'];
const HABIT_PALETTE = ['#c6e7ff', '#d4f6ff', '#feee91', '#cdc1ff', '#a0d683', '#ffc5c5', '#618264', '#ffc96f', '#a8df8e', '#f975aa'];
const HB_GROUPS = ['全部', '健康', '学习', '生活', '工作', '运动', '其他'];
const HB_FREQS = [['daily', '每天'], ['workday', '工作日'], ['weekend', '周末'], ['weekly', '自定义星期']];
const HB_REMINDS = [['off', '关闭'], ['morning', '早上'], ['noon', '中午'], ['night', '晚上']];
const HB_TARGET_TYPES = [['atleast', '至少'], ['atmost', '至多']];

let _hbCache = null;
function hbInvalidate() { _hbCache = null; }
function hbNorm(h) {
  return Object.assign({
    type: 'check', icon: 0, color: HABIT_PALETTE[0], question: '', group: '全部',
    unit: '', target: 0, autoAdd: 1, targetType: 'atleast', reminder: 'off', note: '',
    times: 1, freq: 'daily', days: [], start: '', end: ''
  }, h);
}
function hbData() {
  if (!_hbCache) _hbCache = {
    habits: store.g('habits', []).map(hbNorm),
    checks: store.g('habitChecks', []),
    values: store.g('habitValues', [])
  };
  return _hbCache;
}
function hbTone(c) {
  const base = /^#[0-9a-fA-F]{6}$/.test(c || '') ? c : HABIT_PALETTE[0];
  return {
    base: base,
    ink: mixHex(base, '#3a3034', 0.35),
    soft: mixHex(base, '#ffffff', 0.22),
    mid: mixHex(base, '#ffffff', 0.55)
  };
}
function hbIconStyle(i, size) {
  const n = Math.max(0, Math.min(HB_ICON_N - 1, +i || 0));
  return `background-image:url('${HB_SPRITE}');background-repeat:no-repeat;background-size:${size * HB_COLS}px ${size * HB_ROWS}px;background-position:-${(n % HB_COLS) * size}px -${Math.floor(n / HB_COLS) * size}px;`;
}
function hbIcon(i, size, cls) {
  return `<span class="hb-ico ${cls || ''}" style="width:${size}px;height:${size}px;${hbIconStyle(i, size)}"></span>`;
}
function hbDates() {
  const a = [];
  for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); a.push(fmt(d)); }
  return a;
}
function hbActiveOn(h, ds) {
  const wd = new Date(ds + 'T00:00:00').getDay();
  if (h.freq === 'workday') return wd >= 1 && wd <= 5;
  if (h.freq === 'weekend') return wd === 0 || wd === 6;
  if (h.freq === 'weekly') return (h.days || []).some(d => +d === wd);
  return true;
}
function hbState(h, ds) {
  const d = hbData();
  if (h.type === 'count') {
    const rec = d.values.find(x => x.habitId === h.id && x.date === ds);
    const v = rec ? (+rec.value || 0) : 0;
    const goal = +h.target || 0;
    const done = goal > 0 ? (h.targetType === 'atmost' ? (v > 0 && v <= goal) : v >= goal) : v > 0;
    return { kind: 'count', v: v, done: done, part: v > 0 && !done };
  }
  const cnt = d.checks.filter(x => x.habitId === h.id && x.ts.slice(0, 10) === ds).length;
  return { kind: 'check', v: cnt, done: cnt >= Math.max(1, +h.times || 1), part: cnt > 0 };
}
function hbStreak(h) {
  let n = 0; const d = new Date();
  if (!hbState(h, fmt(d)).done) d.setDate(d.getDate() - 1);
  while (n < 1000 && hbState(h, fmt(d)).done) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function hbTotalValue(h) {
  return hbData().values.filter(x => x.habitId === h.id).reduce((a, b) => a + (+b.value || 0), 0);
}
function hbFreqLabel(h) {
  const f = HB_FREQS.find(x => x[0] === h.freq);
  if (h.freq === 'weekly') return '每周 ' + (h.days || []).map(d => HB_WD[+d]).join('');
  return f ? f[1] : '每天';
}

/* ---------- 打卡交互 ---------- */
function hbTapCell(id, ds) {
  if (ds !== today()) return;
  const h = hbData().habits.find(x => x.id === id); if (!h) return;
  if (h.type === 'count') {
    const arr = store.g('habitValues', []);
    const rec = arr.find(x => x.habitId === id && x.date === ds);
    const step = Math.max(1, +h.autoAdd || 1);
    if (rec) rec.value = (+rec.value || 0) + step;
    else arr.push({ id: uid(), habitId: id, date: ds, value: step });
    store.s('habitValues', arr);
  } else {
    const arr = store.g('habitChecks', []);
    const same = arr.filter(c => c.habitId === id && c.ts.slice(0, 10) === ds);
    if (same.length >= Math.max(1, +h.times || 1)) {
      const ids = new Set(same.map(c => c.id));
      store.s('habitChecks', arr.filter(c => !ids.has(c.id)));
    } else {
      arr.push({ id: uid(), habitId: id, ts: ds + ' 12:00' });
      store.s('habitChecks', arr);
    }
  }
  hbInvalidate(); render();
}
function hbEditValue(id, ds) {
  if (ds !== today()) return;
  const arr = store.g('habitValues', []);
  const rec = arr.find(x => x.habitId === id && x.date === ds);
  const s = prompt('输入 ' + ds + ' 的数值', rec ? String(rec.value) : '0');
  if (s === null) return;
  const n = Math.max(0, +s || 0);
  if (rec) rec.value = n; else arr.push({ id: uid(), habitId: id, date: ds, value: n });
  store.s('habitValues', arr);
  hbInvalidate(); render();
}

/* ---------- 主列表（图 1） ---------- */
function hbCardHtml(h, dates) {
  const t = hbTone(h.color);
  const cells = dates.map(ds => {
    const st = hbState(h, ds), act = hbActiveOn(h, ds), isToday = ds === today(), locked = !isToday;
    let inner, cls;
    if (h.type === 'count') {
      const tap = locked ? '' : `onclick="event.stopPropagation();hbEditValue('${h.id}','${ds}')"`;
      inner = `<span class="hb-num" ${tap}>${st.v || 0}</span><small>${esc(h.unit || '')}</small>`;
      cls = st.done ? 'done' : (st.part ? 'part' : '');
    } else {
      inner = st.done ? '✓' : (act ? '✕' : '–');
      cls = st.done ? 'done' : '';
    }
    if (!act) cls += ' off';
    if (locked) cls += ' locked';
    if (isToday) cls += ' today';
    const cellTap = locked ? '' : `onclick="hbTapCell('${h.id}','${ds}')"`;
    return `<div class="hb-cell ${cls}" title="${ds} · ${st.done ? '已达成' : '未达成'}" ${cellTap}>${inner}</div>`;
  }).join('');
  return `<div class="hb-card" style="--hc:${t.base};--hi:${t.ink};--hs:${t.soft};--hm:${t.mid}">
    <div class="hb-line1"><span></span><span class="hb-name" title="${esc(h.question || h.note || h.name)}" onclick="hbEdit('${h.id}')">${esc(h.name)}</span></div>
    <div class="hb-line2">${hbIcon(h.icon, 40, 'hb-card-ico')}<div class="hb-cells">${cells}</div></div>
  </div>`;
}
function hbListHtml() {
  hbInvalidate();
  const habits = hbData().habits, dates = hbDates();
  const filter = S.hbFilter || '全部';
  const shown = filter === '全部' ? habits : habits.filter(h => (h.group || '全部') === filter);
  const groups = ['全部'].concat([...new Set(habits.map(h => h.group || '全部'))].filter(g => g !== '全部'));
  return `
  <div class="hb-head">
    <div class="hb-title">今日习惯</div>
    <div class="hb-tools">
      <button class="hb-tool" title="添加习惯" onclick="S.hbPicker='type';render()">＋</button>
      <button class="hb-tool" title="筛选分组" onclick="S.hbFilterOpen=!S.hbFilterOpen;render()">☷</button>
      <button class="hb-tool" title="数据概览" onclick="S.hbOverview=!S.hbOverview;render()">▥</button>
      <button class="hb-tool" title="习惯管理" onclick="S.hbView='settings';render()">⚙</button>
    </div>
  </div>
  ${S.hbFilterOpen ? `<div class="hb-filterbar">${groups.map(g => `<button class="hb-chip ${filter === g ? 'on' : ''}" onclick="S.hbFilter='${esc(g)}';render()">${esc(g)}</button>`).join('')}</div>` : ''}
  ${hbOverviewHtml(habits, dates)}
  <div class="hb-week"><span></span><div class="hb-wdays">${dates.map(ds => `<div class="hb-wd ${ds === today() ? 'today' : ''}"><b>${+ds.slice(8)}</b></div>`).join('')}</div></div>
  <div class="hb-list">
    ${shown.length ? shown.map(h => hbCardHtml(h, dates)).join('') : '<div class="hb-empty">还没有习惯，点右上角 ＋ 新建一个吧～</div>'}
  </div>
  ${hbPickerHtml()}`;
}

/* ---------- 数据概览（图 4，默认折叠） ---------- */
function hbRangeLabel(mode) {
  const t = today();
  if (mode === 'month') return (+t.slice(0, 4)) + '年' + (+t.slice(5, 7)) + '月 1日 – ' + (+t.slice(5, 7)) + '月末';
  if (mode === 'year') return (+t.slice(0, 4)) + '年 1月 – 12月';
  const ds = hbDates();
  return (+ds[0].slice(5, 7)) + '月' + (+ds[0].slice(8)) + '日 – ' + (+ds[6].slice(5, 7)) + '月' + (+ds[6].slice(8)) + '日';
}
function hbRateOf(habits, dates) {
  let reached = 0, total = 0;
  dates.forEach(ds => habits.forEach(h => {
    if (ds > today() || !hbActiveOn(h, ds)) return;
    total++; if (hbState(h, ds).done) reached++;
  }));
  return total ? Math.round(reached / total * 100) : 0;
}
function hbOvCells(h, mode) {
  const t = today(), y = +t.slice(0, 4), m = +t.slice(5, 7);
  if (mode === 'week') {
    return hbDates().map(ds => {
      const act = hbActiveOn(h, ds), st = hbState(h, ds);
      const state = ds > t ? 'future' : !act ? 'skip' : st.done ? 'done' : st.part ? 'part' : 'none';
      return { label: String(+ds.slice(8)), state: state, tip: ds + ' · ' + (st.done ? '已达成' : '未达成') };
    });
  }
  if (mode === 'month') {
    const last = new Date(y, m, 0).getDate(), cells = [];
    for (let s = 1; s <= last; s += 7) {
      const e = Math.min(last, s + 6); let tot = 0, dn = 0;
      for (let dd = s; dd <= e; dd++) {
        const ds = y + '-' + pad(m) + '-' + pad(dd);
        if (ds > t) break;
        if (!hbActiveOn(h, ds)) continue;
        tot++; if (hbState(h, ds).done) dn++;
      }
      cells.push({ label: String(Math.floor((s - 1) / 7) + 1), state: !tot ? 'none' : dn / tot >= 1 ? 'done' : dn ? 'part' : 'none', tip: s + '-' + e + '日 达成 ' + dn + '/' + tot });
    }
    return cells;
  }
  const cells = [];
  for (let mm = 1; mm <= 12; mm++) {
    const last = new Date(y, mm, 0).getDate(); let tot = 0, dn = 0;
    for (let dd = 1; dd <= last; dd++) {
      const ds = y + '-' + pad(mm) + '-' + pad(dd);
      if (ds > t) break;
      if (!hbActiveOn(h, ds)) continue;
      tot++; if (hbState(h, ds).done) dn++;
    }
    cells.push({ label: String(mm), state: !tot ? 'none' : dn / tot >= 1 ? 'done' : dn ? 'part' : 'none', tip: mm + '月 达成 ' + dn + '/' + tot });
  }
  return cells;
}
function hbOvItem(h, mode) {
  const t = hbTone(h.color), cells = hbOvCells(h, mode);
  const tail = h.type === 'count' ? (hbTotalValue(h) + ' ' + esc(h.unit || '')) : (hbStreak(h) + ' 天');
  return `<div class="hb-ov-item" style="--hc:${t.base};--hi:${t.ink};--hs:${t.soft};--hm:${t.mid}">
    <div class="hb-ov-item-top">${hbIcon(h.icon, 26)}<b>${esc(h.name)}</b><span class="hb-ov-tail">${tail}</span></div>
    <div class="hb-ov-freq">${hbFreqLabel(h)}</div>
    <div class="hb-ov-days" style="grid-template-columns:repeat(${cells.length},1fr)">${cells.map(c => `<div class="hb-ov-day ${c.state}" title="${esc(c.tip || '')}">${c.label}</div>`).join('')}</div>
  </div>`;
}
function hbOverviewHtml(habits, dates) {
  if (!S.hbOverview) return `<div class="hb-ovbar" onclick="S.hbOverview=true;render()"><span>📊 数据概览</span><span class="li-sub">点开查看 ›</span></div>`;
  const mode = S.hbOvRange || 'week';
  const active = habits.filter(h => hbActiveOn(h, today()));
  const done = active.filter(h => hbState(h, today()).done).length;
  const rate = hbRateOf(habits, dates);
  const prev = hbRateOf(habits, dates.map(ds => { const d = new Date(ds + 'T00:00:00'); d.setDate(d.getDate() - 7); return fmt(d); }));
  const diff = rate - prev;
  const best = habits.slice().sort((a, b) => hbStreak(b) - hbStreak(a))[0];
  const d = hbData();
  const totalChecks = d.checks.length + d.values.filter(v => +v.value > 0).length;
  const legend = [
    ['已完成', 'lg-done'], ['超额完成', 'lg-over'], ['达标', 'lg-part'],
    ['未打卡', 'lg-none'], ['超出限额', 'lg-limit'], ['跳过', 'lg-skip'], ['未来', 'lg-future']
  ];
  return `<div class="hb-ov">
    <div class="hb-ov-head"><button class="hb-tool" onclick="S.hbOverview=false;render()">←</button><div class="hb-title">数据概览</div></div>
    <div class="hb-ov-range">
      <button class="hb-tool" onclick="hbShiftRange(-1)">‹</button>
      <span>${hbRangeLabel(mode)}</span>
      <button class="hb-tool" onclick="hbShiftRange(1)">›</button>
      <div class="hb-range-tabs">${[['week', '周'], ['month', '月'], ['year', '年']].map(x => `<button class="hb-range-btn ${mode === x[0] ? 'on' : ''}" onclick="S.hbOvRange='${x[0]}';render()">${x[1]}</button>`).join('')}</div>
    </div>
    <div class="hb-ov-card">
      <div><b>${done}/${active.length}</b><span>今日完成</span></div>
      <div><b>${rate}%</b><span>周完成率 <em>${diff >= 0 ? '↑' : '↓'}${Math.abs(diff)}%</em></span></div>
      <div><b class="hb-best">${esc(best ? best.name : '—')}</b><span>本周最佳</span></div>
      <div><b>${totalChecks}</b><span>累计打卡</span></div>
    </div>
    <div class="hb-legend">${legend.map(x => `<span><i class="${x[1]}"></i>${x[0]}</span>`).join('')}</div>
    <div class="hb-ov-grid">${habits.length ? habits.map(h => hbOvItem(h, mode)).join('') : '<div class="hb-empty">暂无习惯数据</div>'}</div>
  </div>`;
}
function hbShiftRange(dir) {
  const order = ['week', 'month', 'year'];
  const i = order.indexOf(S.hbOvRange || 'week');
  S.hbOvRange = order[Math.min(2, Math.max(0, i + dir))];
  render();
}

/* ---------- 新建 / 编辑表单（图 2 / 图 3） ---------- */
function hbField(label, inner, cls) {
  return `<div class="hb-field ${cls || ''}"><span class="hb-flabel">${label}</span>${inner}</div>`;
}
function hbSel(id, opts, cur) {
  return `<select id="${id}">${opts.map(x => `<option value="${x[0]}" ${cur === x[0] ? 'selected' : ''}>${x[1]}</option>`).join('')}</select>`;
}
function hbCollect() {
  const g = id => document.getElementById(id);
  const v = id => g(id) ? g(id).value : '';
  const d = S.hbDraft || {};
  d.name = v('hbFName'); d.question = v('hbFQuestion'); d.group = v('hbFGroup');
  d.freq = v('hbFFreq'); d.reminder = v('hbFRemind'); d.note = v('hbFNote');
  if (d.type === 'count') {
    d.unit = v('hbFUnit'); d.target = v('hbFTarget');
    d.autoAdd = v('hbFAuto'); d.targetType = v('hbFType');
  }
  const box = g('hbFWeekBox');
  if (box) d.days = [].slice.call(document.querySelectorAll('.hbFDay:checked')).map(c => +c.value);
  S.hbDraft = d;
  return d;
}
function hbFormHtml() {
  hbInvalidate();
  const d = S.hbDraft || {};
  const isCount = d.type === 'count';
  const edit = !!S.hbEdit;
  const iconBox = d.icon == null ? '<span class="hb-plus">＋</span>' : hbIcon(d.icon, 34);
  const colorBox = `<span class="hb-color-box" style="background:${hbTone(d.color).base}"></span>`;
  const weekBox = `<div id="hbFWeekBox" class="hb-weekbox" style="display:${d.freq === 'weekly' ? '' : 'none'}">${HB_WD.map((w, i) => `<label><input type="checkbox" class="hbFDay" value="${i}" ${(d.days || []).some(x => +x === i) ? 'checked' : ''}>周${w}</label>`).join('')}</div>`;
  const freqSel = `<select id="hbFFreq" onchange="document.getElementById('hbFWeekBox').style.display=this.value==='weekly'?'':'none'">${HB_FREQS.map(x => `<option value="${x[0]}" ${d.freq === x[0] ? 'selected' : ''}>${x[1]}</option>`).join('')}</select>`;
  const extra = isCount ? `
    ${hbField('单位', `<input id="hbFUnit" placeholder="例如：公里" value="${esc(d.unit || '')}">`)}
    <div class="hb-row2">
      ${hbField('目标', `<input id="hbFTarget" type="number" placeholder="例如：15" value="${esc(d.target || '')}">`)}
      ${hbField('频率', freqSel)}
    </div>
    ${hbField('自动增量', `<input id="hbFAuto" type="number" placeholder="例如：1（点击格子自动 +1）" value="${esc(d.autoAdd || 1)}">`)}
    ${hbField('目标类型', hbSel('hbFType', HB_TARGET_TYPES, d.targetType || 'atleast'))}
  ` : hbField('频率', freqSel);
  return `
  <div class="hb-form-head">
    <button class="hb-tool" onclick="S.hbView='list';S.hbEdit=null;S.hbDraft=null;render()">←</button>
    <div class="hb-form-title">${edit ? '编辑习惯' : '新建习惯'}</div>
    <button class="hb-save" onclick="hbSave()">保存</button>
  </div>
  <div class="hb-type-tabs">
    <button class="${isCount ? '' : 'on'}" onclick="hbCollect();S.hbDraft.type='check';render()">✓ 完成与否</button>
    <button class="${isCount ? 'on' : ''}" onclick="hbCollect();S.hbDraft.type='count';render()">123 可量化</button>
  </div>
  <div class="hb-row3">
    ${hbField('习惯标题', `<input id="hbFName" placeholder="${isCount ? '例如：跑步' : '例如：锻炼'}" value="${esc(d.name || '')}">`, 'grow')}
    ${hbField('图标', `<button class="hb-pickbtn" onclick="hbCollect();S.hbPicker='icon';render()">${iconBox}</button>`, 'hb-pickfield')}
    ${hbField('颜色', `<button class="hb-pickbtn" onclick="hbCollect();S.hbPicker='color';render()">${colorBox}</button>`, 'hb-pickfield')}
  </div>
  ${hbField('问题', `<input id="hbFQuestion" placeholder="${isCount ? '例如：今天你跑了几公里？' : '例如：你今天锻炼了吗？'}" value="${esc(d.question || '')}">`)}
  ${hbField('分组', hbSel('hbFGroup', HB_GROUPS.map(g => [g, g]), d.group || '全部'))}
  ${extra}
  ${weekBox}
  ${hbField('提醒', hbSel('hbFRemind', HB_REMINDS, d.reminder || 'off'))}
  ${hbField('备注', `<textarea id="hbFNote" rows="2" placeholder="(选填)">${esc(d.note || '')}</textarea>`)}
  ${edit ? `<div class="row" style="justify-content:center;margin:6px 0 18px"><button class="btn sm warn" onclick="hbDel('${S.hbEdit}')">删除这个习惯</button></div>` : ''}
  ${hbPickerHtml()}`;
}
function hbNewForm(type) {
  S.hbView = 'form'; S.hbEdit = null; S.hbPicker = null;
  S.hbDraft = {
    type: type, name: '', icon: null, color: HABIT_PALETTE[0], question: '', group: '全部',
    freq: 'daily', days: [], unit: '', target: '', autoAdd: 1, targetType: 'atleast',
    reminder: 'off', note: ''
  };
  render();
}
function hbEdit(id) {
  const h = hbData().habits.find(x => x.id === id); if (!h) return;
  S.hbView = 'form'; S.hbEdit = id; S.hbPicker = null;
  S.hbDraft = Object.assign({}, h, { target: h.target || '' });
  render();
}
function hbSave() {
  const d = hbCollect();
  if (!d.name || !d.name.trim()) { alert('请填写习惯标题'); return; }
  const all = store.g('habits', []);
  const obj = {
    id: S.hbEdit || uid(), name: d.name.trim(), type: d.type || 'check',
    icon: d.icon == null ? 0 : +d.icon, color: d.color || HABIT_PALETTE[0],
    question: d.question || '', group: d.group || '全部', freq: d.freq || 'daily', days: d.days || [],
    unit: d.unit || '', target: +(d.target || 0), autoAdd: Math.max(1, +(d.autoAdd || 1)),
    targetType: d.targetType || 'atleast', reminder: d.reminder || 'off', note: d.note || '',
    times: 1, start: '', end: ''
  };
  if (S.hbEdit) {
    const i = all.findIndex(x => x.id === S.hbEdit);
    if (i >= 0) all[i] = Object.assign({}, all[i], obj);
  } else all.push(obj);
  store.s('habits', all);
  S.hbView = 'list'; S.hbEdit = null; S.hbDraft = null; S.hbPicker = null;
  hbInvalidate(); render();
}
function hbDel(id) {
  if (!confirm('删除这个习惯？相关打卡记录也会一并清除。')) return;
  store.s('habits', store.g('habits', []).filter(x => x.id !== id));
  store.s('habitChecks', store.g('habitChecks', []).filter(c => c.habitId !== id));
  store.s('habitValues', store.g('habitValues', []).filter(c => c.habitId !== id));
  S.hbView = 'list'; S.hbEdit = null; S.hbDraft = null;
  hbInvalidate(); render();
}

/* ---------- 弹层：类型 / 图标 / 颜色（图 5-7） ---------- */
function hbPickerHtml() {
  const p = S.hbPicker; if (!p) return '';
  const mask = `<div class="hb-mask" onclick="S.hbPicker=null;render()"></div>`;
  if (p === 'type') return mask + `<div class="hb-sheet hb-sheet-type">
    <div class="hb-sheet-top"><button class="hb-sheet-close" onclick="S.hbPicker=null;render()">关闭</button></div>
    <div class="hb-type-grid">
      <button class="hb-type-opt" onclick="hbNewForm('check')"><b>✓</b><span>完成与否</span><small>今天做到了就打勾</small></button>
      <button class="hb-type-opt" onclick="hbNewForm('count')"><b>123</b><span>可量化</span><small>记录次数 / 数量 / 时长</small></button>
    </div>
  </div>`;
  if (p === 'icon') {
    const cur = (S.hbDraft || {}).icon;
    return mask + `<div class="hb-sheet">
      <div class="hb-sheet-top"><button class="hb-sheet-close" onclick="S.hbPicker=null;render()">关闭</button></div>
      <div class="hb-icon-grid">${Array.from({ length: HB_ICON_N }, (_, i) => `<button class="hb-icon-opt ${cur === i ? 'sel' : ''}" onclick="S.hbDraft.icon=${i};S.hbPicker=null;render()">${hbIcon(i, 46)}</button>`).join('')}</div>
      <button class="hb-ok" onclick="S.hbPicker=null;render()">OK</button>
    </div>`;
  }
  if (p === 'color') {
    const cur = (S.hbDraft || {}).color || HABIT_PALETTE[0];
    return mask + `<div class="hb-sheet">
      <div class="hb-sheet-top"><button class="hb-sheet-close" onclick="S.hbPicker=null;render()">关闭</button></div>
      <div class="hb-color-grid">${HABIT_PALETTE.map(c => `<button class="hb-color-opt ${cur === c ? 'sel' : ''}" style="background:${c}" onclick="S.hbDraft.color='${c}';S.hbPicker=null;render()"></button>`).join('')}</div>
      <div class="li-sub" style="margin-top:10px">选中颜色用于习惯名称、打卡勾和概览方块</div>
      <button class="hb-ok" onclick="S.hbPicker=null;render()">OK</button>
    </div>`;
  }
  return '';
}

/* ---------- 管理页（保留热力图 / 记录查询） ---------- */
function hbSettingsHtml() {
  hbInvalidate();
  const habits = hbData().habits;
  return `
  <div class="hb-head"><div class="hb-title">习惯管理</div><div class="hb-tools"><button class="hb-tool" onclick="S.hbView='list';render()">←</button></div></div>
  <div class="card"><h3>习惯列表</h3>
    ${habits.length ? habits.map(h => `<div class="list-item"><div class="li-main">${hbIcon(h.icon, 28)} <b>${esc(h.name)}</b><div class="li-sub">${h.type === 'count' ? '可量化 · 目标 ' + h.target + ' ' + esc(h.unit || '') : '完成与否'} · ${hbFreqLabel(h)}</div></div>
      <button class="btn sm ghost" onclick="hbEdit('${h.id}')">改</button><button class="btn sm warn" onclick="hbDel('${h.id}')">删</button></div>`).join('') : '<div class="empty">暂无习惯</div>'}
  </div>
  ${typeof render_heatmap === 'function' ? render_heatmap() : ''}
  ${typeof render_habitLog === 'function' ? render_habitLog() : ''}`;
}

function render_habit() {
  const v = S.hbView || 'list';
  if (v === 'form') return hbFormHtml();
  if (v === 'settings') return hbSettingsHtml();
  return hbListHtml();
}
