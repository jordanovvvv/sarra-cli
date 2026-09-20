// GENERATED from components/home.html — do not edit directly.
// Edit the HTML source, then run: npm run web:inline
document.querySelector('[data-component="home"]').innerHTML = `<section id="home" class="workspace-panel workspace-home" role="tabpanel" aria-labelledby="tab-home">
  <div class="home-intro">
    <div>
      <h2 class="text-3xl sm:text-4xl font-bold tracking-tight">Developer utilities, ready when you are</h2>
      <p class="mt-3 text-slate-300 max-w-2xl">Sarra brings the most useful CLI workflows into one local-first browser workspace. Pick a utility family, open a task, and keep the exact CLI equivalent beside the result.</p>
      <div class="flex flex-wrap gap-2 mt-5">
        <button data-target="sec-id" class="nav-btn bg-sky-600 hover:bg-sky-500 rounded px-4 py-2 text-sm font-semibold">Open a utility</button>
        <a href="README.md" class="bg-slate-800 hover:bg-slate-700 rounded px-4 py-2 text-sm font-semibold">Read the workspace README</a>
      </div>
    </div>
    <aside class="home-note">
      <p class="text-xs uppercase tracking-[0.16em] text-sky-300">Local-first by default</p>
      <p class="mt-2 text-sm text-slate-300">Hashing, encryption, QR generation, formatting, and time utilities run in this page. Network lookup is limited to the opt-in geo tools.</p>
    </aside>
  </div>

  <div class="home-heading">
    <div>
      <h3 class="text-lg font-semibold">Open a utility family</h3>
      <p class="text-sm text-slate-400 mt-1">Each family is its own tab. The first task opens for a quick start; the remaining tasks stay tucked away until you need them.</p>
    </div>
  </div>

  <div class="home-grid">
    <article class="home-card">
      <h3>id — Identifiers &amp; tokens</h3>
      <p>Generate UUID v4/v7 values and cryptographically secure random tokens.</p>
      <button data-target="sec-id" class="home-link nav-btn">Open id tab <span aria-hidden="true">→</span></button>
    </article>
    <article class="home-card">
      <h3>crypto — Hash, encode, encrypt</h3>
      <p>Hash text, encode Base64, and run AES or RSA workflows locally.</p>
      <button data-target="sec-crypto" class="home-link nav-btn">Open crypto tab <span aria-hidden="true">→</span></button>
    </article>
    <article class="home-card">
      <h3>data — JSON &amp; CSV</h3>
      <p>Format, minify, validate, query, merge, and convert JSON to CSV.</p>
      <button data-target="sec-data" class="home-link nav-btn">Open data tab <span aria-hidden="true">→</span></button>
    </article>
    <article class="home-card">
      <h3>qr — QR codes</h3>
      <p>Render QR images or inspect text as terminal-friendly ASCII output.</p>
      <button data-target="sec-qr" class="home-link nav-btn">Open qr tab <span aria-hidden="true">→</span></button>
    </article>
    <article class="home-card">
      <h3>time — Timestamps</h3>
      <p>Convert, add, compare, and parse timestamps in the format you need.</p>
      <button data-target="sec-time" class="home-link nav-btn">Open time tab <span aria-hidden="true">→</span></button>
    </article>
    <article class="home-card">
      <h3>ssl — Certificates</h3>
      <p>Create local self-signed certificates or build a Let's Encrypt command.</p>
      <button data-target="sec-ssl" class="home-link nav-btn">Open ssl tab <span aria-hidden="true">→</span></button>
    </article>
    <article class="home-card">
      <h3>geo — IP &amp; network</h3>
      <p>Validate addresses offline and opt in to public IP or geolocation lookup.</p>
      <button data-target="sec-geo" class="home-link nav-btn">Open geo tab <span aria-hidden="true">→</span></button>
    </article>
    <article class="home-card">
      <h3>docs — Command reference</h3>
      <p>Read the detailed help files that power the CLI and the embedded viewer.</p>
      <button data-target="sec-docs" class="home-link nav-btn">Open docs tab <span aria-hidden="true">→</span></button>
    </article>
  </div>

  <div class="home-guide">
    <div>
      <h3 class="font-semibold">How to use this workspace</h3>
      <p class="text-sm text-slate-400 mt-1">Use the sidebar as a tab list. Within a tab, expand a task when you need its inputs and output. Every task shows the matching Sarra CLI command for an easy handoff to the terminal.</p>
    </div>
    <a href="../README.md" class="text-sm text-sky-300 hover:text-sky-200 underline underline-offset-4">View the project README</a>
  </div>
</section>`;
