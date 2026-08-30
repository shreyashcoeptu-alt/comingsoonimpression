import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';

const rootDir = process.cwd();
const htmlPath = path.join(rootDir, 'index.html');
const cssPath = path.join(rootDir, 'styles.css');
const jsPath = path.join(rootDir, 'script.js');

test('File Existence & Readability', async (t) => {
  await t.test('Core files exist and are non-empty', () => {
    assert.ok(fs.existsSync(htmlPath), 'index.html exists');
    assert.ok(fs.statSync(htmlPath).size > 0, 'index.html is non-empty');

    assert.ok(fs.existsSync(cssPath), 'styles.css exists');
    assert.ok(fs.statSync(cssPath).size > 0, 'styles.css is non-empty');

    assert.ok(fs.existsSync(jsPath), 'script.js exists');
    assert.ok(fs.statSync(jsPath).size > 0, 'script.js is non-empty');
  });
});

test('HTML Markup & Accessibility Audits', async (t) => {
  const html = fs.readFileSync(htmlPath, 'utf8');

  await t.test('Contains essential SEO and metadata elements', () => {
    assert.match(html, /<!DOCTYPE html>/i, 'Has valid DOCTYPE');
    assert.match(html, /<meta\s+name=["']viewport["']/i, 'Has viewport meta tag');
    assert.match(html, /<title>[\s\S]*?<\/title>/i, 'Has title tag');
    assert.match(html, /<meta\s+name=["']description["']/i, 'Has meta description');
    assert.match(html, /<meta\s+property=["']og:title["']/i, 'Has Open Graph title');
    assert.match(html, /<meta\s+name=["']twitter:card["']/i, 'Has Twitter card');
  });

  await t.test('Contains semantic landmarks and required interactive DOM IDs', () => {
    const requiredIds = ['ticket3dScene', 'ticketCard', 'cinemaToast', 'stagePropsLayer', 'heroStage'];
    requiredIds.forEach((id) => {
      assert.ok(html.includes(`id="${id}"`), `Missing required element with id="${id}"`);
    });

    const requiredClasses = [
      'ticket-sheen-glare',
      'film-tape-top-wrapper',
      'film-tape-right-wrapper',
      'film-tape-bottom-wrapper'
    ];
    requiredClasses.forEach((cls) => {
      assert.ok(html.includes(cls), `Missing required element with class="${cls}"`);
    });
  });

  await t.test('All HTML-linked assets exist on disk', () => {
    const assetRegex = /(?:src|href)=["']([^"'#?:][^"']*)["']/g;
    let match;
    const missing = [];
    while ((match = assetRegex.exec(html)) !== null) {
      const target = match[1].trim();
      if (!target.startsWith('http') && !target.startsWith('//') && !target.startsWith('mailto:')) {
        const resolved = path.resolve(rootDir, target);
        if (!fs.existsSync(resolved)) {
          missing.push(target);
        }
      }
    }
    assert.deepEqual(missing, [], `Missing HTML referenced files: ${missing.join(', ')}`);
  });
});

test('CSS Styling & Asset Verification', async (t) => {
  const css = fs.readFileSync(cssPath, 'utf8');

  await t.test('Contains core design tokens', () => {
    const tokens = ['--crimson-base', '--gold-bright', '--parchment-pure', '--font-dinosic'];
    tokens.forEach((token) => {
      assert.ok(css.includes(token), `CSS is missing token: ${token}`);
    });
  });

  await t.test('Contains responsive & accessibility media queries', () => {
    assert.ok(css.includes('prefers-reduced-motion'), 'Contains prefers-reduced-motion query');
    assert.ok(css.includes('@media'), 'Contains responsive media queries');
    assert.ok(css.includes('(max-width: 768px)'), 'Contains 768px breakpoint');
    assert.ok(css.includes('(max-width: 480px)'), 'Contains 480px phone breakpoint');
  });

  await t.test('Mobile layout optimizations for footer and filmstrip', () => {
    assert.ok(css.includes('.filmstrip-accent-bar'), 'Contains filmstrip ribbon styling');
    assert.ok(css.includes('white-space: nowrap'), 'Filmstrip label uses nowrap to prevent awkward wrapping');
    assert.ok(css.includes('overflow: hidden'), 'Filmstrip tracks use overflow hidden');
  });

  await t.test('All CSS url(...) assets exist on disk', () => {
    const urlRegex = /url\(\s*(['"])?(.*?)\1\s*\)/g;
    let match;
    const missing = [];
    while ((match = urlRegex.exec(css)) !== null) {
      const urlTarget = match[2].trim();
      if (
        !urlTarget.startsWith('http') &&
        !urlTarget.startsWith('//') &&
        !urlTarget.startsWith('data:') &&
        !urlTarget.startsWith('#') &&
        !urlTarget.startsWith('%23')
      ) {
        const resolved = path.resolve(rootDir, urlTarget);
        if (!fs.existsSync(resolved)) {
          missing.push(urlTarget);
        }
      }
    }
    assert.deepEqual(missing, [], `Missing CSS referenced files: ${missing.join(', ')}`);
  });
});

test('JavaScript File Syntax & Integrity', async (t) => {
  const js = fs.readFileSync(jsPath, 'utf8');

  await t.test('Contains event listeners and physics hooks', () => {
    assert.ok(js.includes('DOMContentLoaded'), 'Registers DOMContentLoaded handler');
    assert.ok(js.includes('ticket3dScene'), 'Binds to ticket3dScene element');
    assert.ok(js.includes('prefers-reduced-motion'), 'Respects prefers-reduced-motion setting');
  });
});

test('Local Server HTTP Serving & MIME Type Test', async (t) => {
  // Spawn a lightweight in-memory HTTP server for testing route resolution
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.woff2': 'font/woff2',
    '.otf': 'font/otf'
  };

  const server = http.createServer((req, res) => {
    let reqPath = req.url === '/' ? '/index.html' : req.url;
    reqPath = reqPath.split('?')[0];
    const filePath = path.join(rootDir, reqPath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  await new Promise((resolve) => server.listen(0, resolve));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    await t.test('Serves index.html with 200 OK', async () => {
      const res = await fetch(`${baseUrl}/`);
      assert.equal(res.status, 200);
      assert.ok(res.headers.get('content-type')?.includes('text/html'));
      const text = await res.text();
      assert.ok(text.includes('Impressions 2026'));
    });

    await t.test('Serves styles.css with 200 OK', async () => {
      const res = await fetch(`${baseUrl}/styles.css`);
      assert.equal(res.status, 200);
      assert.ok(res.headers.get('content-type')?.includes('text/css'));
    });

    await t.test('Serves script.js with 200 OK', async () => {
      const res = await fetch(`${baseUrl}/script.js`);
      assert.equal(res.status, 200);
      assert.ok(res.headers.get('content-type')?.includes('text/javascript'));
    });

    await t.test('Serves static graphic assets', async () => {
      const res = await fetch(`${baseUrl}/assets/COEP-logo.webp`);
      assert.equal(res.status, 200);
    });
  } finally {
    server.close();
  }
});
