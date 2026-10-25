import { chromium } from '@playwright/test';
import fs from 'node:fs';
const out='tmp/browser';fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true});const page=await browser.newPage();const failures=[];let checks=0;
const routes=['/','/work/','/work/agentic-rag/','/work/almanac/','/work/inference-planner/','/resume/','/tacle/'];
for(const route of routes) for(const width of [320,390,768,800,801,1050,1051,1150,1151,1280,1440,1920]) for(const size of [16,32]) for(const colorScheme of ['light','dark']) {
 await page.setViewportSize({width,height:900});await page.emulateMedia({colorScheme,reducedMotion:'reduce'});await page.goto('http://localhost:8001'+route);await page.evaluate(size=>document.documentElement.style.fontSize=size+'px',size);await page.evaluate(()=>document.fonts.ready);
 const overflow=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,items:[...document.querySelectorAll('main *,aside *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+2||r.left< -2)&&getComputedStyle(e).position!=='fixed'}).slice(0,6).map(e=>e.tagName+'.'+e.className)}));checks++;if(overflow.scroll>width+2||overflow.items.length)failures.push({route,width,size,colorScheme,...overflow});
 if(size===16&&colorScheme==='light'&&[390,1440].includes(width))await page.screenshot({path:out+'/'+(route==='/'?'home':route.split('/').filter(Boolean).at(-1))+'-'+width+'.png',fullPage:true});
}
await page.setViewportSize({width:390,height:844});await page.goto('http://localhost:8001/');await page.locator('.compact-menu summary').click();await page.keyboard.press('Escape');if(await page.locator('.compact-menu').getAttribute('open')!==null)throw Error('Escape did not close menu');
await page.context().grantPermissions(['clipboard-read','clipboard-write']);await page.getByRole('button',{name:'Copy email address'}).click();await page.getByRole('status').filter({hasText:'Email address copied.'}).waitFor();const copied=await page.evaluate(()=>navigator.clipboard.readText());if(copied!=='rohitkumar.iisc@gmail.com')throw Error('Clipboard mismatch');
await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(new Error('denied'))},configurable:true}));await page.getByRole('button',{name:'Copy email address'}).click();await page.getByRole('status').filter({hasText:'Could not copy.'}).waitFor();await page.screenshot({path:out+'/contact-error.png'});
await page.goto('http://localhost:8001/resume/');await page.pdf({path:out+'/web-resume.pdf',format:'A4',printBackground:true});
fs.writeFileSync(out+'/results.json',JSON.stringify({checks,failures,interactions:'menu Escape, clipboard success and denial passed'},null,2));console.log(JSON.stringify({checks,failures}));await browser.close();if(failures.length)process.exitCode=1;
