/* 阴阳历转换（精简自 solarlunar 3.1.0，Apache-ish 公共算法，1900-2100）
 * 仅保留倒计时所需：农历转公历、农历月份/日期中文。公历转农历未使用。 */
var SL = (function () {
  var lunarInfo = [0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
    0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0,
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
    0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
    0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,
    0x092e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
    0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
    0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
    0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a4d0, 0x0d150, 0x0f252,
    0x0d520];
  var nStr1 = ['日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  var nStr2 = ['初', '十', '廿', '卅'];
  var nStr3 = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];

  function lYearDays(y) {
    var sum = 348, info = lunarInfo[y - 1900];
    sum += info & 0x8000 ? 1 : 0; sum += info & 0x4000 ? 1 : 0; sum += info & 0x2000 ? 1 : 0;
    sum += info & 0x1000 ? 1 : 0; sum += info & 0x0800 ? 1 : 0; sum += info & 0x0400 ? 1 : 0;
    sum += info & 0x0200 ? 1 : 0; sum += info & 0x0100 ? 1 : 0; sum += info & 0x0080 ? 1 : 0;
    sum += info & 0x0040 ? 1 : 0; sum += info & 0x0020 ? 1 : 0; sum += info & 0x0010 ? 1 : 0;
    return sum + leapDays(y);
  }
  function leapMonth(y) { return lunarInfo[y - 1900] & 0xf; }
  function leapDays(y) { if (leapMonth(y)) return lunarInfo[y - 1900] & 0x10000 ? 30 : 29; return 0; }
  function monthDays(y, m) { if (m > 12 || m < 1) return -1; return lunarInfo[y - 1900] & (0x10000 >> m) ? 30 : 29; }

  /* 农历 y 年 m 月 d 日（isLeap 闰月）转公历，返回 {y,m,d} 或 null */
  function lunar2solar(y, m, d, isLeap) {
    y = +y; m = +m; d = +d; isLeap = !!isLeap;
    if (isLeap && leapMonth(y) !== m) return null;
    if (m < 1 || m > 12 || d < 1) return null;
    if (d > monthDays(y, m)) return null;
    var offset = 0, i;
    for (i = 1900; i < y; i++) offset += lYearDays(i);
    var isAdd = false;
    for (i = 1; i < m; i++) {
      var lp = leapMonth(y);
      if (!isAdd && lp <= i && lp > 0) { offset += leapDays(y); isAdd = true; }
      offset += monthDays(y, i);
    }
    if (isLeap) offset += monthDays(y, m);
    var stmap = Date.UTC(1900, 1, 30, 0, 0, 0);
    var dt = new Date((offset + d - 31) * 86400000 + stmap);
    return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
  }
  function toChinaMonth(m) { if (m > 12 || m < 1) return ''; return nStr3[m - 1] + '月'; }
  function toChinaDay(d) {
    if (d === 10) return '初十'; if (d === 20) return '二十'; if (d === 30) return '三十';
    return nStr2[Math.floor(d / 10)] + nStr1[d % 10];
  }

  /* 公历 y-m-d 转农历，返回 { lYear, lMonth, lDay, IMonthCn, IDayCn, isLeap }（与 lunar2solar 同一历元 1900-01-31）*/
  function solar2lunar(y, m, d) {
    y = +y; m = +m; d = +d;
    var base = Date.UTC(1900, 0, 31);
    var offset = Math.round((Date.UTC(y, m - 1, d) - base) / 86400000);
    var i, temp = 0, lYear, lMonth, lDay;
    for (i = 1900; i < 2101 && offset > 0; i++) { temp = lYearDays(i); offset -= temp; }
    if (offset < 0) { offset += temp; i--; }
    lYear = i;
    var leap = leapMonth(i), isLeap = false;
    for (i = 1; i < 13 && offset > 0; i++) {
      temp = monthDays(lYear, i);
      if (leap > 0 && i === (leap + 1) && !isLeap) { --i; isLeap = true; temp = leapDays(lYear); }
      else { isLeap = false; }
      offset -= temp;
    }
    if (offset === 0 && leap > 0 && i === leap + 1) {
      if (isLeap) { isLeap = false; } else { isLeap = true; --i; }
    }
    if (offset < 0) { offset += temp; i--; }
    lMonth = i; lDay = offset + 1;
    return { lYear: lYear, lMonth: lMonth, lDay: lDay, IMonthCn: toChinaMonth(lMonth), IDayCn: toChinaDay(lDay), isLeap: isLeap };
  }

  /* ============ 24 节气（太阳黄经天文算法，北京时间显示） ============ */
  var TERM_NAMES = ['小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
    '小暑', '大暑', '立秋', '处暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'];
  var TERM_LON = [285, 300, 315, 330, 345, 0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270];

  // Meeus 低精度太阳视黄经（度）
  function sunLon(jd) {
    var T = (jd - 2451545.0) / 36525;
    var L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
    var M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) * Math.PI / 180;
    var C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M)
      + (0.019993 - 0.000101 * T) * Math.sin(2 * M) + 0.000289 * Math.sin(3 * M);
    var L = (L0 + C) % 360; if (L < 0) L += 360;
    return L;
  }
  function ymdToJD(y, mo, d) { // 北京时间 0 点 → 真儒略日
    return Date.UTC(y, mo - 1, d) / 86400000 + 2440587.5 - 8 / 24;
  }
  function jdToYMD(jd) { // 真儒略日 → 北京时间年月日
    var ms = (jd - 2440587.5 + 8 / 24) * 86400000;
    var dt = new Date(ms);
    return { year: dt.getUTCFullYear(), month: dt.getUTCMonth() + 1, day: dt.getUTCDate() };
  }
  var TERM_APPROX = [[1, 6], [1, 20], [2, 4], [2, 19], [3, 6], [3, 21], [4, 5], [4, 20], [5, 6], [5, 21], [6, 6], [6, 21], [7, 7], [7, 23], [8, 8], [8, 23], [9, 8], [9, 23], [10, 8], [10, 24], [11, 7], [11, 22], [12, 7], [12, 22]];
  function termDate(year, idx) {
    var ap = TERM_APPROX[idx];
    var cand = ymdToJD(year, ap[0], ap[1]);
    var a = cand - 20, b = cand + 20, lon = TERM_LON[idx];
    function f(jd) { var d = (sunLon(jd) - lon) % 360; if (d > 180) d -= 360; if (d < -180) d += 360; return d; }
    var fa = f(a), iter = 0;
    while (b - a > 1 / 1440 && iter < 300) {
      var m2 = (a + b) / 2, fm = f(m2);
      if (fa * fm <= 0) b = m2; else { a = m2; fa = fm; }
      iter++;
    }
    return jdToYMD((a + b) / 2);
  }
  function solarTerm(year) {
    var out = [];
    for (var i = 0; i < 24; i++) { var r = termDate(year, i); out.push({ name: TERM_NAMES[i], year: year, month: r.month, day: r.day }); }
    return out;
  }

  return {
    lunar2solar: lunar2solar, solar2lunar: solar2lunar, monthDays: monthDays,
    toChinaMonth: toChinaMonth, toChinaDay: toChinaDay, solarTerm: solarTerm
  };
})();
