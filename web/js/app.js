// Runs after js/components/*.js have injected the sections. Renders the docs viewer.
if (typeof loadDoc === 'function') loadDoc();

const chevronIcon = '<svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m6 8 4 4 4-4" stroke-linecap="round" stroke-linejoin="round" /></svg>';

function toggleDisclosure(button, content, open) {
  button.setAttribute('aria-expanded', String(open));
  content.hidden = !open;
  button.closest('.workspace-section, .task-card')?.classList.toggle('is-collapsed', !open);
}

function makeSectionDisclosure(section, index) {
  const header = section.firstElementChild;
  const content = section.children[1];
  const title = header?.querySelector('h2');
  if (!header || !content || !title) return;

  section.classList.add('workspace-section', 'workspace-panel');
  section.setAttribute('role', 'tabpanel');
  const contentId = `${section.id}-content`;
  content.id = contentId;
  content.classList.add('section-content');
  header.classList.add('section-header');

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'disclosure-button section-disclosure';
  button.setAttribute('aria-controls', contentId);
  button.setAttribute('aria-label', `Toggle ${title.textContent.replace(/^[^a-z]+/i, '')}`);
  button.innerHTML = chevronIcon;
  button.addEventListener('click', () => {
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    if (!isOpen) window.openWorkspaceSection(section.id);
    else toggleDisclosure(button, content, false);
  });
  header.prepend(button);
  toggleDisclosure(button, content, index === 0);
}

function makeTaskDisclosure(card, index) {
  const title = card.querySelector(':scope > h3');
  if (!title) return;

  card.classList.add('task-card');
  const summary = document.createElement('div');
  summary.className = 'task-summary';
  card.insertBefore(summary, title);
  summary.append(title);

  const teaser = card.querySelector(':scope > p');
  if (teaser) {
    teaser.classList.add('task-teaser');
    summary.append(teaser);
  }

  const contentId = `${card.closest('section').id}-${index}-task`;
  const content = document.createElement('div');
  content.id = contentId;
  content.className = 'task-content';
  while (summary.nextElementSibling) content.append(summary.nextElementSibling);
  card.append(content);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'disclosure-button task-disclosure';
  button.setAttribute('aria-controls', contentId);
  button.setAttribute('aria-label', `Toggle ${title.textContent.trim()}`);
  button.innerHTML = chevronIcon;
  button.addEventListener('click', () => {
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    toggleDisclosure(button, content, !isOpen);
  });
  summary.append(button);
  toggleDisclosure(button, content, index === 0);
}

function setupWorkspaceDisclosures() {
  document.querySelectorAll('main section[id^="sec-"]').forEach((section, sectionIndex) => {
    makeSectionDisclosure(section, sectionIndex);
    section.querySelectorAll(':scope > div:nth-child(2) > div').forEach((card, cardIndex) => {
      makeTaskDisclosure(card, cardIndex);
    });
  });
}

window.openWorkspaceSection = (id) => {
  document.querySelectorAll('main section[id^="sec-"]').forEach(section => {
    const button = section.querySelector(':scope > .section-header > .section-disclosure');
    const content = section.querySelector(':scope > .section-content');
    if (!button || !content) return;
    toggleDisclosure(button, content, section.id === id);
  });
};

setupWorkspaceDisclosures();

function setupWorkspaceTabs() {
  const panels = document.querySelectorAll('main .workspace-panel');
  const tabs = document.querySelectorAll('.nav-btn[data-target]');

  tabs.forEach((tab, index) => {
    const target = tab.dataset.target;
    tab.id = tab.id || `tab-${target}-${index}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', target);
    tab.setAttribute('aria-selected', 'false');
  });

  panels.forEach(panel => {
    const primaryTab = document.querySelector(`#sideNav .nav-btn[data-target="${panel.id}"]`);
    if (primaryTab) panel.setAttribute('aria-labelledby', primaryTab.id);
  });

  window.activateWorkspaceTab = (id, updateHistory = true) => {
    const panel = document.getElementById(id);
    if (!panel) return;

    panels.forEach(candidate => {
      const active = candidate.id === id;
      candidate.hidden = !active;
      candidate.classList.toggle('is-active', active);
    });
    tabs.forEach(tab => {
      const active = tab.dataset.target === id;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });

    if (id.startsWith('sec-')) {
      window.openWorkspaceSection(id);
    }
    if (updateHistory && window.location.hash !== `#${id}`) {
      window.history.pushState({}, '', `#${id}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const requested = window.location.hash.slice(1);
  const initial = document.getElementById(requested) ? requested : 'home';
  window.activateWorkspaceTab(initial, false);
  window.addEventListener('popstate', () => {
    const target = window.location.hash.slice(1);
    window.activateWorkspaceTab(document.getElementById(target) ? target : 'home', false);
  });
  window.addEventListener('hashchange', () => {
    const target = window.location.hash.slice(1);
    window.activateWorkspaceTab(document.getElementById(target) ? target : 'home', false);
  });
}

setupWorkspaceTabs();
