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
  const label = buildLabel(block);
  const card  = buildCard(block, postSlug);

  const section = el('div', 'image-section');
  section.append(label, card);
  return section;
}

function buildLabel(block) {
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
  return label;
}

function buildCard(block, postSlug) {
  const card = el('div', 'image-card');

  // Preview
  if (block.exists && block.filename) {
    card.appendChild(buildPreview(postSlug, block.filename, block.key));
  }

  // Drop zone
  card.appendChild(buildDropzone(block, postSlug, card));

  // Upload status placeholder
  card.appendChild(el('div', 'upload-status'));

  // Prompt
  if (block.prompt) {
    card.appendChild(buildPrompt(block.prompt));
  }

  return card;
}

function buildPreview(postSlug, filename, alt) {
  const img = document.createElement('img');
  img.src = `/images/posts/${postSlug}/${filename}`;
  img.alt = alt;
  img.className = 'preview-img';
  return img;
}

function buildDropzone(block, postSlug, card) {
  const dz = el('div', block.exists ? 'dropzone replace' : 'dropzone');
  dz.textContent = block.exists ? 'Drop here to replace' : 'Drag & drop image here, or click to browse';

  dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.classList.add('drag-over'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('drag-over'));
  dz.addEventListener('drop', (e) => {
    e.preventDefault();
    dz.classList.remove('drag-over');
    if (e.dataTransfer.files[0]) upload(e.dataTransfer.files[0], block, postSlug, card);
  });
  dz.addEventListener('click', () => {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = 'image/*';
    inp.onchange = () => { if (inp.files[0]) upload(inp.files[0], block, postSlug, card); };
    inp.click();
  });

  return dz;
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

async function upload(file, block, postSlug, card) {
  const statusEl = card.querySelector('.upload-status');
  statusEl.textContent = 'Uploading…';
  statusEl.className = 'upload-status';

  const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
  const filename = `${block.key}.${ext}`;

  const form = new FormData();
  form.append('file', file);
  form.append('filename', filename);

  try {
    const res = await fetch(`/api/blog/${postSlug}/upload`, { method: 'POST', body: form });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? 'Upload failed');

    statusEl.textContent = 'Uploaded!';
    statusEl.className = 'upload-status ok';
    setTimeout(() => { statusEl.textContent = ''; }, 3000);

    // Update preview
    const newSrc = `/images/posts/${postSlug}/${json.filename}?t=${Date.now()}`;
    const existingImg = card.querySelector('.preview-img');
    if (existingImg) {
      existingImg.src = newSrc;
    } else {
      const img = buildPreview(postSlug, `${json.filename}?t=${Date.now()}`, block.key);
      card.insertBefore(img, card.firstChild);
    }

    // Compact the drop zone
    const dz = card.querySelector('.dropzone');
    if (dz) {
      dz.textContent = 'Drop here to replace';
      dz.className = 'dropzone replace';
    }

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
