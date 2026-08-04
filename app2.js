/* ============ 宠物记录 ============ */
/* 按 key 分组汇总进账(in)/使用(out) 数量，返回 {name:{in,out,unit}} */
function petStockSum(arr, key) {
  const m = {};
  arr.forEach(r => {
    const k = r[key]; if (!k) return;
    if (!m[k]) m[k] = { in: 0, out: 0, unit: '' };
    const q = Number(r.qty) || 0;
    const out = r.act === 'out' || (r.kind && r.kind !== '购买');
    if (out) m[k].out += q; else m[k].in += q;
    if (r.unit) m[k].unit = r.unit;
  });
  return m;
}
/* 明细里展示数量（兼容旧记录无数量） */
function petQtyStr(x) {
  if (x.qty != null && x.qty !== '') {
    const out = x.act === 'out' || (x.kind && x.kind !== '购买');
    return (out ? '−' : '+') + x.qty + (x.unit || '');
  }
  if (x.kind) return x.kind;
  return '旧记录';
}
function petIsOut(x) { return x.act === 'out' || (x.kind && x.kind !== '购买'); }
function petData() { return store.g('pet', { bath: [], deworm: [], supply: [], snack: [] }); }
function render_pet() {
  const p = petData();
  const tabs = [['bath', '🛁 洗澡'], ['deworm', '💊 驱虫'], ['supply', '🧺 猫砂猫粮'], ['snack', '🍖 零食']];
  let body = '';
  const del = (k, id) => `<button class="btn sm warn" onclick="delPet('${k}','${id}')">删</button>`;
  if (S.petTab === 'bath') {
    const last = p.bath.length ? p.bath[p.bath.length - 1].date : null;
    body = `<div class="card"><h3>洗澡日期记录 ${last ? `<span class="tag b">上次：${last}</span>` : ''}</h3>
      <div class="row"><input type="date" id="ptDate" value="${today()}"><input class="grow" id="ptNote" placeholder="备注(选填)"><button class="btn" onclick="addPet('bath')">记录 ➕</button></div>
      ${p.bath.slice().reverse().map(x => `<div class="list-item"><div class="li-main">${x.date}${x.note ? ' · ' + esc(x.note) : ''}</div>${del('bath', x.id)}</div>`).join('') || '<div class="empty">暂无洗澡记录</div>'}</div>`;
  } else if (S.petTab === 'deworm') {
    body = `<div class="card"><h3>体内外驱虫记录</h3>
      <div class="row"><input type="date" id="ptDate" value="${today()}"><select id="ptType"><option>体内驱虫</option><option>体外驱虫</option><option>体内+体外</option></select></div>
      <div class="row mt"><input class="grow" id="ptNote" placeholder="药品/备注(选填)"><button class="btn" onclick="addPet('deworm')">记录 ➕</button></div>
      ${p.deworm.slice().reverse().map(x => `<div class="list-item"><div class="li-main">${x.date} · <span class="tag p">${x.type}</span>${x.note ? esc(x.note) : ''}</div>${del('deworm', x.id)}</div>`).join('') || '<div class="empty">暂无驱虫记录</div>'}</div>`;
  } else if (S.petTab === 'supply') {
    const stock = petStockSum(p.supply, 'item');
    const items = ['猫砂', '猫粮'].map(it => {
      const s = stock[it] || { in: 0, out: 0, unit: '' };
      const left = s.in - s.out;
      const low = left <= 0;
      return `<div class="stock-card">
        <div class="li-sub">${it}</div>
        <div class="stock-num" style="color:${low ? 'var(--blue-d)' : 'var(--green-d)'}">${left} <span class="stock-u">${s.unit || '份'}</span></div>
        ${low ? '<div class="li-sub" style="color:var(--blue-d)">⚠ 需补货</div>' : ''}
      </div>`;
    }).join('');
    const supList = p.supply.filter(x => S.petSupplyLog === 'all' || (S.petSupplyLog === 'out' ? petIsOut(x) : !petIsOut(x)));
    body = `<div class="card"><h3>📦 库存概览</h3><div class="row" style="flex-wrap:wrap;gap:10px">${items}</div></div>
      <div class="card"><h3>猫砂 / 猫粮 记录</h3>
        <div class="row"><input type="date" id="ptDate" value="${today()}"><select id="ptItem"><option>猫砂</option><option>猫粮</option></select><select id="ptAct"><option value="in">购买(进账)</option><option value="out">使用(消耗)</option></select></div>
        <div class="row mt"><input id="ptQty" type="number" min="0" step="0.1" placeholder="数量" style="width:78px"><input id="ptUnit" placeholder="单位(kg/包/个)" style="width:108px"><input class="grow" id="ptNote" placeholder="品牌/价格等(选填)"><button class="btn" onclick="addPet('supply')">记录 ➕</button></div>
        <div class="subtabs">
          <button class="btn ${S.petSupplyLog==='all'?'pink':'ghost'}" onclick="S.petSupplyLog='all';render()">全部</button>
          <button class="btn ${S.petSupplyLog==='in'?'pink':'ghost'}" onclick="S.petSupplyLog='in';render()">进账</button>
          <button class="btn ${S.petSupplyLog==='out'?'pink':'ghost'}" onclick="S.petSupplyLog='out';render()">消耗</button>
        </div>
        ${supList.slice().reverse().map(x => `<div class="list-item"><div class="li-main">${x.date} · <span class="tag b">${x.item}</span> <span class="tag ${petIsOut(x) ? 'p' : 'g'}">${petQtyStr(x)}</span>${x.note ? ' · ' + esc(x.note) : ''}</div>${del('supply', x.id)}<button class="btn sm" style="margin-left:5px" onclick="quickUse('supply','${x.id}')">消耗</button></div>`).join('') || '<div class="empty">暂无记录</div>'}</div>`;
  } else {
    const stock = petStockSum(p.snack, 'name');
    const snackCards = Object.keys(stock).map(n => {
      const s = stock[n]; const left = s.in - s.out; const low = left <= 0;
      return `<div class="stock-card">
        <div class="li-sub">${esc(n)}</div>
        <div class="stock-num" style="color:${low ? 'var(--blue-d)' : 'var(--green-d)'}">${left} <span class="stock-u">${s.unit || '份'}</span></div>
        ${low ? '<div class="li-sub" style="color:var(--blue-d)">⚠ 需补货</div>' : ''}
      </div>`;
    }).join('');
    const snList = p.snack.filter(x => S.petSnackLog === 'all' || (S.petSnackLog === 'out' ? x.act === 'out' : x.act !== 'out'));
    body = `${snackCards ? `<div class="card"><h3>🍪 零食库存</h3><div class="row" style="flex-wrap:wrap;gap:10px">${snackCards}</div></div>` : ''}
      <div class="card"><h3>零食记录</h3>
        <div class="row"><input type="date" id="ptDate" value="${today()}"><input class="grow" id="ptName" placeholder="零食名称"></div>
        <div class="row mt"><select id="ptAct"><option value="in">买入(进账)</option><option value="out">消耗</option></select><input id="ptQty" type="number" min="0" step="0.1" placeholder="数量" style="width:78px"><input id="ptUnit" placeholder="单位(包/个)" style="width:98px"><input class="grow" id="ptNote" placeholder="备注(选填)"><button class="btn" onclick="addPet('snack')">记录 ➕</button></div>
        <div class="subtabs">
          <button class="btn ${S.petSnackLog==='all'?'pink':'ghost'}" onclick="S.petSnackLog='all';render()">全部</button>
          <button class="btn ${S.petSnackLog==='in'?'pink':'ghost'}" onclick="S.petSnackLog='in';render()">进账</button>
          <button class="btn ${S.petSnackLog==='out'?'pink':'ghost'}" onclick="S.petSnackLog='out';render()">消耗</button>
        </div>
        ${snList.slice().reverse().map(x => `<div class="list-item"><div class="li-main"><b>${esc(x.name)}</b> · <span class="tag ${x.act === 'out' ? 'p' : 'g'}">${petQtyStr(x)}</span>${x.note ? ' · ' + esc(x.note) : ''}</div>${del('snack', x.id)}<button class="btn sm" style="margin-left:5px" onclick="quickUse('snack','${x.id}')">消耗</button></div>`).join('') || '<div class="empty">暂无零食记录</div>'}</div>`;
  }
  return `<div class="page-title">🐱 宠物记录</div><div class="page-sub">毛孩子的日常，都值得被记录</div>
  <div class="tabs">${tabs.map(t => `<div class="tab ${S.petTab === t[0] ? 'active' : ''}" onclick="S.petTab='${t[0]}';render()">${t[1]}</div>`).join('')}</div>${body}`;
}
function addPet(k) {
  const p = petData(); const d = $('#ptDate').value || today();
  const rec = { id: uid(), date: d, note: $('#ptNote') ? $('#ptNote').value.trim() : '' };
  if (k === 'deworm') rec.type = $('#ptType').value;
  else if (k === 'supply') {
    rec.item = $('#ptItem').value;
    rec.act = $('#ptAct').value;
    rec.qty = Number($('#ptQty').value) || 0;
    rec.unit = $('#ptUnit').value.trim();
  } else if (k === 'snack') {
    rec.name = $('#ptName').value.trim(); if (!rec.name) return;
    rec.act = $('#ptAct').value;
    rec.qty = Number($('#ptQty').value) || 0;
    rec.unit = $('#ptUnit').value.trim();
  }
  p[k].push(rec); p[k].sort((a, b) => a.date < b.date ? -1 : 1); store.s('pet', p); render();
}
function delPet(k, id) { const p = petData(); p[k] = p[k].filter(x => x.id !== id); store.s('pet', p); render(); }
function quickUse(k, id) {
  const p = petData();
  const rec = p[k].find(x => x.id === id);
  if (!rec) return;
  const nm = k === 'supply' ? rec.item : rec.name;
  const unit = rec.unit || '份';
  const v = prompt('记录「' + nm + '」的一次消耗数量（单位：' + unit + '）', '1');
  if (v == null) return;
  const q = Number(v);
  if (!(q > 0)) { if (v.trim() !== '') alert('请输入大于 0 的数量'); return; }
  const n = { id: uid(), date: today(), note: '快速消耗', act: 'out', qty: q, unit: rec.unit || '' };
  if (k === 'supply') n.item = rec.item; else n.name = rec.name;
  p[k].push(n); p[k].sort((a, b) => a.date < b.date ? -1 : 1); store.s('pet', p); render();
}

/* ============ 剪辑创作 ============ */
function clipData() { return store.g('clip', { notes: [], tuts: [], assets: [], pits: [], works: [] }); }
function render_clip() {
  const c = clipData(); const prac = store.g('clipCk', []);
  const tabs = [['notes', '📒 技巧笔记'], ['tuts', '🎓 教程收纳'], ['assets', '🗂 素材备份'], ['pits', '⚠️ 避坑指南'], ['works', '🏆 作品存档']];
  const del = (k, id) => `<button class="btn sm warn" onclick="delClip('${k}','${id}')">删</button>`;
  let body = '';
  if (S.clipTab === 'notes' || S.clipTab === 'pits') {
    const k = S.clipTab, label = k === 'notes' ? '剪辑技巧笔记' : '创作避坑指南';
    body = `<div class="card"><h3>${label}</h3>
      <textarea id="clText" rows="3" placeholder="记录一条${label}…"></textarea>
      <div class="row mt"><button class="btn" onclick="addClip('${k}')">保存 ➕</button></div>
      ${c[k].slice().reverse().map(x => `<div class="list-item"><div class="li-main" style="white-space:pre-wrap">${esc(x.text)}<div class="li-sub">${x.date}</div></div>${del(k, x.id)}</div>`).join('') || '<div class="empty">暂无记录</div>'}</div>`;
  } else if (S.clipTab === 'tuts' || S.clipTab === 'assets') {
    const k = S.clipTab, label = k === 'tuts' ? '教程' : '素材';
    body = `<div class="card"><h3>${label}收纳</h3>
      <div class="row"><input class="grow" id="clTitle" placeholder="${label}名称"></div>
      <div class="row mt"><input class="grow" id="clLink" placeholder="链接 / 存放位置(选填)"><button class="btn" onclick="addClip('${k}')">收纳 ➕</button></div>
      ${c[k].slice().reverse().map(x => `<div class="list-item"><div class="li-main"><b>${esc(x.title)}</b><div class="li-sub">${esc(x.link || '')} · ${x.date}</div></div>${del(k, x.id)}</div>`).join('') || '<div class="empty">暂无收纳</div>'}</div>`;
  } else {
    body = `<div class="card"><h3>作品存档</h3>
      <div class="row"><input class="grow" id="clTitle" placeholder="作品名称"></div>
      <div class="row mt"><input class="grow" id="clLink" placeholder="作品链接/位置(选填)"><button class="btn" onclick="addClip('works')">存档 ➕</button></div>
      ${c.works.slice().reverse().map(x => `<div class="list-item"><div class="li-main"><b>${esc(x.title)}</b><div class="li-sub">${esc(x.link || '')} · ${x.date}</div></div>${del('works', x.id)}</div>`).join('') || '<div class="empty">暂无作品，期待第一个作品！</div>'}</div>`;
  }
  return `<div class="page-title">🎬 剪辑创作</div><div class="page-sub">自媒体创作 · 剪辑技能提升</div>
  <div class="card"><h3>✂️ 剪辑练习打卡</h3>
    <div class="row"><button class="btn pink" onclick="ckToday('clipCk')" ${prac.includes(today()) ? 'disabled' : ''}>${prac.includes(today()) ? '今日已打卡 ✔' : '今日练习打卡 ➕'}</button>
    <span class="li-sub">连续 ${streakOf(prac)} 天 · 累计 ${prac.length} 天 · 作品 ${c.works.length} 个</span></div>
  </div>
  <div class="tabs">${tabs.map(t => `<div class="tab ${S.clipTab === t[0] ? 'active' : ''}" onclick="S.clipTab='${t[0]}';render()">${t[1]}</div>`).join('')}</div>${body}`;
}
function addClip(k) {
  const c = clipData();
  if (k === 'notes' || k === 'pits') { const t = $('#clText').value.trim(); if (!t) return; c[k].push({ id: uid(), text: t, date: today() }); }
  else { const t = $('#clTitle').value.trim(); if (!t) return; c[k].push({ id: uid(), title: t, link: $('#clLink').value.trim(), date: today() }); }
  store.s('clip', c); render();
}
function delClip(k, id) { const c = clipData(); c[k] = c[k].filter(x => x.id !== id); store.s('clip', c); render(); }
