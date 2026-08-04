/* ============ 记账 ============ */
const EXP_CATS = ['餐饮', '购物', '通勤', '娱乐', '居住', '医疗', '人情', '其他'];
const INC_CATS = ['工资', '理财收益', '副业', '其他'];
const ACCTS = ['支付宝', '微信', '招商银行', '工商银行', '建设银行', '邮政储蓄'];
function acctBalances() {
  const base = store.g('acctBase', {});
  const bal = {}; ACCTS.forEach(a => bal[a] = base[a] || 0);
  store.g('ledger', []).forEach(x => {
    let ac = x.acct; if (ac === '银行卡' || !ac) ac = '招商银行'; // 旧数据“银行卡”并入招商银行
    if (!bal.hasOwnProperty(ac)) return;
    if (x.type === '收入') bal[ac] += x.amt; else if (x.type === '支出') bal[ac] -= x.amt;
  });
  return bal;
}
function saveAcctBase() {
  const base = {}; ACCTS.forEach((a, i) => { base[a] = (+$('#ab' + i).value) || 0; });
  store.s('acctBase', base); S.acctEdit = false; render();
}
function ledgerTabBar() {
  const tabs = [['main', '🧾 记账'], ['repay', '💳 还款'], ['loan', '📤 其他']];
  return `<div class="subtabs">${tabs.map(t => `<button class="btn sm ${S.ledTab === t[0] ? 'pink' : 'ghost'}" onclick="S.ledTab='${t[0]}';render()">${t[1]}</button>`).join('')}</div>`;
}
function render_ledger() {
  if (S.ledTab === 'repay') {
    return `<div class="page-title">🧾 记账</div>
  <div class="page-sub">每一笔都清清楚楚</div>
  ${ledgerTabBar()}
  ${repayFrag()}`;
  }
  if (S.ledTab === 'loan') {
    return `<div class="page-title">🧾 记账</div>
  <div class="page-sub">每一笔都清清楚楚</div>
  ${ledgerTabBar()}
  ${loanFrag()}`;
  }
  const all = store.g('ledger', []);
  const m = S.ledMonth;
  const list = all.filter(x => x.date.slice(0, 7) === m).sort((a, b) => b.date.localeCompare(a.date));
  const inc = list.filter(x => x.type === '收入').reduce((a, b) => a + b.amt, 0);
  const exp = list.filter(x => x.type === '支出').reduce((a, b) => a + b.amt, 0);
  const _bal = acctBalances();
  const totalBal = ACCTS.reduce((a, n) => a + (_bal[n] || 0), 0);
  const byCat = {};
  list.filter(x => x.type === '支出').forEach(x => byCat[x.cat] = (byCat[x.cat] || 0) + x.amt);
  return `
  <div class="page-title">🧾 记账</div>
  <div class="page-sub">每一笔都清清楚楚</div>
  ${ledgerTabBar()}
  <div class="card">
    <div class="row"><input type="month" value="${m}" onchange="S.ledMonth=this.value;render()"></div>
    <div class="stat-grid g2" style="margin-top:10px">
      <div class="stat"><div class="num" style="color:var(--green-d)">¥${inc.toFixed(0)}</div><div class="lb">本月收入</div></div>
      <div class="stat"><div class="num pk">¥${exp.toFixed(0)}</div><div class="lb">本月支出</div></div>
      <div class="stat"><div class="num">¥${(inc - exp).toFixed(0)}</div><div class="lb">本月净收支</div></div>
      <div class="stat"><div class="num" style="color:var(--blue)">¥${totalBal.toFixed(0)}</div><div class="lb">账户总余额</div></div>
    </div>
  </div>
  <div class="card"><h3>💰 账户余额</h3>
    ${(() => { const bal = acctBalances(); const base = store.g('acctBase', {}); const total = ACCTS.reduce((a, n) => a + (bal[n] || 0), 0);
      const row = (n, v) => `<div class="row" style="justify-content:space-between"><span class="li-sub">${n}</span><b style="color:var(--green-d)">¥${v.toFixed(0)}</b></div>`;
      const set = S.acctEdit ? `<div class="row mt" style="flex-wrap:wrap;gap:6px;align-items:center">
        ${ACCTS.map((a, i) => `<label class="li-sub">${a}初始<input type="number" id="ab${i}" value="${base[a] || 0}" style="width:74px"></label>`).join('')}
        <button class="btn sm" onclick="saveAcctBase()">保存</button>
        <button class="btn sm ghost" onclick="S.acctEdit=false;render()">取消</button>
      </div>` : `<div class="row mt"><button class="btn sm ghost" onclick="S.acctEdit=true;render()">⚙ 设置初始余额</button></div>`;
      return ACCTS.map(a => row(a, bal[a])).join('') +
        `<div class="row" style="justify-content:space-between;margin-top:4px;border-top:1px dashed var(--line);padding-top:6px"><b>合计</b><b style="color:var(--blue)">¥${total.toFixed(0)}</b></div>` + set;
    })()}
  </div>
  <div class="card"><h3>➕ 记一笔</h3>
    <div class="row">
      <select id="ldType" onchange="render_ledger_cats(this.value)"><option>支出</option><option>收入</option></select>
      <select id="ldCat">${EXP_CATS.map(c => `<option>${c}</option>`).join('')}</select>
      <input type="number" id="ldAmt" placeholder="金额 ¥">
    </div>
    <div class="row mt">
      <input type="date" id="ldDate" value="${today()}">
      <select id="ldAcct">${ACCTS.map(c => `<option>${c}</option>`).join('')}</select>
      <input class="grow" id="ldNote" placeholder="备注(选填)">
      <button class="btn" onclick="addLedger()">记账 ➕</button>
    </div>
  </div>
  ${Object.keys(byCat).length ? `<div class="card"><h3>📊 本月支出分类</h3>
    ${Object.entries(byCat).sort((a, b) => b[1] - a[1]).map(([c, v]) => {
      const pct = exp ? Math.round(v / exp * 100) : 0;
      return `<div style="margin-bottom:8px"><div class="row" style="justify-content:space-between"><span>${c}</span><span class="li-sub">¥${v.toFixed(0)} · ${pct}%</span></div><div class="bar"><i style="width:${pct}%"></i></div></div>`;
    }).join('')}</div>` : ''}
  <div class="card"><h3>📅 每日明细（${list.length} 笔）</h3>
    ${(() => {
      const days = {};
      list.forEach(x => { (days[x.date] = days[x.date] || []).push(x); });
      const dates = Object.keys(days).sort((a, b) => b.localeCompare(a));
      if (!dates.length) return '<div class="empty">本月还没有账目</div>';
      return dates.map(d => {
        const items = days[d].slice().sort((a, b) => (b.id || '').localeCompare(a.id || ''));
        const dExp = items.filter(x => x.type === '支出').reduce((s, x) => s + x.amt, 0);
        const dInc = items.filter(x => x.type === '收入').reduce((s, x) => s + x.amt, 0);
        const wd = WD_SHORT[new Date(d + 'T00:00:00').getDay()];
        return `<div class="day-group">
          <div class="day-head">
            <span class="day-date">${d.slice(5)} <span class="li-sub">周${wd}</span></span>
            <span class="day-sum">
              <span class="li-sub">支出 <b class="exp">¥${dExp.toFixed(0)}</b></span>
              ${dInc ? `<span class="li-sub" style="margin-left:8px">收入 <b class="inc">¥${dInc.toFixed(0)}</b></span>` : ''}
              <span class="li-sub" style="margin-left:8px">${items.length} 笔</span>
            </span>
          </div>
          ${items.map(x => `<div class="list-item sub"><div class="li-main">
            <span class="tag ${x.type === '收入' ? 'g' : 'p'}">${x.type}</span><span class="tag b">${x.cat}</span><b>¥${x.amt}</b>
            ${x.note ? `<div class="li-sub">${esc(x.note)}</div>` : ''}</div>
            <button class="btn sm warn" onclick="delLedger('${x.id}')">删</button></div>`).join('')}
        </div>`;
      }).join('');
    })()}
  </div>
`;}
/* ============ 还款管理（与收支分开，独立页面） ============ */
function repayFrag() { return repaySection(); }
function render_repay() {
  return `
  <div class="page-title">💳 还款管理</div>
  <div class="page-sub">与日常收支分开记录，每月还款日前提醒你</div>
  ${repayFrag()}`;
}
function repayNext(plan) {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  let y = now.getFullYear(), mo = now.getMonth();
  let t = new Date(y, mo, Math.min(plan.payDay || 1, 28));
  if (t < now) { mo++; if (mo > 11) { mo = 0; y++; } t = new Date(y, mo, Math.min(plan.payDay || 1, 28)); }
  const days = Math.round((t - now) / 864e5);
  return { date: t, days };
}
function repaySection() {
  const plans = store.g('repayPlans', []);
  const recs = store.g('repayRecords', []);
  const m = S.ledMonth;
  const totalAll = plans.reduce((a, p) => a + (parseFloat(p.total) || 0), 0);
  const paidAll = plans.reduce((a, p) => a + (parseFloat(p.paid) || 0), 0);
  const remainAll = Math.max(0, totalAll - paidAll);
  const monthlyTotal = plans.reduce((a, p) => a + (parseFloat(p.monthly) || 0), 0);
  const mPaid = recs.filter(r => r.date.slice(0, 7) === m).reduce((a, r) => a + r.amt, 0);
  const edit = S.repayEdit ? plans.find(x => x.id === S.repayEdit) : null;
  const mRecs = recs.filter(r => r.date.slice(0, 7) === m).sort((a, b) => b.date.localeCompare(a.date));
  const planName = id => (plans.find(p => p.id === id) || {}).name || '已删除';
  const planMonthPaid = p => recs.filter(r => r.planId === p.id && r.date.slice(0, 7) === m).reduce((a, r) => a + r.amt, 0);
  const unpaid = plans.map(p => ({ p, r: repayNext(p), mp: planMonthPaid(p) }))
    .filter(x => (parseFloat(x.p.monthly) || 0) - x.mp > 0.001)
    .sort((a, b) => a.r.days - b.r.days);
  const soonest = unpaid[0] || null;
  const stat = `
  <div class="stat-grid">
    <div class="stat"><div class="num" style="color:var(--blue)">¥${totalAll.toFixed(0)}</div><div class="lb">总还款金额</div></div>
    <div class="stat"><div class="num" style="color:var(--green-d)">¥${monthlyTotal.toFixed(0)}</div><div class="lb">月总还款金额</div></div>
    <div class="stat"><div class="num" style="color:var(--green-d)">¥${mPaid.toFixed(0)}</div><div class="lb">本月已还</div></div>
    <div class="stat"><div class="num">¥${remainAll.toFixed(0)}</div><div class="lb">剩余未还</div></div>
  </div>`;
  const remind = soonest ? (soonest.r.days === 0
    ? `<div class="repay-alert">🔔 今天也要还款啦：${esc(soonest.p.name)} · 本月应还 ¥${(+soonest.p.monthly).toFixed(0)}（已还 ¥${soonest.mp.toFixed(0)}）</div>`
    : `<div class="repay-alert">🔔 即将还款：${esc(soonest.p.name)} · 下次 ${soonest.r.date.getFullYear()}-${pad(soonest.r.date.getMonth() + 1)}-${pad(soonest.r.date.getDate())} · 还有 ${soonest.r.days} 天（已还 ¥${soonest.mp.toFixed(0)}/${(+soonest.p.monthly).toFixed(0)}）</div>`)
    : (plans.length ? '<div class="repay-alert ok">✅ 本月还款提醒已全部结清，辛苦啦 🎉</div>' : '<div class="repay-alert ok">暂无还款计划，添加后这里会在每月还款日前提醒你 🗓️</div>');
  const planCard = p => {
    const total = parseFloat(p.total) || 0, paid = parseFloat(p.paid) || 0, monthly = parseFloat(p.monthly) || 0;
    const remain = Math.max(0, total - paid);
    const pct = total ? Math.round(paid / total * 100) : 0;
    const r = repayNext(p);
    const mp = planMonthPaid(p);
    const due = mp > 0.001 ? `本月已还 ¥${mp.toFixed(0)} ✅` : (r.days === 0 ? '今天应还 🔔' : (r.days <= 3 ? `还有 ${r.days} 天 ⏰` : `还有 ${r.days} 天`));
    return `<div class="card repay-card">
      <div class="row" style="justify-content:space-between">
        <div class="li-main" style="font-weight:700">${esc(p.name)}</div>
        <div class="row" style="gap:6px">
          <button class="btn sm ghost" onclick="editRepayPlan('${p.id}')">改</button>
          <button class="btn sm warn" onclick="delRepayPlan('${p.id}')">删</button>
        </div>
      </div>
      ${p.note ? `<div class="li-sub">${esc(p.note)}</div>` : ''}
      <div class="row" style="justify-content:space-between;margin-top:6px">
        <span class="li-sub">总还款 ¥${total.toFixed(0)}</span>
        <span class="li-sub">月还 ¥${monthly.toFixed(0)}</span>
      </div>
      <div style="margin:6px 0"><div class="row" style="justify-content:space-between"><span class="li-sub">已还 ¥${paid.toFixed(0)} / 剩余 ¥${remain.toFixed(0)}</span><span class="li-sub">${pct}%</span></div><div class="bar"><i style="width:${pct}%"></i></div></div>
      <div class="row" style="justify-content:space-between">
        <span class="tag ${r.days <= 3 ? 'p' : 'b'}">${due}</span>
        <button class="btn sm p" onclick="S.repayPlan='${p.id}';render()">记还款</button>
      </div>
    </div>`;
  };
  return `
  <div class="repay-section">
    <div class="page-sub" style="margin-top:6px">💳 还款管理（与收支分开）</div>
    <div class="card">${stat}${remind}</div>
    <div class="card"><h3>➕ 添加还款计划</h3>
      <div class="row">
        <input class="grow" id="rpName" placeholder="名称，如 房贷 / 车贷 / 信用卡" value="${edit ? esc(edit.name) : ''}">
        <input type="number" id="rpTotal" placeholder="总还款金额" value="${edit ? edit.total : ''}" style="width:120px">
      </div>
      <div class="row mt">
        <input type="number" id="rpMonthly" placeholder="月还款金额" value="${edit ? edit.monthly : ''}" style="width:120px">
        <label class="row" style="gap:4px;font-size:13px">每月<input type="number" id="rpPayDay" min="1" max="28" value="${edit ? (edit.payDay || 1) : 1}" style="width:54px">日</label>
      </div>
      <div class="row mt">
        <input class="grow" id="rpNote" placeholder="备注(选填)" value="${edit ? esc(edit.note || '') : ''}">
        <button class="btn ${edit ? 'pink' : ''}" onclick="saveRepayPlan()">${edit ? '保存修改 ✔' : '添加计划 ➕'}</button>
        ${edit ? '<button class="btn sm ghost" onclick="S.repayEdit=null;render()">取消</button>' : ''}
      </div>
    </div>
    ${S.repayPlan ? `<div class="card"><h3>💸 记录一笔还款</h3>
      <div class="row">
        <select id="rrPlan">${plans.map(p => `<option value="${p.id}" ${p.id === S.repayPlan ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}</select>
        <input type="number" id="rrAmt" placeholder="还款金额" style="width:110px">
        <input type="date" id="rrDate" value="${today()}">
      </div>
      <div class="row mt"><input class="grow" id="rrNote" placeholder="备注(选填)"><button class="btn" onclick="addRepayRec()">记还款 ✔</button><button class="btn sm ghost" onclick="S.repayPlan=null;render()">取消</button></div>
    </div>` : ''}
    ${plans.length ? plans.map(planCard).join('') : '<div class="empty">还没有还款计划，先添加一个吧～</div>'}
    <div class="card"><h3>本月还款明细（${mRecs.length} 笔）</h3>
      ${mRecs.map(r => `<div class="list-item"><div class="li-main">
        <span class="tag p">还款</span><b>¥${r.amt.toFixed(0)}</b>
        <div class="li-sub">${planName(r.planId)}${r.note ? ' · ' + esc(r.note) : ''} · ${r.date}</div></div>
        <button class="btn sm warn" onclick="delRepayRec('${r.id}')">删</button></div>`).join('') || '<div class="empty">本月还没有还款记录</div>'}
    </div>
  </div>`;
}
function saveRepayPlan() {
  const name = $('#rpName').value.trim(); if (!name) return;
  const obj = { name, total: +$('#rpTotal').value || 0, monthly: +$('#rpMonthly').value || 0, payDay: Math.min(28, Math.max(1, +$('#rpPayDay').value || 1)), note: $('#rpNote').value.trim() };
  const all = store.g('repayPlans', []);
  if (S.repayEdit) { const i = all.findIndex(x => x.id === S.repayEdit); if (i >= 0) { const wasPaid = all[i].paid || 0; all[i] = { ...all[i], ...obj, paid: wasPaid }; } S.repayEdit = null; }
  else all.push({ id: uid(), paid: 0, ...obj });
  store.s('repayPlans', all); render();
}
function editRepayPlan(id) { S.repayEdit = id; S.repayPlan = null; render(); }
function delRepayPlan(id) { if (!confirm('删除这个还款计划？已记录的还款流水会保留。')) return; store.s('repayPlans', store.g('repayPlans', []).filter(x => x.id !== id)); render(); }
function addRepayRec() {
  const planId = $('#rrPlan').value; const amt = +$('#rrAmt').value; if (!amt || amt <= 0) return;
  const recs = store.g('repayRecords', []);
  recs.push({ id: uid(), planId, date: $('#rrDate').value || today(), amt, note: $('#rrNote').value.trim() });
  const plans = store.g('repayPlans', []); const i = plans.findIndex(p => p.id === planId);
  if (i >= 0) plans[i].paid = (parseFloat(plans[i].paid) || 0) + amt;
  store.s('repayRecords', recs); store.s('repayPlans', plans); S.repayPlan = null; render();
}
function delRepayRec(id) {
  const recs = store.g('repayRecords', []);
  const r = recs.find(x => x.id === id); if (!r) return;
  if (!confirm('删除这笔还款记录？会同步扣减已还金额。')) return;
  const plans = store.g('repayPlans', []); const i = plans.findIndex(p => p.id === r.planId);
  if (i >= 0) plans[i].paid = Math.max(0, (parseFloat(plans[i].paid) || 0) - r.amt);
  store.s('repayRecords', recs.filter(x => x.id !== id)); store.s('repayPlans', plans); render();
}
/* ============ 其他管理（与收支分开，独立存储，不参与记账） ============ */
function loanFrag() { return loanSection(); }
function loanSection() {
  const plans = store.g('loanPlans', []);
  const recs = store.g('loanRecords', []);
  const m = S.ledMonth;
  const recAmt = r => parseFloat(r.amt) || ((parseFloat(r.principal) || 0) + (parseFloat(r.interest) || 0)) || 0;
  const planName = id => (plans.find(p => p.id === id) || {}).name || '已删除';
  const planPaid = p => recs.filter(r => r.planId === p.id).reduce((a, r) => a + recAmt(r), 0);
  const planCount = p => recs.filter(r => r.planId === p.id).length;
  const planMonthPaid = p => recs.filter(r => r.planId === p.id && r.date.slice(0, 7) === m).reduce((a, r) => a + recAmt(r), 0);
  const totalOf = p => parseFloat(p.total) || 0;
  const monthlyOf = p => parseFloat(p.monthly) || 0;
  const monthsOf = p => parseInt(p.months) || 0;
  const freqOf = p => p.freqLoan || 'monthly';
  const periodLabel = p => freqOf(p) === 'yearly' ? '年供' : '月供';
  const repayOf = p => monthlyOf(p) * monthsOf(p);
  const interestOf = p => Math.max(0, repayOf(p) - totalOf(p));
  const edit = S.loanEdit ? plans.find(x => x.id === S.loanEdit) : null;
  const y = new Date().getFullYear();
  const mRecs = recs.filter(r => r.date.slice(0, 7) === m).sort((a, b) => b.date.localeCompare(a.date));
  const totalAll = plans.reduce((a, p) => a + totalOf(p), 0);
  const interestAll = plans.reduce((a, p) => a + interestOf(p), 0);
  const repayAll = plans.reduce((a, p) => a + repayOf(p), 0);
  const paidAll = recs.reduce((a, r) => a + recAmt(r), 0);
  const remainAll = Math.max(0, repayAll - paidAll);
  const loanNext = p => {
    const now = new Date(); now.setHours(0, 0, 0, 0);
    if (freqOf(p) === 'yearly') {
      const mo = Math.min(12, Math.max(1, +p.payDay || 1)) - 1;
      let yr = now.getFullYear(); let t = new Date(yr, mo, 1);
      if (t < now) { yr++; t = new Date(yr, mo, 1); }
      return { date: t, days: Math.round((t - now) / 864e5) };
    }
    const pd = Math.min(28, Math.max(1, +p.payDay || 1));
    let yy = now.getFullYear(), mo = now.getMonth(); let t = new Date(yy, mo, pd);
    if (t < now) { mo++; if (mo > 11) { mo = 0; yy++; } t = new Date(yy, mo, pd); }
    return { date: t, days: Math.round((t - now) / 864e5) };
  };
  const loanPeriodPaid = p => freqOf(p) === 'yearly'
    ? recs.filter(r => r.planId === p.id && r.date.slice(0, 4) === String(y)).reduce((a, r) => a + recAmt(r), 0)
    : planMonthPaid(p);
  const unpaid = plans.map(p => ({ p, r: loanNext(p), mp: loanPeriodPaid(p) }))
    .filter(x => monthlyOf(x.p) - x.mp > 0.001)
    .sort((a, b) => a.r.days - b.r.days);
  const soonest = unpaid[0] || null;
  const stat = `
  <div class="stat-grid">
    <div class="stat"><div class="num" style="color:var(--blue)">¥${totalAll.toFixed(0)}</div><div class="lb">本金总额</div></div>
    <div class="stat"><div class="num" style="color:#d96a8f">¥${interestAll.toFixed(0)}</div><div class="lb">利息总额(自动)</div></div>
    <div class="stat"><div class="num">¥${repayAll.toFixed(0)}</div><div class="lb">总应还</div></div>
    <div class="stat"><div class="num" style="color:var(--green-d)">¥${paidAll.toFixed(0)}</div><div class="lb">已还金额</div></div>
  </div>`;
  const periodWord = p => freqOf(p) === 'yearly' ? '本年' : '本月';
  const remind = soonest ? (soonest.r.days === 0
    ? `<div class="repay-alert">🔔 今天也要记啦：${esc(soonest.p.name)} · ${periodWord(soonest.p)}应记 ¥${monthlyOf(soonest.p).toFixed(0)}（已记 ¥${soonest.mp.toFixed(0)}）</div>`
    : `<div class="repay-alert">🔔 即将记录：${esc(soonest.p.name)} · 下次 ${soonest.r.date.getFullYear()}-${pad(soonest.r.date.getMonth() + 1)}-${pad(soonest.r.date.getDate())} · 还有 ${soonest.r.days} 天（已记 ¥${soonest.mp.toFixed(0)}/${monthlyOf(soonest.p).toFixed(0)}）</div>`)
    : (plans.length ? '<div class="repay-alert ok">✅ 记录提醒已全部结清，辛苦啦 🎉</div>' : '<div class="repay-alert ok">暂无其他计划，添加后这里会在每期日前提醒你 🗓️</div>');
  const planCard = p => {
    const total = totalOf(p), monthly = monthlyOf(p), months = monthsOf(p);
    const repay = repayOf(p), interest = interestOf(p);
    const paid = planPaid(p), count = planCount(p);
    const remain = Math.max(0, repay - paid);
    const pct = repay ? Math.round(paid / repay * 100) : 0;
    const r = loanNext(p);
    const mp = loanPeriodPaid(p);
    const due = mp > 0.001 ? `${periodWord(p)}已记 ¥${mp.toFixed(0)} ✅` : (r.days === 0 ? '今天应记 🔔' : (r.days <= 3 ? `还有 ${r.days} 天 ⏰` : `还有 ${r.days} 天`));
    return `<div class="card repay-card">
      <div class="row" style="justify-content:space-between">
        <div class="li-main" style="font-weight:700">${esc(p.name)}</div>
        <div class="row" style="gap:6px">
          <button class="btn sm ghost" onclick="editLoanPlan('${p.id}')">改</button>
          <button class="btn sm warn" onclick="delLoanPlan('${p.id}')">删</button>
        </div>
      </div>
      ${p.note ? `<div class="li-sub">${esc(p.note)}</div>` : ''}
      <div class="row" style="justify-content:space-between;margin-top:6px">
        <span class="li-sub">本金 ¥${total.toFixed(0)}</span>
        <span class="li-sub">${periodLabel(p)} ¥${monthly.toFixed(0)}</span>
        <span class="li-sub">${months} ${freqOf(p) === 'yearly' ? '年' : '期'}</span>
      </div>
      <div class="li-sub" style="margin-top:2px;color:#d96a8f">利息总额 ¥${interest.toFixed(0)}（每期¥${monthly.toFixed(0)}×${months}期 − 本金，自动）</div>
      <div style="margin:6px 0"><div class="row" style="justify-content:space-between"><span class="li-sub">已还 ¥${paid.toFixed(0)} / 总应还 ¥${repay.toFixed(0)}</span><span class="li-sub">${pct}%</span></div><div class="bar"><i style="width:${pct}%"></i></div></div>
      <div class="li-sub">已还 ${count} ${freqOf(p) === 'yearly' ? '年' : '期'} / 共 ${months} ${freqOf(p) === 'yearly' ? '年' : '期'}</div>
      <div class="row" style="justify-content:space-between;margin-top:6px">
        <span class="tag ${r.days <= 3 ? 'p' : 'b'}">${due}</span>
        <button class="btn sm p" onclick="S.loanPlan='${p.id}';render()">记一笔</button>
      </div>
    </div>`;
  };
  const mPaidSum = mRecs.reduce((a, r) => a + recAmt(r), 0);
  return `
  <div class="repay-section">
    <div class="page-sub" style="margin-top:6px">📤 其他管理（与收支分开，独立记录）</div>
    <div class="card">${stat}${remind}</div>
    <div class="card"><h3>➕ 添加其他计划</h3>
      <div class="row">
        <input class="grow" id="lpName" placeholder="名称，如 房贷 / 车贷 / 信用卡" value="${edit ? esc(edit.name) : ''}">
        <input type="number" id="lpTotal" placeholder="本金总额" value="${edit ? edit.total : ''}" style="width:110px">
      </div>
      <div class="row mt">
        <select id="lpFreq">
          <option value="monthly" ${edit && freqOf(edit) !== 'yearly' ? 'selected' : ''}>月供</option>
          <option value="yearly" ${edit && freqOf(edit) === 'yearly' ? 'selected' : ''}>年供</option>
        </select>
        <input type="number" id="lpMonthly" placeholder="每期 ¥" value="${edit ? edit.monthly : ''}" style="width:100px">
        <input type="number" id="lpMonths" placeholder="还几期" value="${edit ? edit.months : ''}" style="width:80px">
        <label class="row" style="gap:4px;font-size:13px">${edit && freqOf(edit) === 'yearly' ? '每年' : '每月'}<input type="number" id="lpPayDay" min="1" max="${edit && freqOf(edit) === 'yearly' ? 12 : 28}" value="${edit ? (edit.payDay || 1) : 1}" style="width:54px">${edit && freqOf(edit) === 'yearly' ? '月' : '日'}</label>
      </div>
      <div class="row mt">
        <input class="grow" id="lpNote" placeholder="备注(选填)" value="${edit ? esc(edit.note || '') : ''}">
        <button class="btn ${edit ? 'pink' : ''}" onclick="saveLoanPlan()">${edit ? '保存修改 ✔' : '添加计划 ➕'}</button>
        ${edit ? '<button class="btn sm ghost" onclick="S.loanEdit=null;render()">取消</button>' : ''}
      </div>
      ${edit ? `<div class="li-sub" style="margin-top:6px;color:#d96a8f">利息总额（自动）= 每期¥${parseFloat(edit.monthly) || 0}×${edit.months || 0}期 − 本金 = ¥${Math.max(0, (parseFloat(edit.monthly) || 0) * (parseInt(edit.months) || 0) - (parseFloat(edit.total) || 0)).toFixed(0)}</div>` : ''}
    </div>
    ${S.loanPlan ? `<div class="card"><h3>💸 记一笔（每期还款）</h3>
      <div class="row">
        <select id="lrPlan">${plans.map(p => `<option value="${p.id}" ${p.id === S.loanPlan ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}</select>
        <input type="number" id="lrAmt" placeholder="金额 ¥" style="width:110px">
        <input type="date" id="lrDate" value="${today()}">
      </div>
      <div class="row mt"><input class="grow" id="lrNote" placeholder="备注(选填)"><button class="btn" onclick="addLoanRec()">记录 ✔</button><button class="btn sm ghost" onclick="S.loanPlan=null;render()">取消</button></div>
    </div>` : ''}
    ${plans.length ? plans.map(planCard).join('') : '<div class="empty">还没有其他计划，先添加一个吧～</div>'}
    <div class="card"><h3>本月明细（${mRecs.length} 笔）</h3>
      ${mRecs.length ? `<div class="row" style="justify-content:space-between;margin-bottom:6px"><span class="li-sub">本月已还 ¥${mPaidSum.toFixed(0)}</span></div>` : ''}
      ${mRecs.map(r => `<div class="list-item"><div class="li-main">
        <span class="tag b">还款</span><b>¥${recAmt(r).toFixed(0)}</b>
        <div class="li-sub">${planName(r.planId)}${r.note ? ' · ' + esc(r.note) : ''} · ${r.date}</div></div>
        <button class="btn sm warn" onclick="delLoanRec('${r.id}')">删</button></div>`).join('') || '<div class="empty">本月还没有其他记录</div>'}
    </div>
  </div>`;
}
function saveLoanPlan() {
  const name = $('#lpName').value.trim(); if (!name) return;
  const freq = $('#lpFreq').value;
  const obj = { name, total: +$('#lpTotal').value || 0, monthly: +$('#lpMonthly').value || 0, months: +$('#lpMonths').value || 0, freqLoan: freq, payDay: Math.min(freq === 'yearly' ? 12 : 28, Math.max(1, +$('#lpPayDay').value || 1)), note: $('#lpNote').value.trim() };
  const all = store.g('loanPlans', []);
  if (S.loanEdit) { const i = all.findIndex(x => x.id === S.loanEdit); if (i >= 0) all[i] = { ...all[i], ...obj }; S.loanEdit = null; }
  else all.push({ id: uid(), ...obj });
  store.s('loanPlans', all); render();
}
function editLoanPlan(id) { S.loanEdit = id; S.loanPlan = null; render(); }
function delLoanPlan(id) { if (!confirm('删除这个其他计划？已记录的流水会保留。')) return; store.s('loanPlans', store.g('loanPlans', []).filter(x => x.id !== id)); render(); }
function addLoanRec() {
  const planId = $('#lrPlan').value;
  const amt = +$('#lrAmt').value; if (!amt || amt <= 0) return;
  const recs = store.g('loanRecords', []);
  recs.push({ id: uid(), planId, date: $('#lrDate').value || today(), amt, note: $('#lrNote').value.trim() });
  store.s('loanRecords', recs); S.loanPlan = null; render();
}
function delLoanRec(id) {
  if (!confirm('删除这笔记录？')) return;
  const recs = store.g('loanRecords', []);
  store.s('loanRecords', recs.filter(x => x.id !== id)); render();
}
function render_ledger_cats(type) {
  const cats = type === '收入' ? INC_CATS : EXP_CATS;
  $('#ldCat').innerHTML = cats.map(c => `<option>${c}</option>`).join('');
}
function addLedger() {
  const amt = +$('#ldAmt').value; if (!amt || amt <= 0) return;
  const all = store.g('ledger', []);
  all.push({ id: uid(), date: $('#ldDate').value || today(), type: $('#ldType').value, cat: $('#ldCat').value, amt, note: $('#ldNote').value.trim(), acct: $('#ldAcct').value });
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
function render_habit() {
  const habits = store.g('habits', []);
  const checks = store.g('habitChecks', []);
  const edit = S.habitEdit ? habits.find(x => x.id === S.habitEdit) : null;
  const t = today();
  const doneToday = habits.filter(h => habitActiveToday(h) && habitTodayChecks(h).length >= h.times).length;
  const checkedToday = checks.filter(c => c.ts.slice(0, 10) === t).length;
  const activeCnt = habits.filter(habitActiveToday).length;
  const card = h => {
    const hc = habitTodayChecks(h);
    const done = hc.length, reached = done >= h.times, active = habitActiveToday(h), streak = habitStreak(h);
    const timeTxt = (h.start && h.end) ? (h.start + ' – ' + h.end) : h.start ? ('从 ' + h.start) : h.end ? ('至 ' + h.end) : '不限时间';
    return `<div class="card ${active ? '' : 'habit-off'}">
      <div class="row" style="justify-content:space-between">
        <div class="li-main" style="font-weight:700">${esc(h.name)}</div>
        <div class="row" style="gap:6px">
          <button class="btn sm ghost" onclick="S.habitTab='add';S.habitEdit='${h.id}';render()">改</button>
          <button class="btn sm warn" onclick="delHabit('${h.id}')">删</button>
        </div>
      </div>
      ${h.note ? `<div class="li-sub">${esc(h.note)}</div>` : ''}
      <div class="row" style="justify-content:space-between;margin-top:6px;flex-wrap:wrap;gap:4px">
        <span class="li-sub">🕒 ${timeTxt}</span>
        <span class="li-sub">📆 ${freqLabel(h)}</span>
        <span class="li-sub">🔁 ${h.times} 次/日</span>
        ${streak > 0 ? `<span class="li-sub">🔥 连续 ${streak} 天</span>` : ''}
      </div>
      ${active ? `<div class="row" style="justify-content:space-between;margin-top:8px">
          <span class="tag ${reached ? 'g' : 'p'}">${done} / ${h.times} 次</span>
          <button class="btn sm ${reached ? 'ghost' : 'p'}" onclick="checkHabit('${h.id}')">${reached ? '已达标 🎉' : '打卡 ➕'}</button>
        </div>`
      : `<div class="li-sub" style="margin-top:8px">😴 今天是该习惯的休息日</div>`}
    </div>`;
  };
  const showWeek = edit && edit.freq === 'weekly';
  const dayChecks = edit ? (edit.days || []) : [];
  return `
  <div class="page-title">🌿 习惯打卡</div>
  <div class="page-sub">把好习惯变成每天的仪式感 · 打卡即记录时间点</div>
  <div class="subtabs">
    <button class="btn ${S.habitTab==='check' ? 'pink' : 'ghost'}" onclick="S.habitTab='check';S.habitEdit=null;render()">📋 打卡</button>
    <button class="btn ${S.habitTab==='add' ? 'pink' : 'ghost'}" onclick="S.habitTab='add';S.habitEdit=null;render()">➕ 添加习惯</button>
  </div>
  ${S.habitTab==='add'
    ? `<div class="card"><h3>${edit ? '修改习惯' : '添加习惯'}</h3>
        <div class="row"><input class="grow" id="hbName" placeholder="习惯名称，如 早睡 / 早起 / 喝水 / 背单词 / 学习" value="${edit ? esc(edit.name) : ''}"></div>
        <div class="row mt">
          <label class="li-sub">开始(选填)<input type="time" id="hbStart" value="${edit ? edit.start : ''}"></label>
          <label class="li-sub">结束(选填)<input type="time" id="hbEnd" value="${edit ? edit.end : ''}"></label>
          <select id="hbFreq" onchange="document.getElementById('hbWeekBox').style.display=this.value==='weekly'?'':'none'">${FREQS.map(f => `<option value="${f[0]}" ${edit && edit.freq === f[0] ? 'selected' : ''}>${f[1]}</option>`).join('')}</select>
          <label class="li-sub">次数<input type="number" id="hbTimes" value="${edit ? edit.times : 1}" min="1" style="width:54px">次/日</label>
        </div>
        <div class="row mt" id="hbWeekBox" style="display:${showWeek ? '' : 'none'}">
          ${WD_SHORT.map((w, i) => `<label class="li-sub" style="margin-right:8px"><input type="checkbox" class="hbDay" value="${i}" ${dayChecks.includes(i) ? 'checked' : ''}>周${w}</label>`).join('')}
        </div>
        <div class="row mt"><input class="grow" id="hbNote" placeholder="备注(选填)，如 早睡用于记录实际入睡时间" value="${edit ? esc(edit.note || '') : ''}"></div>
        <div class="row mt">
          <button class="btn ${edit ? 'pink' : ''}" onclick="saveHabit()">${edit ? '保存修改 ✔' : '添加 ➕'}</button>
          ${edit ? '<button class="btn sm ghost" onclick="S.habitEdit=null;S.habitTab=\'check\';render()">取消</button>' : ''}
        </div>
      </div>`
    : `${render_heatmap()}
       <div class="card"><div class="stat-grid g2">
         <div class="stat"><div class="num">${doneToday}/${activeCnt}</div><div class="lb">今日习惯达成</div></div>
         <div class="stat"><div class="num pk">${checkedToday}</div><div class="lb">今日打卡次数</div></div>
         <div class="stat"><div class="num">${habits.length}</div><div class="lb">习惯总数</div></div>
         <div class="stat"><div class="num" style="color:var(--blue)">${activeCnt}</div><div class="lb">今日需打卡</div></div>
       </div></div>
       ${habits.length ? habits.map(card).join('') : '<div class="empty">还没有习惯，先去「➕ 添加习惯」建一个吧～</div>'}
       ${habits.length ? render_habitLog() : ''}`}
  `;
}
function saveHabit() {
  const name = $('#hbName').value.trim(); if (!name) return;
  const start = $('#hbStart').value || '';
  const end = $('#hbEnd').value || '';
  const freq = $('#hbFreq').value;
  const times = Math.max(1, (+$('#hbTimes').value) || 1);
  let days = [];
  if (freq === 'weekly') document.querySelectorAll('.hbDay:checked').forEach(c => days.push(+c.value));
  const note = $('#hbNote').value.trim();
  const all = store.g('habits', []);
  if (S.habitEdit) {
    const i = all.findIndex(x => x.id === S.habitEdit);
    if (i >= 0) all[i] = { ...all[i], name, start, end, freq, times, days, note };
    S.habitEdit = null;
  } else all.push({ id: uid(), name, start, end, freq, times, days, note });
  store.s('habits', all); S.habitTab = 'check'; render();
}
function checkHabit(id) {
  const arr = store.g('habitChecks', []);
  arr.push({ id: uid(), habitId: id, ts: nowISO() });
  store.s('habitChecks', arr); render();
}
function delHabit(id) {
  if (!confirm('删除这个习惯？相关打卡记录也会一并清除。')) return;
  store.s('habits', store.g('habits', []).filter(x => x.id !== id));
  store.s('habitChecks', store.g('habitChecks', []).filter(c => c.habitId !== id));
  render();
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
