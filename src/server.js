import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import multer from 'multer';
import sharp from 'sharp';
import * as cheerio from 'cheerio';
import nodemailer from 'nodemailer';
import { dataDir, uploadsDir, media, leads, addLead, deleteLead, addMedia, updateMedia, removeMedia, settings, saveSettings, saveLogoFile, deleteLogoFile } from './store.js';
import { hasPassword, verifyPassword, credentialVersion, passwordSource } from './admin-auth.js';
import { render, slugs } from './pages.js';

const app = express();
const port = Number(process.env.PORT || 8106);
const preview = process.env.PREVIEW_MODE !== 'false';
const secret = process.env.SESSION_SECRET || '';
const siteKey = process.env.TURNSTILE_SITE_KEY || '';
const turnstileSecret = process.env.TURNSTILE_SECRET_KEY || '';
const siteUrl = (process.env.PUBLIC_SITE_URL || 'https://kitchensprayexpert.co.uk').replace(/\/+$/, '');
const tel = '07764 603423';
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(express.urlencoded({extended: false, limit: '40kb'}));
app.use((req,res,next)=>{
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options','SAMEORIGIN');
  res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://kitchensprayexpert.co.uk https://www.kitchensprayexpert.co.uk; font-src 'self' https://fonts.gstatic.com; frame-src https://challenges.cloudflare.com; connect-src 'self' https://challenges.cloudflare.com; form-action 'self'; base-uri 'self'; object-src 'none'");
  if(preview)res.setHeader('X-Robots-Tag','noindex, nofollow, noarchive');
  next();
});
app.use(express.static(path.resolve('public'),{maxAge:'1d',index:false}));
app.use('/media',express.static(uploadsDir,{maxAge:'7d',index:false,immutable:true}));
app.get('/health',(req,res)=>res.json({status:'ok'}));
app.get('/robots.txt',(req,res)=>{
  res.type('text/plain').send(preview?'User-agent: *\nDisallow: /\n':'User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: '+siteUrl+'/sitemap.xml\n');
});
app.get('/sitemap.xml',(req,res)=>{
  if(preview)return res.status(404).type('text/plain').send('Preview sitemap disabled');
  res.type('application/xml').send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+slugs.map(s=>'<url><loc>'+siteUrl+s+'</loc></url>').join('')+'</urlset>');
});
app.get('/favicon.ico',(req,res)=>res.redirect(301,'/favicon.svg'));
app.get(/^\/google[a-zA-Z0-9_-]+\.html$/, (req,res)=>{
  const filename=req.path.slice(1);
  if(settings().googleVerification!==filename)return res.status(404).send('Not found');
  res.type('text/plain').send('google-site-verification: '+filename);
});
app.get('/blog-item/how-much-does-a-kitchen-respray-cost-in-scotland', (req,res)=>res.redirect(301,'/kitchen-respray-cost/'));
app.get('/blog-item/how-much-does-a-kitchen-respray-cost-in-scotland/', (req,res)=>res.redirect(301,'/kitchen-respray-cost/'));
app.get(['/prices/','/pricing/'],(req,res)=>res.redirect(301,'/kitchen-respray-cost/'));
app.get('/contact-us/',(req,res)=>res.redirect(301,'/contact/'));
const limiters=new Map();
function limited(key, max, windowMs) {
  const now=Date.now();
  const prev=(limiters.get(key)||[]).filter(t=>t>now-windowMs);
  prev.push(now); limiters.set(key,prev);
  if(limiters.size>10000)for(const [k,v] of limiters)if(v[v.length-1]<now-windowMs)limiters.delete(k);
  return prev.length>max;
}
const safe = v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function verifyCaptcha(token,ip){
  if(!siteKey && !turnstileSecret) return true;
  if(!siteKey || !turnstileSecret || !token)return false;
  try {
    const body=new URLSearchParams({secret:turnstileSecret,response:String(token),remoteip:ip});
    const r=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body,signal:AbortSignal.timeout(7000)});
    const result=await r.json();return result.success===true;
  }catch{return false;}
}
app.post('/contact/',async(req,res)=>{
  if(limited('contact:'+req.ip,5,3600000))return res.status(429).send('Too many attempts. Please try again later or call '+tel+'.');
  const b=req.body||{};
  if(b.website)return res.redirect(303,'/contact/?sent=1');
  const name=String(b.name||'').trim().slice(0,100),phone=String(b.phone||'').trim().slice(0,45);
  const email=String(b.email||'').trim().slice(0,150),postcode=String(b.postcode||'').trim().slice(0,20);
  const service=String(b.service||'').trim().slice(0,80),message=String(b.message||'').trim().slice(0,3000);
  const allowedExtras=['handles','worktops','sinks-taps'];
  const requestedExtras=Array.isArray(b.upgrades)?b.upgrades:[b.upgrades];
  const upgrades=[...new Set(requestedExtras.filter(v=>allowedExtras.includes(v)))];
  const ralColour=String(b.ralColour||'').trim().toUpperCase().slice(0,40);
  if(ralColour && !/^RAL [0-9]{4}$/.test(ralColour))return res.redirect(303,'/contact/?error='+encodeURIComponent('Enter a RAL code like RAL 6011.'));
  if(!name||!phone||!email||!message||!email.includes('@')||b.consent!=='yes')return res.redirect(303,'/contact/?error='+encodeURIComponent('Required fields are missing.'));
  if(!await verifyCaptcha(b['cf-turnstile-response'],req.ip))return res.redirect(303,'/contact/?error='+encodeURIComponent('Please complete the verification challenge.'));
  try {addLead({name,phone,email,postcode,service,message,upgrades,ralColour});}
  catch(err){console.error('Contact persistence error:',err);return res.status(503).send('We could not save your enquiry. Please call '+tel+'.');}
  if(process.env.SMTP_HOST && process.env.CONTACT_TO && process.env.SMTP_FROM){
    try {
      const transport=nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:process.env.SMTP_SECURE==='true',auth:process.env.SMTP_USER?{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD}:undefined});
      await transport.sendMail({from:process.env.SMTP_FROM,to:process.env.CONTACT_TO,replyTo:email,subject:'New kitchen spraying enquiry — '+name,text:['New kitchen spraying enquiry','Name: '+name,'Phone: '+phone,'Email: '+email,'Postcode: '+postcode,'Service: '+service,'Optional extras: '+(upgrades.join(', ')||'None requested'),'Preferred RAL colour: '+(ralColour||'Not specified'),'','Message:',message].join('\n')});
    }catch(err){console.error('SMTP delivery failed; enquiry is safely stored in admin:',err.message);}
  }
  return res.redirect(303,'/contact/?sent=1');
});
const cookieName='kse_admin';
function sig(data){return crypto.createHmac('sha256',secret).update(data).digest('hex');}
function getAuth(req){
  if(!secret||!hasPassword())return '';
  const raw=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(cookieName+'='));
  if(!raw)return '';
  const value=raw.slice(cookieName.length+1);
  const [expiry,mac]=value.split('.');
  if(!/^\d+$/.test(expiry||'')||!mac||Number(expiry)<Date.now())return '';
  const expected=sig(expiry+'|'+credentialVersion());
  if(mac.length!==expected.length)return '';
  if(!crypto.timingSafeEqual(Buffer.from(mac),Buffer.from(expected)))return '';
  return mac;
}
function adminOnly(req,res,next){const auth=getAuth(req);if(!auth)return res.redirect('/admin/login/');res.locals.csrf=auth;next();}
function requireCsrf(req,res,next){if(!req.body||req.body.csrf!==res.locals.csrf)return res.status(403).send('Security token invalid. Refresh the admin page.');next();}
function adminLayout(title,body,notice=''){
  return '<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>'+safe(title)+' — Kitchen Spraying Expert</title><link rel="stylesheet" href="/site.css?v=20261018-g"></head><body class="admin-body"><header class="admin-header"><div class="wrap admin-bar"><a href="/admin/">Kitchen Spraying Expert<span> / Admin</span></a><nav><a href="/" target="_blank" rel="noopener noreferrer">View website ↗</a><a href="/admin/logout/">Sign out</a></nav></div></header><main class="wrap admin-main"><h1>'+safe(title)+'</h1>'+(notice?'<div class="success">'+safe(notice)+'</div>':'')+body+'</main></body></html>';
}
app.get('/admin/login/',(req,res)=>{
  if(getAuth(req))return res.redirect('/admin/');
  const configured=!!(hasPassword()&&secret);
  res.send(adminLayout('Admin sign in',!configured?'<p>Admin is disabled. Configure ADMIN_PASSWORD and SESSION_SECRET in the server .env file.</p>':'<form class="admin-login" method="post" action="/admin/login/"><label>Admin password<input type="password" name="password" autocomplete="current-password" required autofocus></label><button class="btn btn-primary">Sign in →</button></form>'));
});
app.post('/admin/login/',(req,res)=>{
  if(limited('login:'+req.ip,8,15*60000))return res.status(429).send('Too many login attempts. Try again later.');
  if(!hasPassword()||!secret)return res.status(503).send('Admin credentials not configured. Run the setup/status script.');
  if(!verifyPassword(req.body.password||''))return res.status(401).send(adminLayout('Admin sign in','<p class="error">The password was not recognised. On Plesk, run <code>docker compose exec -it web node scripts/reset-admin-password.js</code> to set a new password without editing .env.</p><a href="/admin/login/">Try again</a>'));
  const expiry=String(Date.now()+12*3600000);
  const token=expiry+'.'+sig(expiry+'|'+credentialVersion());
  const secure=req.secure?' Secure;':'';
  res.setHeader('Set-Cookie',cookieName+'='+token+'; Path=/admin/; HttpOnly; SameSite=Strict; Max-Age=43200;'+secure);
  res.redirect(303,'/admin/');
});
app.get('/admin/logout/',(req,res)=>{res.setHeader('Set-Cookie',cookieName+'=; Path=/admin/; HttpOnly; SameSite=Strict; Max-Age=0');res.redirect('/admin/login/');});
let importJob={running:false,scanned:0,discovered:0,imported:0,skipped:0,errors:[],finishedAt:null};
function adminPage(req,res){
  const token=res.locals.csrf, m=media(), l=leads(), s=settings();
  const notices={saved:'Settings updated.',uploaded:'Image uploaded.',changed:'Media updated.',removed:'Image removed.',logoSaved:'Logo uploaded successfully.',logoRemoved:'Logo removed.',deleted:'Enquiry deleted.',started:'Media import started. Refresh this page to see progress.'};
  const formToken='<input type="hidden" name="csrf" value="'+safe(token)+'">';
  const info='<section class="admin-stats"><div><strong>'+m.length+'</strong><span>Media images</span></div><div><strong>'+l.length+'</strong><span>Enquiries</span></div><div><strong>'+ (importJob.running?'Import running':'Ready')+'</strong><span>Media importer</span></div></section>';
  const settingsForm='<section class="admin-card"><h2>Website content</h2><p>Update the headline and introduction without touching code.</p><form method="post" action="/admin/settings/">'+formToken+'<label>Homepage headline<input name="heroTitle" maxlength="150" value="'+safe(s.heroTitle||'')+'" placeholder="A fresh look for the heart of your home."></label><label>Homepage introduction<textarea name="heroSubtitle" maxlength="500" rows="3">'+safe(s.heroSubtitle||'')+'</textarea></label><label>Google Search Console verification filename (optional)<input name="googleVerification" maxlength="120" value="'+safe(s.googleVerification||'')+'" placeholder="google123abc.html"></label><button class="btn btn-primary" type="submit">Save changes</button></form></section>';

  const logoControls = '<section class="admin-card brand-settings"><h2>Company logo</h2><p>Upload your own transparent PNG or WebP logo to replace the temporary text branding. A separate light/white variant can be uploaded for the dark footer. JPEG is also accepted. Images are resized and stored locally.</p><div class="logo-setting-grid">' + ['header','footer'].map(which => {
    const file = which === 'header' ? s.headerLogoFile : s.footerLogoFile;
    return '<div class="logo-setting"><div class="logo-preview '+ (which==='footer'?'logo-preview-dark':'') +'">'+
      (file?'<img src="/media/'+encodeURIComponent(file)+'" alt="'+ (which==='footer'?'Footer':'Header') +' logo preview">':'<span>No logo uploaded</span>')+
      '</div><h3>'+(which==='header'?'Header logo':'Footer logo (light version)')+'</h3>'+
      '<form method="post" action="/admin/logo/upload/" enctype="multipart/form-data">'+formToken+
      '<input type="hidden" name="variant" value="'+which+'"><label>Choose logo image <input name="logo" type="file" accept="image/png,image/jpeg,image/webp" required></label>'+
      '<button type="submit" class="btn btn-small">Upload '+which+' logo</button></form>'+
      (file?'<form method="post" action="/admin/logo/remove/">'+formToken+'<input type="hidden" name="variant" value="'+which+'"><button class="btn btn-small danger" type="submit">Remove logo</button></form>':'')+
      '</div>';
  }).join('')+'</div><p class="muted">Logo files are saved in the persistent Docker data volume. They remain in place after subsequent Git pulls or rebuilds.</p></section>';

  const status='<p>'+(importJob.running?'Import is running':importJob.finishedAt?'Last completed: '+new Date(importJob.finishedAt).toLocaleString('en-GB'):'Not run yet')+' · Pages scanned: '+importJob.scanned+' · Images found: '+importJob.discovered+' · Added: '+importJob.imported+' · Skipped: '+importJob.skipped+'</p>'+(importJob.errors.length?'<details><summary>Import warnings ('+importJob.errors.length+')</summary><pre>'+safe(importJob.errors.slice(0,15).join('\n'))+'</pre></details>':'');
  const importer='<section class="admin-card"><h2>Import media from the old website</h2><p>Crawls public pages on kitchensprayexpert.co.uk, finds images (including /images/ paths), downloads them into your own Docker data volume and converts them to optimised WebP. Re-running skips previously imported URLs.</p>'+status+'<form method="post" action="/admin/import-media/">'+formToken+'<button class="btn btn-primary" type="submit" '+(importJob.running?'disabled':'')+'>Import old website images ↗</button></form><p class="muted">Run this while the original website is still live. If some media is missed, upload files below.</p></section>';
  const upload='<section class="admin-card"><h2>Upload an image</h2><form method="post" action="/admin/upload/" enctype="multipart/form-data">'+formToken+'<label>Image (JPEG, PNG, WebP; max 10MB)<input name="photo" type="file" accept="image/jpeg,image/png,image/webp" required></label><label>Accessible description<input name="alt" maxlength="180" placeholder="e.g. Deep green kitchen with shaker cabinet doors"></label><button class="btn btn-primary" type="submit">Upload image</button></form></section>';
  const imageList='<section class="admin-card"><h2>Image library</h2><p>Use “Project” only for pictures verified as the company’s own completed work. Otherwise keep as inspiration.</p>'+(m.length?'<div class="admin-media-grid">'+m.map(x=>'<article><img src="/media/'+encodeURIComponent(x.file)+'" alt="'+safe(x.alt)+'" loading="lazy"><form method="post" action="/admin/media/update/">'+formToken+'<input type="hidden" name="id" value="'+safe(x.id)+'"><label>Description<input name="alt" value="'+safe(x.alt)+'" maxlength="180"></label><label>Category<select name="category">'+['inspiration','project','before','after'].map(y=>'<option value="'+y+'" '+(x.category===y?'selected':'')+'>'+y+'</option>').join('')+'</select></label><label class="consent"><input name="featured" value="yes" type="checkbox" '+(x.featured?'checked':'')+'> Homepage hero</label><button class="btn btn-small" type="submit">Save</button></form><form method="post" action="/admin/media/remove/" onsubmit="return confirm(\'Delete this picture?\')">'+formToken+'<input type="hidden" name="id" value="'+safe(x.id)+'"><button class="btn btn-small danger" type="submit">Delete</button></form></article>').join('')+'</div>':'<p>No images imported yet.</p>')+'</section>';
  const enquires='<section class="admin-card"><h2>Enquiries ('+l.length+')</h2>'+(l.length?l.map(x=>'<details class="lead"><summary><b>'+safe(x.name)+'</b> · '+safe(x.service)+' · '+safe(new Date(x.createdAt).toLocaleString('en-GB'))+'</summary><p><strong>Email:</strong> <a href="mailto:'+encodeURIComponent(x.email)+'">'+safe(x.email)+'</a> · <strong>Tel:</strong> '+safe(x.phone)+' · <strong>Postcode:</strong> '+safe(x.postcode)+'</p><p><strong>Optional extras:</strong> '+safe((x.upgrades||[]).join(', ')||'None requested')+' · <strong>RAL colour:</strong> '+safe(x.ralColour||'Not specified')+'</p><p class="lead-message">'+safe(x.message)+'</p><form method="post" action="/admin/leads/remove/">'+formToken+'<input type="hidden" name="id" value="'+safe(x.id)+'"><button class="btn btn-small danger" type="submit">Delete enquiry</button></form></details>').join(''):'<p>No enquiries received yet.</p>')+'</section>';
  res.send(adminLayout('Site management',info+settingsForm+logoControls+importer+upload+imageList+enquires,notices[req.query.status]));
}
app.get(['/admin/','/admin'],adminOnly,adminPage);
app.post('/admin/settings/',adminOnly,requireCsrf,(req,res)=>{saveSettings(req.body);res.redirect(303,'/admin/?status=saved');});
const uploadFile=multer({storage:multer.memoryStorage(),limits:{fileSize:10*1024*1024,files:1}});
async function processImage(data,origin,alt=''){
  const hash=crypto.createHash('sha256').update(data).digest('hex').slice(0,24);
  const name=hash+'-'+crypto.randomUUID()+'.webp';
  await sharp(data,{limitInputPixels:45000000}).rotate().resize({width:1800,height:1800,fit:'inside',withoutEnlargement:true}).webp({quality:82,effort:4}).toFile(path.join(uploadsDir,name));
  const added=addMedia({file:name,source:origin||'',alt:alt.slice(0,180)});
  if(!added){fs.unlinkSync(path.join(uploadsDir,name));return false;}
  return true;
}
app.post('/admin/upload/',adminOnly,uploadFile.single('photo'),async(req,res)=>{
  if(req.body.csrf!==res.locals.csrf)return res.status(403).send('Invalid security token');
  if(!req.file)return res.status(400).send('Choose a picture');
  try{await processImage(req.file.buffer,'',String(req.body.alt||''));res.redirect(303,'/admin/?status=uploaded');}
  catch(e){res.status(400).send('Unable to process this image: '+safe(e.message));}
});

const logoUpload = multer({ storage: multer.memoryStorage(), limits: {fileSize: 6*1024*1024, files: 1} });
app.post('/admin/logo/upload/',adminOnly,logoUpload.single('logo'),async(req,res)=>{
  if(req.body.csrf !== res.locals.csrf)return res.status(403).send('Invalid security token');
  const which = req.body.variant;
  if(!['header','footer'].includes(which))return res.status(400).send('Invalid logo location');
  if(!req.file)return res.status(400).send('Choose a logo image.');
  const mime = req.file.mimetype;
  if(!['image/jpeg','image/png','image/webp'].includes(mime))return res.status(415).send('Please upload PNG, JPEG or WebP. SVG is not accepted for security reasons.');
  const filename = 'logo-'+crypto.randomUUID()+'.webp';
  const destination = path.join(uploadsDir,filename);
  try{
    await sharp(req.file.buffer,{limitInputPixels:35000000}).rotate()
      .resize({width:1100,height:400,fit:'inside',withoutEnlargement:true})
      .webp({lossless:true,effort:4}).toFile(destination);
    try {saveLogoFile(which,filename);}
    catch(error){try{fs.unlinkSync(destination);}catch{}throw error;}
    res.redirect(303,'/admin/?status=logoSaved');
  }catch(error){console.error('Logo upload failed:',error);res.status(400).send('Unable to process logo. Try a valid PNG, JPEG or WebP image.');}
});
app.post('/admin/logo/remove/',adminOnly,requireCsrf,(req,res)=>{
  if(!['header','footer'].includes(req.body.variant))return res.status(400).send('Invalid logo location');
  deleteLogoFile(req.body.variant);
  res.redirect(303,'/admin/?status=logoRemoved');
});

app.post('/admin/media/update/',adminOnly,requireCsrf,(req,res)=>{
  updateMedia(String(req.body.id||''),{alt:String(req.body.alt||''),category:String(req.body.category||''),featured:req.body.featured==='yes'});
  res.redirect(303,'/admin/?status=changed');
});
app.post('/admin/media/remove/',adminOnly,requireCsrf,(req,res)=>{removeMedia(String(req.body.id||''));res.redirect(303,'/admin/?status=removed');});
app.post('/admin/leads/remove/',adminOnly,requireCsrf,(req,res)=>{
  const id=String(req.body.id||'');
  // Deletion is handled below by a store operation.
  deleteLead(id);
  res.redirect(303,'/admin/?status=deleted');
});
const sourceOrigin='https://kitchensprayexpert.co.uk';
function validSource(u){
  try{const x=new URL(u,sourceOrigin);return x.protocol==='https:' && ['kitchensprayexpert.co.uk','www.kitchensprayexpert.co.uk'].includes(x.hostname) && !x.username && !x.password ? x.href : null;}catch{return null;}
}
async function remote(url,bytes=10*1024*1024) {
  const valid=validSource(url);if(!valid)throw new Error('Unexpected source host');
  const res=await fetch(valid,{redirect:'manual',signal:AbortSignal.timeout(12000),headers:{'User-Agent':'KitchenSprayingExpertMediaMigrator/1.0'}});
  if(!res.ok)throw new Error('HTTP '+res.status+' '+valid);
  if(Number(res.headers.get('content-length')||0)>bytes)throw new Error('File too large');
  const chunks=[];let total=0;
  for await(const chunk of res.body){total+=chunk.length;if(total>bytes)throw new Error('Response exceeded size limit');chunks.push(chunk);}
  return {buf:Buffer.concat(chunks),type:res.headers.get('content-type')||''};
}
function candidate(u) {
  const url=validSource(u);if(!url)return null;
  const p=new URL(url).pathname.toLowerCase();
  if(!/\.(jpg|jpeg|png|webp)(?:$)/.test(p))return null;
  if(/(logo|icon|favicon|sprite|flag|avatar|tracking|placeholder)/i.test(p))return null;
  return url;
}
async function runImport(){
  const job=importJob={running:true,scanned:0,discovered:0,imported:0,skipped:0,errors:[],finishedAt:null};
  try{
    const pages=['/','/how-it-works/','/contact/','/gallery/','/about/','/our-work/','/projects/'];
    const seenPages=new Set(), images=new Map();
    while(pages.length && seenPages.size<18 && images.size<180){
      const url=validSource(pages.shift());if(!url||seenPages.has(url))continue;
      seenPages.add(url);
      try{
        const {buf,type}=await remote(url,5*1024*1024);
        if(!type.includes('text/html'))continue;
        job.scanned++;
        const $=cheerio.load(buf.toString('utf8'));
        $('img,source').each((_,elem)=>{
          for(const attr of ['src','data-src','data-lazy-src','data-original']){
            const raw=$(elem).attr(attr);if(!raw)continue;
            const img=candidate(raw);if(img)images.set(img,($(elem).attr('alt')||'').slice(0,180));
          }
          const srcset=$(elem).attr('srcset')||$(elem).attr('data-srcset');
          if(srcset)for(const part of srcset.split(',')){
            const img=candidate(part.trim().split(/\s+/)[0]);if(img)images.set(img,($(elem).attr('alt')||'').slice(0,180));
          }
        });
        $('meta[property="og:image"], meta[name="twitter:image"]').each((_,elem)=>{
          const img=candidate($(elem).attr('content'));if(img)images.set(img,'');
        });
        $('[style*="background"]').each((_,elem)=>{
          const str=$(elem).attr('style')||'';
          const result=/url\(["']?([^"')]+)/i.exec(str);
          if(result){const img=candidate(result[1]);if(img)images.set(img,'');}
        });
        $('a[href]').each((_,elem)=>{
          const next=validSource($(elem).attr('href'));
          if(next && !next.includes('?') && !seenPages.has(next) && pages.length<25 && !/\.(pdf|jpg|png|zip|webp|jpeg|xml)$/i.test(next))pages.push(next);
        });
      }catch(err){job.errors.push('Page '+url+': '+err.message);}
    }
    job.discovered=images.size;
    for(const [url,alt] of images){
      if(job.imported>=50)break;
      if(media().some(x=>x.source===url)){job.skipped++;continue;}
      try{
        const {buf,type}=await remote(url,12*1024*1024);
        if(!type.startsWith('image/') && type!=='application/octet-stream')throw new Error('Not an image');
        if(await processImage(buf,url,alt))job.imported++;else job.skipped++;
      }catch(err){job.errors.push('Image '+url+': '+err.message);}
    }
  }catch(err){job.errors.push(err.message);}
  finally{job.running=false;job.finishedAt=new Date().toISOString();}
}
app.post('/admin/import-media/',adminOnly,requireCsrf,(req,res)=>{
  if(!importJob.running)void runImport();
  res.redirect(303,'/admin/?status=started');
});
app.get(['/admin/login','/admin/logout'],(req,res)=>res.redirect(301,req.path+'/'));
app.get('*',(req,res)=>{
  if(req.path.startsWith('/admin/'))return res.status(404).send('Not found');
  let urlPath=req.path;
  if(urlPath!=='/' && !urlPath.endsWith('/') && !path.extname(urlPath))return res.redirect(301,urlPath+'/'+(req.url.includes('?')?req.url.substring(req.url.indexOf('?')):''));
  const html=render(urlPath,media(),req.query,settings(),preview,siteKey);
  if(!html)return res.status(404).send(render('/',media(),{},settings(),preview,siteKey).replace('<main id="main">','<main id="main"><div class="wrap not-found"><h1>Page not found</h1><p>Let us help you find what you need.</p><a href="/" class="btn btn-primary">Back to home</a></div>'));
  res.type('html').send(html);
});
app.use((err,req,res,next)=>{
  if(err instanceof multer.MulterError)return res.status(400).send('Upload error: '+safe(err.message));
  console.error('Unhandled request error:',err);
  if(res.headersSent)return next(err);
  res.status(500).send('Something went wrong. Please try again or contact us.');
});
app.listen(port,'0.0.0.0',()=>console.log('Kitchen Spraying Expert listening on '+port+' ('+(preview?'PREVIEW / NOINDEX':'PUBLIC / INDEXABLE')+')'));
