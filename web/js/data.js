// ---------- data ----------
function readJsonInput() {
  const t = $('jsonInput').value;
  if (!t.trim()) throw new Error('Paste JSON first.');
  return t;
}
function runJsonFormat() {
  try {
    const indent = bounded($('jsonIndent').value, 0, 8, 2);
    setOut('jsonOut', JSON.stringify(JSON.parse(readJsonInput()), null, indent));
  } catch (e) { setOut('jsonOut', 'Invalid JSON: ' + e.message); }
}
function runJsonMinify() {
  try {
    const raw = readJsonInput();
    const min = JSON.stringify(JSON.parse(raw));
    setOut('jsonOut', min + `\n\n// ${raw.length} → ${min.length} bytes`);
  } catch (e) { setOut('jsonOut', 'Invalid JSON: ' + e.message); }
}
function runJsonValidate() {
  try { JSON.parse(readJsonInput()); setOut('jsonOut', '✓ Valid JSON'); }
  catch (e) { setOut('jsonOut', '✗ Invalid JSON\n' + e.message); }
}
function queryPath(obj, path) {
  return path.split(/\.|\[|\]/).filter(Boolean).reduce((o, k) => (o == null ? o : o[k]), obj);
}
function runJsonQuery() {
  try {
    const v = queryPath(JSON.parse(readJsonInput()), $('jsonPath').value.trim());
    if (v === undefined) return setOut('queryOut', '✗ Path not found in JSON');
    setOut('queryOut', typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v));
  } catch (e) { setOut('queryOut', 'Error: ' + e.message); }
}
function runJsonMerge() {
  try {
    const a = JSON.parse($('mergeA').value || '{}');
    const b = JSON.parse($('mergeB').value || '{}');
    setOut('mergeOut', JSON.stringify(Object.assign({}, a, b), null, 2));
  } catch (e) { setOut('mergeOut', 'Error: both inputs must be valid JSON objects. ' + e.message); }
}
function runToCsv() {
  try {
    const parsed = JSON.parse($('csvInput').value);
    if (!Array.isArray(parsed) || !parsed.length) return setOut('csvOut', 'Input must be a non-empty JSON array.');
    const keys = Array.from(new Set(parsed.flatMap(Object.keys)));
    const rows = [keys.join(',')].concat(parsed.map(o => keys.map(k => {
      const s = o[k] == null ? '' : String(o[k]);
      return (s.includes(',') || s.includes('"')) ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(',')));
    setOut('csvOut', rows.join('\n'));
  } catch (e) { setOut('csvOut', 'Error: ' + e.message); }
}
