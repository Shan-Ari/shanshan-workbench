/* ============ 人生重启计划（集成模块） ============
   双模式：每日习惯打卡（Project 50 逻辑） + 30天全新自我体验清单
   复用工作台 store / esc / today / fmt / uid / pad / render
*/
(function () {
  /* ---- 一次性注入样式（仅工作台内生效，rb- 前缀避免冲突） ---- */
  if (!document.getElementById('rb-style')) {
    const s = document.createElement('style');
    s.id = 'rb-style';
    s.textContent = `
.rb-tabs{display:flex;gap:8px;margin-bottom:14px}
.rb-tab{flex:1;border:2px solid #eee;background:#fff;border-radius:14px;padding:11px;font-weight:600;color:#9a8a8a;cursor:pointer;font-family:inherit;font-size:13px}
.rb-tab.on{color:#6b5555;border-color:#B8E0D2}
.rb-ov{display:flex;text-align:center;gap:6px}
.rb-stat{flex:1}
.rb-stat b{font-size:20px;color:#6b5555}
.rb-stat span{display:block;font-size:11px;color:#9a8a8a;margin-top:2px}
.rb-tip{background:#fff4e6;color:#9a6a3a;border-radius:14px;padding:12px 14px;font-size:13px;margin-bottom:14px;line-height:1.5}
.rb-tip.ok{background:#e8f6ee;color:#3a7a5a}
.rb-tip.warn{background:#fdeaea;color:#9a4a4a}
.rb-day{border:1px solid #eee}
.rb-day.rb-today{border:2px solid #F9E79F}
.rb-dayhead{display:flex;align-items:center;gap:8px;margin-bottom:10px}
.rb-dayhead b{font-size:15px;color:#6b5555}
.rb-checks{display:flex;flex-direction:column;gap:7px}
.rb-chk{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:12px;background:#faf6ef;cursor:pointer}
.rb-chk.on{background:#eaf6ef}
.rb-box{width:20px;height:20px;border-radius:6px;border:2px solid #d8c8b8;display:flex;align-items:center;justify-content:center;font-size:13px;color:#fff;flex:none}
.rb-chk.on .rb-box{background:#B8E0D2;border-color:#B8E0D2}
.rb-ct{flex:1;line-height:1.35;font-size:14px}
.rb-chk.on .rb-ct{color:#3a7a5a;text-decoration:line-through;text-decoration-color:#b8d8c8}
.rb-note{width:100%;border:1.5px solid #eee;border-radius:10px;padding:9px;font-size:13px;font-family:inherit;resize:vertical;min-height:36px;margin-top:10px;box-sizing:border-box}
.rb-rule{display:flex;gap:8px;align-items:center;margin-bottom:8px}
.rb-rule input{flex:1;border:1.5px solid #eee;border-radius:10px;padding:9px;font-size:14px;font-family:inherit;box-sizing:border-box}
.rb-qbar{height:12px;background:#f0e8dc;border-radius:20px;overflow:hidden;margin-bottom:10px}
.rb-qfill{height:100%;width:0;background:linear-gradient(90deg,#B8E0D2,#F9E79F);transition:width .35s}
.rb-qstat{font-size:14px;color:#6b5555;margin-bottom:12px;text-align:center}
.rb-qstat b{font-weight:700}
.rb-quest{display:flex;align-items:center;gap:10px;padding:11px 12px;border-radius:12px;background:#faf6ef;margin-bottom:8px;cursor:pointer}
.rb-quest.on{background:#eaf6ef}
.rb-qbox{width:20px;height:20px;border-radius:6px;border:2px solid #d8c8b8;display:flex;align-items:center;justify-content:center;font-size:13px;color:#fff;flex:none}
.rb-quest.on .rb-qbox{background:#B8E0D2;border-color:#B8E0D2}
.rb-qnum{font-size:12px;color:#9a8a8a;width:18px;flex:none}
.rb-qtxt{flex:1;font-size:14px;line-height:1.35}
.rb-quest.on .rb-qtxt{color:#3a7a5a;text-decoration:line-through;text-decoration-color:#b8d8c8}
.rb-toast{position:fixed;left:50%;bottom:30px;transform:translateX(-50%);background:rgba(90,74,74,.92);color:#fff;padding:12px 18px;border-radius:14px;font-size:14px;max-width:84%;text-align:center;z-index:50;box-shadow:0 6px 20px rgba(0,0,0,.2)}
.rb-toast.hidden{display:none}
.rb-caret{margin-left:auto;color:#b8a8a8;font-size:13px;transition:transform .2s;flex:none}
.rb-day.collapsed .rb-caret{transform:rotate(-90deg)}
.rb-summary{font-size:12px;color:#9a8a8a;background:#faf6ef;border-radius:10px;padding:8px 10px;display:flex;align-items:center;gap:8px}
.rb-summary .rb-sp{flex:1}
.rb-mini{display:flex;gap:3px;flex-wrap:wrap}
.rb-dot{width:9px;height:9px;border-radius:50%;background:#e3d8c8}
.rb-dot.on{background:#B8E0D2}
.rb-photos{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
.rb-photo{position:relative;width:74px;height:74px;border-radius:10px;overflow:hidden;border:1px solid #eee;cursor:pointer;background:#faf6ef}
.rb-photo img{width:100%;height:100%;object-fit:cover}
.rb-photo .rb-x{position:absolute;top:2px;right:2px;background:rgba(90,74,74,.8);color:#fff;border:none;border-radius:50%;width:18px;height:18px;font-size:11px;line-height:18px;cursor:pointer;padding:0}
.rb-phbtn{margin-top:10px}
`;
    document.head.appendChild(s);
  }

  const RB_RULES = [
    '8点前起床（睡眠≥6h）', '晨间1小时专注（规划/冥想）', '运动1小时', '阅读10页',
    '学新技能1小时', '健康饮食', '写日记记录进度'
  ];
  const RB_QUESTS = [
    '去一间从来没去过的餐厅', '换一个平时不常用的交通工具回家', '跟一个一年（及以上）没联系的老友聊天',
    '一口气读完一本新的书', '选一天，离开网络', '比平常早起一个小时，吃丰盛的早餐',
    '请家人外出吃饭（或自己做一顿大餐）', '点一杯从来没喝过的饮料', '一个人看一场电影',
    '看隔壁桌吃什么，自己就点什么', '写一封信给曾经的自己', '做一项手工（折纸/乐高/编织等）',
    '去海边或者森林亲近大自然', '和一个陌生人聊3句', '翻看老照片旧日记', '整理房间', '慢跑30分钟',
    '十点半睡觉', '跟家人说“我爱你”', '买一束花放在家里', '和好朋友去野餐', '拒绝别人',
    '跟朋友一起唱一场主题限定KTV', '不加班', '认识一个新朋友', '给好朋友/家人送一个礼物',
    '在好朋友家过夜聊八卦', '一个人逛街大采购', '化一个最完美的妆＋拍照', '把这30天的感受记下来'
  ];

  function rbDefault() {
    return {
      tab: 'habit',
      habit: { startDate: rbAddDays(today(), 1), totalDays: 50, rules: RB_RULES.map((t, i) => ({ id: 'r' + i, text: t })), days: {}, collapsed: {} },
      quests: RB_QUESTS.map((t, i) => ({ id: 'q' + i, text: t, done: false }))
    };
  }
  function rbState() { return store.g('reboot', rbDefault()); }
  function rbSave(st) { store.s('reboot', st); }
  function rbParse(s) { const p = String(s).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function rbDiff(a, b) { return Math.round((rbParse(a) - rbParse(b)) / 864e5); }
  function rbAddDays(s, n) { const d = rbParse(s); d.setDate(d.getDate() + n); return fmt(d); }
  function rbComplete(st, i) {
    const day = st.habit.days[i]; if (!day || !day.checks) return false;
    const R = st.habit.rules; return R.length > 0 && R.every(r => day.checks[r.id]);
  }
  /* 折叠视图：完成的天默认折叠（collapsed 未设置时跟随完成态）；今日强制展开 */
  function rbDayCollapsed(st, i) {
    const c = st.habit.collapsed && st.habit.collapsed[i];
    if (c === undefined) return rbComplete(st, i);
    return !!c;
  }
  function rbSaveSafe(st) {
    try { rbSave(st); }
    catch (e) { alert('保存失败：本地存储空间可能不足（照片过大）。可删除部分照片后重试。'); }
  }

  function rbToast(msg) {
    let el = document.getElementById('rb-toast');
    if (!el) { el = document.createElement('div'); el.id = 'rb-toast'; el.className = 'rb-toast'; document.body.appendChild(el); }
    el.textContent = msg; el.classList.remove('hidden');
    clearTimeout(el._t); el._t = setTimeout(() => el.classList.add('hidden'), 2800);
  }

  /* ============ 渲染 ============ */
  function render_reboot() {
    const st = rbState();
    if (st.tab !== 'quest') st.tab = 'habit';
    return st.tab === 'habit' ? rbHabit(st) : rbQuest(st);
  }

  function rbHabit(st) {
    const h = st.habit, t = today();
    const idx = rbDiff(t, h.startDate);
    let dayNum = '未开始';
    if (idx >= 0 && idx < h.totalDays) dayNum = idx + 1;
    else if (idx >= h.totalDays) dayNum = '已结束';

    let done = 0;
    for (let i = 0; i < h.totalDays; i++) if (rbComplete(st, i)) done++;
    const rate = Math.round(done / h.totalDays * 100);

    let streak = 0;
    for (let i = 0; i < h.totalDays; i++) {
      const d = rbAddDays(h.startDate, i); if (d > t) break;
      if (rbComplete(st, i)) streak++; else break;
    }

    let tip = '';
    if (idx < 0) tip = '<div class="rb-tip">还没开始，设定好起始日后从 Day 1 打卡吧。</div>';
    else if (idx >= h.totalDays) tip = '<div class="rb-tip ok">挑战周期已结束，已完成 ' + done + ' / ' + h.totalDays + ' 天。</div>';
    else {
      let fm = -1;
      for (let i = 0; i <= idx; i++) { if (!rbComplete(st, i)) { fm = i; break; } }
      if (fm === -1) tip = '<div class="rb-tip ok">进行顺利 🎉 已连续完成 ' + streak + ' 天，保持住！</div>';
      else if (fm === idx) tip = '<div class="rb-tip">今天还有规则没完成，加油把今日打卡补齐～</div>';
      else tip = '<div class="rb-tip warn">第 ' + (fm + 1) + ' 天有规则未完成。按 Project 50 规则需从 Day 1 重来；此处保留历史记录方便查看。</div>';
    }

    const rules = h.rules;
    let daysHtml = '';
    for (let i = 0; i < h.totalDays; i++) {
      const dStr = rbAddDays(h.startDate, i);
      const day = h.days[i] || { checks: {}, note: '' };
      const isToday = dStr === t, isFuture = dStr > t, complete = rbComplete(st, i);
      const badge = isFuture ? '未到' : complete ? '✓ 完成' : isToday ? '今日待办' : '未完成';
      const bcls = complete ? 'g' : isFuture ? '' : (isToday ? 'y' : 'r');
      const collapsed = isToday ? false : rbDayCollapsed(st, i);
      let checks = '';
      rules.forEach(r => {
        const on = !!(day.checks && day.checks[r.id]);
        checks += '<div class="rb-chk ' + (on ? 'on' : '') + '" onclick="rbToggleHabit(' + i + ',\'' + r.id + '\')"><span class="rb-box">' + (on ? '✓' : '') + '</span><span class="rb-ct">' + esc(r.text) + '</span></div>';
      });
      const doneCount = rules.filter(r => day.checks && day.checks[r.id]).length;
      const dots = rules.map(r => '<span class="rb-dot ' + ((day.checks && day.checks[r.id]) ? 'on' : '') + '"></span>').join('');
      const noteSnip = (day.note || '').trim();
      const summary = '<div class="rb-summary"><span class="rb-sp">' + (noteSnip ? '📝 ' + esc(noteSnip.slice(0, 30)) : '已完成 ' + doneCount + ' / ' + rules.length) + '</span>' + dots + '</div>';
      const body = collapsed ? summary : ('<div class="rb-checks">' + checks + '</div>' +
        '<textarea class="rb-note" placeholder="今日记录 / 备注…" onchange="rbNote(' + i + ', this.value)">' + esc(day.note || '') + '</textarea>');
      daysHtml += '<div class="card rb-day ' + (isToday ? 'rb-today ' : '') + (collapsed ? 'collapsed' : '') + '">' +
        '<div class="rb-dayhead" onclick="rbToggleCollapse(' + i + ')"><b>Day ' + (i + 1) + '</b><span class="li-sub">' + dStr.slice(5).replace('-', '/') + '</span>' +
        '<span class="tag ' + bcls + '">' + badge + '</span><span class="rb-caret">▾</span></div>' +
        body +
        '</div>';
    }

    let rulesHtml = rules.map((r, i) =>
      '<div class="rb-rule"><input value="' + esc(r.text) + '" onchange="rbRuleText(' + i + ', this.value)"><button class="btn sm warn" onclick="rbDelRule(' + i + ')">删</button></div>'
    ).join('');

    return '<div class="page-title">🔄 人生重启计划</div>' +
      '<div class="page-sub">每日习惯打卡 · 30天体验清单，顶部切换</div>' +
      '<div class="rb-tabs"><button class="rb-tab on" onclick="rbSwitch(\'habit\')">每日习惯打卡</button><button class="rb-tab" onclick="rbSwitch(\'quest\')">30天体验清单</button></div>' +
      '<div class="card"><div class="row"><label class="li-sub">开始日期</label><input type="date" id="rbStart" value="' + h.startDate + '"></div>' +
      '<div class="row mt"><label class="li-sub">总天数</label><input type="number" id="rbDays" value="' + h.totalDays + '" min="1" max="365"></div>' +
      '<div class="row mt"><button class="btn sm" onclick="rbSaveSetup()">保存设置</button><button class="btn sm ghost" onclick="rbExport()">导出</button><button class="btn sm ghost" onclick="rbImportClick()">导入</button><button class="btn sm warn" onclick="rbReset()">清空</button><input type="file" id="rbFile" accept="application/json" style="display:none" onchange="rbImport(this)"></div></div>' +
      '<div class="card rb-ov"><div class="rb-stat"><b>' + dayNum + '</b><span>今天第几天</span></div><div class="rb-stat"><b>' + streak + '</b><span>连续完成</span></div><div class="rb-stat"><b>' + rate + '%</b><span>完成率</span></div><div class="rb-stat"><b>' + done + '</b><span>已完成天数</span></div></div>' +
      tip +
      '<div class="card"><h3>我的规则</h3>' + (rulesHtml || '<div class="empty">还没有规则，添加一个吧</div>') +
      '<button class="btn sm ghost mt" onclick="rbAddRule()">+ 添加规则</button></div>' +
      daysHtml;
  }

  function rbQuest(st) {
    const qs = st.quests;
    const done = qs.filter(q => q.done).length;
    const total = qs.length;
    const left = total - done;
    const pct = total ? Math.round(done / total * 100) : 0;
    let list = qs.map((q, i) => {
      const photos = q.photos || [];
      const thumbs = photos.map((p, pi) =>
        '<div class="rb-photo" onclick="rbViewPhoto(' + i + ',' + pi + ')"><img src="' + p + '"><button class="rb-x" onclick="event.stopPropagation();rbDelPhoto(' + i + ',' + pi + ')">×</button></div>'
      ).join('');
      const photoArea = q.done
        ? '<div class="rb-photos">' + thumbs +
          '<label class="rb-photo rb-phbtn" style="display:flex;align-items:center;justify-content:center;font-size:24px;color:#b8a8a8">+<input type="file" accept="image/*" style="display:none" onchange="rbAddPhoto(' + i + ', this)"></label></div>'
        : '';
      return '<div class="rb-qwrap">' +
        '<div class="rb-quest ' + (q.done ? 'on' : '') + '" onclick="rbToggleQuest(' + i + ')">' +
        '<span class="rb-qbox">' + (q.done ? '✓' : '') + '</span><span class="rb-qnum">' + (i + 1) + '</span>' +
        '<span class="rb-qtxt" ondblclick="event.stopPropagation();rbEditQuest(' + i + ')">' + esc(q.text) + '</span>' +
        '<button class="btn sm warn" onclick="event.stopPropagation();rbDelQuest(' + i + ')">✕</button></div>' +
        photoArea + '</div>';
    }).join('');
    return '<div class="page-title">🔄 人生重启计划</div>' +
      '<div class="page-sub">30天全新自我挑战 · 每项做一次即完成</div>' +
      '<div class="rb-tabs"><button class="rb-tab" onclick="rbSwitch(\'habit\')">每日习惯打卡</button><button class="rb-tab on" onclick="rbSwitch(\'quest\')">30天体验清单</button></div>' +
      '<div class="card"><div class="rb-qbar"><div class="rb-qfill" style="width:' + pct + '%"></div></div>' +
      '<div class="rb-qstat">已完成 <b>' + done + '</b> / ' + total + ' · 还剩 <b>' + left + '</b></div>' +
      '<button class="btn sm ghost" onclick="rbRoll()">🎲 抽一个未完成的</button></div>' +
      '<div class="card"><h3>体验任务（双击文字可改）</h3>' + (list || '<div class="empty">还没有任务</div>') +
      '<div class="row mt"><input class="grow" id="rbQInput" placeholder="添加自定义任务…"><button class="btn sm" onclick="rbAddQuest()">添加</button></div></div>';
  }

  /* ============ 交互 ============ */
  function rbSwitch(tab) { const st = rbState(); st.tab = tab; rbSave(st); render(); }
  function rbSaveSetup() {
    const sd = document.getElementById('rbStart').value;
    let td = parseInt(document.getElementById('rbDays').value, 10);
    if (!sd) { alert('请选择开始日期'); return; }
    if (!td || td < 1) td = 1; if (td > 365) td = 365;
    const st = rbState(); st.habit.startDate = sd; st.habit.totalDays = td; rbSave(st); render();
  }
  function rbToggleHabit(i, rid) {
    const st = rbState(); st.habit.days[i] = st.habit.days[i] || { checks: {}, note: '' };
    const cur = !!(st.habit.days[i].checks[rid]); st.habit.days[i].checks[rid] = !cur; rbSave(st); render();
  }
  function rbNote(i, v) {
    const st = rbState(); st.habit.days[i] = st.habit.days[i] || { checks: {}, note: '' };
    st.habit.days[i].note = v; rbSave(st);
  }
  function rbRuleText(i, v) { const st = rbState(); if (st.habit.rules[i]) { st.habit.rules[i].text = v; rbSave(st); } }
  function rbAddRule() { const st = rbState(); st.habit.rules.push({ id: uid(), text: '新规则' }); rbSave(st); render(); }
  function rbDelRule(i) { const st = rbState(); st.habit.rules.splice(i, 1); rbSave(st); render(); }
  function rbToggleQuest(i) { const st = rbState(); if (st.quests[i]) { st.quests[i].done = !st.quests[i].done; rbSave(st); render(); } }
  function rbEditQuest(i) {
    const st = rbState(); if (!st.quests[i]) return;
    const v = prompt('修改任务', st.quests[i].text);
    if (v !== null && v.trim()) { st.quests[i].text = v.trim(); rbSave(st); render(); }
  }
  function rbDelQuest(i) { const st = rbState(); st.quests.splice(i, 1); rbSave(st); render(); }
  function rbAddQuest() {
    const inp = document.getElementById('rbQInput'); if (!inp) return;
    const v = inp.value.trim(); if (!v) return;
    const st = rbState(); st.quests.push({ id: uid(), text: v, done: false }); rbSave(st); render();
  }
  function rbRoll() {
    const st = rbState(); const left = st.quests.filter(q => !q.done);
    if (!left.length) { rbToast('全部完成啦 🎉'); return; }
    const pick = left[Math.floor(Math.random() * left.length)];
    rbToast('试试这个：' + pick.text);
  }
  function rbExport() {
    const data = rbState();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = '人生重启计划-' + data.habit.startDate + '.json'; document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }
  function rbImportClick() { const f = document.getElementById('rbFile'); if (f) f.click(); }
  function rbImport(input) {
    const f = input.files[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = function () {
      try {
        const s = JSON.parse(reader.result);
        if (s && s.habit && s.quests) { rbSave(s); render(); alert('导入成功'); }
        else alert('文件格式不正确');
      } catch (e) { alert('解析失败：' + e.message); }
    };
    reader.readAsText(f); input.value = '';
  }
  function rbReset() {
    if (confirm('确定清空人生重启计划的所有数据？此操作不可恢复（建议先导出备份）。')) {
      rbSave(rbDefault()); render();
    }
  }
  function rbToggleCollapse(i) {
    const st = rbState(); st.habit.collapsed = st.habit.collapsed || {};
    st.habit.collapsed[i] = !rbDayCollapsed(st, i); rbSave(st); render();
  }
  function rbAddPhoto(i, input) {
    const f = input.files && input.files[0]; if (!f) return;
    const rd = new FileReader();
    rd.onload = function () {
      const st = rbState(); const q = st.quests[i]; if (!q) return;
      q.photos = q.photos || []; q.photos.push(rd.result);
      rbSaveSafe(st); render();
    };
    rd.readAsDataURL(f); input.value = '';
  }
  function rbDelPhoto(i, pi) {
    const st = rbState(); const q = st.quests[i]; if (!q || !q.photos) return;
    q.photos.splice(pi, 1); rbSave(st); render();
  }
  function rbViewPhoto(i, pi) {
    const st = rbState(); const q = st.quests[i];
    if (q && q.photos && q.photos[pi]) window.open(q.photos[pi]);
  }

  /* ---- 暴露到全局，供工作台路由 (window['render_'+id]) 与 onclick 调用 ---- */
  Object.assign(window, {
    render_reboot, rbSwitch, rbSaveSetup, rbExport, rbImportClick, rbReset,
    rbToggleHabit, rbNote, rbAddRule, rbDelRule, rbRuleText,
    rbToggleQuest, rbEditQuest, rbDelQuest, rbAddQuest, rbRoll, rbImport,
    rbToggleCollapse, rbAddPhoto, rbDelPhoto, rbViewPhoto
  });
})();
