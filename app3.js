/* ============ 古诗词积累 ============ */
const POEMS = [
  { id: 'p1', t: '静夜思', a: '唐 · 李白', lines: ['床前明月光，疑是地上霜。', '举头望明月，低头思故乡。'], yi: '明亮的月光洒在床前，好像地上泛起了一层白霜。我抬起头望着天上的明月，不由得低下头思念起远方的家乡。', zhu: '疑：好像。举头：抬头。', xi: '全诗语言清新朴素，用「霜」喻月光，由望月而思乡，短短二十字道尽游子的思乡之情，是千古传诵的名篇。' },
  { id: 'p2', t: '相思', a: '唐 · 王维', lines: ['红豆生南国，春来发几枝。', '愿君多采撷，此物最相思。'], yi: '红豆生长在南方，春天到了它又生出多少新枝呢？希望你多多采摘它，因为它最能寄托相思之情。', zhu: '红豆：又名相思子。采撷（xié）：采摘。', xi: '借红豆抒发相思，语言明快自然，情感含蓄深长，把抽象的情感寄托在具体事物上，意味隽永。' },
  { id: 'p3', t: '登鹳雀楼', a: '唐 · 王之涣', lines: ['白日依山尽，黄河入海流。', '欲穷千里目，更上一层楼。'], yi: '夕阳依傍着山峦渐渐落下，黄河朝着大海滔滔奔流。想要看到千里之外的风光，那就要再登上更高的一层楼。', zhu: '尽：消失。欲：想要。穷：尽，达到极点。', xi: '前两句写景气势磅礴，后两句寓理于景，道出「站得高才能看得远」的哲理，激励人积极向上。' },
  { id: 'p4', t: '春晓', a: '唐 · 孟浩然', lines: ['春眠不觉晓，处处闻啼鸟。', '夜来风雨声，花落知多少。'], yi: '春夜酣睡不知不觉天已亮了，到处都能听到鸟儿的啼叫。想起夜里那阵阵风雨声，不知吹落了多少花朵。', zhu: '晓：天刚亮。闻：听见。', xi: '从听觉落笔写春晨，语言平易自然，惜春之情藏于字里行间，清新婉约，回味无穷。' },
  { id: 'p5', t: '江雪', a: '唐 · 柳宗元', lines: ['千山鸟飞绝，万径人踪灭。', '孤舟蓑笠翁，独钓寒江雪。'], yi: '群山中的鸟儿都飞得不见踪影，所有的路上也没有人的踪迹。江上孤舟里一位披蓑戴笠的老翁，独自在寒冷的江面上钓鱼。', zhu: '绝：无，没有。蓑笠（suō lì）：蓑衣和斗笠。', xi: '以极简笔墨勾勒空寂清冷的雪景，孤舟独钓的渔翁形象，寄托了诗人孤高坚守的品格。' },
  { id: 'p6', t: '枫桥夜泊', a: '唐 · 张继', lines: ['月落乌啼霜满天，江枫渔火对愁眠。', '姑苏城外寒山寺，夜半钟声到客船。'], yi: '月亮落下乌鸦啼叫寒气满天，我对着江边枫树和渔火忧愁而眠。姑苏城外寂寞清静的寒山古寺，半夜里敲响的钟声传到了我乘坐的客船。', zhu: '姑苏：苏州的别称。寒山寺：苏州枫桥附近的寺院。', xi: '一幅情景交融的秋夜羁旅图，钟声反衬夜的静谧，愁绪悠远绵长，意境极美。' },
  { id: 'p7', t: '竹里馆', a: '唐 · 王维', lines: ['独坐幽篁里，弹琴复长啸。', '深林人不知，明月来相照。'], yi: '独自坐在幽深的竹林里，一边弹琴一边高声长啸。深深的山林中无人知晓，只有一轮明月静静与我相伴。', zhu: '幽篁（huáng）：幽深的竹林。啸：撮口发出长而清脆的声音。', xi: '写隐居生活的恬淡闲适，以明月为知己，物我两忘，境界清幽绝俗。' },
  { id: 'p8', t: '望庐山瀑布', a: '唐 · 李白', lines: ['日照香炉生紫烟，遥看瀑布挂前川。', '飞流直下三千尺，疑是银河落九天。'], yi: '香炉峰在阳光的照射下升起紫色烟霞，远远望见瀑布像白色绢绸悬挂在山前。高崖上飞泻直落的瀑布好像有三千尺，让人怀疑是银河从九天倾泻而下。', zhu: '香炉：指香炉峰。九天：天的最高处。', xi: '想象雄奇，夸张大胆，「飞流直下三千尺」气势磅礴，尽显李白浪漫主义诗风。' },
  { id: 'p9', t: '秋词', a: '唐 · 刘禹锡', lines: ['自古逢秋悲寂寥，我言秋日胜春朝。', '晴空一鹤排云上，便引诗情到碧霄。'], yi: '自古以来每逢秋天都会感到悲凉寂寥，我却认为秋天要胜过春天。万里晴空中一只鹤凌云而飞起，就引发我的诗兴到了蓝天之上。', zhu: '寂寥：冷清萧条。春朝：春天。碧霄：蓝天。', xi: '一反悲秋传统，以昂扬乐观的态度赞美秋天，格调豪迈高远，催人奋发。' },
  { id: 'p10', t: '游子吟', a: '唐 · 孟郊', lines: ['慈母手中线，游子身上衣。', '临行密密缝，意恐迟迟归。', '谁言寸草心，报得三春晖。'], yi: '慈祥的母亲手里把着针线，为即将远行的孩子赶制新衣。临行前一针针密密地缝着，是担心孩子回来得晚衣服破损。谁能说像小草那样微弱的孝心，能报答得了像春晖普泽的慈母恩情呢？', zhu: '寸草：小草，比喻子女。三春晖：春天的阳光，比喻母爱。', xi: '通过缝衣的细节写尽母爱深笃，末句以反问作结，情真意切，千百年来广为传诵。' }
];
function poemFrag() {
  const fav = store.g('poemFav', []), rec = store.g('poemRec', []);
  const daily = POEMS[dayIdx % POEMS.length];
  const view = S.poemView ? POEMS.find(p => p.id === S.poemView) : daily;
  const detail = p => `
  <div class="card">
    <h3 style="justify-content:center">${p.id === daily.id ? '🏮 今日一首 · ' : ''}${p.t} <span class="li-sub">${p.a}</span></h3>
    <div class="poem-body">${p.lines.join('<br>')}</div>
    <div class="row" style="justify-content:center">
      <button class="btn sm ${fav.includes(p.id) ? 'pink' : 'ghost'}" onclick="togglePoem('poemFav','${p.id}')">${fav.includes(p.id) ? '已收藏 ❤' : '收藏 ♡'}</button>
      <button class="btn sm ${rec.includes(p.id) ? '' : 'ghost'}" onclick="togglePoem('poemRec','${p.id}')">${rec.includes(p.id) ? '已加入背诵 ✔' : '加入背诵清单 ➕'}</button>
    </div>
    <div class="poem-sec"><b>译文：</b>${p.yi}</div>
    <div class="poem-sec"><b>注释：</b>${p.zhu}</div>
    <div class="poem-sec"><b>简析：</b>${p.xi}</div>
  </div>`;
  const listOf = (ids, empty) => ids.length ? ids.map(id => { const p = POEMS.find(x => x.id === id); return p ? `<div class="list-item"><div class="li-main" style="cursor:pointer" onclick="S.poemView='${p.id}';render()"><b>${p.t}</b> · ${p.a}</div></div>` : ''; }).join('') : `<div class="empty">${empty}</div>`;
  return `
  ${detail(view)}
  <div class="card"><h3>📜 全部诗词</h3>
    <div class="row">${POEMS.map(p => `<div class="tab ${view.id === p.id ? 'active' : ''}" onclick="S.poemView='${p.id}';render()">${p.t}</div>`).join('')}</div>
  </div>
  <div class="card"><h3>❤ 我的收藏</h3>${listOf(fav, '还没有收藏的诗词')}</div>
  <div class="card"><h3>🎯 背诵清单</h3>${listOf(rec, '背诵清单是空的')}</div>`;
}
function togglePoem(key, id) {
  const arr = store.g(key, []);
  const i = arr.indexOf(id);
  if (i >= 0) arr.splice(i, 1); else arr.push(id);
  store.s(key, arr); render();
}

/* ============ 随记笔录 ============ */
function noteFrag() {
  const notes = store.g('notes', []);
  const ed = S.noteEdit ? notes.find(n => n.id === S.noteEdit) : null;
  return `
  <div class="card">
    <textarea id="ntText" rows="3" placeholder="记录此刻的想法…">${ed ? esc(ed.text) : ''}</textarea>
    <div class="row mt"><button class="btn" onclick="saveNote()">${ed ? '保存修改 ✔' : '记下 ➕'}</button>${ed ? '<button class="btn sm ghost" onclick="S.noteEdit=null;render()">取消</button>' : ''}</div>
  </div>
  <div class="card"><h3>全部随记（${notes.length}）</h3>
    ${notes.slice().reverse().map(n => `<div class="list-item"><div class="li-main" style="white-space:pre-wrap">${esc(n.text)}<div class="li-sub">${n.ts}</div></div>
      <button class="btn sm ghost" onclick="S.noteEdit='${n.id}';render()">改</button>
      <button class="btn sm warn" onclick="delNote('${n.id}')">删</button></div>`).join('') || '<div class="empty">还没有随记，写点什么吧～</div>'}
  </div>`;
}
function saveNote() {
  const t = $('#ntText').value.trim(); if (!t) return;
  const notes = store.g('notes', []);
  if (S.noteEdit) { const n = notes.find(x => x.id === S.noteEdit); if (n) n.text = t; S.noteEdit = null; }
  else { const d = new Date(); notes.push({ id: uid(), text: t, ts: fmt(d) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) }); }
  store.s('notes', notes); render();
}
function delNote(id) { if (!confirm('删除这条随记？')) return; store.s('notes', store.g('notes', []).filter(x => x.id !== id)); render(); }

/* ============ 运动计划 ============ */
const SPORT_PARTS = ['练腿', '练肩', '练背', '手臂', '臀腿', '体态训练', '眼部放松'];
function sportData() {
  const d = store.g('sport', null);
  if (d) return d;
  const freq = {}; SPORT_PARTS.forEach(p => freq[p] = 2);
  return { freq, durPosture: 15, durStrength: 40, logs: [], rev: [] };
}
function render_sport() {
  const sp = sportData();
  const wk = isoWeek(today());
  const wkLogs = sp.logs.filter(l => isoWeek(l.date) === wk);
  const totalMin = sp.logs.reduce((a, b) => a + (+b.mins || 0), 0);
  const sportDates = [...new Set(sp.logs.map(l => l.date))];
  const unfinished = SPORT_PARTS.filter(p => wkLogs.filter(l => l.part === p).length < (sp.freq[p] || 0) && (sp.freq[p] || 0) > 0);
  return `
  <div class="page-title">💪 运动计划</div>
  <div class="page-sub">计划 → 执行 → 复盘，完整运动体系</div>

  <div class="card">
    <div class="stat-grid">
      <div class="stat"><div class="num">${streakOf(sportDates)}</div><div class="lb">连续运动(天)</div></div>
      <div class="stat"><div class="num pk">${wkLogs.length}</div><div class="lb">本周训练(次)</div></div>
      <div class="stat"><div class="num">${totalMin}</div><div class="lb">累计时长(分)</div></div>
    </div>
  </div>

  <div class="card"><h3>⚡ 一键套用打卡（今日训练）</h3>
    <div class="row">${SPORT_PARTS.map(p => `<button class="btn sm ghost" onclick="quickSport('${p}')">${p} ➕</button>`).join('')}</div>
    <div class="row mt">
      <select id="spPart">${SPORT_PARTS.map(p => `<option>${p}</option>`).join('')}</select>
      <input type="number" id="spMin" placeholder="时长(分)">
      <button class="btn" onclick="addSport()">自定义打卡 ➕</button>
    </div>
    <div class="li-sub" style="margin-top:6px">体态训练默认 ${sp.durPosture} 分钟 · 力量器械默认 ${sp.durStrength} 分钟 · 眼部放松默认 10 分钟</div>
  </div>

  <div class="card"><h3>📋 每周训练频次计划</h3>
    ${SPORT_PARTS.map(p => {
      const done = wkLogs.filter(l => l.part === p).length, tgt = sp.freq[p] || 0;
      const pct = tgt ? Math.min(100, Math.round(done / tgt * 100)) : 0;
      return `<div style="margin-bottom:10px">
        <div class="row" style="justify-content:space-between"><span>${p}</span>
          <span class="row"><input type="number" id="fq_${p}" value="${tgt}" style="width:56px;padding:4px 6px" onchange="setFreq('${p}',this.value)"><span class="li-sub">次/周 · 已练 ${done} 次</span></span></div>
        <div class="bar"><i style="width:${pct}%"></i></div>
      </div>`;
    }).join('')}
    <div class="row mt">
      <span class="li-sub">体态训练时长</span><input type="number" value="${sp.durPosture}" style="width:64px" onchange="setDur('durPosture',this.value)">
      <span class="li-sub">力量器械时长</span><input type="number" value="${sp.durStrength}" style="width:64px" onchange="setDur('durStrength',this.value)">
    </div>
  </div>

  ${unfinished.length ? `<div class="card"><h3>🔔 本周未完成提醒</h3><div class="row">${unfinished.map(p => `<span class="tag r">${p} 还差 ${(sp.freq[p] || 0) - wkLogs.filter(l => l.part === p).length} 次</span>`).join('')}</div></div>` : ''}

  <div class="card"><h3>🗒 最近训练记录</h3>
    ${sp.logs.slice(-8).reverse().map(l => `<div class="list-item"><div class="li-main">${l.date} · <span class="tag b">${l.part}</span>${l.mins} 分钟</div><button class="btn sm warn" onclick="delSport('${l.id}')">删</button></div>`).join('') || '<div class="empty">暂无训练记录</div>'}
  </div>

  <div class="card"><h3>🎯 阶段性运动目标复盘</h3>
    <textarea id="spRev" rows="2" placeholder="写下这一阶段的运动复盘 / 目标调整…"></textarea>
    <div class="row mt"><button class="btn pink" onclick="addSportRev()">保存复盘 ➕</button></div>
    ${sp.rev.slice().reverse().map(r => `<div class="list-item"><div class="li-main" style="white-space:pre-wrap">${esc(r.text)}<div class="li-sub">${r.date}</div></div><button class="btn sm warn" onclick="delSportRev('${r.id}')">删</button></div>`).join('') || '<div class="empty">暂无复盘记录</div>'}
  </div>`;
}
function saveSport(sp) { store.s('sport', sp); render(); }
function quickSport(part) {
  const sp = sportData();
  const mins = part === '体态训练' ? sp.durPosture : part === '眼部放松' ? 10 : sp.durStrength;
  sp.logs.push({ id: uid(), date: today(), part, mins }); saveSport(sp);
}
function addSport() {
  const sp = sportData(); const m = +$('#spMin').value || 0; if (!m) return;
  sp.logs.push({ id: uid(), date: today(), part: $('#spPart').value, mins: m }); saveSport(sp);
}
function setFreq(p, v) { const sp = sportData(); sp.freq[p] = Math.max(0, +v || 0); saveSport(sp); }
function setDur(k, v) { const sp = sportData(); sp[k] = Math.max(5, +v || 15); saveSport(sp); }
function delSport(id) { const sp = sportData(); sp.logs = sp.logs.filter(x => x.id !== id); saveSport(sp); }
function addSportRev() { const t = $('#spRev').value.trim(); if (!t) return; const sp = sportData(); sp.rev.push({ id: uid(), text: t, date: today() }); saveSport(sp); }
function delSportRev(id) { const sp = sportData(); sp.rev = sp.rev.filter(x => x.id !== id); saveSport(sp); }
