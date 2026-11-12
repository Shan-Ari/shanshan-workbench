/* ============ 番茄钟 / 专注（参考模板） ============ */
const FC_ART = 'focus-art.png?v=20261112i';
const FC_PRESETS = [15, 25, 45, 60];
const FC_DEFAULT_TASKS = ['工作', '学习', '阅读', '写作'];

function fcArtStyle(i, size) {
  return `background-image:url('${FC_ART}');background-repeat:no-repeat;background-size:${size}px ${size * 3}px;background-position:0 -${i * size}px;`;
}
function fcArt(i, size, cls) {
  return `<span class="fc-art ${cls || ''}" style="width:${size}px;height:${size}px;${fcArtStyle(i, size)}"></span>`;
}
function fcCfg() { return store.g('focusCfg', { defaultMin: 25 }); }
function fcMode() { return S.fcMode || 'countdown'; }
function fcMin() { return +S.fcMin || fcCfg().defaultMin || 25; }
function fcTasks() { return store.g('focusTasks', FC_DEFAULT_TASKS.slice()); }
function fcLogs() { return store.g('focusLogs', []); }
function fcTimer() { return store.g('focusTimer', null); }
function fcSecToStr(s) {
  s = Math.max(0, Math.round(s));
  return pad(Math.floor(s / 60)) + ':' + pad(s % 60);
}
function fcElapsed(t) {
  const base = +t.elapsedBefore || 0;
  const run = t.paused ? 0 : (Date.now() - (+t.startTs || Date.now())) / 1000;
  return Math.max(0, base + run);
}
function fcRemaining(t) { return Math.max(0, (+t.durationSec || 0) - fcElapsed(t)); }
function fcDisplay() {
  const t = fcTimer();
  if (!t) return fcMode() === 'countup' ? '00:00' : fcSecToStr(fcMin() * 60);
  return t.mode === 'countdown' ? fcSecToStr(Math.ceil(fcRemaining(t))) : fcSecToStr(Math.floor(fcElapsed(t)));
}
function fcTodayMinutes() {
  return fcLogs().filter(l => l.date === today()).reduce((a, b) => a + (+b.minutes || 0), 0);
}

/* ---------- 计时控制 ---------- */
function fcSetMode(m) {
  if (fcTimer()) fcEnd();
  S.fcMode = m; S.fcPanel = null; S.fcToast = '';
  render();
}
function fcSetMin(n) {
  n = Math.max(1, Math.min(180, +n || 25));
  const c = fcCfg(); c.defaultMin = n; store.s('focusCfg', c);
  S.fcMin = n; S.fcPanel = null;
  render();
}
function fcCustomMin() {
  const v = prompt('输入专注分钟数（1 - 180）', String(fcMin()));
  if (v === null) return;
  fcSetMin(+v);
}
function fcTask() { return S.fcTask || ''; }
function fcPickTask(v) {
  if (v === '__new__') {
    const name = prompt('新建专注任务', '');
    if (name && name.trim()) {
      const arr = fcTasks(); arr.push(name.trim());
      store.s('focusTasks', arr); S.fcTask = name.trim();
    }
  } else S.fcTask = v;
  S.fcPanel = null; render();
}
function fcBegin() {
  const mode = fcMode();
  const t = {
    mode: mode,
    startTs: Date.now(),
    durationSec: mode === 'countdown' ? fcMin() * 60 : 0,
    task: fcTask(),
    paused: false,
    elapsedBefore: 0
  };
  store.s('focusTimer', t);
  S.fcToast = ''; S.fcPanel = null;
  render();
}
function fcPause() {
  const t = fcTimer(); if (!t || t.paused) return;
  t.elapsedBefore = fcElapsed(t); t.paused = true;
  store.s('focusTimer', t); render();
}
function fcResume() {
  const t = fcTimer(); if (!t || !t.paused) return;
  t.startTs = Date.now(); t.paused = false;
  store.s('focusTimer', t); render();
}
function fcEnd() {
  const t = fcTimer(); if (!t) return;
  const elapsed = fcElapsed(t);
  const mins = t.mode === 'countdown' && fcRemaining(t) <= 0
    ? Math.round(t.durationSec / 60)
    : Math.max(1, Math.round(elapsed / 60));
  const d = new Date();
  const logs = fcLogs();
  logs.push({
    id: uid(), date: today(), minutes: mins, task: t.task || '未命名任务',
    mode: t.mode, ts: pad(d.getHours()) + ':' + pad(d.getMinutes())
  });
  store.s('focusLogs', logs);
  store.s('focusTimer', null);
  S.fcToast = '🎉 本轮专注完成，已记录 ' + mins + ' 分钟';
  render();
  setTimeout(() => { S.fcToast = ''; render(); }, 4000);
}
function fcDelLog(id) {
  store.s('focusLogs', fcLogs().filter(l => l.id !== id));
  render();
}
function fcTick() {
  const el = document.getElementById('fcTime');
  if (el) el.textContent = fcDisplay();
  const t = fcTimer();
  if (t && t.mode === 'countdown' && !t.paused && fcRemaining(t) <= 0) fcEnd();
}
setInterval(fcTick, 1000);

/* ---------- 片段 ---------- */
function fcModeBar() {
  const m = fcMode();
  return `<div class="fc-modes">
    <button class="fc-mode ${m === 'countup' ? 'on' : ''}" onclick="fcSetMode('countup')">⏱ 正计时</button>
    <button class="fc-mode ${m === 'countdown' ? 'on' : ''}" onclick="fcSetMode('countdown')">⏱ 倒计时</button>
  </div>`;
}
function fcTaskSelect() {
  const cur = fcTask();
  const opts = fcTasks().map(t => `<option value="${esc(t)}" ${cur === t ? 'selected' : ''}>${esc(t)}</option>`).join('');
  return `<select class="fc-task" onchange="fcPickTask(this.value)">
    <option value="" ${cur === '' ? 'selected' : ''}>选择专注任务</option>
    ${opts}<option value="__new__">＋ 新建任务…</option>
  </select>`;
}
function fcAction() {
  const t = fcTimer();
  if (!t) return `<button class="fc-start" onclick="fcBegin()">开始</button>`;
  if (t.paused) return `<div class="fc-run-row"><button class="fc-side" onclick="fcEnd()">结束</button><button class="fc-start" onclick="fcResume()">继续</button></div>`;
  return `<div class="fc-run-row"><button class="fc-side" onclick="fcPause()">暂停</button><button class="fc-start" onclick="fcEnd()">结束</button></div>`;
}
function fcTodayCard() {
  const mins = fcTodayMinutes();
  const logs = fcLogs().filter(l => l.date === today()).slice().reverse();
  const body = logs.length ? logs.map(l => `<div class="fc-log">
      <span class="fc-log-task">${esc(l.task)}</span>
      <span class="fc-log-min">${l.minutes} 分钟</span>
      <span class="fc-log-time">${esc(l.ts || '')}</span>
      <button class="fc-log-del" onclick="fcDelLog('${l.id}')">×</button>
    </div>`).join('')
    : `<div class="fc-empty">${fcArt(1, 64, 'fc-ghost')}<div>暂无数据</div></div>`;
  return `<div class="fc-card fc-today">
    <div class="fc-card-title">今日专注</div>
    <div class="fc-pill">${mins} 分钟</div>
    <div class="fc-inner">${body}</div>
  </div>`;
}
function fcWeekCard() {
  const days = [];
  for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); days.push(fmt(d)); }
  const vals = days.map(ds => fcLogs().filter(l => l.date === ds).reduce((a, b) => a + (+b.minutes || 0), 0));
  const max = Math.max(30, ...vals);
  const ticks = [max, Math.round(max / 2), 0];
  const bars = days.map((ds, i) => `<div class="fc-bar-col">
      <div class="fc-bar" style="height:${Math.max(2, Math.round(vals[i] / max * 100))}%" title="${ds} · ${vals[i]} 分钟"></div>
      <span>${ds.slice(5)}</span>
    </div>`).join('');
  return `<div class="fc-card fc-week">
    <div class="fc-card-title">本周专注图</div>
    <div class="fc-chart">
      <div class="fc-axis">${ticks.map(t => `<span>${t}</span>`).join('')}</div>
      <div class="fc-bars">${bars}</div>
    </div>
  </div>`;
}
function fcPanelHtml() {
  const p = S.fcPanel; if (!p) return '';
  const mask = `<div class="fc-mask" onclick="S.fcPanel=null;render()"></div>`;
  if (p === 'duration') return mask + `<div class="fc-sheet">
    <div class="fc-sheet-title">选择专注时长</div>
    <div class="fc-min-grid">${FC_PRESETS.map(n => `<button class="fc-min ${fcMin() === n ? 'on' : ''}" onclick="fcSetMin(${n})">${n} 分钟</button>`).join('')}</div>
    <button class="fc-ok" onclick="fcCustomMin()">自定义时长</button>
    <button class="fc-cancel" onclick="S.fcPanel=null;render()">取消</button>
  </div>`;
  if (p === 'settings') {
    const tasks = fcTasks();
    return mask + `<div class="fc-sheet">
      <div class="fc-sheet-title">专注设置</div>
      <div class="fc-sheet-label">默认时长</div>
      <div class="fc-min-grid">${FC_PRESETS.map(n => `<button class="fc-min ${fcMin() === n ? 'on' : ''}" onclick="fcSetMin(${n})">${n} 分钟</button>`).join('')}</div>
      <div class="fc-sheet-label">专注任务</div>
      <div class="fc-task-list">${tasks.map((t, i) => `<div class="fc-task-item"><span>${esc(t)}</span><button onclick="fcDelTask(${i})">删</button></div>`).join('')}</div>
      <button class="fc-ok" onclick="fcAddTask()">＋ 添加任务</button>
      <button class="fc-cancel" onclick="S.fcPanel=null;render()">关闭</button>
    </div>`;
  }
  return '';
}
function fcAddTask() {
  const v = prompt('新任务名称', '');
  if (v && v.trim()) { const a = fcTasks(); a.push(v.trim()); store.s('focusTasks', a); }
  render();
}
function fcDelTask(i) {
  const a = fcTasks(); a.splice(i, 1);
  store.s('focusTasks', a);
  render();
}

function render_focus() {
  const running = !!fcTimer();
  return `<div class="fc-page">
    <button class="fc-hourglass" title="专注设置" onclick="S.fcPanel='settings';render()">${fcArt(2, 40)}</button>
    ${fcModeBar()}
    <div class="fc-time-row">
      <div class="fc-time" id="fcTime">${fcDisplay()}</div>
      <button class="fc-caret" title="选择时长" onclick="S.fcPanel='duration';render()">▼</button>
    </div>
    <div class="fc-mascot">${fcArt(0, 180)}</div>
    ${fcTaskSelect()}
    ${fcAction()}
    ${S.fcToast ? `<div class="fc-toast">${esc(S.fcToast)}</div>` : ''}
    ${running ? `<div class="fc-running">专注中 · ${esc(fcTask() || '未选任务')}</div>` : ''}
    ${fcTodayCard()}
    ${fcWeekCard()}
    ${fcPanelHtml()}
  </div>`;
}
