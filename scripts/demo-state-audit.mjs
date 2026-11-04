// scripts/ui-audit.mjs
// Desktop-only UI audit for ananyapanayappan.com
// Run: BASE_URL=http://localhost:8080 node scripts/ui-audit.mjs
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = await import(pathToFileURL(process.env.USERPROFILE + '/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs')); }
const { chromium } = playwright;
import fs from 'node:fs';
const browser=await chromium.launch({channel:'msedge'});
const results=await Promise.all([[1024,768],[1280,720],[1366,768],[1536,864],[1920,1080],[2560,1440]].map(async([width,height])=>{
 const page=await browser.newPage({viewport:{width,height}});
 await page.goto(process.env.BASE_URL+'/community.html');await page.evaluate(()=>document.fonts.ready);
 const samples=[];
 for(let i=0;i<9;i++){
  samples.push(await page.locator('[data-demo]').evaluate(el=>{const b=el.getBoundingClientRect(); const t=el.querySelector('table').getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height,tableHeight:t.height,contained:t.left>=b.left&&t.right<=b.right&&t.bottom<=b.bottom,state:el.querySelector('[data-result]').textContent}}));
  if([0,2,4,7].includes(i))await page.locator('[data-demo]').screenshot({path:`ui-audit/${width}x${height}__braille_state_${i}.png`});
  await page.waitForTimeout(900);
 }
 await page.goto(process.env.BASE_URL+'/pocketsmart.html');
 const frame=page.locator('iframe');await frame.scrollIntoViewIfNeeded();
 const before=await frame.boundingBox();
 await page.frameLocator('iframe').getByRole('button',{name:'Get started'}).click();
 await page.waitForTimeout(500);
 const after=await frame.boundingBox();
 await page.locator('[data-demo]').screenshot({path:`ui-audit/${width}x${height}__pocket_started.png`});
 await page.close();return {width,height,braille:samples,pocket:{before,after}};
}));
fs.writeFileSync('ui-audit/demo-states.json',JSON.stringify(results,null,2));await browser.close();
