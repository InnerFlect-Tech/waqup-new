#!/usr/bin/env node
/**
 * Reads Playwright results.json and writes a consolidated failures markdown file.
 * Open e2e-failures.md in Cursor and @ mention it to get AI help debugging.
 *
 * Run after test:e2e:   node scripts/playwright-failures-to-markdown.mjs
 * Or use:               npm run test:e2e:for-cursor
 */

import fs from 'fs';
import path from 'path';

const resultsPath = path.join(process.cwd(), 'playwright-report', 'results.json');
const outputPath = path.join(process.cwd(), 'e2e-failures.md');

function collectFailures(suites, projectName = '', acc = []) {
  for (const suite of suites || []) {
    const title = suite.title || '';
    for (const spec of suite.specs || []) {
      for (const test of spec.tests || []) {
        for (const result of test.results || []) {
          if (result.status === 'failed' || result.status === 'timedOut') {
            const err = result.error;
            acc.push({
              project: projectName || test.projectName || '',
              file: spec.file || '',
              title: spec.title || '',
              testFullTitle: [suite.title, spec.title].filter(Boolean).join(' › '),
              error: err ? (err.message || String(err)) : 'Unknown error',
              stack: err?.stack || '',
            });
          }
        }
      }
    }
  }
  return acc;
}

function main() {
  if (!fs.existsSync(resultsPath)) {
    console.error('No results.json found. Run playwright test first.');
    process.exit(1);
  }

  const raw = fs.readFileSync(resultsPath, 'utf-8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse results.json:', e.message);
    process.exit(1);
  }

  const failures = [];
  // Playwright JSON: project array with { name, suites } or top-level suites
  if (Array.isArray(data.project)) {
    for (const proj of data.project) {
      if (proj.suites) {
        collectFailures(proj.suites, proj.name || '', failures);
      }
    }
  } else if (data.suites) {
    collectFailures(data.suites, '', failures);
  } else {
    // Fallback: recursive traversal to find failed results
    function walk(obj, ctx = {}) {
      if (!obj || typeof obj !== 'object') return;
      if (Array.isArray(obj.suites)) {
        collectFailures(obj.suites, ctx.projectName || obj.name || '', failures);
        return;
      }
      if (Array.isArray(obj.results)) {
        for (const r of obj.results) {
          if (r.status === 'failed' || r.status === 'timedOut') {
            const spec = ctx.spec || obj;
            const suite = ctx.suite || obj;
            failures.push({
              project: obj.projectName || ctx.projectName || '',
              file: spec.file || '',
              title: spec.title || '',
              testFullTitle: [suite.title, spec.title].filter(Boolean).join(' › '),
              error: r.error ? (r.error.message || String(r.error)) : 'Unknown error',
              stack: r.error?.stack || '',
            });
          }
        }
      }
      for (const v of Object.values(obj)) {
        if (v && typeof v === 'object') walk(v, ctx);
      }
    }
    walk(data);
  }

  const byFile = {};
  for (const f of failures) {
    const key = f.file || '(unknown)';
    if (!byFile[key]) byFile[key] = [];
    byFile[key].push(f);
  }

  const lines = [
    '# E2E Test Failures',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Total failures: ${failures.length}`,
    '',
    '---',
    '',
  ];

  for (const [file, items] of Object.entries(byFile).sort()) {
    lines.push(`## ${file}`);
    lines.push('');
    for (const item of items) {
      lines.push(`### ${item.testFullTitle}`);
      if (item.project) lines.push(`- **Project**: \`${item.project}\``);
      lines.push('');
      lines.push('```');
      lines.push(item.error);
      if (item.stack) lines.push('\n' + item.stack);
      lines.push('```');
      lines.push('');
    }
  }

  fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8');
  console.log(`Wrote ${outputPath} (${failures.length} failures)`);
}

main();
