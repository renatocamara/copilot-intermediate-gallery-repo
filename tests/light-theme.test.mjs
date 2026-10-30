import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

const sourceRoot = new URL('../src/', import.meta.url);
const css = await readFile(new URL('app/globals.css', sourceRoot), 'utf8');

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(entry => {
    const url = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
    return entry.isDirectory() ? sourceFiles(url) : [url];
  }));
  return files.flat().filter(file => /\.(tsx?|css)$/.test(file.pathname));
}

function declaration(selector, property) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const rule = css.match(new RegExp(`${escapedSelector}\\s*\\{([^}]+)\\}`));
  assert.ok(rule, `Missing CSS rule: ${selector}`);
  const value = rule[1].match(new RegExp(`(?:^|;)\\s*${property}:\\s*([^;]+);`));
  assert.ok(value, `Missing ${property} on ${selector}`);
  return value[1].trim();
}

function luminance(hex) {
  assert.match(hex, /^#[0-9a-f]{6}$/i);
  const rgb = [1, 3, 5].map(start => parseInt(hex.slice(start, start + 2), 16) / 255);
  const linear = rgb.map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function assertContrast(foreground, background, minimum, label) {
  const a = luminance(foreground);
  const b = luminance(background);
  const contrast = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  assert.ok(contrast >= minimum, `${label}: ${contrast.toFixed(2)}:1 is below ${minimum}:1`);
}

test('uses a light browser color scheme and a readable default foreground', () => {
  assert.equal(declaration(':root', 'color-scheme'), 'light');
  assertContrast(declaration(':root', '--foreground'), declaration(':root', '--background'), 4.5, 'Body');
});

test('source components cannot switch to dark styling with the system preference', async () => {
  for (const file of await sourceFiles(sourceRoot)) {
    const source = await readFile(file, 'utf8');
    assert.doesNotMatch(source, /\bdark:|prefers-color-scheme\s*:\s*dark/, file.pathname);
  }
});

test('shared buttons, navigation, placeholders, and badges have readable light-theme contrast', () => {
  assertContrast(declaration('.btn-primary', 'color'), declaration('.btn-primary', 'background-color'), 4.5, 'Primary button');
  assertContrast(declaration('.btn-secondary', 'color'), '#ffffff', 4.5, 'Secondary button');
  assertContrast(declaration('.nav-link', 'color'), '#e2e8f0', 4.5, 'Navigation');
  assertContrast(declaration('.nav-link-active', 'color'), '#e2e8f0', 4.5, 'Active navigation');
  assertContrast(declaration('.form-input::placeholder', 'color'), '#ffffff', 4.5, 'Form placeholder');
  assertContrast(declaration('.btn-icon', 'color'), '#ffffff', 3, 'Action icon');
  for (const status of ['active', 'private', 'draft']) {
    assertContrast(declaration(`.status-${status}`, 'color'), declaration(`.status-${status}`, 'background-color'), 4.5, status);
  }
});
