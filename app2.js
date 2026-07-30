/* ============ 英语学习 ============ */
const WORDS = [
  ['abundant', '丰富的，充裕的'], ['accomplish', '完成，实现'], ['adapt', '适应，改编'], ['ambition', '雄心，抱负'], ['anticipate', '预期，期望'],
  ['appreciate', '感激，欣赏'], ['approach', '方法；接近'], ['appropriate', '合适的'], ['assume', '假定，承担'], ['attitude', '态度'],
  ['available', '可获得的'], ['balance', '平衡'], ['benefit', '好处，受益'], ['brilliant', '杰出的，明亮的'], ['capacity', '能力，容量'],
  ['challenge', '挑战'], ['commitment', '承诺，投入'], ['confidence', '信心'], ['consistent', '一致的，持续的'], ['contribute', '贡献'],
  ['curious', '好奇的'], ['dedicate', '奉献，致力于'], ['determine', '决定，决心'], ['efficient', '高效的'], ['embrace', '拥抱，欣然接受'],
  ['emphasize', '强调'], ['enhance', '提高，增强'], ['essential', '必要的，本质的'], ['evaluate', '评估'], ['eventually', '最终'],
  ['evidence', '证据'], ['expand', '扩大，展开'], ['explore', '探索'], ['flexible', '灵活的'], ['focus', '专注，焦点'],
  ['frequent', '频繁的'], ['generate', '产生，生成'], ['genuine', '真诚的，真正的'], ['gradual', '逐渐的'], ['grateful', '感激的'],
  ['habit', '习惯'], ['improve', '改进，提高'], ['inspire', '激励，鼓舞'], ['maintain', '保持，维护'], ['motivate', '激发动力'],
  ['necessary', '必要的'], ['objective', '目标；客观的'], ['opportunity', '机会'], ['optimistic', '乐观的'], ['organize', '组织，整理'],
  ['overcome', '克服'], ['patient', '耐心的；病人'], ['perspective', '视角，观点'], ['positive', '积极的'], ['potential', '潜力'],
  ['priority', '优先事项'], ['progress', '进步，进展'], ['pursue', '追求'], ['reflect', '反思，反映'], ['strategy', '策略']
];
const SPEAK_SETS = [
  ['What do you usually do after work?', 'I like to unwind by reading or working out.', 'It has been a long day, but totally worth it.', 'Let me walk you through my daily routine.'],
  ['Could you give me a hand with this?', 'No worries, take your time.', 'That sounds like a great plan to me.', 'I will keep you posted on the progress.'],
  ['How is your project coming along?', 'We are ahead of schedule so far.', 'Let us touch base tomorrow morning.', 'I appreciate your quick response.'],
  ['What are you up to this weekend?', 'I am planning a short getaway.', 'It slipped my mind completely, sorry!', 'Better late than never, right?'],
  ['The weather is lovely today, isn\'t it?', 'I could not agree with you more.', 'Let us grab a coffee sometime.', 'It is my treat today, I insist.'],
  ['I am trying to build a morning routine.', 'Consistency is the key to everything.', 'Small steps lead to big changes.', 'You have made huge progress lately!'],
  ['May I ask a quick question?', 'That makes perfect sense now.', 'Thanks for pointing that out.', 'Practice makes perfect, keep going!']
];
function engData() { return store.g('eng', { speak: [], newWords: [], sents: [] }); }
function render_english() {
  const e = engData();
  const speakCk = store.g('speakCk', []), wordCk = store.g('wordCk', []), revCk = store.g('revCk', []);
  const start = (dayIdx * 20) % WORDS.length;
  const todayWords = Array.from({ length: 20 }, (_, i) => WORDS[(start + i) % WORDS.length]);
  const totalMins = e.speak.reduce((a, b) => a + (+b.mins || 0), 0);
  const tabs = [['speak', '🗣 口语练习'], ['word', '📖 单词学习'], ['sent', '✍️ 语句积累']];
  let body = '';
  if (S.engTab === 'speak') {
    const mats = SPEAK_SETS[dayIdx % SPEAK_SETS.length];
    body = `
    <div class="card"><h3>今日口语素材（跟读练习）</h3>
      ${mats.map((m, i) => `<div class="list-item"><div class="li-main">${i + 1}. ${esc(m)}</div></div>`).join('')}
      <div class="row mt">
        <input type="number" id="spkMin" placeholder="练习时长(分)">
        <input class="grow" id="spkNote" placeholder="练习内容备注(选填)">
        <button class="btn" onclick="addSpeak()">口语打卡 ➕</button>
      </div>
    </div>
    <div class="card"><h3>打卡记录</h3>
      <div class="stat-grid"><div class="stat"><div class="num">${streakOf(speakCk)}</div><div class="lb">连续打卡(天)</div></div>
      <div class="stat"><div class="num pk">${speakCk.length}</div><div class="lb">累计打卡(天)</div></div>
      <div class="stat"><div class="num">${totalMins}</div><div class="lb">累计时长(分)</div></div></div>
      ${e.speak.slice(-6).reverse().map(s => `<div class="list-item"><div class="li-main">${s.date} · ${s.mins}分钟${s.note ? ' · ' + esc(s.note) : ''}</div></div>`).join('') || '<div class="empty">暂无口语练习记录</div>'}
    </div>`;
  } else if (S.engTab === 'word') {
    body = `
    <div class="card"><h3>今日推送 20 词 ${wordCk.includes(today()) ? '<span class="tag g">今日已打卡</span>' : ''}</h3>
      ${todayWords.map(w => `<div class="list-item"><div class="li-main"><b>${w[0]}</b></div><div class="li-sub" style="margin-top:0">${w[1]}</div></div>`).join('')}
      <div class="row mt">
        <button class="btn" onclick="ckToday('wordCk')" ${wordCk.includes(today()) ? 'disabled' : ''}>今日单词打卡 ✔</button>
        <button class="btn pink" onclick="ckToday('revCk')" ${revCk.includes(today()) ? 'disabled' : ''}>复习打卡 🔁</button>
      </div>
      <div class="li-sub" style="margin-top:8px">背词打卡 ${wordCk.length} 天 · 连续 ${streakOf(wordCk)} 天 · 复习打卡 ${revCk.length} 天</div>
    </div>
    <div class="card"><h3>生词本</h3>
      <div class="row"><input id="nwWord" placeholder="生词"><input class="grow" id="nwMean" placeholder="释义"><button class="btn" onclick="addNewWord()">记录 ➕</button></div>
      ${e.newWords.slice().reverse().map(w => `<div class="list-item"><div class="li-main"><b>${esc(w.word)}</b> — ${esc(w.mean)}</div><button class="btn sm warn" onclick="delEng('newWords','${w.id}')">删</button></div>`).join('') || '<div class="empty">还没有生词记录</div>'}
    </div>`;
  } else {
    const ed = S.sentEdit ? e.sents.find(x => x.id === S.sentEdit) : null;
    body = `
    <div class="card"><h3>${ed ? '编辑语句' : '积累新语句'}</h3>
      <textarea id="stEn" rows="2" placeholder="英文句型 / 长难句">${ed ? esc(ed.en) : ''}</textarea>
      <div class="row mt"><input class="grow" id="stZh" placeholder="中文释义" value="${ed ? esc(ed.zh) : ''}"></div>
      <div class="row mt"><input class="grow" id="stNote" placeholder="仿写练习 / 笔记(选填)" value="${ed ? esc(ed.note) : ''}"></div>
      <div class="row mt"><button class="btn" onclick="saveSent()">${ed ? '保存修改 ✔' : '添加 ➕'}</button>${ed ? '<button class="btn sm ghost" onclick="S.sentEdit=null;render()">取消</button>' : ''}</div>
    </div>
    <div class="card"><h3>语句本（${e.sents.length}）</h3>
      ${e.sents.slice().reverse().map(s => `<div class="list-item"><div class="li-main">${esc(s.en)}<div class="li-sub">${esc(s.zh)}${s.note ? '\n仿写：' + esc(s.note) : ''}</div></div>
      <button class="btn sm ghost" onclick="S.sentEdit='${s.id}';render()">改</button><button class="btn sm warn" onclick="delEng('sents','${s.id}')">删</button></div>`).join('') || '<div class="empty">还没有语句积累</div>'}
    </div>`;
  }
  return `
  <div class="page-title">🔤 英语学习</div>
  <div class="page-sub">口语 · 单词 · 语句，每天进步一点点</div>
  <div class="tabs">${tabs.map(t => `<div class="tab ${S.engTab === t[0] ? 'active' : ''}" onclick="S.engTab='${t[0]}';S.sentEdit=null;render()">${t[1]}</div>`).join('')}</div>
  ${body}`;
}
function addSpeak() {
  const m = +$('#spkMin').value || 0; if (!m) return;
  const e = engData(); e.speak.push({ id: uid(), date: today(), mins: m, note: $('#spkNote').value.trim() }); store.s('eng', e);
  const ck = store.g('speakCk', []); if (!ck.includes(today())) { ck.push(today()); store.s('speakCk', ck); }
  render();
}
function addNewWord() {
  const w = $('#nwWord').value.trim(), m = $('#nwMean').value.trim(); if (!w) return;
  const e = engData(); e.newWords.push({ id: uid(), word: w, mean: m }); store.s('eng', e); render();
}
function saveSent() {
  const en = $('#stEn').value.trim(); if (!en) return;
  const e = engData();
  if (S.sentEdit) { const s = e.sents.find(x => x.id === S.sentEdit); if (s) { s.en = en; s.zh = $('#stZh').value.trim(); s.note = $('#stNote').value.trim(); } S.sentEdit = null; }
  else e.sents.push({ id: uid(), en, zh: $('#stZh').value.trim(), note: $('#stNote').value.trim() });
  store.s('eng', e); render();
}
function delEng(key, id) { const e = engData(); e[key] = e[key].filter(x => x.id !== id); store.s('eng', e); render(); }

/* ============ 宠物记录 ============ */
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
    body = `<div class="card"><h3>猫砂 / 猫粮 购买与使用</h3>
      <div class="row"><input type="date" id="ptDate" value="${today()}"><select id="ptItem"><option>猫砂</option><option>猫粮</option></select><select id="ptKind"><option>购买</option><option>开封使用</option><option>用完</option></select></div>
      <div class="row mt"><input class="grow" id="ptNote" placeholder="品牌/规格/价格等(选填)"><button class="btn" onclick="addPet('supply')">记录 ➕</button></div>
      ${p.supply.slice().reverse().map(x => `<div class="list-item"><div class="li-main">${x.date} · <span class="tag b">${x.item}</span><span class="tag y">${x.kind}</span>${x.note ? esc(x.note) : ''}</div>${del('supply', x.id)}</div>`).join('') || '<div class="empty">暂无购买/使用记录</div>'}</div>`;
  } else {
    body = `<div class="card"><h3>零食记录</h3>
      <div class="row"><input type="date" id="ptDate" value="${today()}"><input class="grow" id="ptName" placeholder="零食名称"></div>
      <div class="row mt"><input class="grow" id="ptNote" placeholder="备注(选填)"><button class="btn" onclick="addPet('snack')">记录 ➕</button></div>
      ${p.snack.slice().reverse().map(x => `<div class="list-item"><div class="li-main">${x.date} · <b>${esc(x.name)}</b>${x.note ? ' · ' + esc(x.note) : ''}</div>${del('snack', x.id)}</div>`).join('') || '<div class="empty">暂无零食记录</div>'}</div>`;
  }
  return `<div class="page-title">🐱 宠物记录</div><div class="page-sub">毛孩子的日常，都值得被记录</div>
  <div class="tabs">${tabs.map(t => `<div class="tab ${S.petTab === t[0] ? 'active' : ''}" onclick="S.petTab='${t[0]}';render()">${t[1]}</div>`).join('')}</div>${body}`;
}
function addPet(k) {
  const p = petData(); const d = $('#ptDate').value || today();
  const rec = { id: uid(), date: d, note: $('#ptNote') ? $('#ptNote').value.trim() : '' };
  if (k === 'deworm') rec.type = $('#ptType').value;
  if (k === 'supply') { rec.item = $('#ptItem').value; rec.kind = $('#ptKind').value; }
  if (k === 'snack') { rec.name = $('#ptName').value.trim(); if (!rec.name) return; }
  p[k].push(rec); p[k].sort((a, b) => a.date < b.date ? -1 : 1); store.s('pet', p); render();
}
function delPet(k, id) { const p = petData(); p[k] = p[k].filter(x => x.id !== id); store.s('pet', p); render(); }

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

/* ============ 读书计划 ============ */
function render_book() {
  const books = store.g('books', []);
  const goal = store.g('bookGoal', 12);
  const ck = store.g('bookCk', []);
  const doneBooks = books.filter(b => b.done);
  const reading = books.filter(b => !b.done && b.cur > 0);
  const unread = books.filter(b => !b.done && (!b.cur || b.cur === 0));
  const card = b => {
    const pct = b.total > 0 ? Math.min(100, Math.round(b.cur / b.total * 100)) : 0;
    return `<div class="card">
      <div class="row" style="justify-content:space-between"><b>《${esc(b.title)}》</b><span class="li-sub">${esc(b.author || '')}</span></div>
      <div class="bar"><i style="width:${b.done ? 100 : pct}%"></i></div>
      <div class="li-sub">进度 ${b.done ? b.total || b.cur : b.cur}/${b.total || '?'} 页 · ${b.done ? '已读完 🎉' : pct + '%'} · 评分 ${'★'.repeat(b.rating || 0)}${'☆'.repeat(5 - (b.rating || 0))}</div>
      <div class="row mt">
        <input type="number" id="bkCur_${b.id}" placeholder="当前页" value="${b.cur || ''}" style="width:80px">
        <button class="btn sm" onclick="updBook('${b.id}')">更新进度</button>
        <select id="bkRate_${b.id}" onchange="rateBook('${b.id}',this.value)">
          ${[0, 1, 2, 3, 4, 5].map(n => `<option value="${n}" ${b.rating === n ? 'selected' : ''}>${n ? '★'.repeat(n) : '评分'}</option>`).join('')}
        </select>
        ${b.done ? '' : `<button class="btn sm pink" onclick="finishBook('${b.id}')">读完归档 📥</button>`}
        <button class="btn sm warn" onclick="delBook('${b.id}')">删</button>
      </div>
      <textarea id="bkNote_${b.id}" rows="2" placeholder="读书笔记 / 感悟…" style="margin-top:8px">${esc(b.note || '')}</textarea>
      <div class="row mt"><button class="btn sm ghost" onclick="noteBook('${b.id}')">保存笔记 ✔</button></div>
    </div>`;
  };
  return `
  <div class="page-title">📚 读书计划</div>
  <div class="page-sub">书单 · 进度 · 笔记 · 归档</div>
  <div class="card">
    <div class="stat-grid">
      <div class="stat"><div class="num">${doneBooks.length}/${goal}</div><div class="lb">年度目标(本)</div></div>
      <div class="stat"><div class="num pk">${streakOf(ck)}</div><div class="lb">连续读书打卡</div></div>
      <div class="stat"><div class="num">${ck.length}</div><div class="lb">累计打卡(天)</div></div>
    </div>
    <div class="row mt">
      <button class="btn pink" onclick="ckToday('bookCk')" ${ck.includes(today()) ? 'disabled' : ''}>${ck.includes(today()) ? '今日已打卡 ✔' : '每日读书打卡 ➕'}</button>
      <input type="number" id="bkGoal" placeholder="年度目标" value="${goal}" style="width:90px">
      <button class="btn sm ghost" onclick="store.s('bookGoal',+document.querySelector('#bkGoal').value||12);render()">设目标</button>
    </div>
  </div>
  <div class="card"><h3>➕ 添加书籍</h3>
    <div class="row"><input class="grow" id="bkTitle" placeholder="书名"><input id="bkAuthor" placeholder="作者(选填)" style="width:110px"></div>
    <div class="row mt"><input type="number" id="bkTotal" placeholder="总页数"><button class="btn" onclick="addBook()">加入书单 ➕</button></div>
  </div>
  <h3 style="margin:14px 0 8px">📖 在读（${reading.length}）</h3>${reading.map(card).join('') || '<div class="card"><div class="empty">暂无在读书籍</div></div>'}
  <h3 style="margin:14px 0 8px">🕐 未读清单（${unread.length}）</h3>${unread.map(card).join('') || '<div class="card"><div class="empty">未读清单是空的</div></div>'}
  <h3 style="margin:14px 0 8px">✅ 已读归档（${doneBooks.length}）</h3>${doneBooks.map(card).join('') || '<div class="card"><div class="empty">还没有读完的书</div></div>'}`;
}
function addBook() {
  const t = $('#bkTitle').value.trim(); if (!t) return;
  const books = store.g('books', []);
  books.push({ id: uid(), title: t, author: $('#bkAuthor').value.trim(), total: +$('#bkTotal').value || 0, cur: 0, rating: 0, note: '', done: false });
  store.s('books', books); render();
}
function updBook(id) { const bs = store.g('books', []); const b = bs.find(x => x.id === id); if (b) { b.cur = +$('#bkCur_' + id).value || 0; if (b.total && b.cur >= b.total) b.done = true; } store.s('books', bs); render(); }
function rateBook(id, v) { const bs = store.g('books', []); const b = bs.find(x => x.id === id); if (b) b.rating = +v; store.s('books', bs); render(); }
function noteBook(id) { const bs = store.g('books', []); const b = bs.find(x => x.id === id); if (b) b.note = $('#bkNote_' + id).value; store.s('books', bs); render(); }
function finishBook(id) { const bs = store.g('books', []); const b = bs.find(x => x.id === id); if (b) { b.done = true; if (b.total) b.cur = b.total; } store.s('books', bs); render(); }
function delBook(id) { if (!confirm('删除这本书？')) return; store.s('books', store.g('books', []).filter(x => x.id !== id)); render(); }
