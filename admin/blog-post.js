const slug = location.pathname.split('/').pop();

boot();

async function boot() {
  try {
    const res = await fetch(`/api/blog/${slug}`);
    if (!res.ok) throw new Error(`Post not found: ${slug}`);
    const data = await res.json();
    render(data);
  } catch (err) {
    document.getElementById('root').innerHTML = `<p class="error">${err.message}</p>`;
  }
}

function render(data) {
  const root = document.getElementById('root');
  root.innerHTML = '';
  root.append(buildHeader(data), buildContent(data));
}

// ─── Header ──────────────────────────────────────────────────────────────────

function buildHeader(data) {
  const fm = data.frontmatter;

  const topBar = el('div', 'top-bar');
  topBar.append(
    span('OpenWallet Blog Admin', 'brand'),
    link(`http://localhost:3000/tin-tuc/${data.slug}`, '← Back to post', 'back-link', true),
  );

  const slugLine = el('div', 'slug-line');
  slugLine.textContent = data.slug;

  const dot = el('span', `status-dot ${fm.status === 'published' ? 'published' : 'draft'}`);
  dot.title = fm.status ?? '';

  const metaLine = el('div', 'meta-line');
  metaLine.append(
    span(`"${fm.title}"`, 'post-title'),
    span('·', 'sep'),
    span(fm.category ?? '', 'category'),
    span('·', 'sep'),
    span(fm.date ?? '', 'date'),
    dot,
  );

  const header = el('header', 'page-header');
  header.append(topBar, slugLine, metaLine);
  return header;
}

// ─── Content ─────────────────────────────────────────────────────────────────

function buildContent(data) {
  const wrap = el('div', 'content');
  for (const block of data.blocks) {
    wrap.appendChild(
      block.type === 'text' ? buildTextBlock(block) : buildImageSection(block, data.slug),
    );
  }
  return wrap;
}

function buildTextBlock(block) {
  const p = el('p', 'text-block');
  p.textContent = block.text + (block.text.length >= 160 ? '…' : '');
  return p;
}

// ─── Image section ────────────────────────────────────────────────────────────

function buildImageSection(block, postSlug) {
  const label = buildLabel(block, postSlug);
  const card  = buildCard(block, postSlug);

  const section = el('div', 'image-section');
  section.append(label, card);
  return section;
}

function buildLabel(block, postSlug) {
  const label = el('div', 'image-label');
  if (block.key === 'cover') {
    label.appendChild(span('Cover image', 'cover-badge'));
  } else {
    const displayName = block.filename ?? block.key;
    const icon = block.exists
      ? span('✓', 'status-icon-ok')
      : span('⚠', 'status-icon-warn');
    label.append(span(displayName, 'filename'), icon);
    if (!block.exists) label.append(span('missing', 'sep'));
  }
  if (block.exists && block.filename) {
    label.appendChild(buildRewatermarkBtn(block, postSlug));
  }
  return label;
}

function buildRewatermarkBtn(block, postSlug) {
  const btn = el('button', 'rewatermark-btn');
  btn.textContent = '↻ Watermark';
  btn.title = 'Re-apply watermark at a new random position';
  btn.addEventListener('click', () => rewatermark(btn, block, postSlug));
  return btn;
}

function buildCard(block, postSlug) {
  const card = el('div', 'image-card');
  const wrap = el('div', 'preview-wrap');

  if (block.exists && block.filename) {
    // Image exists: show it, overlay the drop zone on top
    wrap.appendChild(buildPreview(postSlug, block.filename, block.key));
    const dz = el('div', 'dropzone overlay');
    dz.textContent = 'Drop to replace';
    attachDropzone(dz, block, postSlug, card, wrap);
    wrap.appendChild(dz);
  } else {
    // No image: full gray drop zone
    const dz = el('div', 'dropzone');
    dz.textContent = 'Drag & drop image here, or click to browse';
    attachDropzone(dz, block, postSlug, card, wrap);
    wrap.appendChild(dz);
  }

  card.appendChild(wrap);
  card.appendChild(el('div', 'upload-status'));
  if (block.prompt) card.appendChild(buildPrompt(block.prompt));

  return card;
}

function buildPreview(postSlug, filename, alt) {
  const img = document.createElement('img');
  img.src = `/images/posts/${postSlug}/${filename}`;
  img.alt = alt;
  img.className = 'preview-img';
  return img;
}

function attachDropzone(dz, block, postSlug, card, wrap) {
  dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.classList.add('drag-over'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('drag-over'));
  dz.addEventListener('drop', (e) => {
    e.preventDefault();
    dz.classList.remove('drag-over');
    if (e.dataTransfer.files[0]) upload(e.dataTransfer.files[0], block, postSlug, card, wrap, dz);
  });
  dz.addEventListener('click', () => {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = 'image/*';
    inp.onchange = () => { if (inp.files[0]) upload(inp.files[0], block, postSlug, card, wrap, dz); };
    inp.click();
  });
}

function buildPrompt(promptText) {
  const section = el('div', 'prompt-section');
  const lbl = el('div', 'prompt-label');
  lbl.textContent = 'Gemini prompt';

  const btn = el('button', 'copy-btn');
  btn.textContent = 'Copy';
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(promptText).then(() => {
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
    });
  });

  const row = el('div', 'prompt-row');
  row.append(span(`"${promptText}"`, 'prompt-text'), btn);

  section.append(lbl, row);
  return section;
}

// ─── Upload ───────────────────────────────────────────────────────────────────

async function upload(file, block, postSlug, card, wrap, dz) {
  const statusEl = card.querySelector('.upload-status');
  statusEl.textContent = 'Uploading…';
  statusEl.className = 'upload-status';

  const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
  const form = new FormData();
  form.append('file', file);
  form.append('filename', `${block.key}.${ext}`);

  try {
    const res = await fetch(`/api/blog/${postSlug}/upload`, { method: 'POST', body: form });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? 'Upload failed');

    statusEl.textContent = 'Uploaded!';
    statusEl.className = 'upload-status ok';
    setTimeout(() => { statusEl.textContent = ''; }, 3000);

    // Update or insert preview image inside wrap
    const newSrc = `/images/posts/${postSlug}/${json.filename}?t=${Date.now()}`;
    const existingImg = wrap.querySelector('.preview-img');
    if (existingImg) {
      existingImg.src = newSrc;
    } else {
      wrap.insertBefore(buildPreview(postSlug, `${json.filename}?t=${Date.now()}`, block.key), dz);
    }

    // Switch drop zone to overlay
    dz.className = 'dropzone overlay';
    dz.textContent = 'Drop to replace';

    // Update label for non-cover images
    const section = card.closest('.image-section');
    if (section && block.key !== 'cover') {
      const label = section.querySelector('.image-label');
      if (label) {
        label.innerHTML = '';
        label.append(span(json.filename, 'filename'), span('✓', 'status-icon-ok'));
      }
    }
  } catch (err) {
    statusEl.textContent = err.message;
    statusEl.className = 'upload-status error';
  }
}

// ─── Rewatermark ──────────────────────────────────────────────────────────────

async function rewatermark(btn, block, postSlug) {
  btn.textContent = '…';
  btn.className = 'rewatermark-btn busy';

  try {
    const res = await fetch(`/api/blog/${postSlug}/rewatermark`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: block.filename }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? 'Failed');

    // Force-refresh the preview image with cache-buster
    const section = btn.closest('.image-section');
    const img = section && section.querySelector('.preview-img');
    if (img) {
      const base = img.src.split('?')[0];
      img.src = `${base}?t=${Date.now()}`;
    }

    btn.textContent = '✓ Done';
    btn.className = 'rewatermark-btn done';
    setTimeout(() => { btn.textContent = '↻ Watermark'; btn.className = 'rewatermark-btn'; }, 2500);
  } catch (err) {
    btn.textContent = err.message.length < 30 ? err.message : 'Error';
    btn.className = 'rewatermark-btn err';
    setTimeout(() => { btn.textContent = '↻ Watermark'; btn.className = 'rewatermark-btn'; }, 3000);
  }
}

// ─── DOM helpers ──────────────────────────────────────────────────────────────

function el(tag, className = '') {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

function span(text, className = '') {
  const s = el('span', className);
  s.textContent = text;
  return s;
}

function link(href, text, className = '', newTab = false) {
  const a = el('a', className);
  a.href = href;
  a.textContent = text;
  if (newTab) { a.target = '_blank'; a.rel = 'noreferrer'; }
  return a;
}
