/* ============ 通用语音工具：发音 + 跟读录音对比 ============ */
/* 喇叭发音：text 文本，lang 语言码（en-US / ko-KR / ja-JP / zh-CN） */
/* 移动端（尤其 iOS Safari）兼容处理：
   - 缓存 voices 列表（iOS 上 getVoices 首屏为空、异步就绪）
   - 显式按语言选 voice，提升命中率
   - 全局持有 utterance，避免 iOS 垃圾回收导致朗读中断
   - cancel() 后延迟再 speak，规避 iOS “cancel 紧跟 speak 吞音” 已知 bug
   - voices 未就绪时等待 voiceschanged 或超时兜底，确保首次也能出声 */
let _voicesCache = [];
let _voicesReady = false;
let _curUtter = null;
function _loadVoices() {
  try { _voicesCache = (window.speechSynthesis && speechSynthesis.getVoices()) || []; }
  catch (e) { _voicesCache = []; }
  if (_voicesCache.length) _voicesReady = true;
}
function _pickVoice(lang) {
  if (!_voicesCache.length) return null;
  const L = (lang || 'en-US').toLowerCase();
  const pref = (store.g('voicePref', {}))[lang] || '';
  if (pref) {
    let m = _voicesCache.filter(v => v.name === pref);
    if (!m.length) m = _voicesCache.filter(v => (v.name || '').indexOf(pref) >= 0);
    if (m.length) return m[0];
  }
  const same = _voicesCache.filter(v => (v.lang || '').toLowerCase() === L);
  if (same.length) {
    const nice = same.find(v => /google|samantha|yuna|kyoko|premium|natural|neural|female|女/i.test(v.name || '')) || same[0];
    return nice;
  }
  const p2 = L.split('-')[0];
  const m = _voicesCache.filter(v => (v.lang || '').toLowerCase().split('-')[0] === p2);
  return m[0] || null;
}
let _voiceRenderTimer = null;
function _afterVoices() {
  _loadVoices();
  speechSynthesis.onvoiceschanged = _afterVoices;
  if (typeof render === 'function' && document.getElementById('voicePick')) {
    clearTimeout(_voiceRenderTimer);
    _voiceRenderTimer = setTimeout(render, 300);
  }
}
if (typeof speechSynthesis !== 'undefined') {
  _loadVoices();
  speechSynthesis.onvoiceschanged = _afterVoices;
}
function speak(text, lang) {
  try {
    if (!text) return;
    if (!('speechSynthesis' in window)) { alert('当前浏览器不支持语音发音，建议用 Chrome 或 Safari 打开'); return; }
    if (!_voicesCache.length) _loadVoices();
    const L = lang || 'en-US';
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = L; u.rate = 0.9; u.pitch = 1.04;
    const v = _pickVoice(L);
    if (v) u.voice = v;
    _curUtter = u; // 防 iOS GC 中断
    const fire = () => { try { speechSynthesis.speak(u); } catch (e) { alert('语音发音失败：' + e.message); } };
    if (!_voicesReady || !_voicesCache.length) {
      // iOS/部分安卓：voices 首屏为空，等 voiceschanged 就绪后再读一次
      let done = false;
      const onReady = () => { if (done) return; done = true; _afterVoices(); fire(); };
      speechSynthesis.onvoiceschanged = onReady;
      setTimeout(onReady, 700); // 兜底：若语音引擎一直不回调，700ms 后强制朗读
    } else {
      // 已知 iOS bug：cancel 紧跟 speak 会吞掉发音，延迟 120ms
      setTimeout(fire, 120);
    }
  } catch (e) { alert('语音发音失败：' + e.message); }
}
function setVoice(lang, name) {
  const p = store.g('voicePref', {});
  if (name) p[lang] = name; else delete p[lang];
  store.s('voicePref', p);
}
function voicePickHtml() {
  const langs = [['en-US', '英语'], ['ko-KR', '韩语'], ['ja-JP', '日语']];
  const pref = store.g('voicePref', {});
  const rows = langs.map(([code, nm]) => {
    const opts = _voicesCache.filter(v => {
      const vl = (v.lang || '').toLowerCase();
      return vl === code.toLowerCase() || vl.split('-')[0] === code.toLowerCase().split('-')[0];
    });
    const sel = pref[code] || '';
    const os = ['<option value="">自动（系统默认）</option>'].concat(
      opts.map(v => `<option value="${esc(v.name)}" ${v.name === sel ? 'selected' : ''}>${esc(v.name)}</option>`)
    ).join('');
    return `<div class="row mt" style="gap:8px;align-items:center"><span style="width:40px">${nm}</span><select onchange="setVoice('${code}',this.value)" style="flex:1;min-width:0">${os}</select></div>`;
  }).join('');
  return `<details class="folder" id="voicePick"><summary class="folder-sum">🎚 发音人设置（点开挑选更好听的声音）</summary><div class="folder-body">${rows}<div class="li-sub" style="margin-top:8px">不同设备声音不同，挑一个顺耳的即可；选「自动」则用系统默认更自然的发音。</div></div></details>`;
}
/* 跟读录音对比：点击开始录音，再点停止→自动回放你的录音 + best-effort 语音识别 */
const _recs = {};
function recToggle(id, lang, target, wrongKey) {
  const box = document.getElementById(id);
  if (!box) return;
  if (_recs[id] && _recs[id].rec && _recs[id].rec.state === 'recording') { _recs[id].rec.stop(); return; }
  if (!navigator.mediaDevices || !window.MediaRecorder) {
    box.innerHTML = '<span class="li-sub">当前环境不支持录音（建议用 https 或 localhost 打开）</span>'; return;
  }
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    const rec = new MediaRecorder(stream);
    const chunks = [];
    rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
    rec.onstop = () => {
      const blob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' });
      const url = URL.createObjectURL(blob);
      box.innerHTML = `<audio controls src="${url}"></audio> <span class="li-sub">↑ 你的跟读</span> <button class="btn sm ghost" onclick="recToggle('${id}','${lang}')">重录</button>`;
      tryRecog(id, lang, target, wrongKey);
      stream.getTracks().forEach(t => t.stop());
    };
    rec.start(); _recs[id] = { rec };
    box.innerHTML = '<span class="li-sub">● 录音中… 再次点击按钮停止</span>';
  }).catch(() => { box.innerHTML = '<span class="li-sub">无法访问麦克风，请在浏览器授权后重试</span>'; });
}
function tryRecog(id, lang, target, wrongKey) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;
  try {
    const rec = new SR(); rec.lang = lang || 'en-US'; rec.interimResults = false; rec.maxAlternatives = 1;
    rec.onresult = e => {
      const t = e.results[0][0].transcript;
      const box = document.getElementById(id);
      if (box) box.innerHTML += ` <span class="li-sub">识别结果：${esc(t)}</span>`;
      if (target) {
        let mismatch;
        if (lang === 'en-US') {
          const got = t.toLowerCase().replace(/[^a-z]/g, '');
          const tgt = String(target).toLowerCase().replace(/[^a-z]/g, '');
          mismatch = got && tgt && got !== tgt && !got.includes(tgt) && !tgt.includes(got);
        } else {
          const clean = t.replace(/\s/g, '');
          const tgt = String(target).replace(/\s/g, '');
          mismatch = !!clean && clean !== tgt && clean.indexOf(tgt) < 0 && tgt.indexOf(clean) < 0;
        }
        if (mismatch) {
          addWrongK(target, wrongKey || 'wordWrong');
          if (box) box.innerHTML += ` <span class="li-sub" style="color:#e2557a">与目标不符，已加入错词本 🔴</span>`;
        }
      }
    };
    rec.start();
  } catch (_) { /* 识别不可用则忽略 */ }
}
/* 错词本（生词本）：记录没记住 / 跟读识别不符的单词 */
function wrongSetK(key) { return store.g(key, []); }
function addWrongK(w, key) { key = key || 'wordWrong'; const a = wrongSetK(key); if (w && !a.includes(w)) { a.push(w); store.s(key, a); } }
function toggleWrongK(w, key) { const a = wrongSetK(key); const i = a.indexOf(w); if (i >= 0) a.splice(i, 1); else a.push(w); store.s(key, a); render(); }
function clearWrongK(key) { if (confirm('把错词本全部标记为已掌握？')) { store.s(key, []); render(); } }
/* 英语模块兼容（错词本 key = wordWrong） */
function wrongSet() { return wrongSetK('wordWrong'); }
function addWrong(w) { addWrongK(w, 'wordWrong'); }
function toggleWrong(w) { toggleWrongK(w, 'wordWrong'); }
function clearWrong() { clearWrongK('wordWrong'); }

/* ============ 灵感补给站 ============ */
/* 好书推荐 */
const BOOKS_REC = [
  { t: '《被讨厌的勇气》', a: '岸见一郎 / 古贺史健', reason: '用「哲人与青年对话」的形式讲阿德勒心理学，读完会很想松一口气。', body: '全书围绕「课题分离」「目的论」「共同体感觉」展开。最打动我的是：人的烦恼皆源于人际关系，而自由就是被别人讨厌的勇气。不必迎合所有人的期待，把「自己想要的」和「别人怎么看」分开，人生会轻很多。' },
  { t: '《小王子》', a: '圣埃克苏佩里', reason: '每个大人都曾是孩子，只是渐渐忘了。睡前读几页，很治愈。', body: '“真正重要的东西，用眼睛是看不见的。”小王子走访各个星球，遇见国王、虚荣者、点灯人……最后在玫瑰与狐狸身上懂得「驯养」与「责任」。它不只是一本童书，更是对成年世界温柔的提醒：请守护心里那个孩子。' },
  { t: '《非暴力沟通》', a: '马歇尔·卢森堡', reason: '把「好好说话」变成可练习的方法，亲密关系和工作都受益。', body: '沟通四步：观察（说事实，不作评判）→ 感受（说情绪，不怪对方）→ 需要（我真正想要的是什么）→ 请求（具体、可执行的动作）。当我们停止用指责开场，对方才听得进。很多争吵，其实只是没被听懂的需要。' },
  { t: '《活着》', a: '余华', reason: '苦难里活着本身的意义，读完会对「平安是福」有更深的体会。', body: '福贵的一生接连失去所有至亲，却依然与老牛在田间平静地活着。余华用最朴素的语言写最深的命运：人是为了活着本身而活着，而不是为了活着之外的任何事物。它不煽情，却让人久久沉默。' },
  { t: '《认知觉醒》', a: '周岭', reason: '从脑科学角度讲「为什么道理都懂却做不到」，适合想改变习惯的人。', body: '书里把大脑分成「本能脑、情绪脑、理智脑」，解释为何我们总被短视诱惑战胜。觉醒的方法不是逼自己，而是用「元认知」在冲动时按下暂停键，让理智脑参与决策。每天微小而持续的觉察，会慢慢改写人生轨迹。' },
  { t: '《蛤蟆先生去看心理医生》', a: '罗伯特·戴博德', reason: '用童话讲心理咨询，轻松读懂「童年如何影响现在的你」。', body: '蛤蟆抑郁了，在苍鹭医生引导下，逐渐看清自己总在扮演「儿童自我状态」讨好别人。书里提出三种状态：儿童、父母、成人。当你能稳定在「成人状态」回应世界，便拿回了人生的主动权。' },
  { t: '《人间值得》', a: '中村恒子 / 奥田弘美', reason: '90 岁心理医生的从容问答，适合焦虑时在枕边翻两页。', body: '恒子奶奶说：人生的本质，只不过是一切都会过去的。工作也好、婚姻也好，别太较真，「只要能照亮某个角落就够了」。把期望降低一点，对不可控的放手一点，日子反而轻了。' },
  { t: '《微习惯》', a: '斯蒂芬·盖斯', reason: '想坚持却总失败？从一个「小到不可能失败」的动作开始。', body: '作者用「每天做 1 个俯卧撑」开启了改变。微习惯的核心：把目标缩到小到毫无心理负担，靠「完成」带来的成就感滚雪球。比起宏大的计划，持续的小行动才是真正的复利。' }
];
/* 好词好句 / 人生建议（困困想对你说的话） */
const QUOTES_REC = [
  { t: '关于内耗', s: '困困', body: '想做就做，做不完也没关系。大多数焦虑来自「想得太多、做得太少」。先动起来，路会自己亮。' },
  { t: '关于比较', s: '困困', body: '别人的进度是别人的，你的节奏是你的。花期不同，不必急着和谁撞色。你只需要比昨天的自己好一点点。' },
  { t: '关于休息', s: '佚名', body: '休息不是偷懒，是给电池充电。允许自己什么都不做，是对长期主义的尊重。' },
  { t: '关于关系', s: '困困', body: '好的关系不是不吵架，而是吵完还愿意回到彼此身边。把「赢了争论」换成「懂了对方」，很多事就化了。' },
  { t: '关于失败', s: '佚名', body: '失败只是排除了一种不行的方法，不代表你不行。每一次试错，都在把正确答案的范围缩小。' },
  { t: '关于金钱', s: '困困', body: '记账不是为了苛待自己，而是看清钱去哪了，把有限的预算花在真正让你开心的地方。' },
  { t: '关于学习', s: '佚名', body: '每天 10 个单词、5 个句子，看起来很少，但一年就是 3650 个。复利最公平，它不辜负任何持续的微小投入。' },
  { t: '关于情绪', s: '困困', body: '情绪来了先别急着发消息。睡一觉，或者喝杯温水，第二天你可能根本想不起昨晚为何生气。' },
  { t: '关于自律', s: '佚名', body: '真正的自律是温柔的：不靠意志力硬撑，而是把好习惯安排进环境里，让「做对的事」变成最省力的选择。' },
  { t: '关于自我', s: '困困', body: '你不需要所有人都喜欢。把讨好别人的精力收回来，用来喜欢自己，这笔买卖怎么都不亏。' },
  { t: '关于当下', s: '佚名', body: '过去已去，未来未至。能握住的，只有此刻这杯温水、这口呼吸、这件手边的小事。' },
  { t: '关于表达', s: '困困', body: '有话好好说，是一种能力，也是一种温柔。把「你总是……」换成「我觉得……」，对方会更容易听进去。' },
  { t: '关于健康', s: '佚名', body: '身体是 1，其他是后面的 0。少熬一次夜、多走一千步，都是在给未来的自己存钱。' },
  { t: '关于完美', s: '困困', body: '先完成，再完美。等待「准备好了」的完美时机，往往等来的是「来不及」。粗糙的开始，好过完美的犹豫。' },
  { t: '关于独处', s: '佚名', body: '学会和自己相处，是成年人的必修课。一个人也能把日子过得有声有色，才不怕任何人的离开。' }
];
/* 电影推荐 */
const MOVIES_REC = [
  { t: '《千与千寻》', y: '2001', reason: '关于成长与勇气的童话，每次看都有新感悟。', body: '千寻误入神灵世界，为救父母在汤屋打工。她从一个怯懦女孩，渐渐学会承担责任、记住自己的名字。台词「千万不能说不想工作，不然会被变成猪」是成人世界的隐喻。结尾她没回头，是因为已经长大。' },
  { t: '《寻梦环游记》', y: '2017', reason: '关于记忆与爱的 Pixar 佳作，准备好纸巾。', body: '小男孩米格追寻音乐梦，误入亡灵世界，揭开家族秘密。最戳心的是：「真正的死亡，是被所有人遗忘。」只要还有人记得，爱就不灭。它教会我们：亲情从不是束缚，而是回家的路。' },
  { t: '《心灵奇旅》', y: '2020', reason: '讲「人生的火花」，适合觉得日子没意思时看。', body: '爵士乐手乔伊临近成功却意外离魂，与厌世的灵魂 22 相遇。电影推翻「目标=人生意义」的执念：火花不是目标，而是对生活的热爱。一片落叶、一口披萨、一次walk，都值得活得认真。' },
  { t: '《绿皮书》', y: '2018', reason: '种族偏见下的友谊公路片，温暖又幽默。', body: '黑人钢琴家与白人司机南下巡演，两个截然不同的人在旅途中彼此改变。它温柔地证明：偏见可以被真诚击穿，友谊不问肤色。最好的关系，是互相把对方带出舒适区。' },
  { t: '《摔跤吧！爸爸》', y: '2016', reason: '关于女性自我实现的真实改编，燃到起鸡皮。', body: '印度父亲把女儿培养成摔跤冠军，起初被骂「强迫」，最终成就她们掌控命运的能力。它讲的是父爱，也是「打破偏见、靠自己赢一次」的爽感。' },
  { t: '《海蒂和爷爷》', y: '2015', reason: '阿尔卑斯山的自然与纯真，治愈眼疲劳也治愈心。', body: '孤儿海蒂被祖父收养，在山顶自由生长，后来被迫去城市，却始终怀念山风。她用纯真融化了孤独的女孩克拉拉。电影提醒：孩子需要的不是规矩，是被看见和被爱。' },
  { t: '《三傻大闹宝莱坞》', y: '2009', reason: '反填鸭式教育，笑中带泪。', body: '兰彻用「追求卓越，成功会自己找上门」对抗僵化教育。那句「All is well」不是盲目乐观，而是面对恐惧时的自我安抚。适合每个曾被分数定义过的人。' },
  { t: '《小森林》', y: '2014', reason: '一个人种菜做饭的四季，极简到让人平静。', body: '女孩市子回到东北乡村，依着时令种田、做饭、独处。没有大起大落，只有米饭的香、雪里的萝卜。它像一部可食用的散文，教我们在喧嚣之外，也可以把日子过得很慢、很稳。' }
];
function render_inspire() {
  const tabs = [['good', '📚 好书推荐'], ['quote', '✨ 好词好句'], ['movie', '🎬 电影'], ['poem', '🏮 古诗词'], ['note', '✏️ 随机笔录']];
  let body = '';
  if (S.insTab === 'good') {
    body = BOOKS_REC.map((b, i) => `<div class="card">
      <div class="row" style="justify-content:space-between"><b>${esc(b.t)}</b><span class="li-sub">${esc(b.a)}</span></div>
      <div class="poem-sec" style="margin-top:8px"><b>💡 推荐原因：</b>${esc(b.reason)}</div>
      <div class="poem-sec"><b>📖 内容介绍：</b>${esc(b.body)}</div>
    </div>`).join('');
  } else if (S.insTab === 'quote') {
    body = QUOTES_REC.map(q => `<div class="card">
      <div class="row" style="justify-content:space-between"><b>✨ ${esc(q.t)}</b><span class="li-sub">—— ${esc(q.s)}</span></div>
      <div class="poem-sec" style="margin-top:8px">${esc(q.body)}</div>
    </div>`).join('');
  } else if (S.insTab === 'movie') {
    body = MOVIES_REC.map(m => `<div class="card">
      <div class="row" style="justify-content:space-between"><b>🎬 ${esc(m.t)}</b><span class="li-sub">${esc(m.y)}</span></div>
      <div class="poem-sec" style="margin-top:8px"><b>💡 推荐原因：</b>${esc(m.reason)}</div>
      <div class="poem-sec"><b>📝 简介：</b>${esc(m.body)}</div>
    </div>`).join('');
  } else if (S.insTab === 'poem') {
    body = poemFrag();
  } else {
    body = noteFrag();
  }
  return `
  <div class="page-title">💡 灵感补给站</div>
  <div class="page-sub">好书 · 好句 · 电影 · 诗词 · 随记，给生活一点养分</div>
  <div class="tabs">${tabs.map(t => `<div class="tab ${S.insTab === t[0] ? 'active' : ''}" onclick="S.insTab='${t[0]}';render()">${t[1]}</div>`).join('')}</div>
  ${body}`;
}

/* ============ 表达能力 ============ */
/* 日常表达话术库（daily） + 职场表达话术库（work）；每条：标题/讲解/适用场景/话术[] */
const DAILY_EXP = [
  { id: 'd1', t: '委婉拒绝不必要的帮忙', skill: '拒绝不是冷漠，是守住自己的边界。用「先肯定+再说明+给替代」的句式，对方更容易接受。', scene: '同事临时甩来不属于你的活', lines: ['这个我理解挺急的，不过我今天排满了手头的事，可能帮不上。', '你可以问问 XX，他这块更熟，或许能帮上忙。'] },
  { id: 'd2', t: '表达不同意见不伤和气', skill: '把「你错了」换成「我有个补充视角」，把对立变成共建。', scene: '朋友/家人观点不同', lines: ['我懂你的想法，其实换个角度看也挺有道理。', '我这边有个小补充，你看看是不是也成立……'] },
  { id: 'd3', t: '请求对方重复/解释', skill: '直接说「没听懂」不丢人，确认清楚比假装懂更高效。', scene: '对方说太快或太专业', lines: ['不好意思，刚才那段我没太跟上，能再讲一遍吗？', '你是说 XX 意思对吗？我想确认下理解没错。'] },
  { id: 'd4', t: '表达感谢更走心', skill: '把「谢谢」具体化成「你做了什么+对我意味着什么」，分量立刻不同。', scene: '别人帮了你', lines: ['真的谢谢你，特意帮我跑这一趟，省了我好多事。', '有你兜底我心里踏实多了，记你一份人情～'] },
  { id: 'd5', t: '化解尴尬冷场', skill: '冷场时抛一个轻松的开放式问题，把焦点从自己移开。', scene: '聊天突然没话', lines: ['话说最近你有没有追什么剧/书？', '对了，你上次说的那家店去试了吗？'] },
  { id: 'd6', t: '表达不满而不攻击', skill: '用「我」开头说感受，而不是用「你」开头指责，对方防御心会低很多。', scene: '对方做了让你不舒服的事', lines: ['你刚才那样说，我有点尴尬，不是针对你哈。', '我希望咱们以后能提前说一声，我会更安心。'] },
  { id: 'd7', t: '向人道歉真诚', skill: '道歉=认错+共情+弥补，别加「但是」把责任推回去。', scene: '自己确实做错了', lines: ['对不起，是我考虑不周，让你为难了。', '下次我会先跟你对一下，这次的补救你看这样行吗？'] },
  { id: 'd8', t: '提出小请求不别扭', skill: '把请求说清楚+说明对对方的影响小，对方更愿意帮。', scene: '想请人帮个小忙', lines: ['方便帮我看一眼这个吗？就一小会儿，不耽误你太久。', '要是现在不方便也没事，你空了再帮我看就行。'] },
  { id: 'd9', t: '夸人夸到点上', skill: '夸具体行为比夸「你好棒」更可信，也更能强化对方的好行为。', scene: '想肯定身边的人', lines: ['你今天那个处理特别稳，我都在学。', '你总能注意到这种细节，真的很厉害。'] },
  { id: 'd10', t: '结束一段对话', skill: '给对话一个温暖的句号，比突然消失更得体。', scene: '聊得差不多了', lines: ['今天聊得挺开心的，那我先去忙啦～', '先这样，回头再约！你注意休息哦。'] },
  { id: 'd11', t: '表达紧张/脆弱', skill: '适度示弱不是弱，反而让人觉得真实、愿意靠近。', scene: '面对重要场合心跳加速', lines: ['说实话我有点紧张，毕竟挺看重这次。', '第一次做这个，难免手忙脚乱，多担待哈。'] },
  { id: 'd12', t: '争取自己的需求', skill: '把需求说成「对我们的好处」，比只说「我要」更容易被答应。', scene: '想要某样东西/安排', lines: ['我希望周末能空出来，这样下周状态会更好，活也能干得更顺。', '如果可以调整下顺序，我效率会高不少。'] },
  { id: 'd13', t: '接住别人的情绪', skill: '对方吐槽时，先共情再给建议，很多人其实只想要被听见。', scene: '朋友向你倒苦水', lines: ['听你这么说真的好累，换我也要崩。', '你愿意跟我说这些，我挺开心的，想说随时找我。'] },
  { id: 'd14', t: '表达喜欢不油腻', skill: '喜欢用「具体小事+感受」表达，比直白的表白更自然。', scene: '对喜欢的人', lines: ['你认真做事的样子，我挺喜欢的。', '跟你待着挺舒服的，时间过得特别快。'] },
  { id: 'd15', t: '拒绝饭局不解释太多', skill: '一句「那天已经有安排」足够，过度解释反而显得心虚。', scene: '不想去的聚会', lines: ['那天刚好有安排了，这次就不去啦。', '下次提前约我，我一定到！'] },
  { id: 'd16', t: '把批评变成建议', skill: '先肯定再提可改进点，对方不会觉得被全盘否定。', scene: '给对方反馈', lines: ['整体挺好的，尤其开头很有力。', '如果中间再紧凑点，观感会更抓人，你参考下。'] },
  { id: 'd17', t: '表达期待而不施压', skill: '用「我期待」代替「你必须」，关系更松弛。', scene: '对伴侣/孩子', lines: ['我挺期待周末一起出去的，看你时间哈。', '你愿意试试当然好，不想也没关系。'] },
  { id: 'd18', t: '承认自己不懂', skill: '「这个我不太清楚，我去查查」比硬编更赢得信任。', scene: '被问到盲区', lines: ['这个我还真不太熟，我去确认下再回你。', '好问题，我之前没细想过，咱们一起琢磨下？'] },
  { id: 'd19', t: '回应夸奖大方收下', skill: '被夸时别急着否认，一句「谢谢+轻描原因」就好。', scene: '别人夸你', lines: ['谢谢！这次确实花心思了。', '哈哈被你夸到了，开心～'] },
  { id: 'd20', t: '转移话题不突兀', skill: '用「顺接+新问」把话题自然带开，适合不想继续的尴尬话题。', scene: '话题想换', lines: ['你说得对，不过说到这个我想起……', '对了对了，你之前说的事后来怎样了？'] },
  { id: 'd21', t: '表达「我需要空间」', skill: '把「别管我」换成「我想静静」，对方不会觉得被推开。', scene: '想独处一会儿', lines: ['今天有点累，想自己待会儿回回血，不是不理你哈。', '等我充好电，咱再好好聊。'] },
  { id: 'd22', t: '商量分工', skill: '用「谁更擅长什么」分配，比谁嗓门大谁干活公平。', scene: '和室友/搭档分活', lines: ['你嘴甜你去沟通，我细心我来整理，这样最快。', '这块我熟，我来；那个你拿手，交给你啦。'] },
  { id: 'd23', t: '表达惊喜/开心', skill: '把情绪大声说出来，快乐会翻倍，对方也更有成就感。', scene: '收到礼物/好消息', lines: ['哇这也太好了吧！我超开心！', '你居然记得这个，我真的被暖到了。'] },
  { id: 'd24', t: '缓和争执', skill: '先喊停再谈，避免在情绪顶点说出后悔的话。', scene: '快吵起来', lines: ['咱们先歇口气，等不生气了再聊，好不好？', '我都想解决问题，但 now 有点上头，缓一下。'] },
  { id: 'd25', t: '请教问题显真诚', skill: '「你在这方面很厉害，想请教」比直接要答案更让人愿意帮。', scene: '向高手请教', lines: ['你这块特别厉害，有个小问题想请教你。', '我卡在这了，你方便给点思路吗？'] },
  { id: 'd26', t: '表达「我没空但不想冷落」', skill: '说明状态+约未来，既诚实又不让人觉得被敷衍。', scene: '忙得顾不上回', lines: ['这两天有点炸，回得慢别介意哈。', '等我忙完这阵，咱们好好聚。'] },
  { id: 'd27', t: '肯定自己的努力', skill: '对外会夸人，对内也要会夸自己，自我鼓励很重要。', scene: '完成一件不容易的事', lines: ['今天我确实挺拼的，给自己点个赞。', '虽然不完美，但我没放弃，这就够啦。'] },
  { id: 'd28', t: '表达担心而不控制', skill: '把「你别那样」换成「我有点担心」，对方感受是关心而非管制。', scene: '在意的人要做冒险决定', lines: ['我是真有点担心你，不是不信任你。', '你如果决定了我支持，但记得照顾好自己。'] },
  { id: 'd29', t: '邀约更自然', skill: '给具体时间+具体事，比「有空聚」更容易成行。', scene: '想约人', lines: ['这周六下午有空吗？咱们去那家新店？', '周三下班一起吃饭呗，好久没见了。'] },
  { id: 'd30', t: '收尾不拖泥带水', skill: '一段话有个明确的落点，对方知道你说完了。', scene: '讲完一件事', lines: ['所以核心就是这三点，你看清楚没？', '总之先这样试，不行咱们再调。'] }
];
const WORK_EXP = [
  { id: 'w1', t: '汇报进展', skill: '结论先行：先说结果，再补过程。领导最在意的是「成了没、风险在哪」。', scene: '周会/向上汇报', lines: ['XX 项目已上线，比预期提前 2 天，目前运行稳定。', '有个小风险点我同步下，已经在跟进了。'] },
  { id: 'w2', t: '争取资源', skill: '把「我要人」翻译成「加人能让项目少踩坑、早交付」，站在对方利益说。', scene: '向主管申请支持', lines: ['如果这阶段加 1 个同学，我们能把交付提前一周，质量也更稳。', '算下来投入产出比挺划算的，您看能不能协调？'] },
  { id: 'w3', t: '给领导提异议', skill: '用「数据/事实」支撑异议，而非情绪；先认同目标再提不同路径。', scene: '不认同某个决策', lines: ['我理解咱们要冲进度，不过从数据看这样风险偏高。', '是不是可以换个稳妥点的方式，同样能达到目标？'] },
  { id: 'w4', t: '邮件/消息开场', skill: '一句「您好+来意」，让对方 3 秒知道你要干啥，效率翻倍。', scene: '工作沟通开头', lines: ['XX 老师好，想跟您确认下下周一评审的时间。', '您好，关于 XX 项目有个小问题想请教。'] },
  { id: 'w5', t: '请求延期不慌', skill: '尽早说+给新时间点+说明已做的，比最后一刻炸雷强百倍。', scene: 'deadline 赶不上', lines: ['这个我可能要延到周四，今天先把核心部分给您看。', '实在抱歉，中间插了个急活，我重新排了下优先级。'] },
  { id: 'w6', t: '跨部门协作', skill: '先建立共同目标，再谈分工，减少「踢皮球」感。', scene: '和别的团队对接', lines: ['咱们目标一致，就是把这个体验做顺，我这边负责 XX。', '卡点我列出来了，需要你这边配合这两块，你看行不？'] },
  { id: 'w7', t: '接受批评', skill: '先接住再澄清，不辩解不甩锅，专业形象立住。', scene: '被上级指出问题', lines: ['收到，这块确实我疏忽了，马上改。', '您说的对，我复盘下流程，避免再犯。'] },
  { id: 'w8', t: '展示成果', skill: '用「数据变化」说话，比「我很努力」有说服力。', scene: '述职/总结', lines: ['这季度把转化率从 12% 提到 18%，主要靠优化了 XX。', '用户投诉量下降了 40%，关键是改了那套流程。'] },
  { id: 'w9', t: '拒绝不合理需求', skill: '用「优先级冲突」拒绝，而非「我不想做」，更客观。', scene: '临时插队的需求', lines: ['这个我能做，但会和手头的 A 冲突，您看哪个更优先？', '如果先保 A，这个可能要排到周五，可以吗？'] },
  { id: 'w10', t: '会议发言', skill: '「观点+一句理由」结构，简洁有力，不啰嗦。', scene: '讨论中表态', lines: ['我倾向方案 B，因为它上线更快、风险更小。', '我补充一点，这块用户反馈其实偏 A。'] },
  { id: 'w11', t: '同步坏消息', skill: '先给结论+影响+已采取的措施，领导要的是可控感。', scene: '出问题第一时间', lines: ['有个线上问题，已临时降级，影响范围在缩小。', '根因在查，半小时内给您详细复盘。'] },
  { id: 'w12', t: '请教前辈', skill: '带「自己已有的思考」去问，前辈才愿意深聊。', scene: '向资深同事取经', lines: ['这块我查了点资料，但拿不准，您经验多想听听看法。', '我初步想这样做，您觉得坑在哪？'] },
  { id: 'w13', t: '交接工作', skill: '清单化+关键人+截止日，让接手的人不抓瞎。', scene: '离职/休假前', lines: ['这几件事我整理成清单了，标了紧急度。', '关键对接人都在文档里，有问题随时找我。'] },
  { id: 'w14', t: '表达不同方案', skill: '「我有个备选」比「你这不行」更容易被接纳。', scene: '评审他人方案', lines: ['你的思路我挺认同，我这边还有个备选你参考下。', '两种各有利弊，咱们按场景选就行。'] },
  { id: 'w15', t: '结束加班话题', skill: '用「进展到哪+明天的计划」收尾，显得有条理。', scene: '下班前同步', lines: ['今天到这，明天先把 XX 收尾，再开新模块。', '剩下的我记下了，明天一早接着弄。'] },
  { id: 'w16', t: '争取涨薪', skill: '用「价值+市场」谈，而非「我缺钱」，站在公司视角讲回报。', scene: '绩效/谈薪', lines: ['这一年我主导了 XX，带来 XX 收益，想聊聊下一步的发展。', '对照行业水平，希望薪资能调整到对应区间，您看怎么推进？'] },
  { id: 'w17', t: '新人自我介绍', skill: '「我是谁+负责什么+性格」三要素，让人快速记住你。', scene: '入职/破冰', lines: ['大家好，我是 XX，负责 XX 模块，平时话不多但活儿细。', '之后多向大家学习，有不对的随时指正哈。'] },
  { id: 'w18', t: '推动决策', skill: '给选项+推荐项+利弊，让老板做选择题而非问答题。', scene: '需要上级拍板', lines: ['两条路：A 快但贵，B 慢但稳，我建议 A。', '您只要定方向，执行我来排。'] },
  { id: 'w19', t: '回应「在吗」', skill: '直接说事，别让对方猜，也别回「在的，怎么了」空耗。', scene: '收到「在吗」', lines: ['在的，有啥直接说哈，我这边方便。', '刚看到，你说～'] },
  { id: 'w20', t: '感谢协作', skill: '公开感谢比私下更有分量，也经营你的职场口碑。', scene: '项目结束', lines: ['这次多亏 XX 同学顶上，不然真悬。', '给大家记一功，复盘我写文档里。'] },
  { id: 'w21', t: '澄清误解', skill: '对事不对人，用事实平复误会，不翻旧账。', scene: '被误会了', lines: ['可能有点误会，实际情况是 XX，我截图为证。', '不是推脱，是想把事儿捋清楚。'] },
  { id: 'w22', t: '表达工作量', skill: '用「已交付+进行中」呈现，让付出被看见，而非抱怨。', scene: '被问「在忙啥」', lines: ['这周搞定了 A 和 B，正在推进 C，进度正常。', '手头三件事并行，都排了优先级。'] },
  { id: 'w23', t: '约同事反馈', skill: '给明确时间窗+具体问题，对方更容易给有效反馈。', scene: '请人 review', lines: ['方便下午帮我看下这段逻辑吗？主要看边界情况。', '不急，明天上午前给都行，谢谢啦。'] },
  { id: 'w24', t: '应对临时会议', skill: '「确认目标+时长」避免被拖会，尊重彼此时间。', scene: '被拉会', lines: ['这个会主要想解决啥？大概多久？我好安排手头活。', '如果只是同步，发个文档我也能跟上。'] },
  { id: 'w25', t: '表达职业目标', skill: '把个人成长和团队目标绑定，上级更愿意帮你。', scene: '1on1/规划', lines: ['我想往 XX 方向深耕，这块也能补咱团队的短板。', '您看能不能给我些有挑战的活儿练手？'] },
  { id: 'w26', t: '纠正下属/后辈', skill: '私下+具体+给方法，批评才长本事不伤自尊。', scene: '带新人', lines: ['这块有个小坑，我教你个更稳的做法。', '不是你不行，是没人带过，下次这样弄就好。'] },
  { id: 'w27', t: '同步个人状态', skill: '适度同步「今天状态一般」比硬撑更重要，避免出错。', scene: '状态不好时', lines: ['今天有点不在状态，重要的事我先放放，先做点杂活。', '有急的您先说，我缓一下就回血了。'] },
  { id: 'w28', t: '收束跑题会议', skill: '「回到主题+总结共识+明确行动」三连，挽救被浪费的时间。', scene: '会议跑偏', lines: ['咱们拉回主线，刚达成的是这三点对吧？', '那 action 就是 XX 负责 A，周五前出。'] },
  { id: 'w29', t: '表达不确定', skill: '「目前看是这样，还在确认」比拍胸脯更可信。', scene: '被问结论', lines: ['目前数据指向 A，但我再核一遍明天给你准信。', '大概率是这个，不敢百分百保证。'] },
  { id: 'w30', t: '离场/下班话术', skill: '一句「今天先到这」配进度，体面收工。', scene: '下班前', lines: ['今天先到这，明早第一件事接着弄。', '辛苦大家，剩下的我记着，明天见～'] }
];
function expList(key) {
  const all = key === 'work' ? WORK_EXP : DAILY_EXP;
  const n = 10, start = (dayIdx * 10) % Math.max(1, all.length - n + 1);
  return all.slice(start, start + n);
}
function render_express() {
  const fav = store.g('expFav', []);
  const tabs = [['daily', '💬 日常表达'], ['work', '💼 职场表达'], ['fav', '❤ 我的收藏']];
  let body = '';
  if (S.expTab === 'fav') {
    body = fav.length ? fav.map(id => {
      const it = [...DAILY_EXP, ...WORK_EXP].find(x => x.id === id);
      if (!it) return '';
      return expCard(it, fav.includes(id));
    }).join('') : '<div class="empty">还没有收藏的话术，去日常/职场里点 ❤ 收藏吧～</div>';
  } else {
    const list = expList(S.expTab);
    body = `<div class="li-sub" style="margin-bottom:8px">今日更新 ${list.length} 条 · 每天自动轮换</div>` +
      list.map(it => expCard(it, fav.includes(it.id))).join('');
  }
  return `
  <div class="page-title">💬 表达能力</div>
  <div class="page-sub">每天 10 条沟通技能，把话说到心坎里</div>
  <div class="tabs">${tabs.map(t => `<div class="tab ${S.expTab === t[0] ? 'active' : ''}" onclick="S.expTab='${t[0]}';render()">${t[1]}</div>`).join('')}</div>
  ${body}`;
}
function expCard(it, isFav) {
  return `<div class="card">
    <h3>${esc(it.t)}</h3>
    <div class="poem-sec"><b>📖 讲解：</b>${esc(it.skill)}</div>
    <div class="poem-sec"><b>🎯 适用场景：</b>${esc(it.scene)}</div>
    <div style="margin-top:8px">${it.lines.map((l, i) => `<div class="list-item" style="border:none;padding:6px 0">
      <div class="li-main" style="display:flex;gap:8px;align-items:flex-start"><span class="tag b">话术${i + 1}</span><span style="flex:1">${esc(l)}</span>
      <button class="btn sm" onclick="speakExp('${it.id}',${i})">🔊</button></div>
    </div>`).join('')}</div>
    <div class="row mt" style="justify-content:flex-end">
      <button class="btn sm ${isFav ? 'pink' : 'ghost'}" onclick="toggleFav('${it.id}')">${isFav ? '已收藏 ❤' : '收藏 ♡'}</button>
    </div>
  </div>`;
}
function speakExp(id, i) {
  const it = [...DAILY_EXP, ...WORK_EXP].find(x => x.id === id);
  if (it) speak(it.lines[i], 'zh-CN');
}
function toggleFav(id) {
  const arr = store.g('expFav', []);
  const i = arr.indexOf(id);
  if (i >= 0) arr.splice(i, 1); else arr.push(id);
  store.s('expFav', arr); render();
}
