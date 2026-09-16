// ---------- time ----------
function parseTs(v) {
  v = String(v).trim();
  let d;
  if (/^-?\d+$/.test(v)) {
    const n = Number(v);
    d = new Date(Math.abs(n) < 1e10 ? n * 1000 : n);
  } else d = new Date(v);
  if (isNaN(d.getTime())) throw new Error('Invalid timestamp');
  return d;
}
function fmtDate(d, f) {
  switch (f) {
    case 'unix': return String(Math.floor(d.getTime() / 1000));
    case 'ms': return String(d.getTime());
    case 'date': return d.toISOString().split('T')[0];
    case 'time': return d.toISOString().split('T')[1].replace('Z', '');
    case 'locale': return d.toLocaleString();
    default: return d.toISOString();
  }
}
function runTimeNow() { setOut('timeNowOut', fmtDate(new Date(), $('nowFormat').value)); }
function runConvert() {
  try { setOut('convOut', fmtDate(parseTs($('convInput').value), $('convTo').value)); }
  catch (e) { setOut('convOut', 'Error: ' + e.message); }
}
function runTimeAdd() {
  try {
    const base = $('addBase').value.trim() ? parseTs($('addBase').value) : new Date();
    const r = new Date(base);
    r.setSeconds(r.getSeconds() + (parseInt($('addS').value, 10) || 0));
    r.setMinutes(r.getMinutes() + (parseInt($('addM').value, 10) || 0));
    r.setHours(r.getHours() + (parseInt($('addH').value, 10) || 0));
    r.setDate(r.getDate() + (parseInt($('addD').value, 10) || 0));
    setOut('addOut', r.toISOString());
  } catch (e) { setOut('addOut', 'Error: ' + e.message); }
}
function runTimeDiff() {
  try {
    const a = parseTs($('diffA').value);
    const b = $('diffB').value.trim() ? parseTs($('diffB').value) : new Date();
    let diff = b.getTime() - a.getTime();
    if ($('diffAbs').checked) diff = Math.abs(diff);
    const u = $('diffUnit').value;
    const v = u === 'ms' ? diff : u === 'minutes' ? Math.floor(diff / 6e4) : u === 'hours' ? Math.floor(diff / 36e5) : u === 'days' ? Math.floor(diff / 864e5) : Math.floor(diff / 1000);
    setOut('diffOut', `Difference: ${v} ${u}\n\na: ${a.toISOString()}\nb: ${b.toISOString()}`);
  } catch (e) { setOut('diffOut', 'Error: enter timestamp 1. ' + e.message); }
}
function runTimeParse() {
  try {
    const d = parseTs($('parseInput').value);
    setOut('diffOut', `✓ Valid timestamp\nISO 8601: ${d.toISOString()}\nUnix (s): ${Math.floor(d.getTime()/1000)}\nUnix (ms): ${d.getTime()}\nDate: ${d.toISOString().split('T')[0]}\nTime: ${d.toISOString().split('T')[1].replace('Z','')}\nLocale: ${d.toLocaleString()}`);
  } catch (e) { setOut('diffOut', '✗ Invalid timestamp'); }
}
