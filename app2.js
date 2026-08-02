/* ============ 英语学习 ============ */
const WORDS = [
  { w: 'abundant', ph: '/əˈbʌndənt/', mean: '丰富的，充裕的', ex: [{ en: 'The region is abundant in natural resources.', zh: '这个地区自然资源丰富。' }, { en: 'She has abundant energy for the work.', zh: '她对这项工作精力充沛。' }] },
  { w: 'accomplish', ph: '/əˈkɑːmplɪʃ/', mean: '完成，实现', ex: [{ en: 'We accomplished the goal ahead of time.', zh: '我们提前完成了目标。' }, { en: 'He felt proud to accomplish it.', zh: '他因完成它而感到自豪。' }] },
  { w: 'adapt', ph: '/əˈdæpt/', mean: '适应，改编', ex: [{ en: 'It takes time to adapt to a new city.', zh: '适应新城市需要时间。' }, { en: 'We should adapt our plan to the change.', zh: '我们应让计划适应变化。' }] },
  { w: 'ambition', ph: '/æmˈbɪʃn/', mean: '雄心，抱负', ex: [{ en: 'Her ambition is to start her own brand.', zh: '她的抱负是创立自己的品牌。' }, { en: 'Ambition drives people forward.', zh: '抱负推动人们向前。' }] },
  { w: 'anticipate', ph: '/ænˈtɪsɪpeɪt/', mean: '预期，期望', ex: [{ en: 'We anticipate a busy season ahead.', zh: '我们预计将迎来繁忙季。' }, { en: 'I anticipate his reply by tomorrow.', zh: '我预期明天前收到他的回复。' }] },
  { w: 'appreciate', ph: '/əˈpriːʃieɪt/', mean: '感激，欣赏', ex: [{ en: 'I really appreciate your help.', zh: '我真心感激你的帮助。' }, { en: 'She appreciates good music.', zh: '她欣赏好音乐。' }] },
  { w: 'approach', ph: '/əˈproʊtʃ/', mean: '方法；接近', ex: [{ en: 'We need a new approach to this.', zh: '我们需要个新方法来处理。' }, { en: 'He approached the problem calmly.', zh: '他冷静地接近这个问题。' }] },
  { w: 'appropriate', ph: '/əˈproʊpriət/', mean: '合适的', ex: [{ en: 'Casual clothes are appropriate here.', zh: '休闲装在这里很合适。' }, { en: 'Pick an appropriate time to talk.', zh: '选个合适的时间谈。' }] },
  { w: 'assume', ph: '/əˈsuːm/', mean: '假定，承担', ex: [{ en: 'Do not assume it will be easy.', zh: '别假定它会很容易。' }, { en: 'He assumed the new role last month.', zh: '他上月承担了新角色。' }] },
  { w: 'attitude', ph: '/ˈætɪtuːd/', mean: '态度', ex: [{ en: 'A positive attitude helps a lot.', zh: '积极的态度很有帮助。' }, { en: 'Her attitude impressed the team.', zh: '她的态度打动了团队。' }] },
  { w: 'available', ph: '/əˈveɪləbl/', mean: '可获得的', ex: [{ en: 'Is the manager available now?', zh: '经理现在有空吗？' }, { en: 'This service is available online.', zh: '这项服务在线可用。' }] },
  { w: 'balance', ph: '/ˈbæləns/', mean: '平衡', ex: [{ en: 'Try to balance work and life.', zh: '试着平衡工作与生活。' }, { en: 'The budget is finally in balance.', zh: '预算终于平衡了。' }] },
  { w: 'benefit', ph: '/ˈbenɪfɪt/', mean: '好处，受益', ex: [{ en: 'Both sides will benefit from it.', zh: '双方都将从中受益。' }, { en: 'The benefit is obvious.', zh: '好处是明显的。' }] },
  { w: 'brilliant', ph: '/ˈbrɪliənt/', mean: '杰出的，明亮的', ex: [{ en: 'She gave a brilliant speech.', zh: '她做了场杰出的演讲。' }, { en: 'The sky was brilliant blue.', zh: '天空是明亮的蓝。' }] },
  { w: 'capacity', ph: '/kəˈpæsəti/', mean: '能力，容量', ex: [{ en: 'The hall has a capacity of 500.', zh: '大厅容量为 500 人。' }, { en: 'He has the capacity to lead.', zh: '他有领导能力。' }] },
  { w: 'challenge', ph: '/ˈtʃælɪndʒ/', mean: '挑战', ex: [{ en: 'This is a real challenge.', zh: '这是个真正的挑战。' }, { en: 'She welcomed the challenge.', zh: '她欣然接受挑战。' }] },
  { w: 'commitment', ph: '/kəˈmɪtmənt/', mean: '承诺，投入', ex: [{ en: 'His commitment moved everyone.', zh: '他的投入打动了所有人。' }, { en: 'Keep your commitment.', zh: '信守你的承诺。' }] },
  { w: 'confidence', ph: '/ˈkɑːnfɪdəns/', mean: '信心', ex: [{ en: 'Practice builds confidence.', zh: '练习建立信心。' }, { en: 'She spoke with confidence.', zh: '她自信地发言。' }] },
  { w: 'consistent', ph: '/kənˈsɪstənt/', mean: '一致的，持续的', ex: [{ en: 'Be consistent with your efforts.', zh: '保持努力的持续。' }, { en: 'His story is consistent.', zh: '他的说法前后一致。' }] },
  { w: 'contribute', ph: '/kənˈtrɪbjuːt/', mean: '贡献', ex: [{ en: 'Everyone contributed to the project.', zh: '每个人都为项目做了贡献。' }, { en: 'She contributed a new idea.', zh: '她贡献了一个新点子。' }] },
  { w: 'curious', ph: '/ˈkjʊriəs/', mean: '好奇的', ex: [{ en: 'Kids are naturally curious.', zh: '孩子天生好奇。' }, { en: 'I am curious about your story.', zh: '我对你的故事很好奇。' }] },
  { w: 'dedicate', ph: '/ˈdedɪkeɪt/', mean: '奉献，致力于', ex: [{ en: 'He dedicated his life to art.', zh: '他毕生奉献于艺术。' }, { en: 'We dedicate this to you.', zh: '我们把这个献给你。' }] },
  { w: 'determine', ph: '/dɪˈtɜːrmɪn/', mean: '决定，决心', ex: [{ en: 'We determined to finish it.', zh: '我们决心完成它。' }, { en: 'The result determined our plan.', zh: '结果决定了我们的计划。' }] },
  { w: 'efficient', ph: '/ɪˈfɪʃnt/', mean: '高效的', ex: [{ en: 'The new tool is efficient.', zh: '新工具很高效。' }, { en: 'Work smarter, be efficient.', zh: '更聪明地工作，提高效率。' }] },
  { w: 'embrace', ph: '/ɪmˈbreɪs/', mean: '拥抱，欣然接受', ex: [{ en: 'Embrace the change bravely.', zh: '勇敢拥抱变化。' }, { en: 'They embraced the new idea.', zh: '他们欣然接受了新想法。' }] },
  { w: 'emphasize', ph: '/ˈemfəsaɪz/', mean: '强调', ex: [{ en: 'He emphasized the key point.', zh: '他强调了关键点。' }, { en: 'I want to emphasize safety.', zh: '我想强调安全。' }] },
  { w: 'enhance', ph: '/ɪnˈhæns/', mean: '提高，增强', ex: [{ en: 'This will enhance your skills.', zh: '这会增强你的技能。' }, { en: 'Music enhances the mood.', zh: '音乐提升氛围。' }] },
  { w: 'essential', ph: '/ɪˈsenʃl/', mean: '必要的，本质的', ex: [{ en: 'Water is essential to life.', zh: '水对生命必不可少。' }, { en: 'Trust is essential.', zh: '信任是必要的。' }] },
  { w: 'evaluate', ph: '/ɪˈvæljueɪt/', mean: '评估', ex: [{ en: 'We evaluate the results weekly.', zh: '我们每周评估结果。' }, { en: 'It is hard to evaluate.', zh: '这很难评估。' }] },
  { w: 'eventually', ph: '/ɪˈventʃuəli/', mean: '最终', ex: [{ en: 'Eventually we made it.', zh: '最终我们做到了。' }, { en: 'It will eventually work out.', zh: '最终会好起来的。' }] },
  { w: 'evidence', ph: '/ˈevɪdəns/', mean: '证据', ex: [{ en: 'There is no clear evidence.', zh: '没有明确证据。' }, { en: 'Show me the evidence.', zh: '给我看证据。' }] },
  { w: 'expand', ph: '/ɪkˈspænd/', mean: '扩大，展开', ex: [{ en: 'We plan to expand the team.', zh: '我们计划扩大团队。' }, { en: 'The business expanded fast.', zh: '业务迅速扩张。' }] },
  { w: 'explore', ph: '/ɪkˈsplɔːr/', mean: '探索', ex: [{ en: 'Let us explore the options.', zh: '我们来探索各种选项。' }, { en: 'She loves to explore cities.', zh: '她喜欢探索城市。' }] },
  { w: 'flexible', ph: '/ˈfleksəbl/', mean: '灵活的', ex: [{ en: 'We have a flexible schedule.', zh: '我们的日程很灵活。' }, { en: 'Be flexible with the plan.', zh: '对计划保持灵活。' }] },
  { w: 'focus', ph: '/ˈfoʊkəs/', mean: '专注，焦点', ex: [{ en: 'Focus on what matters.', zh: '专注于重要的事。' }, { en: 'The focus is on quality.', zh: '焦点在质量上。' }] },
  { w: 'frequent', ph: '/ˈfriːkwənt/', mean: '频繁的', ex: [{ en: 'He is a frequent visitor.', zh: '他是常客。' }, { en: 'Frequent breaks help.', zh: '频繁休息有帮助。' }] },
  { w: 'generate', ph: '/ˈdʒenəreɪt/', mean: '产生，生成', ex: [{ en: 'The idea generated discussion.', zh: '这个想法引发了讨论。' }, { en: 'It generates income.', zh: '它产生收入。' }] },
  { w: 'genuine', ph: '/ˈdʒenjuɪn/', mean: '真诚的，真正的', ex: [{ en: 'She gave a genuine smile.', zh: '她给了真诚的微笑。' }, { en: 'This is a genuine product.', zh: '这是真品。' }] },
  { w: 'gradual', ph: '/ˈɡrædʒuəl/', mean: '逐渐的', ex: [{ en: 'There was a gradual change.', zh: '有一个逐渐的变化。' }, { en: 'Progress is gradual.', zh: '进步是渐进的。' }] },
  { w: 'grateful', ph: '/ˈɡreɪtfl/', mean: '感激的', ex: [{ en: 'I am grateful for your support.', zh: '我感激你的支持。' }, { en: 'Be grateful for small things.', zh: '为小事感恩。' }] },
  { w: 'improve', ph: '/ɪmˈpruːv/', mean: '改进，提高', ex: [{ en: 'We must improve the process.', zh: '我们必须改进流程。' }, { en: 'Her English improved fast.', zh: '她英语进步很快。' }] },
  { w: 'inspire', ph: '/ɪnˈspaɪər/', mean: '激励，鼓舞', ex: [{ en: 'The story inspired many.', zh: '这个故事鼓舞了很多人。' }, { en: 'She inspires her team.', zh: '她激励着团队。' }] },
  { w: 'maintain', ph: '/meɪnˈteɪn/', mean: '保持，维护', ex: [{ en: 'Maintain a healthy habit.', zh: '保持健康的习惯。' }, { en: 'We maintain the system.', zh: '我们维护系统。' }] },
  { w: 'motivate', ph: '/ˈmoʊtɪveɪt/', mean: '激发动力', ex: [{ en: 'Good goals motivate us.', zh: '好目标激励我们。' }, { en: 'The coach motivated the team.', zh: '教练激励了团队。' }] },
  { w: 'necessary', ph: '/ˈnesəseri/', mean: '必要的', ex: [{ en: 'Sleep is necessary for health.', zh: '睡眠对健康必要。' }, { en: 'Take the necessary steps.', zh: '采取必要的步骤。' }] },
  { w: 'objective', ph: '/əbˈdʒektɪv/', mean: '目标；客观的', ex: [{ en: 'Our objective is clear.', zh: '我们的目标清晰。' }, { en: 'Stay objective in review.', zh: '复盘时保持客观。' }] },
  { w: 'opportunity', ph: '/ˌɑːpərˈtuːnəti/', mean: '机会', ex: [{ en: 'This is a great opportunity.', zh: '这是个好机会。' }, { en: 'Seize the opportunity.', zh: '抓住机会。' }] },
  { w: 'optimistic', ph: '/ˌɑːptɪˈmɪstɪk/', mean: '乐观的', ex: [{ en: 'He is optimistic about the future.', zh: '他对未来乐观。' }, { en: 'Stay optimistic.', zh: '保持乐观。' }] },
  { w: 'organize', ph: '/ˈɔːrɡənaɪz/', mean: '组织，整理', ex: [{ en: 'Let us organize the event.', zh: '我们来组织活动。' }, { en: 'She organized her desk.', zh: '她整理了书桌。' }] },
  { w: 'overcome', ph: '/ˌoʊvərˈkʌm/', mean: '克服', ex: [{ en: 'We overcame the difficulty.', zh: '我们克服了困难。' }, { en: 'Overcome your fear.', zh: '克服你的恐惧。' }] },
  { w: 'patient', ph: '/ˈpeɪʃnt/', mean: '耐心的；病人', ex: [{ en: 'Be patient with yourself.', zh: '对自己耐心点。' }, { en: 'The patient is recovering.', zh: '病人正在康复。' }] },
  { w: 'perspective', ph: '/pərˈspektɪv/', mean: '视角，观点', ex: [{ en: 'Try a new perspective.', zh: '换个新视角。' }, { en: 'From my perspective, it works.', zh: '在我看来这行得通。' }] },
  { w: 'positive', ph: '/ˈpɑːzətɪv/', mean: '积极的', ex: [{ en: 'Keep a positive mind.', zh: '保持积极心态。' }, { en: 'The feedback was positive.', zh: '反馈是积极的。' }] },
  { w: 'potential', ph: '/pəˈtenʃl/', mean: '潜力', ex: [{ en: 'He has great potential.', zh: '他潜力很大。' }, { en: 'Realize your potential.', zh: '发挥你的潜力。' }] },
  { w: 'priority', ph: '/praɪˈɔːrəti/', mean: '优先事项', ex: [{ en: 'Health is my priority.', zh: '健康是我的优先项。' }, { en: 'Set the right priority.', zh: '设好正确的优先级。' }] },
  { w: 'progress', ph: '/ˈprɑːɡres/', mean: '进步，进展', ex: [{ en: 'We made real progress.', zh: '我们取得了实在进展。' }, { en: 'Track your progress.', zh: '追踪你的进展。' }] },
  { w: 'pursue', ph: '/pərˈsuː/', mean: '追求', ex: [{ en: 'Pursue your dream.', zh: '追求你的梦想。' }, { en: 'He pursued a career in art.', zh: '他追求艺术事业。' }] },
  { w: 'reflect', ph: '/rɪˈflekt/', mean: '反思，反映', ex: [{ en: 'Reflect on your day.', zh: '反思你的一天。' }, { en: 'The data reflects a trend.', zh: '数据反映了一个趋势。' }] },
  { w: 'strategy', ph: '/ˈstrætədʒi/', mean: '策略', ex: [{ en: 'We need a clear strategy.', zh: '我们需要清晰策略。' }, { en: 'His strategy worked.', zh: '他的策略奏效了。' }] }
];
/* 艾宾浩斯复习间隔（天）：学完当天复习后逐级拉长 */
const EBB_GAPS = [0, 1, 2, 4, 7, 15, 30];
function wordState() { return store.g('wordRec', {}); }
function learnedSet() { return store.g('wordLearned', []); }
function ckArr(key) { const a = store.g(key, []); if (!a.includes(today())) { a.push(today()); store.s(key, a); } }
function learnTodayWords() {
  const L = learnedSet();
  let pick = WORDS.filter(w => !L.includes(w.w));
  if (pick.length < 10) pick = pick.concat(WORDS.filter(w => L.includes(w.w)));
  return pick.slice(0, 10);
}
function reviewDue() {
  const rec = wordState(), t = today();
  return WORDS.filter(w => rec[w.w] && rec[w.w].level < 6 && rec[w.w].next <= t);
}
function speakWord(i) { const w = WORDS[i]; if (w) speak(w.w, 'en-US'); }
function speakEx(i, ei) { const w = WORDS[i]; if (w && w.ex[ei]) speak(w.ex[ei].en, 'en-US'); }
function finishTodayNew() {
  const L = learnedSet(), rec = wordState();
  learnTodayWords().forEach(w => {
    if (!L.includes(w.w)) L.push(w.w);
    if (!rec[w.w]) rec[w.w] = { first: today(), level: 0, next: today(), last: today() };
  });
  store.s('wordLearned', L); store.s('wordRec', rec); ckArr('wordStudyCk'); render();
}
function reviewDone(w) {
  const rec = wordState(); const o = rec[w]; if (!o) return;
  o.level = Math.min(6, o.level + 1);
  const add = EBB_GAPS[Math.min(o.level, EBB_GAPS.length - 1)];
  const d = new Date(); d.setDate(d.getDate() + add);
  o.next = fmt(d); o.last = today();
  store.s('wordRec', rec); ckArr('wordStudyCk'); render();
}
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
function englishFrag() {
  const e = engData();
  const speakCk = store.g('speakCk', []);
  const totalMins = e.speak.reduce((a, b) => a + (+b.mins || 0), 0);
  const tabs = [['speak', '🗣 口语练习'], ['word', '📖 单词学习'], ['sent', '✍️ 语句积累'], ['mine', '📥 我的词库']];
  let body = '';
  if (S.engTab === 'speak') {
    const mats = SPEAK_SETS[dayIdx % SPEAK_SETS.length];
    body = `
    <div class="card"><h3>今日口语素材（跟读练习）</h3>
      ${mats.map((m, i) => `<div class="list-item"><div class="li-main"><b>${i + 1}.</b> ${esc(m)}</div>
        <div class="row mt" style="justify-content:flex-start;gap:6px">
          <button class="btn sm" onclick="speakSpeak(${i})">🔊 发音</button>
          <span id="spk_${i}"></span>
          <button class="btn sm ghost" onclick="recToggle('spk_${i}','en-US')">🎙 跟读</button>
        </div></div>`).join('')}
      <div class="row mt">
        <input type="number" id="spkMin" placeholder="练习时长(分)">
        <input class="grow" id="spkNote" placeholder="练习内容备注(选填)">
        <button class="btn" onclick="addSpeak()">口语打卡 ➕</button>
      </div>
    </div>
    <div class="card"><h3>学习记录（历史进度）</h3>
      <div class="stat-grid"><div class="stat"><div class="num">${streakOf(speakCk)}</div><div class="lb">连续打卡(天)</div></div>
      <div class="stat"><div class="num pk">${speakCk.length}</div><div class="lb">累计打卡(天)</div></div>
      <div class="stat"><div class="num">${totalMins}</div><div class="lb">累计时长(分)</div></div></div>
      ${e.speak.slice(-6).reverse().map(s => `<div class="list-item"><div class="li-main">${s.date} · ${s.mins}分钟${s.note ? ' · ' + esc(s.note) : ''}</div></div>`).join('') || '<div class="empty">暂无口语练习记录</div>'}
    </div>`;
  } else if (S.engTab === 'word') {
    const L = learnedSet(), rec = wordState();
    const todayNew = learnTodayWords();
    const due = reviewDue();
    const ck = store.g('wordStudyCk', []);
    const lvCount = [0, 1, 2, 3, 4, 5, 6].map(l => WORDS.filter(w => rec[w.w] && rec[w.w].level === l).length);
    const newCard = (w) => {
      const gi = WORDS.indexOf(w);
      return `<div class="card" style="padding:12px">
        <div class="row" style="justify-content:space-between;align-items:center">
          <div><b style="font-size:16px">${esc(w.w)}</b> <span class="li-sub">${esc(w.ph)}</span></div>
          <div class="row" style="gap:6px">
            <button class="btn sm" onclick="speakWord(${gi})">🔊</button>
            <span id="wrd_${gi}"></span>
            <button class="btn sm ghost" onclick="recToggle('wrd_${gi}','en-US','${w.w}')">🎙</button>
            <button class="btn sm ghost" onclick="toggleWrong('${w.w}')" title="加入错词本">🔴</button>
          </div>
        </div>
        <div class="li-sub" style="margin-top:4px">${esc(w.mean)}</div>
        ${w.ex.map((x, ei) => `<div class="list-item" style="border:none;padding:6px 0">
          <div class="li-main" style="display:flex;gap:6px;align-items:flex-start"><span style="flex:1">${esc(x.en)}<div class="li-sub">${esc(x.zh)}</div></span>
          <button class="btn sm" onclick="speakEx(${gi},${ei})">🔊</button></div>
          <div class="row mt" style="justify-content:flex-start"><span id="wex_${gi}_${ei}"></span><button class="btn sm ghost" onclick="recToggle('wex_${gi}_${ei}','en-US')">🎙 跟读</button></div>
        </div>`).join('')}
      </div>`;
    };
    body = `
    <div class="card"><h3>📚 今日新词（${todayNew.length} 个）</h3>
      <div class="li-sub" style="margin-bottom:8px">学完点下方按钮，自动加入艾宾浩斯复习计划</div>
      ${todayNew.map(w => newCard(w)).join('')}
      <button class="btn mt" onclick="finishTodayNew()">✅ 我已学完今日新词</button>
    </div>
    <div class="card"><h3>🔁 待复习（${due.length} 个）</h3>
      ${due.length ? due.map(w => { const gi = WORDS.indexOf(w); return `<div class="list-item"><div class="li-main" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><b>${esc(w.w)}</b><span class="li-sub">${esc(w.ph)} · ${esc(w.mean)}</span>
        <button class="btn sm" onclick="speakWord(${gi})">🔊</button><span id="rv_${gi}"></span><button class="btn sm ghost" onclick="recToggle('rv_${gi}','en-US','${w.w}')">🎙</button>
        <button class="btn sm ghost" onclick="toggleWrong('${esc(w.w)}')" title="加入错词本">🔴</button>
        <button class="btn sm pink" onclick="reviewDone('${esc(w.w)}')">记住了 🔁</button></div></div>`; }).join('') : '<div class="empty">今日没有待复习的词，太棒了 🎉</div>'}
    </div>
    ${(() => { const wrong = wrongSet(); return `<div class="card"><h3>🔴 错词本 / 生词本（${wrong.length}）</h3>
      <div class="li-sub" style="margin-bottom:8px">跟读识别不符、或点 🔴 加入的词会在这里，重点复习。</div>
      ${wrong.length ? wrong.map(w => { const gi = WORDS.findIndex(x => x.w === w); const wd = WORDS[gi]; return `<div class="list-item"><div class="li-main" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><b>${esc(w)}</b>${wd ? ` <span class="li-sub">${esc(wd.ph)} · ${esc(wd.mean)}</span>` : ''}
        <button class="btn sm" onclick="speak('${esc(w)}','en-US')">🔊</button><span id="wng_${gi}"></span><button class="btn sm ghost" onclick="recToggle('wng_${gi}','en-US','${esc(w)}')">🎙</button>
        <button class="btn sm pink" onclick="toggleWrong('${esc(w)}')">已掌握 🔴</button></div></div>`; }).join('') + `<button class="btn mt ghost" onclick="clearWrong()">全部标记为已掌握</button>` : '<div class="empty">还没有错词，继续保持 💪</div>'}
    </div>`; })()}
    <div class="card"><h3>📈 学习进度（历史）</h3>
      <div class="stat-grid">
        <div class="stat"><div class="num">${L.length}</div><div class="lb">已学词数</div></div>
        <div class="stat"><div class="num pk">${streakOf(ck)}</div><div class="lb">连续学习(天)</div></div>
        <div class="stat"><div class="num">${ck.length}</div><div class="lb">累计学习(天)</div></div>
      </div>
      <div class="li-sub" style="margin-top:6px">熟练度分布（L0 生疏 → L6 掌握）：${lvCount.join(' / ')}</div>
      <div class="li-sub">艾宾浩斯间隔：当天 → 1 → 2 → 4 → 7 → 15 → 30 天逐级复习</div>
    </div>
    <div class="card"><h3>📝 生词本</h3>
      <div class="row"><input id="nwWord" placeholder="生词"><input class="grow" id="nwMean" placeholder="释义"><button class="btn" onclick="addNewWord()">记录 ➕</button></div>
      ${e.newWords.slice().reverse().map(w => `<div class="list-item"><div class="li-main"><b>${esc(w.word)}</b> — ${esc(w.mean)}</div><button class="btn sm warn" onclick="delEng('newWords','${w.id}')">删</button></div>`).join('') || '<div class="empty">还没有生词记录</div>'}
    </div>`;
  } else if (S.engTab === 'mine') {
    body = myVocabManage('en-US', 'en', 'MY_EN', MY_EN_CFG);
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
  <div class="tabs">${tabs.map(t => `<div class="tab ${S.engTab === t[0] ? 'active' : ''}" onclick="S.engTab='${t[0]}';S.sentEdit=null;render()">${t[1]}</div>`).join('')}</div>
  ${body}`;
}
/* 英语学习已并入「外语学习」子分类，保留独立入口以兼容旧链接 */
function render_english() {
  return `
  <div class="page-title">🔤 英语学习</div>
  <div class="page-sub">口语 · 单词 · 语句，每天进步一点点</div>
  ${englishFrag()}`;
}
function speakSpeak(i) { const m = SPEAK_SETS[dayIdx % SPEAK_SETS.length][i]; if (m) speak(m, 'en-US'); }
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
