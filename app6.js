/* ============ 快递记录 ============ */
function kdList() { return store.g('kuaidi', []); }
function money(n) { const v = Math.round((+n || 0) * 100) / 100; return Number.isInteger(v) ? String(v) : v.toFixed(2); }

function addKd() {
  const platform = $('#kdPlatform').value.trim();
  const name = $('#kdName').value.trim();
  const date = $('#kdDate').value || today();
  const amount = +$('#kdAmount').value || 0;
  if (!name) { alert('请填写物品名称'); return; }
  const all = kdList();
  all.unshift({ id: uid(), platform: platform, name: name, date: date, amount: amount, done: false });
  store.s('kuaidi', all); render();
}
function toggleKdRefund(id) {
  const all = kdList();
  const k = all.find(x => x.id === id);
  if (k) k.refund = !k.refund;
  store.s('kuaidi', all); render();
}
function toggleKdDone(id) {
  const all = kdList();
  const k = all.find(x => x.id === id);
  if (k) k.done = !k.done;
  store.s('kuaidi', all); render();
}
function delKd(id) { if (!confirm('删除这条记录？')) return; store.s('kuaidi', kdList().filter(x => x.id !== id)); render(); }

/* 统计：退款/退货不计入 */
function kdStat(list) {
  const valid = list.filter(k => !k.refund);
  return {
    count: valid.length,
    amount: Math.round(valid.reduce((a, b) => a + (+b.amount || 0), 0) * 100) / 100
  };
}

function render_kuaidi() {
  const all = kdList();
  const tStr = today();
  const mStr = thisMonth();

  const monthList = all.filter(k => (k.date || '').slice(0, 7) === mStr);
  const dayKeys = [...new Set(monthList.map(k => k.date))].sort();
  const dayRows = dayKeys.map(d => {
    const s = kdStat(monthList.filter(k => k.date === d));
    return { d, count: s.count, amount: s.amount };
  }).reverse();
  const monthStat = kdStat(monthList);
  const todayStat = kdStat(all.filter(k => k.date === tStr));

  const item = k => `<div class="todo ${k.done ? 'done' : ''}">
    <div class="ck" onclick="toggleKdDone('${k.id}')">${k.done ? '✓' : ''}</div>
    <div style="flex:1;min-width:0">
      <div class="li-main">${esc(k.name)}</div>
      <div class="li-sub">
        <span class="tag b">${esc(k.platform || '未填平台')}</span>
        <span class="tag">${esc(k.date)}</span>
        ${k.amount ? '<span class="tag p">¥' + money(k.amount) + '</span>' : ''}
        ${k.refund ? '<span class="tag warn">已退款</span>' : ''}
        ${!k.done && !k.refund ? '<span class="tag">运输中</span>' : ''}
        ${k.done && !k.refund ? '<span class="tag ok">已到货</span>' : ''}
      </div>
    </div>
    <button class="btn sm ${k.done ? 'ghost' : 'pink'}" onclick="toggleKdDone('${k.id}')">${k.done ? '撤销' : '到货 ✓'}</button>
    <button class="btn sm ${k.refund ? 'ghost' : ''}" onclick="toggleKdRefund('${k.id}')">${k.refund ? '撤销退款' : '退款'}</button>
    <button class="btn sm warn" onclick="delKd('${k.id}')">删</button>
  </div>`;

  return `
  <div class="page-title">📦 快递记录</div>
  <div class="page-sub">记每一笔网购 · 退款/退货不计入统计</div>

  <div class="stat-grid">
    <div class="stat"><div class="num">${monthStat.count}</div><div class="lb">本月件数</div></div>
    <div class="stat"><div class="num pk">¥${money(monthStat.amount)}</div><div class="lb">本月金额</div></div>
    <div class="stat"><div class="num">${todayStat.count}</div><div class="lb">今日件数</div></div>
    <div class="stat"><div class="num pk">¥${money(todayStat.amount)}</div><div class="lb">今日金额</div></div>
  </div>

  <div class="card">
    <h3>➕ 新增记录</h3>
    <div class="row mt"><input class="grow" id="kdPlatform" placeholder="购买平台（淘宝 / 京东 / 拼多多 / 抖音…）"></div>
    <div class="row mt"><input class="grow" id="kdName" placeholder="物品名称"></div>
    <div class="row mt">
      <input type="date" id="kdDate" value="${tStr}" max="${tStr}">
      <input type="number" class="grow" id="kdAmount" placeholder="金额 (元)">
    </div>
    <div class="row mt">
      <button class="btn" onclick="addKd()">添加 ➕</button>
    </div>
  </div>

  <div class="card"><h3>📅 本月每日明细</h3>
    ${dayRows.length ? dayRows.map(s => `<div class="list-item"><div class="li-main"><span class="tag b">${s.d}</span> ${s.count} 件 · <b>¥${money(s.amount)}</b></div></div>`).join('') : '<div class="empty">本月还没有记录</div>'}
  </div>

  <div class="card"><h3>📦 全部记录（${all.length}）</h3>
    ${all.length ? all.map(item).join('') : '<div class="empty">还没有快递记录，买点什么犒劳自己吧 🛍️</div>'}
  </div>`;
}
