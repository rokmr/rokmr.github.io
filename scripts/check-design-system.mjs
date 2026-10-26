import { chromium, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const output = 'tmp/design-system';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();
let checks = 0;
for (const route of ['agentic-rag', 'almanac', 'inference-planner']) {
  for (const width of [320, 390, 600, 740, 768, 801, 1280, 1440]) {
    for (const fontSize of [16, 32]) {
      for (const colorScheme of ['light', 'dark']) {
        await page.setViewportSize({ width, height: 1000 });
        await page.emulateMedia({ colorScheme });
        await page.goto(`http://localhost:8001/work/${route}/`);
        await page.evaluate(size => document.documentElement.style.fontSize = `${size}px`, fontSize);
        await expect.poll(() => page.locator('.diagram-stage-symbol use').evaluateAll(icons => icons.every(icon => icon.getBBox().width > 0 && icon.getBBox().height > 0))).toBe(true);
        const issues = await page.locator('.technical-diagram').evaluate(figure => {
          const issues = [];
          const box = element => element.getBoundingClientRect();
          const styles = getComputedStyle(figure);
          for (const flow of figure.querySelectorAll('.diagram-flow')) {
            const stages = [...flow.children];
            for (let index = 0; index < stages.length - 1; index++) {
              const source = box(stages[index]);
              const target = box(stages[index + 1]);
              const arrow = box(stages[index].querySelector('.diagram-connector'));
              const vertical = target.top > source.bottom;
              const center = vertical ? (source.bottom + target.top) / 2 : (source.right + target.left) / 2;
              const arrowCenter = vertical ? (arrow.top + arrow.bottom) / 2 : (arrow.left + arrow.right) / 2;
              if (Math.abs(center - arrowCenter) > 2) issues.push('Connector not centered in stage gap');
              if (vertical ? arrow.top < source.bottom - 1 || arrow.bottom > target.top + 1 : arrow.left < source.right - 1 || arrow.right > target.left + 1) issues.push('Connector overlaps a stage');
            }
          }
          for (const label of figure.querySelectorAll('.diagram-stage p,.diagram-stage-kind,figcaption')) {
            if (parseFloat(getComputedStyle(label).fontSize) < 12) issues.push('Text below 12px');
            if (label.scrollWidth > label.clientWidth + 1) issues.push('Clipped stage text');
          }
          const caption = getComputedStyle(figure.querySelector('figcaption'));
          if (caption.fontFamily !== getComputedStyle(document.querySelector('.portfolio-page')).fontFamily) issues.push('Caption font differs from body');
          const sample = document.createElement('span');
          figure.append(sample);
          const resolveColor = token => { sample.style.color = styles.getPropertyValue(token); return getComputedStyle(sample).color; };
          const accent = resolveColor('--page-accent');
          const wash = resolveColor('--page-wash');
          for (const stage of figure.querySelectorAll('.diagram-stage--check')) if (getComputedStyle(stage).borderTopColor !== accent) issues.push('Check border lost to cascade');
          for (const stage of figure.querySelectorAll('.diagram-stage--output')) if (getComputedStyle(stage).backgroundColor !== wash) issues.push('Output shading lost to cascade');
          for (const stage of figure.querySelectorAll('.diagram-stage--store')) if (getComputedStyle(stage).borderTopStyle !== 'double') issues.push('Store rule lost to cascade');
          const rgb = color => color.match(/[\d.]+/g).slice(0, 3).map(Number);
          const luminance = color => rgb(color).map(value => value / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
          const contrast = (first, second) => { const values = [luminance(first), luminance(second)].sort((a,b)=>b-a); return (values[0]+.05)/(values[1]+.05); };
          for (const surface of ['--page-paper', '--page-wash']) for (const ink of ['--page-ink', '--page-muted']) if (contrast(resolveColor(surface), resolveColor(ink)) < 4.5) issues.push('Text contrast below 4.5:1');
          sample.remove();
          return issues;
        });
        expect(issues, `${route} ${width}px ${fontSize}px ${colorScheme}`).toEqual([]);
        if (fontSize === 16 && [390, 1440].includes(width)) await page.locator('.technical-diagram').screenshot({ path: `${output}/${route}-${width}-${colorScheme}.png` });
        checks++;
      }
    }
  }
}
for (const route of ['/', '/work/', '/resume/']) {
  await page.goto(`http://localhost:8001${route}`);
  const issues = await page.locator('.portfolio-page').evaluate(surface => {
    const issues = [];
    for (const element of surface.querySelectorAll('p,a,summary,button,span')) {
      const rect = element.getBoundingClientRect();
      if (rect.width > 1 && rect.height > 1 && parseFloat(getComputedStyle(element).fontSize) < 12) issues.push('Visible label below 12px');
    }
    const iconSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    for (const icon of surface.querySelectorAll('svg:not(.diagram-connector)')) {
      const style = getComputedStyle(icon);
      if (Math.abs(parseFloat(style.width) - iconSize) > .1 || Math.abs(parseFloat(style.height) - iconSize) > .1 || parseFloat(style.strokeWidth) !== 1.5) issues.push('Inconsistent UI icon');
    }
    return issues;
  });
  expect(issues, route).toEqual([]);
}
await page.goto('http://localhost:8001/');
await page.keyboard.press('Tab');
await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
expect(await page.getByRole('link', { name: 'Skip to content' }).evaluate(element => getComputedStyle(element).boxShadow)).toBe('none');
await browser.close();
console.log(`${checks} diagram states passed: connectors, typography, role styling and text contrast`);
