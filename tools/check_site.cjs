/* Browser verification over HTTP, including deployment below a URL prefix. */
'use strict';
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const {spawn} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const out = path.join(__dirname, 'out');
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  if (!process.argv[2]) throw new Error('Usage: node tools/check_site.cjs <chromium-executable>');
  await fs.mkdir(out, {recursive:true});
  const profile = await fs.mkdtemp(path.join(out, 'browser-'));
  const server = http.createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      if (!pathname.startsWith('/preview/')) { res.writeHead(404); res.end(); return; }
      const relative = pathname.slice('/preview/'.length);
      if (relative.split('/').some(s => s.startsWith('.'))) throw new Error('Hidden path');
      let file = path.resolve(root, relative);
      if (path.relative(root, file).startsWith('..')) throw new Error('Outside site');
      if ((await fs.stat(file)).isDirectory()) file = path.join(file, 'index.html');
      const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.json':'application/json'};
      res.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream'});
      res.end(await fs.readFile(file));
    } catch { res.writeHead(404); res.end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = spawn(process.argv[2], ['--headless=new','--no-first-run','--no-default-browser-check','--disable-background-networking','--disable-component-update','--disable-sync','--disable-extensions','--remote-debugging-port=0', ...(process.platform === 'win32' ? ['--do-not-de-elevate'] : []), `--user-data-dir=${profile}`, 'about:blank'], {windowsHide:true,stdio:'ignore'});
  let socket, id=0;
  const pending = new Map(), checks=[], errors=[], badResponses=[], external=[];
  try {
    let port;
    for (let i=0;i<100;i++) {
      try { port=(await fs.readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0]; break; } catch { await pause(100); }
    }
    if (!port) throw new Error('Browser debugging did not start');
    const pages=await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    socket=new WebSocket(pages.find(p=>p.type==='page').webSocketDebuggerUrl);
    await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});
    socket.onmessage=({data})=>{
      const message=JSON.parse(data);
      if(message.id){const p=pending.get(message.id);if(p){clearTimeout(p.timer);pending.delete(message.id);message.error?p.reject(new Error(JSON.stringify(message.error))):p.resolve(message.result);}}
      if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails);
      if(message.method==='Network.responseReceived'&&message.params.response.status>=400&&!message.params.response.url.endsWith('/favicon.ico'))badResponses.push(message.params.response.url);
      if(message.method==='Network.requestWillBeSent'&&/^https?:/.test(message.params.request.url)&&!message.params.request.url.startsWith(origin+'/'))external.push(message.params.request.url);
    };
    const command=(method,params={})=>new Promise((resolve,reject)=>{
      const seq=++id;const timer=setTimeout(()=>{pending.delete(seq);reject(new Error('Timeout: '+method));},15000);
      pending.set(seq,{resolve,reject,timer});socket.send(JSON.stringify({id:seq,method,params}));
    });
    const evaluate=async expression=>{
      const result=await command('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
      if(result.exceptionDetails)throw new Error(JSON.stringify(result.exceptionDetails));
      return result.result.value;
    };
    const check=async(name,expression)=>{
      const passed=await evaluate(expression);checks.push({name,passed:passed===true});
      if(passed!==true)throw new Error(name+': '+JSON.stringify(passed));
    };
    const go=async file=>{
      const url=origin+'/preview/'+file;
      await command('Page.navigate',{url});
      for(let i=0;i<100;i++){
        if(await evaluate(`location.href===${JSON.stringify(url)} && document.readyState==='complete'`))return;
        await pause(100);
      }
      throw new Error('Navigation did not finish: '+file);
    };
    const screenshot=async name=>fs.writeFile(path.join(out,name+'.png'),Buffer.from((await command('Page.captureScreenshot',{format:'png'})).data,'base64'));
    await command('Page.enable');await command('Runtime.enable');await command('Network.enable');
    const notebooks=['index','concepts','seigrasm','silicon','experiments','evidence','method','electrical','stability','repeatability','freshness','transitions','held','adaptive','bounded','guide'];
    for(const width of [1440,390]){
      await command('Emulation.setDeviceMetricsOverride',{width,height:width===390?844:1080,deviceScaleFactor:1,mobile:false});
      for(const file of ['index.html','html/insektsreservat.html','html/sound.html','html/manifesto.html',...notebooks.map(n=>'lab/hyphos/'+n+'.html')]){
        await go(file);
        await check(file+' fits '+width,'document.documentElement.scrollWidth<=innerWidth');
        await check(file+' site navigation '+width,"document.querySelectorAll('.site-nav a').length===4 && document.querySelectorAll('.site-nav [aria-current]').length===1 && document.querySelector('.site-brand img').naturalWidth>0");
        await check(file+' images '+width,"[...document.images].every(i=>i.complete&&i.naturalWidth>0)");
        if(file.startsWith('lab/')){
          await check(file+' project context '+width,"document.querySelector('.lab-return').href.endsWith('/preview/index.html') && document.querySelector('.site-nav [aria-current]').textContent==='Seigr Lab'");
          await check(file+' notebook navigation '+width,"document.querySelectorAll('.chapter-menu a').length===7 && !document.querySelector('iframe')");
        }
        if(['index.html','lab/hyphos/index.html','lab/hyphos/experiments.html','lab/hyphos/adaptive.html','lab/hyphos/bounded.html','html/sound.html'].includes(file))await screenshot(file.replaceAll('/','-').replace('.html','')+'-'+width);
      }
    }
    await go('lab/hyphos/experiments.html');
    await check('eight experiments',"document.querySelectorAll('.study-card').length===8");
    await evaluate("document.querySelector('#search').value='F34EB0FBBAF8';document.querySelector('#search').dispatchEvent(new Event('input'))");
    await check('search current candidate',"document.querySelectorAll('.study-card').length===1 && document.querySelector('.study-card h3').textContent.includes('Calibration renewal')");
    await check('pending series exposes earlier results',"document.querySelector('.study-card a[href=\"adaptive.html#results\"]')!==null");
    await evaluate("document.querySelector('#clear-search').click();document.querySelector('[data-filter=passed]').click()");
    await check('outcome filtering',"document.querySelectorAll('.study-card').length===1 && document.querySelector('.study-card h3').textContent.includes('trigger')");
    await go('lab/hyphos/adaptive.html#boot-2-results');
    await check('deep result link',"document.querySelector('#boot-2-results').textContent.includes('eight from correct to unresolved')");
    await evaluate("document.querySelector('.archive-reference').click()");
    for(let i=0;i<50;i++){if(await evaluate("location.hash==='#availability' && document.body.dataset.chapter==='evidence'"))break;await pause(100);}
    await check('private references explain availability',"document.querySelector('#availability').textContent.includes('private project archive') && !document.querySelector('#source-index')");
    await command('Emulation.setEmulatedMedia',{media:'print'});
    await check('print omits site chrome',"getComputedStyle(document.querySelector('#header-container')).display==='none'");
    await command('Emulation.setEmulatedMedia',{media:''});
    await command('Emulation.setScriptExecutionDisabled',{value:true});
    await go('lab/hyphos/concepts.html');
    await check('chapter and navigation without JavaScript',"document.querySelector('#senary')!==null && document.querySelector('.site-nav a')!==null && document.querySelector('.chapter-menu a[href=\"experiments.html\"]')!==null");
    await go('index.html');
    await check('lab navigation without JavaScript',"document.querySelector('.lab-button').href.endsWith('/preview/lab/hyphos/index.html') && document.querySelector('.site-nav a')!==null");
    await command('Emulation.setScriptExecutionDisabled',{value:false});
    if(errors.length||badResponses.length||external.length)throw new Error(JSON.stringify({errors,badResponses,external}));
    await fs.writeFile(path.join(out,'browser-checks.json'),JSON.stringify({checks,errors,badResponses,external,browser:await command('Browser.getVersion')},null,2)+'\n');
    console.log(`Passed ${checks.length} browser checks; screenshots in tools/out/.`);
    await command('Browser.close');
  } finally {
    socket?.close();for(const p of pending.values())clearTimeout(p.timer);
    browser.kill();server.close();
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
