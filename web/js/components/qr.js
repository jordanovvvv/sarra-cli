// GENERATED from components/qr.html — do not edit directly.
// Edit the HTML source, then run: npm run web:inline
document.querySelector('[data-component="qr"]').innerHTML = `<section id="sec-qr" class="space-y-4">
        <div>
          <h2 class="text-xl font-bold">📷 qr — QR code generation</h2>
          <p class="text-sm text-slate-400">Mirrors <code>sarra qr generate|url|file|terminal</code>. PNG preview renders locally; right-click to save.</p>
        </div>
        <div class="grid gap-4 lg:grid-cols-2">
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 class="font-semibold">generate / url</h3>
            <input id="qrText" placeholder="Text or URL, e.g. https://example.com" value="Hello Sarra" class="mt-3 w-full text-sm bg-slate-800 border border-slate-700 rounded px-3 py-2" />
            <div class="grid grid-cols-4 gap-2 mt-2 text-sm">
              <label class="text-xs">Size<input id="qrSize" type="number" value="256" min="128" max="1024" class="mt-1 w-full bg-slate-800 border border-slate-700 rounded px-2 py-1" /></label>
              <label class="text-xs">EC<select id="qrEC" class="mt-1 w-full bg-slate-800 border border-slate-700 rounded px-2 py-1"><option>M</option><option>L</option><option>Q</option><option>H</option></select></label>
              <label class="text-xs">Dark<input id="qrDark" type="color" value="#000000" class="mt-1 w-full h-9 bg-slate-800 rounded" /></label>
              <label class="text-xs">Light<input id="qrLight" type="color" value="#ffffff" class="mt-1 w-full h-9 bg-slate-800 rounded" /></label>
            </div>
            <div class="flex gap-2 mt-3 text-sm">
              <button onclick="runQrImage()" class="bg-sky-600 hover:bg-sky-500 rounded px-4 py-2 font-semibold">Render QR</button>
              <button onclick="runQrTerminal(false)" class="bg-slate-700 rounded px-3 py-2">ASCII preview</button>
            </div>
            <div class="mt-3 flex items-start gap-3">
              <img id="qrImg" alt="QR preview" class="w-40 h-40 bg-white rounded border border-slate-700 hidden" />
              <pre id="qrMeta" class="text-xs text-slate-400">No QR yet.</pre>
            </div>
            <pre class="mt-2 text-[11px] bg-black/40 rounded p-2 overflow-auto">sarra qr generate "Hello" -s 500 -e H -o code.png</pre>
          </div>
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 class="font-semibold">terminal / file-content</h3>
            <p class="text-xs text-slate-400">ASCII preview only (no file), or encode pasted file text (≤2953 chars recommended).</p>
            <textarea id="qrTermInput" rows="3" placeholder="Text for ASCII QR…" class="mt-3 w-full text-sm bg-slate-800 border border-slate-700 rounded px-3 py-2">WIFI:T:WPA;S:MyNet;P:secret;;</textarea>
            <input type="file" id="qrFile" class="mt-2 text-xs text-slate-400" onchange="loadFileTo('qrFile','qrTermInput')" />
            <div class="flex gap-2 mt-3 text-sm">
              <button onclick="runQrTerminal(true)" class="bg-sky-600 rounded px-4 py-2 font-semibold">Show ASCII</button>
              <button onclick="copyText('qrAscii')" class="bg-slate-800 rounded px-3 py-2">Copy</button>
            </div>
            <pre id="qrAscii" class="mt-3 text-[10px] leading-tight bg-black text-green-300 rounded p-3 overflow-auto max-h-72">…</pre>
            <pre class="mt-2 text-[11px] bg-black/40 rounded p-2 overflow-auto">sarra qr terminal "Quick check" --no-small
sarra qr file config.json -o file-qr.png</pre>
          </div>
        </div>
      </section>`;
