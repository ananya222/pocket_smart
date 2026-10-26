(() => {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const canAnimate = () => Boolean(window.gsap) && !reduced.matches;
  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if (window.Draggable) gsap.registerPlugin(Draggable);

  const closeMenu = () => {
    document.body.classList.remove('nav-open');
    menu.setAttribute('aria-expanded', 'false');
    menu.innerHTML = 'Menu <span aria-hidden="true">+</span>';
  };
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    document.body.classList.toggle('nav-open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.innerHTML = open ? 'Close <span aria-hidden="true">×</span>' : 'Menu <span aria-hidden="true">+</span>';
    if (open && canAnimate()) gsap.fromTo(nav.children, {y: 14, opacity: 0}, {y: 0, opacity: 1, duration: 0.4, stagger: 0.035, clearProps: 'all'});
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('nav-open')) {
      closeMenu();
      menu.focus();
    }
  });
  nav.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
  document.querySelectorAll('[data-year]').forEach((year) => { year.textContent = new Date().getFullYear(); });
  document.querySelector('[data-print]')?.addEventListener('click', () => window.print());

  // Native details keep their keyboard behavior; motion only changes the transition.
  document.querySelectorAll('details').forEach((details) => {
    const summary = details.querySelector('summary');
    const content = details.querySelector('.detail-content');
    let expanded = details.open;
    if (!content) return;
    summary.addEventListener('click', (event) => {
      if (!canAnimate()) return;
      event.preventDefault();
      expanded = !expanded;
      gsap.killTweensOf(content);
      const height = details.open ? content.getBoundingClientRect().height : 0;
      details.open = true;
      content.style.overflow = 'hidden';
      gsap.fromTo(content, {height, opacity: height ? 1 : 0}, {
        height: expanded ? content.scrollHeight : 0,
        opacity: expanded ? 1 : 0,
        duration: expanded ? 0.48 : 0.3,
        ease: 'power3.inOut',
        onComplete: () => {
          details.open = expanded;
          gsap.set(content, {clearProps: 'height,opacity,overflow'});
        }
      });
    });
    details.addEventListener('toggle', () => {
      if (!canAnimate()) expanded = details.open;
    });
    reduced.addEventListener('change', () => {
      if (!window.gsap) return;
      gsap.killTweensOf(content);
      details.open = expanded;
      gsap.set(content, {clearProps: 'height,opacity,overflow'});
    });
  });

  const screen = document.querySelector('#pocket-screen');
  const controls = [...document.querySelectorAll('[data-gallery]')];
  if (screen && controls.length) {
    const stage = screen.parentElement;
    const group = controls[0].parentElement;
    let active = controls.findIndex((control) => control.getAttribute('aria-pressed') === 'true');
    if (active < 0) active = 0;
    stage.tabIndex = 0;
    stage.setAttribute('role', 'group');
    stage.setAttribute('aria-label', 'PocketSmart preview. Use left and right arrow keys to change screens.');
    screen.draggable = false;
    const hint = document.createElement('p');
    hint.className = 'gallery-hint';
    hint.textContent = 'Drag or swipe to explore · arrow keys also work';
    stage.after(hint);
    const announcement = document.createElement('span');
    announcement.className = 'sr-only';
    announcement.setAttribute('aria-live', 'polite');
    group.after(announcement);
    const indicator = document.createElement('span');
    indicator.className = 'gallery-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    group.append(indicator);
    const moveIndicator = (instant = false) => {
      const button = controls[active];
      const offset = button.getBoundingClientRect().left - group.getBoundingClientRect().left;
      const values = {x: offset, y: button.getBoundingClientRect().bottom - group.getBoundingClientRect().bottom, width: button.offsetWidth};
      if (canAnimate() && !instant) gsap.to(indicator, {...values, duration: 0.45, ease: 'power3.out'});
      else if (window.gsap) gsap.set(indicator, values);
      else { indicator.style.transform = 'translateX(' + offset + 'px)'; indicator.style.width = button.offsetWidth + 'px'; }
    };
    const select = (requested, direction = 1) => {
      const next = (requested + controls.length) % controls.length;
      if (next === active) {
        if (window.gsap) gsap.to(screen, {x: 0, rotation: 0, opacity: 1, duration: canAnimate() ? 0.4 : 0});
        return;
      }
      active = next;
      controls.forEach((control, index) => control.setAttribute('aria-pressed', String(index === active)));
      moveIndicator();
      const apply = () => {
        screen.src = 'assets/' + controls[active].dataset.gallery;
        screen.alt = controls[active].dataset.alt;
        announcement.textContent = controls[active].textContent.trim() + ' screen';
      };
      if (!canAnimate()) {
        if (window.gsap) { gsap.killTweensOf(screen); gsap.set(screen, {clearProps: 'all'}); }
        apply();
        return;
      }
      gsap.killTweensOf(screen);
      gsap.to(screen, {x: -direction * 45, opacity: 0, rotation: -direction * 3, scale: 0.97, duration: 0.18, onComplete: () => {
        apply();
        gsap.fromTo(screen, {x: direction * 45, opacity: 0, rotation: direction * 3, scale: 0.97}, {x: 0, opacity: 1, rotation: 0, scale: 1, duration: 0.55, ease: 'power3.out', clearProps: 'all'});
      }});
    };
    controls.forEach((control, index) => {
      const preload = new Image();
      preload.src = 'assets/' + control.dataset.gallery;
      control.addEventListener('click', () => select(index, index >= active ? 1 : -1));
    });
    stage.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const destination = event.key === 'Home' ? 0 : event.key === 'End' ? controls.length - 1 : active + (event.key === 'ArrowRight' ? 1 : -1);
      select(destination, event.key === 'ArrowLeft' ? -1 : 1);
    });
    if (window.Draggable) {
      Draggable.create(screen, {
        type: 'x', bounds: {minX: -90, maxX: 90}, edgeResistance: 0.8,
        allowNativeTouchScrolling: true,
        onPress() { gsap.killTweensOf(screen); },
        onDrag() { if (canAnimate()) gsap.set(screen, {rotation: this.x * 0.045}); },
        onDragEnd() {
          if (Math.abs(this.x) > 35) select(active + (this.x < 0 ? 1 : -1), this.x < 0 ? 1 : -1);
          else gsap.to(screen, {x: 0, rotation: 0, duration: canAnimate() ? 0.45 : 0, ease: 'power3.out'});
        }
      });
    }
    new ResizeObserver(() => moveIndicator(true)).observe(group);
    reduced.addEventListener('change', () => {
      if (!window.gsap) return;
      gsap.killTweensOf(screen);
      gsap.set(screen, {clearProps: 'all'});
      screen.src = 'assets/' + controls[active].dataset.gallery;
      screen.alt = controls[active].dataset.alt;
      moveIndicator(true);
    });
    moveIndicator(true);
  }

  if (!window.gsap) return;
  const splitWords = (heading) => {
    if (heading.dataset.wordsReady) return heading.querySelectorAll('.word-inner');
    heading.dataset.wordsReady = 'true';
    heading.setAttribute('aria-label', heading.innerText.replace(/\s+/g, ' ').trim());
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((word) => {
        if (!word.trim()) { fragment.append(document.createTextNode(word)); return; }
        const mask = document.createElement('span');
        mask.className = 'word-mask';
        mask.setAttribute('aria-hidden', 'true');
        const inner = document.createElement('span');
        inner.className = 'word-inner';
        inner.textContent = word;
        mask.append(inner);
        fragment.append(mask);
      });
      node.replaceWith(fragment);
    });
    return heading.querySelectorAll('.word-inner');
  };
  const heading = document.querySelector('.home-name h1, .page-heading h1, .quiet-page h1');
  const titleWords = heading ? splitWords(heading) : [];
  const countTarget = document.querySelector('.project-fact strong');
  if (countTarget) countTarget.dataset.countEnd = countTarget.textContent.trim();
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    const context = gsap.context(() => {
      gsap.from(titleWords, {yPercent: 115, rotation: 3, opacity: 0, duration: 1.05, stagger: 0.075, ease: 'power4.out', clearProps: 'all'});
      gsap.from('.home-introduction, .page-deck, .quiet-note', {y: 26, opacity: 0, delay: 0.22, duration: 0.9, ease: 'power3.out', clearProps: 'all'});
      const entries = document.querySelectorAll('.research-entry:not([data-focus-panel]), .project-story:not([data-focus-panel]), .app-story, .academic-record, .featured-product, .work-directory, .about-aside, .about-prose, .award-row, .resume-section, .next-section, main > .source-note');
      entries.forEach((entry, index) => {
        const targets = entry.matches('.featured-product, .work-directory, .about-aside, .about-prose, .award-row, .source-note') ? [entry] : [...entry.children];
        const settings = {y: 52, opacity: 0, duration: 0.95, stagger: 0.13, ease: 'power3.out', clearProps: 'all'};
        if (window.ScrollTrigger) {
          gsap.from(targets, {...settings, scrollTrigger: {trigger: entry, start: 'top 91%', once: true}});
        } else gsap.from(targets, settings);
      });
      const fact = document.querySelector('.project-fact strong');
      if (fact && window.ScrollTrigger) {
        const finalValue = Number(fact.dataset.countEnd);
        const counter = {value: 0};
        gsap.to(counter, {value: finalValue, duration: 1.5, ease: 'power2.out', scrollTrigger: {trigger: fact, start: 'top 90%', once: true}, onUpdate: () => {fact.textContent = Math.round(counter.value);}});
      }
    });
    return () => { context.revert(); if (countTarget) countTarget.textContent = countTarget.dataset.countEnd; };
  });

  // Pointer effects complement the linked product previews; touch navigation stays native.
  document.querySelectorAll('.pocket-preview').forEach((preview) => {
    const tiltX = gsap.quickTo(preview, 'rotationX', {duration: 0.65, ease: 'power3.out'});
    const tiltY = gsap.quickTo(preview, 'rotationY', {duration: 0.65, ease: 'power3.out'});
    preview.addEventListener('pointermove', (event) => {
      if (!canAnimate() || !finePointer.matches) return;
      const box = preview.getBoundingClientRect();
      gsap.set(preview, {transformPerspective: 1000});
      tiltX(-((event.clientY - box.top) / box.height - 0.5) * 9);
      tiltY(((event.clientX - box.left) / box.width - 0.5) * 11);
    });
    preview.addEventListener('pointerleave', () => {tiltX(0); tiltY(0);});
    reduced.addEventListener('change', () => {gsap.killTweensOf(preview); gsap.set(preview, {clearProps: 'transform'});});
  });
  document.querySelectorAll('.inline-action, .text-button').forEach((link) => {
    const moveX = gsap.quickTo(link, 'x', {duration: 0.35, ease: 'power3.out'});
    const moveY = gsap.quickTo(link, 'y', {duration: 0.35, ease: 'power3.out'});
    link.addEventListener('pointermove', (event) => {
      if (!canAnimate() || !finePointer.matches) return;
      const box = link.getBoundingClientRect();
      moveX(((event.clientX - box.left) / box.width - 0.5) * 8);
      moveY(((event.clientY - box.top) / box.height - 0.5) * 5);
    });
    link.addEventListener('pointerleave', () => {moveX(0); moveY(0);});
    reduced.addEventListener('change', () => {gsap.killTweensOf(link); gsap.set(link, {clearProps: 'transform'});});
  });
  const braille = document.querySelector('.braille-word');
  if (braille) {
    const letters = [...braille.textContent.trim()];
    braille.textContent = '';
    letters.forEach((letter) => {
      const cell = document.createElement('span');
      cell.className = 'braille-cell';
      cell.textContent = letter;
      cell.setAttribute('aria-hidden', 'true');
      braille.append(cell);
    });
    braille.closest('.braille-plate').addEventListener('pointerenter', () => {
      if (!canAnimate()) return;
      gsap.fromTo(braille.children, {y: 0}, {y: -13, duration: 0.32, stagger: 0.09, repeat: 1, yoyo: true, ease: 'sine.inOut', overwrite: true, clearProps: 'all'});
    });
  }
  document.fonts.ready.then(() => { if (window.ScrollTrigger) ScrollTrigger.refresh(); });
})();

(() => {
 const controls = document.querySelectorAll('[data-demo-mode]');
 if (!controls.length) return;
 controls.forEach(control => control.addEventListener('click', () => {
  const live = control.dataset.demoMode === 'live';
  document.querySelector('[data-live-demo]').hidden = !live;
  document.querySelector('[data-shot-demo]').hidden = live;
  controls.forEach(button => button.setAttribute('aria-pressed', String(button === control)));
 }));
})();

// Animate the document itself so local-file previews and browsers without
// cross-document View Transitions receive the same navigation treatment.
(() => {
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 let leaving = false;
 document.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || reduced.matches || !window.gsap) return;
  const link = event.target.closest('a[href]');
  if (!link || link.target || link.hasAttribute('download')) return;
  const destination = new URL(link.href, location.href);
  const sameHost = location.protocol === 'file:' ? destination.protocol === 'file:' : destination.origin === location.origin;
  if (!sameHost || !destination.pathname.endsWith('.html') || destination.pathname === location.pathname) return;
  event.preventDefault();
  if (leaving) return;
  leaving = true;
  const main = document.querySelector('main');
  gsap.to(main, {opacity: 0, y: -14, duration: 0.28, ease: 'power2.inOut', overwrite: true, onComplete: () => location.assign(destination.href)});
 });
 const restore = () => {
  leaving = false;
  if (window.gsap) gsap.set(document.querySelector('main'), {clearProps: 'opacity,transform'});
 };
 window.addEventListener('pageshow', event => { if (event.persisted) { restore(); if (window.ScrollTrigger) ScrollTrigger.refresh(); } });
 window.addEventListener('pagehide', restore);
 if (window.gsap && !reduced.matches) gsap.fromTo(document.querySelector('main'), {opacity: 0, y: 12}, {opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', clearProps: 'opacity,transform'});
})();

// A focused reading view preserves the original articles and their deep links.
(() => {
 document.querySelectorAll('[data-focus-library]').forEach(library => {
  const tabs = [...library.querySelectorAll('[data-focus-target]')];
  const panels = [...library.querySelectorAll('[data-focus-panel]')];
  const narrow = matchMedia('(max-width: 680px)');
  const orientation = () => library.querySelector('[role="tablist"]').setAttribute('aria-orientation', narrow.matches ? 'horizontal' : 'vertical');
  const select = (index, updateAddress = true) => {
   const active = panels[index];
   if (!active) return;
   tabs.forEach((tab, position) => {tab.setAttribute('aria-selected', String(position === index)); tab.tabIndex = position === index ? 0 : -1;});
   panels.forEach(panel => {panel.hidden = panel !== active;});
   if (window.gsap) {
    panels.forEach(panel => {gsap.killTweensOf(panel.children); gsap.set(panel.children, {clearProps: 'opacity,transform'});});
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) gsap.fromTo(active.children, {opacity: 0, y: 14}, {opacity: 1, y: 0, duration: .45, stagger: .05, ease: 'power2.out', clearProps: 'opacity,transform'});
   }
   if (updateAddress) {try {history.replaceState(history.state, '', '#' + active.id);} catch { /* Selection works when address updates are unavailable. */ }}
   if (window.ScrollTrigger) ScrollTrigger.refresh();
  };
  tabs.forEach((tab, index) => {
   tab.addEventListener('click', () => select(index));
   tab.addEventListener('keydown', event => {
    if (!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (['ArrowDown','ArrowRight'].includes(event.key) ? 1 : -1) + tabs.length) % tabs.length;
    select(next); tabs[next].focus();
   });
  });
  const openHash = () => {const index = panels.findIndex(panel => '#' + panel.id === location.hash); select(index < 0 ? 0 : index, false);};
  window.addEventListener('hashchange', openHash);
  narrow.addEventListener('change', orientation);
  orientation(); openHash();
 });
})();
