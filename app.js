/* International Education Egypt — Arabic Grade 6 Interactive Assessments
   قاعدة أسئلة موحدة (BANK) تُعرض بثلاث طرق: التقييمات الأسبوعية، التدريب حسب المهارة، منشئ الامتحانات */
"use strict";
(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const AR=n=>String(n).replace(/\d/g,d=>"٠١٢٣٤٥٦٧٨٩"[d]);
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};

/* ---------- metadata ---------- */
const SKILLS=[
 {k:"النحو",c:"#C2410C",g:"ن"},{k:"القراءة",c:"#0E7C7B",g:"ق"},{k:"النصوص",c:"#8B3A8F",g:"ش"},
 {k:"الإملاء",c:"#3B7D23",g:"ء"},{k:"الأساليب اللغوية",c:"#A16207",g:"أ"},{k:"الاستماع",c:"#B8860B",g:"س"},
 {k:"الكتابة",c:"#9F1239",g:"ك"},{k:"التحدث",c:"#0B5CAD",g:"ح"},{k:"الخط",c:"#5B4636",g:"خ"},{k:"تقييم تشخيصي",c:"#475569",g:"ت"}];
const SK=Object.fromEntries(SKILLS.map((s,i)=>[s.k,{...s,i}]));
const WEEK_LABEL={1:"الأسبوع الأول",2:"الأسبوع الثاني",3:"الأسبوع الثالث",4:"الأسبوع الرابع",5:"الأسبوع الخامس",6:"الأسبوع السادس",7:"الأسبوع السابع",8:"الأسبوع الثامن",9:"الأسبوع التاسع",10:"الأسبوع العاشر",11:"الأسبوع الحادي عشر",12:"الأسبوع الثاني عشر",13:"الأسبوع الثالث عشر",14:"الأسبوع الرابع عشر",R1:"مراجعة عامة على الوحدة الأولى",R2:"مراجعة عامة على الوحدة الثانية",R3:"مراجعة عامة على الوحدة الثالثة",RF:"مراجعة عامة على الفصل الدراسي"};
const PERIOD_NAME={0:"المراجعة العامة",1:"الفترة الأولى",2:"الفترة الثانية",3:"الفترة الثالثة",4:"الفترة الرابعة"};
const PERIODS={
 1:["تقييم تشخيصي","نص الاستماع «سمر تطور نفسها»","القواعد النحوية (مراجعة على ما سبق دراسته)","التقييم الأسبوعي"],
 2:["القراءة: درس (كنز لا يقدر بثمن)","القواعد النحوية (الاسم النكرة والاسم المعرفة)","القواعد الإملائية (الهمزة المتوسطة على الألف)","التقييم الأسبوعي"],
 3:["الكتابة – كتابة نص معلوماتي","القراءة: نص «اصنع قرارك»","القواعد النحوية (أنواع المعارف)","التقييم الأسبوعي"],
 4:["تطبيقات على (أنواع المعارف)","تطبيقات على (الهمزة المتوسطة على الألف)","التحدث: نشاط «اصنع قرارك»","التقييم الأسبوعي"],
 5:["تطبيقات على (كتابة نص معلوماتي)","النص الشعري (إلى الشباب)","نص شعري (إلى الشباب)","التقييم الأسبوعي"],
 6:["استماع: من هم الناجحون؟","نحو: الأسماء الخمسة وعلاماتها","تحدث: أثر الكلمة","موعد الاختبار الشهري"],
 7:["قراءة: قوة الكلمات","إملاء: الهمزة المتوسطة على الياء","كتابة: كتابة التقرير","التقييم الأسبوعي"],
 8:["قراءة: سر القوة والنجاح","تطبيقات الأسماء الخمسة","تحدث: كن مسئولًا","التقييم الأسبوعي"],
 9:["تطبيقات كتابة التقرير","نص شعري: بناة المجد","نحو: أنواع الخبر","التقييم الأسبوعي"],
 10:["استماع: من الخيال إلى الواقع","نحو: كان وأخواتها","تحدث: التكنولوجيا في حياتي","التقييم الأسبوعي"],
 11:["قراءة: من وراء الكاميرا؟","تطبيقات كان وأخواتها","إملاء: الهمزة المتوسطة على الواو","التقييم الأسبوعي"],
 12:["قراءة: رحلة إلى المستقبل","نحو: إن وأخواتها","تحدث: حلم يصنع مستقبلًا","التقييم الأسبوعي"],
 13:["نص شعري: سعادة الأوطان","تطبيقات إن وأخواتها","تطبيقات الهمزة على الواو","التقييم الأسبوعي"],
 14:["(تابع) سعادة الأوطان","مراجعة عامة على النحو","تطبيقات الهمزة المتوسطة","التقييم الأسبوعي"]};
const UNITS=[{n:"الوحدة الأولى",t:"أطور ذاتي",weeks:[1,2,3,4,5,"R1"]},{n:"الوحدة الثانية",t:"أنا مسئول",weeks:[6,7,8,9,"R2"]},{n:"الوحدة الثالثة",t:"العلم والخيال والمستقبل",weeks:[10,11,12,13,14,"R3","RF"]}];
const KIND_LABEL={class:"أولًا: الأداءات الصفية",home:"ثانيًا: الأداءات المنزلية",assess:"التقييم الأسبوعي",review:"مراجعة عامة"};
const TYPE_LABEL={mcq:"اختيار من متعدد",kw:"إجابة قصيرة / أكمل",multi:"أكمل الجدول / فراغات متعددة",set:"استخرج",pick:"ضع خطًّا تحت",copy:"الخط (نسخ)",essay:"تعبير وكتابة",order:"ترتيب",sort:"تصنيف",blanks:"أكمل بالكلمة المناسبة",teacher:"يصححه المعلم"};
const TYPE_MIN={mcq:.75,kw:1.5,multi:2.5,set:3,pick:.75,copy:2,essay:12,order:1.5,sort:4,blanks:3,teacher:2};
const wk=w=>String(w);
const AVAILABLE_WEEKS=[...new Set(BANK.map(b=>wk(b.w)))];

/* ---------- index & validation ---------- */
const BLOCK=Object.fromEntries(BANK.map(b=>[b.id,b]));
const ITEMS=[]; // flat list of {key,b,i,it}
BANK.forEach(b=>b.items.forEach((it,i)=>{ if(it.t) ITEMS.push({key:b.id+"#"+i,b,i,it}); }));
const IT=Object.fromEntries(ITEMS.map(x=>[x.key,x]));
const scorable=it=>it.t!=="teacher"&&!it.v;
const VALIDATION=(()=>{const errs=[];const ids=new Set();
 BANK.forEach(b=>{ if(ids.has(b.id))errs.push("معرّف مكرر "+b.id); ids.add(b.id);
  if(!SK[b.sec])errs.push(b.id+": مهارة غير معروفة "+b.sec);
  if(b.passage&&b.passage.startsWith("P_")&&!PASSAGES[b.passage])errs.push(b.id+": نص مفقود");
  b.items.forEach((it,i)=>{const k=b.id+"#"+i; if(!it.t)return;
   if(!TYPE_LABEL[it.t])errs.push(k+": نوع غير معروف");
   if(it.t==="mcq"&&!(it.opts&&it.a>=0&&it.a<it.opts.length))errs.push(k+": إجابة اختيار غير صالحة");
   if(it.t==="kw"&&!(it.kw&&it.kw.length))errs.push(k+": كلمات مفتاحية مفقودة");
   if(it.t==="multi"&&!(it.fields&&it.fields.every(f=>f.kw&&f.kw.length)))errs.push(k+": حقول ناقصة");
   if(it.t==="essay"&&!MODELS[it.model])errs.push(k+": نموذج تعبير مفقود "+it.model);
   if(it.t==="pick"&&!(it.a&&it.a.every(x=>x<it.q.split(/\s+/).length)))errs.push(k+": موضع غير صالح");
   if(it.t==="order"&&!(it.a&&it.a.length===it.opts.length))errs.push(k+": ترتيب غير صالح");
   if(it.t==="blanks"&&!(it.a&&it.a.every(x=>it.opts.includes(x))))errs.push(k+": فراغات غير صالحة");
   if(it.t==="sort"&&!(it.words&&it.words.every(w=>w[1]<it.cats.length)))errs.push(k+": تصنيف غير صالح");
  });});
 if(errs.length)console.warn("Validation:",errs);return errs;})();

/* ---------- lessons (Mode B) ---------- */
const LESSONS=[];const LKEY={};
BANK.forEach(b=>{const key=b.sec+"|"+b.lesson; if(!LKEY[key]){LKEY[key]={idx:LESSONS.length,key,sec:b.sec,lesson:b.lesson,weeks:new Set(),blocks:[]};LESSONS.push(LKEY[key]);} LKEY[key].weeks.add(wk(b.w)); LKEY[key].blocks.push(b);});
LESSONS.forEach(L=>{L.items=ITEMS.filter(x=>L.blocks.includes(x.b));L.nScore=L.items.filter(x=>scorable(x.it)).length;});
const lessonOf=b=>LKEY[b.sec+"|"+b.lesson];

/* ---------- normalization & grading ---------- */
const TASHKEEL=/[ً-ٰٟـ]/g;
function norm(s,strict){ s=String(s||"").replace(TASHKEEL,"").replace(/[«»"'“”()\[\]{}.,،؛;:!؟?\-–—_*\/\\]/g," ");
 s=s.replace(/ى/g,"ي");
 if(!strict){ s=s.replace(/[أإآٱ]/g,"ا").replace(/ة/g,"ه").replace(/ؤ/g,"و").replace(/ئ/g,"ي").replace(/ء/g,""); }
 return s.replace(/\s+/g," ").trim(); }
function kwMatch(ans,kw,strict,no,min){ const a=" "+norm(ans,strict)+" "; if(!a.trim())return false;
 if(min&&a.trim().split(" ").length<min)return false;
 if(no&&no.some(n=>n==="ال"?a.split(" ").some(w=>w.startsWith("ال")):a.includes(norm(n,strict))))return false;
 return kw.every(g=>g.some(alt=>alt==="*"?a.trim().length>0:a.includes(norm(alt,strict)))); }
const wordsOf=s=>norm(s,false).split(" ").filter(Boolean);
function grade(it,v){
 switch(it.t){
  case"mcq":return{ok:v===it.a};
  case"kw":return{ok:kwMatch(v,it.kw,it.st,it.no,it.min)};
  case"multi":{const parts=it.fields.map((f,i)=>kwMatch((v||[])[i],f.kw,f.st||it.st,f.no));return{ok:parts.every(Boolean),parts};}
  case"set":{const parts=[];let ok=true;it.groups.forEach((g,gi)=>{const used=new Set();const vals=(v||[])[gi]||[];const p=[];
    for(let k=0;k<g.n;k++){const s=vals[k]||"";const hit=g.opts.findIndex((o,oi)=>!used.has(oi)&&kwMatch(s,o.kw));if(hit>=0){used.add(hit);p.push(true)}else{p.push(false);ok=false}}parts.push(p)});return{ok,parts};}
  case"pick":{const s=new Set(v||[]);return{ok:s.size===it.a.length&&it.a.every(x=>s.has(x))};}
  case"copy":{const a=norm(v,false),b=norm(it.text,false);return{ok:!!a&&a===b};}
  case"essay":{const ws=wordsOf(v);const txt=" "+ws.join(" ")+" ";const hits=it.kw.filter(k=>txt.includes(norm(k,false))).length;return{ok:ws.length>=it.min&&hits>=it.need,wc:ws.length,hits};}
  case"order":return{ok:Array.isArray(v)&&v.length===it.a.length&&v.every((x,i)=>x===it.a[i])};
  case"sort":{const parts=it.words.map((w,i)=>v&&v[i]===w[1]);return{ok:parts.every(Boolean),parts};}
  case"blanks":{const parts=it.a.map((x,i)=>(v||[])[i]===x);return{ok:parts.every(Boolean),parts};}
  case"teacher":return{ok:null};
 }return{ok:false};}
function isAnswered(it,v){ if(v==null)return false;
 switch(it.t){case"mcq":return v>=0;case"kw":case"copy":case"essay":return String(v).trim().length>0;
  case"multi":return Array.isArray(v)&&v.some(x=>x&&x.trim());case"set":return Array.isArray(v)&&v.some(g=>g&&g.some(x=>x&&x.trim()));
  case"pick":return v.length>0;case"order":return v.length===it.opts.length;case"sort":return Object.keys(v).length===it.words.length;
  case"blanks":return Array.isArray(v)&&v.filter(Boolean).length===it.a.length;case"teacher":return v===true;}return false;}
function answerText(it){
 switch(it.t){case"mcq":return it.opts[it.a];case"kw":return it.ans;
  case"multi":return it.fields.map(f=>`${f.l}: ${f.ans}`).join(" — ");
  case"set":return it.groups.map(g=>`${g.l}: `+g.opts.map(o=>o.ans).join("، ")).join(" | ");
  case"pick":{const w=it.q.split(/\s+/);return it.a.map(i=>w[i]).join("، ")+(it.ans&&it.ans!==it.a.map(i=>w[i]).join("، ")?` (${it.ans})`:"");}
  case"copy":return it.text;case"essay":return "انظر نموذج التعبير";
  case"order":return it.a.join(" ← ");case"sort":return it.cats.map((c,ci)=>c+": "+(it.words.filter(w=>w[1]===ci).map(w=>w[0]).join("، ")||"—")).join(" | ");
  case"blanks":return it.a.join(" – ");case"teacher":return it.ans;}return "";}

/* ---------- state & persistence ---------- */
const LS_KEY="iee-ar6-v1";
let S={ans:{},pts:0,badges:[],exams:[],last:null,v:1};
try{const raw=localStorage.getItem(LS_KEY);if(raw)S=Object.assign(S,JSON.parse(raw));}catch(e){}
let cloud=null,saveT=null,saving=false,dirty=false;
function save(){ try{localStorage.setItem(LS_KEY,JSON.stringify(S));}catch(e){} dirty=true; clearTimeout(saveT); saveT=setTimeout(flush,1200); }
async function flush(){ if(!cloud||saving||!dirty)return; saving=true;dirty=false; try{await cloud.set({state:JSON.stringify(S),at:Date.now()});}catch(e){ if(e&&e.code==="unavailable"){dirty=true;} else if(e&&(e.code==="invalid_argument"||e.code==="revoked"))cloud=null; } saving=false; if(dirty)saveT=setTimeout(flush,1500); }
(async()=>{ try{ if(!window.claude||!window.claude.use)return; const db=await window.claude.use("db"); const user=await window.claude.use("user"); if(!db||!user)return; const id=await user.id(); if(!id)return;
  const ref=db.collection("data/users/"+id).doc("progress"); const snap=await ref.get(); cloud=ref;
  if(snap.exists){const d=snap.data();try{const remote=JSON.parse(d.state); const rc=Object.keys(remote.ans||{}).length, lc=Object.keys(S.ans).length;
   if(rc>=lc){S=Object.assign({ans:{},pts:0,badges:[],exams:[]},remote);try{localStorage.setItem(LS_KEY,JSON.stringify(S));}catch(e){} updatePts(); if(!SESSION)route();} else {dirty=true;flush();}}catch(e){}}
  else if(Object.keys(S.ans).length){dirty=true;flush();}
 }catch(e){} })();

/* ---------- UI helpers ---------- */
function toast(msg){const t=document.createElement("div");t.className="toast";t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2600);}
function confetti(){ if(matchMedia("(prefers-reduced-motion: reduce)").matches)return; const c=document.createElement("div");c.className="confetti";const cols=["#F4B400","#0D2C83","#C2410C","#0E7C7B","#8B3A8F","#3B7D23"];
 for(let i=0;i<70;i++){const p=document.createElement("i");p.style.left=Math.random()*100+"%";p.style.background=cols[i%cols.length];p.style.animationDelay=Math.random()*.6+"s";p.style.animationDuration=1.2+Math.random()+"s";c.appendChild(p);} document.body.appendChild(c);setTimeout(()=>c.remove(),2600);}
function modal(html,buttons){return new Promise(res=>{const bg=document.createElement("div");bg.className="modal-bg";bg.innerHTML=`<div class="modal" role="dialog" aria-modal="true">${html}<div class="row" style="margin-top:18px;justify-content:flex-start"></div></div>`;
 const row=$(".row",bg);buttons.forEach(([label,val,cls])=>{const b=document.createElement("button");b.className="btn "+(cls||"");b.textContent=label;b.onclick=()=>{bg.remove();res(val)};row.appendChild(b);});
 bg.addEventListener("click",e=>{if(e.target===bg){bg.remove();res(null)}});document.body.appendChild(bg);row.firstChild&&row.firstChild.focus();});}
function updatePts(bump){$("#ptsN").textContent=AR(S.pts);if(bump){const p=$("#pts");p.classList.remove("bump");void p.offsetWidth;p.classList.add("bump");}}
function ring(p,size=54,stroke=6,col="var(--navy)"){const r=(size-stroke)/2,c=2*Math.PI*r;return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="ring" aria-hidden="true"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--paper2)" stroke-width="${stroke}"/><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${col}" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-p)}" transform="rotate(-90 ${size/2} ${size/2})"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-size="${size/4}" font-weight="700" fill="var(--ink)" font-family="IBM Plex Sans Arabic">${AR(Math.round(p*100))}٪</text></svg>`;}
const pct=(a,b)=>b?Math.round(a/b*100):0;
const fmtQ=s=>esc(s).replace(/\[([^\]]+)\]/g,"<u>$1</u>");
function listenHTML(b){ if(!b.listen)return""; const t=PASSAGES[b.listen]; if(!t)return"";
 return `<details class="model listen" style="margin:12px 18px 0"><summary>🎧 نص الاستماع «سمر تطور نفسها» — من كتاب الطالب ص ١٤٦</summary><div class="rules"><button type="button" class="btn sm" data-speak="${b.listen}">▶ استمع إلى النص</button><button type="button" class="btn soft sm" data-stop="1">■ إيقاف</button><span class="muted" style="font-size:13px;align-self:center">يُفضَّل أن يقرأه المعلم أو ولي الأمر، ثم يجيب الطالب دون النظر إلى النص.</span></div><div class="mt">${esc(t)}</div></details>`;}
function passageHTML(b){ let p=b.passage; if(!p)return""; if(p.startsWith("P_"))p=PASSAGES[p];
 return `<div style="margin:14px 18px 0;display:flex;justify-content:flex-end"><button type="button" class="readbtn" data-readp="${b.id}" title="اقرأ النص"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg><span>${b.poem?"اقرأ الأبيات":"اقرأ النص"}</span></button></div>`+passageBody(b,p);}
function passageBody(b,p){
 if(b.poem){const rows=p.split("\n").map(l=>l.split("***").map(s=>s.trim()));return `<div class="passage"><div class="poem">${rows.map(r=>`<div>${esc(r[0])}</div><div class="st">***</div><div>${esc(r[1]||"")}</div>`).join("")}</div></div>`;}
 return `<div class="passage">${esc(p).replace(/\n/g,"<br>")}</div>`;}

/* ---------- progress stats ---------- */
function stats(items){let total=0,att=0,ok=0;items.forEach(x=>{if(!scorable(x.it))return;total++;const a=S.ans[x.key];if(a&&a.done){att++;if(a.ok)ok++;}});return{total,att,ok,bad:att-ok,comp:total?att/total:0,acc:att?ok/att:null};}
const weekItems=w=>ITEMS.filter(x=>wk(x.b.w)===wk(w));
const skillItems=s=>ITEMS.filter(x=>x.b.sec===s);

/* ---------- badges ---------- */
const BADGES=[
 {id:"first",n:"البداية",d:"أول إجابة صحيحة",g:"١"},{id:"ten",n:"منطلق",d:"١٠ إجابات صحيحة",g:"١٠"},{id:"fifty",n:"مثابر",d:"٥٠ إجابة صحيحة",g:"٥٠"},{id:"hundred",n:"نجم العربية",d:"١٠٠ إجابة صحيحة",g:"★"},
 {id:"week",n:"أسبوع مكتمل",d:"أتممت أسبوعًا كاملًا",g:"أ"},{id:"perfect",n:"بلا أخطاء",d:"درس كامل بدرجة ١٠٠٪",g:"✓"},{id:"writer",n:"الكاتب",d:"أول موضوع تعبير مقبول",g:"ك"},
 {id:"calli",n:"الخطاط",d:"٥ تمارين خط صحيحة",g:"خ"},{id:"exam",n:"الممتحن",d:"أنهيت أول امتحان",g:"م"},{id:"exam90",n:"المتفوق",d:"٩٠٪ أو أكثر في امتحان",g:"٩٠"}];
function checkBadges(){const before=new Set(S.badges);const okCount=Object.values(S.ans).filter(a=>a.done&&a.ok).length;const give=id=>{if(!before.has(id)){S.badges.push(id);before.add(id);const b=BADGES.find(x=>x.id===id);toast("🏅 وسام جديد: "+b.n);confetti();}};
 if(okCount>=1)give("first");if(okCount>=10)give("ten");if(okCount>=50)give("fifty");if(okCount>=100)give("hundred");
 if(AVAILABLE_WEEKS.some(w=>{const s=stats(weekItems(w));return s.total&&s.att===s.total}))give("week");
 if(LESSONS.some(L=>{const s=stats(L.items);return s.total>=3&&s.ok===s.total}))give("perfect");
 if(ITEMS.some(x=>x.it.t==="essay"&&S.ans[x.key]&&S.ans[x.key].ok))give("writer");
 if(ITEMS.filter(x=>x.it.t==="copy"&&S.ans[x.key]&&S.ans[x.key].ok).length>=5)give("calli");
 if(S.exams.some(e=>e.result))give("exam");if(S.exams.some(e=>e.result&&e.result.pct>=90))give("exam90");}

/* ---------- nav & routing ---------- */
const ICON={home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
 weeks:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>',
 skills:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19V5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2zM8 7h6M8 11h6"/></svg>',
 exams:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l2 2 4-4"/><rect x="4" y="3" width="16" height="18" rx="2"/></svg>',
 progress:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
 key:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3"/></svg>'};
const NAV=[["home","الصفحة الرئيسية","الرئيسية"],["weeks","التقييمات الأسبوعية","الأسبوعية"],["skills","التدريب حسب المهارة","المهارات"],["exams","الاختبارات","الاختبارات"],["progress","نتائجي وتقدمي","تقدمي"],["key","دليل الإجابات","الإجابات"]];
const mob=()=>matchMedia("(max-width:720px)").matches;
function drawNav(cur){$("#nav").innerHTML=NAV.map(([h,l,s])=>`<a href="#${h}" class="${cur===h?"on":""}" ${cur===h?'aria-current="page"':""}>${ICON[h]}<span>${mob()?s:l}</span></a>`).join("");}
let SESSION=null,TIMER=null;
let ROUTING=false;
let PREV_SESSION=null;
function route(){ if(ROUTING)return; ROUTING=true; if(SESSION&&/^#study-/.test(location.hash))PREV_SESSION=SESSION; try{ const ae=document.activeElement; if(ae&&ae!==document.body&&ae.blur)ae.blur(); routeInner(); } finally { ROUTING=false; } }
function routeInner(){ const h=(location.hash||"#home").slice(1); if(h!=="run"&&SESSION){if(SESSION.submitted&&h!=="home"&&window.malek)malek.goodbye();endSessionSilently();}
 const [r,arg]=(()=>{const m=h.match(/^([a-z]+)-?([\w-]*)$/i);return m?[m[1],m[2]]:["home",""]})();
 const navCur={study:"skills",home:"home",weeks:"weeks",week:"weeks",skills:"skills",skill:"skills",lesson:"skills",exams:"exams",progress:"progress",key:"key",run:SESSION?SESSION.nav:"home"}[r]||"home";
 drawNav(navCur); const app=$("#app"); window.scrollTo(0,0);
 const V={study:()=>vStudy(arg),home:vHome,weeks:vWeeks,week:()=>vWeek(arg),skills:vSkills,skill:()=>vSkill(+arg),lesson:()=>vLesson(+arg),exams:vExams,progress:vProgress,key:vKey,run:vRun}[r]||vHome;
 if(r==="run"&&!SESSION){setTimeout(()=>{location.hash="#home";});return;}
 app.innerHTML=`<div class="view">${V()}</div>`; bindView(r,arg); }
window.addEventListener("hashchange",route);
window.addEventListener("resize",()=>{const on=$("#nav a.on");drawNav(on?on.getAttribute("href").slice(1):"home");});
function endSessionSilently(){clearInterval(TIMER);TIMER=null;SESSION=null;}

/* ---------- views ---------- */
function vHome(){ const all=stats(ITEMS); const lastW=AVAILABLE_WEEKS.find(w=>{const s=stats(weekItems(w));return s.att<s.total})||AVAILABLE_WEEKS[0];
 return `<section class="hero"><div class="hero-txt"><div class="eyebrow">الفصل الدراسي الأول · كتاب الأداءات والتقييمات</div>
 <h1>تدرّب على كل أسئلة كتابك<br>واعرف مستواك فورًا</h1>
 <p>جميع أسئلة كتاب «الأداءات والتقييمات» للصف السادس الابتدائي، بترتيبها الأصلي أسبوعًا بأسبوع، أو مجمّعة حسب المهارة والدرس، مع تصحيح فوري ودليل إجابات ونماذج تعبير.</p>
 <div class="stat-row"><div class="stat"><b>${AR(stats(ITEMS).total)}</b><span>سؤالًا يُصحح تلقائيًا</span></div><div class="stat"><b>${AR(AVAILABLE_WEEKS.filter(w=>!/^R/.test(w)).length)}</b><span>أسبوعًا + مراجعات</span></div><div class="stat"><b>${AR(LESSONS.length)}</b><span>درسًا ومهارة</span></div><div class="stat"><b>${AR(pct(all.att,all.total))}٪</b><span>نسبة إنجازك</span></div></div>
 <div class="row"><a class="btn gold" href="#week-${lastW.toLowerCase()}">${all.att?"تابع من حيث توقفت":"ابدأ الأسبوع الأول"} ←</a><a class="btn ghost" href="#exams">أنشئ امتحانًا</a></div></div>
 <div class="hero-art" aria-hidden="true"><div class="glyphs"><span>ض</span><span>ع</span><span>ر</span><span>ب</span><span>ي</span><span>ة</span><span>ق</span><span>ل</span><span>م</span><span>ن</span><span>ح</span><span>و</span></div>
 <div class="big">لُغتي<br><em>هُوِيّتي</em></div><div class="sub">International Education Egypt</div></div></section>
 <div class="modes"><a class="mode a" href="#weeks"><span class="n">١</span><h3>التقييمات الأسبوعية</h3><p>حلّ كل أسبوع كما في الكتاب المطبوع: الفترات الأربع والمجموعات (أ، ب، ج) بالترتيب الأصلي.</p><span class="go">ادخل ←</span></a>
 <a class="mode b" href="#skills"><span class="n">٢</span><h3>التدريب حسب المهارة</h3><p>النحو، القراءة، النصوص، الإملاء… كل الأسئلة مجمّعة حسب الدرس من جميع الأسابيع.</p><span class="go">ادخل ←</span></a>
 <a class="mode c" href="#exams"><span class="n">٣</span><h3>منشئ الامتحانات الذكي</h3><p>اختر الدروس وعدد الأسئلة والمدة، واحصل على امتحان من أسئلة الكتاب فقط.</p><span class="go">ادخل ←</span></a></div>
 <div class="panel"><h3>كيف تُصحَّح الإجابات؟</h3><p class="muted" style="margin:0">أسئلة الاختيار والترتيب والتصنيف تُصحح آليًّا. الإجابات المكتوبة تُعدّ صحيحة إذا احتوت على <b>الكلمات المفتاحية</b> للإجابة. أسئلة الإملاء تُصحح بدقة رسم الهمزة. أسئلة التعبير تُقبل إذا حققت عدد الكلمات المطلوب وتضمنت عناصر الموضوع، ويظهر بعدها نموذج كامل (≈٣٠٠ كلمة). البنود المعلّمة <span class="vflag">مراجعة المعلم</span> إجاباتها مقترحة ولا تدخل في الدرجة.</p></div>`;}

function weekCard(w){ const has=AVAILABLE_WEEKS.includes(wk(w)); const s=stats(weekItems(w)); const label=WEEK_LABEL[w];
 const isR=String(w).startsWith("R"); const per=PERIODS[w];
 if(!has)return `<div class="wk" style="opacity:.55" aria-disabled="true"><span class="num">${isR?"م":AR(w)}</span><span class="t">${label}</span>${per?`<ul>${per.slice(0,3).map(p=>`<li>${esc(p)}</li>`).join("")}</ul>`:""}<span class="chip">قريبًا – الدفعة التالية</span></div>`;
 return `<a class="wk" href="#week-${String(w).toLowerCase()}"><span class="num">${isR?"م":AR(w)}</span><span class="t">${label}</span>${per?`<ul>${per.slice(0,3).map(p=>`<li>${esc(p)}</li>`).join("")}</ul>`:'<ul><li>الاستماع · القراءة · النحو والإملاء · النص الشعري</li></ul>'}
 <div class="row" style="justify-content:space-between;font-size:13px;color:var(--ink2)"><span>${AR(s.att)} / ${AR(s.total)} سؤال</span><span>${AR(pct(s.att,s.total))}٪</span></div><div class="bar"><i style="width:${pct(s.att,s.total)}%"></i></div>${s.total&&s.att===s.total?'<span class="chip ok badge-done">مكتمل</span>':""}</a>`;}
function vWeeks(){ return `<div class="eyebrow">الوضع (أ)</div><h1>التقييمات الأسبوعية</h1><p class="muted">كل أسبوع بأسئلته وترتيبه الأصلي كما في الكتاب. جميع الأسابيع الأربعة عشر والمراجعات العامة متاحة.</p>
 ${UNITS.map(u=>`<div class="unit-h"><h2>${u.n}</h2><span>${u.t}</span></div><div class="grid">${u.weeks.map(weekCard).join("")}</div>`).join("")}`;}

function vWeek(arg){ const w=/^r/i.test(arg)?arg.toUpperCase():arg; if(!AVAILABLE_WEEKS.includes(wk(w)))return `<div class="empty">هذا الأسبوع غير متاح بعد. <a href="#weeks">عودة</a></div>`;
 const its=weekItems(w),s=stats(its),blocks=BANK.filter(b=>wk(b.w)===wk(w)); const periods=[...new Set(blocks.map(b=>b.p))];
 const cert=s.total&&s.att===s.total?`<div class="cert panel"><img src="assets/logo.png" alt="International Education Egypt"><div class="eyebrow">شهادة إتمام</div><h2>أتممتَ ${WEEK_LABEL[w]} بنجاح</h2><p>الدرجة: ${AR(s.ok)} من ${AR(s.total)} (${AR(pct(s.ok,s.total))}٪)</p></div>`:"";
 return `<div class="crumbs"><a href="#weeks">التقييمات الأسبوعية</a> / ${WEEK_LABEL[w]}</div>
 <div class="row" style="justify-content:space-between;align-items:flex-end"><div><h1>${WEEK_LABEL[w]}</h1><p class="muted" style="margin:0">${AR(blocks.length)} نشاطًا وسؤالًا رئيسًا · ${AR(s.total)} بندًا يُصحح · صفحات الكتاب ${AR(Math.min(...blocks.map(b=>b.page)))}–${AR(Math.max(...blocks.map(b=>b.page)))}</p></div>
 <div class="row"><button class="btn gold" data-start-week="${w}" data-mode="practice">حل الأسبوع كاملًا</button><button class="btn ghost" data-start-week="${w}" data-mode="test">اختبار الأسبوع</button></div></div>
 <div class="kpis" style="margin:18px 0"><div class="kpi"><b>${AR(pct(s.att,s.total))}٪</b><span>الإنجاز</span></div><div class="kpi"><b>${AR(s.ok)}</b><span>إجابات صحيحة</span></div><div class="kpi"><b>${AR(s.bad)}</b><span>إجابات خاطئة</span></div><div class="kpi"><b>${s.acc==null?"—":AR(Math.round(s.acc*100))+"٪"}</b><span>الدقة</span></div></div>
 ${cert}
 <div class="lesson-list">${periods.map(p=>{const bs=blocks.filter(b=>b.p===p);const ps=stats(ITEMS.filter(x=>bs.includes(x.b)));const title=p?(PERIODS[w]?PERIODS[w][p-1]:""):"مراجعة عامة";
  const ls=[...new Set(bs.map(b=>b.lesson))];
  return `<div class="lesson"><button class="lt plain" data-start-period="${w}|${p}"><b>${PERIOD_NAME[p]}: ${esc(title)}</b><span>${AR(bs.length)} نشاط/سؤال · ${[...new Set(bs.map(b=>b.sec))].join("، ")}${p===4?" · المجموعات "+[...new Set(bs.map(b=>b.grp).filter(Boolean))].join("، "):""}</span></button><span class="study-row">${ls.map(l=>studyBtn(l,ls.length>1)).join("")}</span>${ring(ps.total?ps.att/ps.total:0)}</div>`;}).join("")}</div>`;}

function vSkills(){ return `<div class="eyebrow">الوضع (ب)</div><h1>التدريب حسب المهارة</h1><p class="muted">كل أسئلة الأسابيع المتاحة مُعاد تنظيمها حسب المهارة والدرس. يبقى كل سؤال في القسم الذي ورد فيه في الكتاب، ويبقى كل نص مع أسئلته.</p>
 <div class="grid">${SKILLS.map((s,i)=>{const its=skillItems(s.k);const st=stats(its);const nl=LESSONS.filter(L=>L.sec===s.k).length;
  return `<a class="sk" href="#skill-${i}" style="--c:${s.c}"><span class="ic">${s.g}</span><span style="flex:1"><b>${s.k}</b><span>${nl?AR(nl)+" درس/موضوع · "+AR(st.total)+" سؤال":"لا توجد أسئلة مستقلة في الأسابيع المتاحة"}</span>${st.total?`<div class="bar" style="margin-top:8px"><i style="width:${pct(st.att,st.total)}%;background:${s.c}"></i></div>`:""}</span></a>`;}).join("")}</div>`;}

function vSkill(i){ const s=SKILLS[i]; if(!s)return vSkills(); const Ls=LESSONS.filter(L=>L.sec===s.k);
 const note=s.k==="الأساليب اللغوية"?`<div class="empty">لا يحتوي كتاب التقييمات على قسم مستقل بعنوان «الأساليب اللغوية». أسئلة الأساليب الواردة داخل النصوص والقراءة تبقى في أقسامها الأصلية كما في الكتاب. </div>`:"";
 return `<div class="crumbs"><a href="#skills">التدريب حسب المهارة</a> / ${s.k}</div><div class="row" style="justify-content:space-between;align-items:flex-end"><div><h1 style="color:${s.c}">${s.k}</h1><p class="muted" style="margin:0">${AR(Ls.length)} درس/موضوع من الأسابيع المتاحة</p></div>${Ls.length?`<button class="btn" data-start-skill="${i}" style="background:${s.c}">تدرّب على المهارة كاملة</button>`:""}</div>
 <div class="lesson-list" style="margin-top:16px">${Ls.map(L=>{const st=stats(L.items);return `<div class="lesson"><a class="lt plain" href="#lesson-${L.idx}"><b>${esc(L.lesson)}</b><span>${[...L.weeks].map(w=>WEEK_LABEL[w]).join("، ")} · ${AR(L.nScore)} سؤال يُصحح${L.items.some(x=>x.it.v)?" · بنود للمراجعة":""}</span></a>${studyBtn(L.lesson)}${ring(st.total?st.att/st.total:0,54,6,s.c)}</div>`;}).join("")}</div>${note}`;}

function vLesson(i){ const L=LESSONS[i]; if(!L)return vSkills(); const s=SK[L.sec]; const st=stats(L.items);
 return `<div class="crumbs"><a href="#skills">المهارات</a> / <a href="#skill-${s.i}">${s.k}</a> / ${esc(L.lesson)}</div>
 <h1>${esc(L.lesson)}</h1><p class="muted">${[...L.weeks].map(w=>WEEK_LABEL[w]).join("، ")} · ${AR(L.blocks.length)} نشاط/سؤال · ${AR(L.nScore)} بندًا يُصحح</p>
 <div class="kpis" style="margin:14px 0"><div class="kpi"><b>${AR(pct(st.att,st.total))}٪</b><span>الإنجاز</span></div><div class="kpi"><b>${AR(st.ok)}</b><span>صحيحة</span></div><div class="kpi"><b>${AR(st.bad)}</b><span>خاطئة</span></div><div class="kpi"><b>${st.acc==null?"—":AR(Math.round(st.acc*100))+"٪"}</b><span>الدقة</span></div></div>
 <div class="row">${studyBtn(L.lesson,false,true)}<button class="btn" data-start-lesson="${i}" data-mode="practice">تدريب</button><button class="btn soft" data-start-lesson="${i}" data-mode="learn">تعلّم مع الإجابات</button><button class="btn ghost" data-start-lesson="${i}" data-mode="test">اختبار الدرس</button></div>
 <h3 style="margin-top:22px">محتوى الدرس</h3><div class="lesson-list">${L.blocks.map(b=>`<div class="lesson"><span class="lt"><b>${esc(b.title)}</b><span>${WEEK_LABEL[b.w]} · ${PERIOD_NAME[b.p]}${b.grp?" · المجموعة ("+b.grp+")":""} · ${KIND_LABEL[b.kind]} · ص ${AR(b.page)}</span></span></div>`).join("")}</div>`;}

/* ---------- session ---------- */
function unitsFromBlocks(blocks){return blocks.map(b=>({b:b.id,idx:b.items.map((it,i)=>it.t?i:null).filter(i=>i!=null)}));}
function startSession(o){ SESSION=Object.assign({mode:"practice",exam:false,local:{},submitted:false,nav:"weeks",started:Date.now()},o);
 SESSION.order=[];SESSION.units.forEach(u=>u.idx.forEach(i=>SESSION.order.push(u.b+"#"+i)));
 if(location.hash==="#run")route();else location.hash="#run"; }
const getA=key=>SESSION&&SESSION.exam?SESSION.local[key]:S.ans[key];
function setA(key,obj){ if(SESSION&&SESSION.exam){SESSION.local[key]=obj;} else {S.ans[key]=obj;save();} }

function vRun(){ const X=SESSION; const n=X.order.length;
 let lastHead="",lastGrp="",lastKind="";let qn=0;
 const body=X.units.map(u=>{const b=BLOCK[u.b];let pre="";
  if(!X.exam){const head=wk(b.w)+"|"+b.p;if(head!==lastHead){pre+=`<div class="period-h">${b.p?PERIOD_NAME[b.p]+": ":""}${esc(b.p?(PERIODS[b.w]||[])[b.p-1]||"":WEEK_LABEL[b.w])} <small>${WEEK_LABEL[b.w]}</small></div>`;lastHead=head;lastGrp="";lastKind="";}
   if(b.kind!=="assess"&&b.kind!=="review"&&b.kind!==lastKind){pre+=`<div class="kind-h">${KIND_LABEL[b.kind]}</div>`;lastKind=b.kind;}
   if(b.grp&&b.grp!==lastGrp){pre+=`<div class="grp-h">المجموعة ( ${b.grp} ) أجب عن الأسئلة التالية</div>`;lastGrp=b.grp;}}
  const sk=SK[b.sec]; let inner="";let lastSub=null;
  b.items.forEach((it,i)=>{ if(!it.t){ // sub heading: show only if a following item in this unit exists
     if(u.idx.some(j=>j>i))lastSub=it.sub; return;}
   if(!u.idx.includes(i))return; if(lastSub){inner+=`<div class="sub">${esc(lastSub)}</div>`;lastSub=null;}
   qn++; inner+=itemHTML(b,i,it,qn,n); });
  return pre+`<article class="block" style="--c:${sk.c}" id="blk-${b.id}"><div class="block-h"><span class="tag"></span><div style="flex:1"><h3>${esc(b.title)}</h3><div class="meta"><span class="chip c" style="--c:${sk.c}">${b.sec}</span><span class="chip">${esc(b.lesson)}</span><span class="chip">${WEEK_LABEL[b.w]}${b.p?" · "+PERIOD_NAME[b.p]:""}${b.grp?" · مجموعة "+b.grp:""}</span><span class="chip">ص ${AR(b.page)}</span>${studyBtn(b.lesson,true)}</div></div></div>${b.note?`<div class="note">${esc(b.note)}</div>`:""}${b.source?`<div class="note" style="background:#EEF2FC;color:var(--navy2)">${esc(b.source)}</div>`:""}${listenHTML(b)}${passageHTML(b)}<div class="items">${inner}</div></article>`;}).join("");
 const modes=X.exam?"":`<div class="seg" role="tablist" aria-label="وضع الحل">${[["practice","تدريب"],["learn","تعلّم"],["test","اختبار"]].map(([m,l])=>`<button role="tab" aria-selected="${X.mode===m}" class="${X.mode===m?"on":""}" data-mode-switch="${m}">${l}</button>`).join("")}</div>`;
 return `<div class="sess-head"><div class="row" style="justify-content:space-between"><h2>${esc(X.title)}</h2>${modes}</div>
  <div class="sess-meta"><span id="sessCount"></span><div class="bar navy"><i id="sessBar" style="width:0"></i></div>${X.duration?`<span class="timer" id="timer"></span>`:""}<span class="chip" id="modeChip"></span></div></div>
  ${X.mode==="test"&&!X.submitted?`<div class="alert">وضع الاختبار: لن تظهر الإجابات حتى تضغط «تسليم» في نهاية الصفحة.</div>`:""}
  ${X.mode==="learn"?`<div class="alert" style="background:#EEF2FC;color:var(--navy2)">وضع التعلّم: تظهر الإجابة الصحيحة والشرح تحت كل سؤال.</div>`:""}
  <div id="resultsTop"></div>${body}
  <div class="sess-foot">${X.mode==="test"&&!X.submitted?`<button class="btn gold" id="submitAll">تسليم ${X.exam?"الامتحان":"الاختبار"}</button>`:`<button class="btn" id="showResults">${X.submitted?"عرض النتائج":"إنهاء وعرض النتائج"}</button>`}<a class="btn soft" href="${X.back||"#home"}">خروج</a></div>`;}

function itemHTML(b,i,it,qn,n){ const key=b.id+"#"+i; const a=getA(key)||{}; const v=a.v; const X=SESSION;
 const showFB=(X.mode==="practice"&&a.done)||(X.mode==="test"&&X.submitted&&X.showAns!==false)||(X.mode==="learn");
 const lock=(X.mode==="practice"&&a.done)||(X.mode==="test"&&X.submitted);
 const dis=lock?"disabled":""; let ctl="";
 const rb=`<button type="button" class="readbtn" data-readq="${key}" aria-label="اقرأ السؤال بصوت مسموع" title="اقرأ السؤال"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg><span>اقرأ</span></button>`;
 const qtxt=it.q?`<div class="q"><span class="qn">${AR(qn)}</span><span style="flex:1">${fmtQ(it.t==="pick"?"":it.q)}${it.v?'<span class="vflag" title="الإجابة مقترحة ولا تدخل في الدرجة">مراجعة المعلم</span>':""}</span>${rb}</div>`:`<div class="q"><span class="qn">${AR(qn)}</span><span style="flex:1">${it.v?'<span class="vflag">مراجعة المعلم</span>':""}</span>${rb}</div>`;
 switch(it.t){
  case"mcq":{const g=lock||X.mode==="learn"?grade(it,v):null;ctl=`<div class="opts" role="radiogroup">${it.opts.map((o,oi)=>{let cls=v===oi?"sel":"";if(showFB){if(oi===it.a)cls+=" right";else if(v===oi)cls+=" wrong";}
   return `<label class="opt ${cls}"><input type="radio" name="r-${key}" value="${oi}" ${v===oi?"checked":""} ${dis} data-k="${key}" data-f="mcq"> <span>${esc(o)}</span></label>`;}).join("")}</div>`;break;}
  case"kw":ctl=`<input class="inp" data-k="${key}" data-f="kw" value="${esc(v||"")}" ${dis} placeholder="اكتب إجابتك هنا" ${it.st?'spellcheck="false"':""}>`;break;
  case"multi":ctl=`<div class="fields">${it.fields.map((f,fi)=>`<div><label for="f-${key}-${fi}">${esc(f.l)}</label><input id="f-${key}-${fi}" class="inp" data-k="${key}" data-f="multi" data-i="${fi}" value="${esc((v||[])[fi]||"")}" ${dis}></div>`).join("")}</div>`;break;
  case"set":ctl=it.groups.map((g,gi)=>`<div style="margin-bottom:8px"><label style="font-weight:700;font-size:14.5px">${esc(g.l)} (${AR(g.n)})</label><div class="fields">${Array.from({length:g.n},(_,k)=>`<input class="inp" aria-label="${esc(g.l)} ${k+1}" data-k="${key}" data-f="set" data-g="${gi}" data-i="${k}" value="${esc(((v||[])[gi]||[])[k]||"")}" ${dis}>`).join("")}</div></div>`).join("");break;
  case"pick":{const ws=it.q.split(/\s+/);const sel=new Set(v||[]);ctl=`<div class="muted" style="font-size:14px;margin-bottom:6px">اضغط على الكلمة المطلوبة:</div><div class="words">${ws.map((w,wi)=>{let c=sel.has(wi)?"sel":"";if(showFB){if(it.a.includes(wi))c+=" right";else if(sel.has(wi))c+=" wrong";}return `<button type="button" class="word ${c}" data-k="${key}" data-f="pick" data-i="${wi}" aria-pressed="${sel.has(wi)}" ${dis}>${esc(w)}</button>`}).join("")}</div>`;break;}
  case"copy":ctl=`<div class="copybox">${esc(it.text)}</div><div class="muted" style="font-size:14px">اكتب العبارة في كراستك بخطي النسخ والرقعة، ثم اكتبها هنا كما هي للتحقق من الكلمات:</div><input class="inp" data-k="${key}" data-f="copy" value="${esc(v||"")}" ${dis}>`;break;
  case"essay":{const wc=wordsOf(v||"").length;ctl=`<textarea class="inp essay" data-k="${key}" data-f="essay" ${dis} placeholder="اكتب موضوعك هنا…">${esc(v||"")}</textarea><div class="wc"><span data-wc="${key}">${AR(wc)}</span> كلمة · المطلوب ${AR(it.min)}${it.max&&it.max<300?"–"+AR(it.max):"+"} كلمة على الأقل، مع تضمين عناصر الموضوع</div>`;break;}
  case"order":{const cur=v||[];ctl=`<div class="order-pool">${it.opts.filter(o=>!cur.includes(o)).map(o=>`<button type="button" class="tok" data-k="${key}" data-f="order-add" data-o="${esc(o)}" ${dis}>${esc(o)}</button>`).join("")||'<span class="muted" style="font-size:14px">تم ترتيب الكل</span>'}</div><div class="order-line" aria-label="ترتيبك">${cur.map((o,oi)=>`<button type="button" class="tok ${showFB?(it.a[oi]===o?"right":"wrong"):""}" data-k="${key}" data-f="order-del" data-o="${esc(o)}" ${dis}><span class="k">${AR(oi+1)}</span>${esc(o)}</button>`).join("")||'<span class="muted" style="font-size:14px">اضغط على الحركات بالترتيب من الأقوى إلى الأضعف</span>'}</div>`;break;}
  case"sort":{const cur=v||{};const pickedW=X.pickSort&&X.pickSort.k===key?X.pickSort.w:null;
   ctl=`<div class="muted" style="font-size:14px;margin-bottom:6px">اضغط على الكلمة ثم على الخانة المناسبة (اضغط كلمة داخل خانة لإعادتها):</div><div class="sort-pool">${it.words.map((w,wi)=>cur[wi]==null?`<button type="button" class="tok ${pickedW===wi?"picked":""}" data-k="${key}" data-f="sort-pick" data-i="${wi}" ${dis}>${esc(w[0])}</button>`:"").join("")}</div>
   <div class="sort-cats">${it.cats.map((c,ci)=>`<div class="cat ${pickedW!=null?"target":""}" data-k="${key}" data-f="sort-drop" data-c="${ci}" role="button" tabindex="0" aria-label="${esc(c)}"><h4>${esc(c)}</h4>${it.words.map((w,wi)=>cur[wi]===ci?`<button type="button" class="tok ${showFB?(w[1]===ci?"right":"wrong"):""}" data-k="${key}" data-f="sort-back" data-i="${wi}" ${dis}>${esc(w[0])}</button>`:"").join("")}</div>`).join("")}</div>`;break;}
  case"blanks":{let k=0;ctl=`<div class="blanktxt">${esc(it.q).replace(/\{(\d)\}/g,(m,d)=>{const di=+d;const val=(v||[])[di]||"";const g=showFB?(val===it.a[di]?"right":"wrong"):"";return `<span class="blank"><select aria-label="الفراغ ${di+1}" data-k="${key}" data-f="blanks" data-i="${di}" ${dis} class="${g}"><option value="">……</option>${it.opts.map(o=>`<option ${val===o?"selected":""}>${esc(o)}</option>`).join("")}</select></span>`;})}</div>`;break;}
  case"teacher":ctl=`<div class="note" style="margin:0">${esc(it.ans)}</div>`;break;
 }
 let fb="";
 if(showFB){ const g=it.t==="teacher"?{ok:null}:grade(it,v); const answered=isAnswered(it,v);
  const right=`<div class="ans">الإجابة الصحيحة: ${esc(answerText(it))}</div>`; const ex=it.ex?`<div class="ex">${esc(it.ex)}</div>`:"";
  if(it.t==="teacher")fb="";
  else if(X.mode==="learn")fb=`<div class="fb info"><b>الإجابة</b>${right}${ex}${it.v?'<div class="ex">إجابة مقترحة تحتاج مراجعة المعلم.</div>':""}</div>`;
  else if(!answered)fb=`<div class="fb bad"><b>لم تتم الإجابة</b>${right}${ex}</div>`;
  else if(g.ok)fb=`<div class="fb ok"><b>${["أحسنت! إجابة صحيحة","ممتاز!","رائع، استمر!","إجابة موفقة!"][qn%4]}</b>${it.t==="essay"?`<div>عدد الكلمات: ${AR(g.wc)} · تضمّن موضوعك عناصر الدرس. قارن موضوعك بالنموذج.</div>`:""}${ex}${it.v?'<div class="ex">إجابة مقترحة تحتاج مراجعة المعلم، لذلك لا تدخل في الدرجة.</div>':""}</div>`;
  else fb=`<div class="fb bad"><b>${it.t==="essay"?"يحتاج موضوعك إلى تحسين":"إجابة غير صحيحة"}</b>${it.t==="essay"?`<div>عدد الكلمات: ${AR(g.wc)} (المطلوب ${AR(it.min)} على الأقل) · ${g.hits<it.need?"أضف أفكارًا ترتبط بعناصر الموضوع.":""}</div>`:right}${partsHint(it,g)}${ex}</div>`;
  if(it.t==="essay")fb+=modelHTML(it,X.mode==="learn");
 }
 let actions="";
 if(X.mode==="practice"&&it.t!=="teacher"){actions=a.done?`<div class="actions"><button class="btn soft sm" data-retry="${key}">حاول مرة أخرى</button></div>`:`<div class="actions"><button class="btn sm" data-check="${key}">تحقق من الإجابة</button>${it.t==="essay"?`<button class="btn soft sm" data-peek="${key}">عرض النموذج</button>`:""}</div>`;}
 if(it.t==="teacher"&&X.mode!=="learn"){actions=`<div class="actions"><button class="btn soft sm" data-tdone="${key}" ${a.v===true?"disabled":""}>${a.v===true?"✓ تم":"أنجزته (يصححه المعلم)"}</button></div>`;}
 const cls=showFB&&it.t!=="teacher"&&X.mode!=="learn"?(isAnswered(it,v)&&grade(it,v).ok?"ok":"bad"):"";
 return `<div class="item ${cls}" id="it-${key.replace("#","_")}" data-item="${key}">${qtxt}${ctl}${actions}${fb}</div>`;}
function partsHint(it,g){ if(it.t==="multi"&&g.parts)return `<div class="ex">${it.fields.map((f,i)=>`${g.parts[i]?"✓":"✗"} ${esc(f.l)}`).join(" · ")}</div>`; return "";}
function modelHTML(it,open){const m=MODELS[it.model];if(!m)return"";return `<details class="model" ${open?"open":""}><summary>نموذج للطالب: ${esc(m.title)} (${AR(wordsOf(m.text).length)} كلمة)</summary><div class="rules">${m.rules.map(r=>`<span class="chip">${esc(r)}</span>`).join("")}</div><div class="mt">${esc(m.text)}</div></details>`;}

function refreshItem(key){const el=document.getElementById("it-"+key.replace("#","_"));if(!el)return;const x=IT[key];const qn=+el.querySelector(".qn").textContent.replace(/[٠-٩]/g,d=>"٠١٢٣٤٥٦٧٨٩".indexOf(d));
 const tmp=document.createElement("div");tmp.innerHTML=itemHTML(x.b,x.i,x.it,qn,SESSION.order.length);el.replaceWith(tmp.firstChild);updateSessMeta();}
function updateSessMeta(){const X=SESSION;if(!X)return;const n=X.order.length;let done=0,att=0;X.order.forEach(k=>{const a=getA(k);const it=IT[k].it;if(a&&(a.done||(X.mode==="test"&&isAnswered(it,a.v))||a.v===true&&it.t==="teacher"))done++;});
 if(window.malek&&!X.submitted&&n>=4&&done>=n/2)malek.milestone("half-"+X.started);
 const c=$("#sessCount");if(c)c.textContent=`أنجزت ${AR(done)} من ${AR(n)} سؤال · لم يُجب ${AR(n-done)}`;const bar=$("#sessBar");if(bar)bar.style.width=pct(done,n)+"%";
 const mc=$("#modeChip");if(mc)mc.textContent={practice:"تدريب: تصحيح فوري",learn:"تعلّم: الإجابات ظاهرة",test:X.submitted?"تم التسليم":"اختبار: الإجابات بعد التسليم"}[X.mode];}

function readVal(el){const key=el.dataset.k;const x=IT[key];const a=Object.assign({},getA(key)||{});let v=a.v;const f=el.dataset.f;
 if(f==="mcq")v=+el.value; else if(f==="kw"||f==="copy"||f==="essay")v=el.value;
 else if(f==="multi"){v=[...(v||[])];v[+el.dataset.i]=el.value;}
 else if(f==="set"){v=(v||[]).map(g=>[...(g||[])]);const gi=+el.dataset.g;v[gi]=v[gi]||[];v[gi][+el.dataset.i]=el.value;}
 else if(f==="blanks"){v=[...(v||[])];v[+el.dataset.i]=el.value;}
 a.v=v;setA(key,a);return {key,x,a};}

function checkItem(key,silent){const x=IT[key];const a=Object.assign({},getA(key)||{});const it=x.it;
 if(!isAnswered(it,a.v)){if(!silent)toast("أجب عن السؤال أولًا");return false;}
 const g=grade(it,a.v);const first=!a.tries;a.done=true;a.ok=!!g.ok;a.tries=(a.tries||0)+1;a.at=Date.now();
 if(!SESSION.exam&&g.ok&&first&&scorable(it)){const p=it.t==="essay"?20:it.t==="copy"?5:10;a.pts=p;S.pts+=p;updatePts(true);}
 setA(key,a);if(!SESSION.exam){save();checkBadges();if(!silent&&scorable(it)&&window.malek)malek.answer(g.ok);}return true;}

function bindView(r,arg){
 $$("[data-start-week]").forEach(b=>b.onclick=()=>{const w=b.dataset.startWeek;startSession({title:WEEK_LABEL[w]+" — كاملًا",units:unitsFromBlocks(BANK.filter(x=>wk(x.w)===wk(w))),mode:b.dataset.mode,nav:"weeks",back:"#week-"+w.toLowerCase()});});
 $$("[data-start-period]").forEach(b=>b.onclick=()=>{const [w,p]=b.dataset.startPeriod.split("|");const bs=BANK.filter(x=>wk(x.w)===w&&x.p===+p);startSession({title:WEEK_LABEL[w]+" — "+PERIOD_NAME[p],units:unitsFromBlocks(bs),mode:"practice",nav:"weeks",back:"#week-"+w.toLowerCase()});});
 $$("[data-start-skill]").forEach(b=>b.onclick=()=>{const s=SKILLS[+b.dataset.startSkill];const bs=LESSONS.filter(L=>L.sec===s.k).flatMap(L=>L.blocks);startSession({title:"مهارة: "+s.k,units:unitsFromBlocks(bs),nav:"skills",back:"#skill-"+b.dataset.startSkill});});
 $$("[data-start-lesson]").forEach(b=>b.onclick=()=>{const L=LESSONS[+b.dataset.startLesson];startSession({title:L.lesson,units:unitsFromBlocks(L.blocks),mode:b.dataset.mode,nav:"skills",back:"#lesson-"+L.idx});});
 if(r==="run")bindRun();
 if(r==="exams")bindExams();
 if(r==="progress")bindProgress();
 if(r==="key")bindKey();
 if(r==="study")bindStudy(arg);
}
function bindRun(){ const X=SESSION; updateSessMeta(); const app=$("#app"); if(window.malek){if(X.submitted)malek.questionClosed();else malek.questionShown(X.started);}
 if(X.duration&&!X.submitted){const end=X.started+X.duration*60000;clearInterval(TIMER);const tick=()=>{const left=Math.max(0,end-Date.now());const t=$("#timer");if(t)t.textContent="⏱ "+AR(String(Math.floor(left/60000)).padStart(2,"0"))+":"+AR(String(Math.floor(left/1000)%60).padStart(2,"0"));if(left<=0){clearInterval(TIMER);toast("انتهى الوقت! تم تسليم الامتحان تلقائيًّا");submitAll(true);}};tick();TIMER=setInterval(tick,1000);}
 app.oninput=e=>{const el=e.target;if(!el.dataset.k)return;if(["kw","copy","essay","multi","set"].includes(el.dataset.f)){readVal(el);if(el.dataset.f==="essay"){const w=$(`[data-wc="${CSS.escape(el.dataset.k)}"]`);if(w)w.textContent=AR(wordsOf(el.value).length);} if(X.mode==="test")updateSessMeta();}};
 app.onchange=e=>{const el=e.target;if(!el.dataset.k)return;if(el.dataset.f==="mcq"||el.dataset.f==="blanks"){readVal(el);if(el.dataset.f==="mcq")refreshItem(el.dataset.k);else updateSessMeta();}};
 app.onkeydown=e=>{const el=e.target;if(e.key==="Enter"&&el.tagName==="INPUT"&&el.dataset.k&&X.mode==="practice"){e.preventDefault();if(checkItem(el.dataset.k))refreshItem(el.dataset.k);} if((e.key==="Enter"||e.key===" ")&&el.dataset.f==="sort-drop"){e.preventDefault();el.click();}};
 app.onclick=async e=>{const t=e.target.closest("[data-check],[data-retry],[data-peek],[data-tdone],[data-mode-switch],[data-f],#submitAll,#showResults,[data-jump]");if(!t)return;
  if(t.dataset.check){if(checkItem(t.dataset.check))refreshItem(t.dataset.check);const a=getA(t.dataset.check);if(a&&a.ok&&!X.exam)maybeBlockDone(t.dataset.check);return;}
  if(t.dataset.retry){const a=Object.assign({},getA(t.dataset.retry));a.done=false;setA(t.dataset.retry,a);refreshItem(t.dataset.retry);return;}
  if(t.dataset.peek){if(window.malek)malek.help();const x=IT[t.dataset.peek];const el=t.closest(".item");if(!el.querySelector(".model"))el.insertAdjacentHTML("beforeend",modelHTML(x.it,true));return;}
  if(t.dataset.tdone){setA(t.dataset.tdone,{v:true,done:false});refreshItem(t.dataset.tdone);return;}
  if(t.dataset.modeSwitch){X.mode=t.dataset.modeSwitch;X.submitted=false;route();return;}
  if(t.id==="submitAll"){submitAll(false);return;}
  if(t.id==="showResults"){if(!X.submitted&&X.mode==="practice"){X.order.forEach(k=>{const a=getA(k);if(a&&!a.done&&isAnswered(IT[k].it,a.v))checkItem(k,true);});}showResults();return;}
  if(t.dataset.jump){const el=document.getElementById("it-"+t.dataset.jump.replace("#","_"));if(el){el.scrollIntoView({behavior:"smooth",block:"center"});el.animate([{boxShadow:"0 0 0 4px var(--gold)"},{boxShadow:"0 0 0 0 transparent"}],{duration:1400});}return;}
  const f=t.dataset.f,key=t.dataset.k;if(!key)return;const a=Object.assign({},getA(key)||{});const it=IT[key].it;
  if(f==="pick"){const s=new Set(a.v||[]);const i=+t.dataset.i;s.has(i)?s.delete(i):s.add(i);a.v=[...s];setA(key,a);refreshItem(key);}
  else if(f==="order-add"){a.v=[...(a.v||[]),t.dataset.o];setA(key,a);refreshItem(key);}
  else if(f==="order-del"){a.v=(a.v||[]).filter(o=>o!==t.dataset.o);setA(key,a);refreshItem(key);}
  else if(f==="sort-pick"){X.pickSort={k:key,w:+t.dataset.i};refreshItem(key);}
  else if(f==="sort-back"){const v=Object.assign({},a.v||{});delete v[+t.dataset.i];a.v=v;setA(key,a);refreshItem(key);}
  else if(f==="sort-drop"){if(!X.pickSort||X.pickSort.k!==key){toast("اختر كلمة أولًا");return;}const v=Object.assign({},a.v||{});v[X.pickSort.w]=+t.dataset.c;a.v=v;X.pickSort=null;setA(key,a);refreshItem(key);}
 };}
function maybeBlockDone(key){const b=IT[key].b;const ks=b.items.map((it,i)=>it.t&&scorable(it)?b.id+"#"+i:null).filter(Boolean);if(ks.length>1&&ks.every(k=>{const a=getA(k);return a&&a.done&&a.ok})){confetti();toast("🎉 أحسنت! أجبت عن النشاط كله إجابة صحيحة");}}

async function submitAll(force){const X=SESSION;const un=X.order.filter(k=>!isAnswered(IT[k].it,(getA(k)||{}).v)&&IT[k].it.t!=="teacher").length;
 if(!force&&un){const r=await modal(`<h3>بقي ${AR(un)} سؤال بدون إجابة</h3><p class="muted">الأسئلة غير المُجاب عنها تُحسب إجابات غير صحيحة. هل تريد التسليم الآن؟</p>`,[["العودة للإجابة",false,"gold"],["تسليم الآن",true,"ghost"]]);if(!r){const k=X.order.find(k=>!isAnswered(IT[k].it,(getA(k)||{}).v)&&IT[k].it.t!=="teacher");const el=k&&document.getElementById("it-"+k.replace("#","_"));if(el)el.scrollIntoView({behavior:"smooth",block:"center"});return;}}
 clearInterval(TIMER);X.order.forEach(k=>{const a=Object.assign({},getA(k)||{});const it=IT[k].it;if(it.t==="teacher")return;const g=isAnswered(it,a.v)?grade(it,a.v):{ok:false};a.done=true;a.ok=!!g.ok;a.at=Date.now();setA(k,a);
  if(X.exam&&scorable(it)){const prev=S.ans[k]||{};const first=!prev.tries;S.ans[k]=Object.assign({},prev,{v:a.v,done:true,ok:a.ok,tries:(prev.tries||0)+1,at:a.at});if(a.ok&&first){S.pts+=10;}}});
 X.submitted=true;if(!X.exam)save();const res=computeResults();
 if(X.exam){const ex=S.exams.find(e=>e.id===X.examId);if(ex){ex.result=res;ex.answers=X.local;ex.doneAt=Date.now();}save();}
 updatePts(true);checkBadges();save();route();setTimeout(showResults,50);}

function computeResults(){const X=SESSION;const rows=X.order.map(k=>{const x=IT[k];const a=getA(k)||{};return{k,x,a,sc:scorable(x.it),ans:isAnswered(x.it,a.v),ok:a.done&&a.ok};}).filter(r=>r.sc);
 const total=rows.length,ok=rows.filter(r=>r.ok).length,answered=rows.filter(r=>r.ans&&r.a.done).length;
 const by=(f)=>{const m={};rows.forEach(r=>{const key=f(r.x);m[key]=m[key]||{t:0,o:0};m[key].t++;if(r.ok)m[key].o++;});return m;};
 return{total,ok,bad:answered-ok,unanswered:total-answered,pct:pct(ok,total),byLesson:by(x=>x.b.lesson),bySkill:by(x=>x.b.sec),wrong:rows.filter(r=>!r.ok).map(r=>r.k)};}
function showResults(){const X=SESSION;const r=computeResults();const top=$("#resultsTop");if(!top)return;
 const lvl=r.pct>=90?"ممتاز! أداء رائع 🌟":r.pct>=75?"جيد جدًّا، واصل التقدم":r.pct>=50?"جيد، راجع الأسئلة الخاطئة":"تحتاج إلى مزيد من التدريب، لا تستسلم!";
 top.innerHTML=`<div class="panel" style="border-top:5px solid var(--gold)"><div class="ringwrap"><div class="big-ring">${ring(r.pct/100,150,14,r.pct>=50?"var(--ok)":"var(--bad)")}</div><div style="flex:1;min-width:220px"><div class="eyebrow">النتيجة</div><h2 style="margin:0">${lvl}</h2><p class="muted" style="margin:4px 0 0">الدرجة ${AR(r.ok)} من ${AR(r.total)} · الأسئلة المعلّمة «مراجعة المعلم» وأسئلة المعلم لا تدخل في الدرجة.</p></div></div>
 <div class="kpis" style="margin-top:14px"><div class="kpi"><b>${AR(r.pct)}٪</b><span>النسبة المئوية</span></div><div class="kpi"><b style="color:var(--ok)">${AR(r.ok)}</b><span>صحيحة</span></div><div class="kpi"><b style="color:var(--bad)">${AR(r.bad)}</b><span>خاطئة</span></div><div class="kpi"><b>${AR(r.unanswered)}</b><span>بدون إجابة</span></div></div>
 <div class="gen" style="margin-top:16px"><div><h3>الأداء حسب الدرس</h3><div class="hbars">${Object.entries(r.byLesson).map(([l,v])=>`<div class="hbar"><span title="${esc(l)}" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(l)}</span><div class="bar"><i style="width:${pct(v.o,v.t)}%"></i></div><span>${AR(v.o)}/${AR(v.t)}</span></div>`).join("")}</div></div>
 <div><h3>الأداء حسب المهارة</h3><div class="hbars">${Object.entries(r.bySkill).map(([s,v])=>`<div class="hbar"><span>${s}</span><div class="bar"><i style="width:${pct(v.o,v.t)}%;background:${SK[s].c}"></i></div><span>${AR(v.o)}/${AR(v.t)}</span></div>`).join("")}</div></div></div>
 ${r.wrong.length?`<h3 style="margin-top:16px">أسئلة تحتاج إلى مراجعة (${AR(r.wrong.length)})</h3><div class="row">${r.wrong.slice(0,60).map(k=>`<button class="chip bad" style="border:0;cursor:pointer" data-jump="${k}">س ${AR(X.order.indexOf(k)+1)}</button>`).join("")}</div>`:`<p>لا توجد أخطاء — أحسنت!</p>`}
 <div class="row" style="margin-top:14px">${X.mode!=="test"||X.submitted?`<button class="btn" id="retakeBtn">إعادة المحاولة</button>`:""}<a class="btn soft" href="#progress">نتائجي وتقدمي</a></div></div>`;
 top.scrollIntoView({behavior:"smooth"}); if(r.pct>=90)confetti(); if(window.malek){if(r.pct<50)malek.incorrect();else if(X.exam)malek.levelComplete();else malek.lessonComplete();}
 const rb=$("#retakeBtn");if(rb)rb.onclick=()=>{const o={title:X.title,units:X.units,mode:X.exam?X.mode:X.mode,nav:X.nav,back:X.back,exam:X.exam,duration:X.duration,showAns:X.showAns};
  if(X.exam){const ex=newExamRecord(X.cfg,X.units);o.examId=ex.id;o.cfg=X.cfg;} else {X.order.forEach(k=>{const a=Object.assign({},S.ans[k]||{});a.done=false;a.v=undefined;S.ans[k]=a;});save();}
  startSession(o);};}

/* ---------- exam generator ---------- */
let GEN={sel:new Set(),title:"",n:20,dist:"balanced",types:null,duration:0,random:true,mode:"formal",showAns:true,q:"",step:1};
function genUnits(lessonKeys,types){const units=[];lessonKeys.forEach(lk=>{const L=LKEY[lk];L.blocks.forEach(b=>{const idx=b.items.map((it,i)=>it.t&&scorable(it)&&(!types||types.has(it.t))?i:null).filter(i=>i!=null);if(!idx.length)return;
  if(b.passage)units.push({lk,b:b.id,idx,n:idx.length,min:idx.reduce((s,i)=>s+TYPE_MIN[b.items[i].t],0)});else idx.forEach(i=>units.push({lk,b:b.id,idx:[i],n:1,min:TYPE_MIN[b.items[i].t]}));});});return units;}
function pickUnits(units,n,dist,random){const byL={};units.forEach(u=>{(byL[u.lk]=byL[u.lk]||[]).push(u)});Object.keys(byL).forEach(k=>{if(random)byL[k]=shuffle(byL[k]);});
 const out=[];let left=n;const keys=Object.keys(byL);
 if(dist==="book"){const all=random?shuffle(units):units;for(const u of all){if(left<=0)break;if(u.n<=left){out.push(u);left-=u.n;}}}
 else{let progress=true;while(left>0&&progress){progress=false;for(const k of keys){if(left<=0)break;const q=byL[k];const j=q.findIndex(u=>u.n<=left);if(j>=0){const u=q.splice(j,1)[0];out.push(u);left-=u.n;progress=true;}}}}
 if(!random){const ord=Object.fromEntries(BANK.map((b,i)=>[b.id,i]));out.sort((a,b)=>ord[a.b]-ord[b.b]||a.idx[0]-b.idx[0]);} else if(random)return shuffle(out);
 return out;}
function newExamRecord(cfg,units){const ex={id:"e"+Date.now().toString(36),title:cfg.title,date:Date.now(),cfg:{...cfg,sel:[...cfg.sel],types:cfg.types?[...cfg.types]:null},units:units.map(u=>({b:u.b,idx:u.idx}))};S.exams.unshift(ex);S.exams=S.exams.slice(0,20);save();return ex;}
function launchExam(cfg,units){const ex=newExamRecord(cfg,units);const mode={practice:"practice",formal:"test",revision:"learn"}[cfg.mode];
 startSession({title:cfg.title,units:ex.units,mode,exam:true,examId:ex.id,cfg,duration:cfg.duration||0,showAns:cfg.showAns,nav:"exams",back:"#exams"});}

function vExams(){ const G=GEN; const selArr=[...G.sel];
 const typesAvail=new Set();selArr.forEach(lk=>LKEY[lk].items.forEach(x=>{if(scorable(x.it))typesAvail.add(x.it.t)}));
 const types=G.types?new Set([...G.types].filter(t=>typesAvail.has(t))):typesAvail;
 const units=genUnits(selArr,types);const max=units.reduce((s,u)=>s+u.n,0);
 const lessonsHTML=SKILLS.map(s=>{const Ls=LESSONS.filter(L=>L.sec===s.k&&(!G.q||L.lesson.includes(G.q)||s.k.includes(G.q)));if(!Ls.length)return"";const allOn=Ls.every(L=>G.sel.has(L.key));const some=Ls.some(L=>G.sel.has(L.key));
  return `<details class="gsec" ${some||G.q?"open":""}><summary><span class="chip c" style="--c:${s.c}">${s.g}</span>${s.k}<small class="muted">(${AR(Ls.length)})</small><button class="btn soft sm" data-selskill="${s.i}" style="margin-inline-start:8px">${allOn?"إلغاء الكل":"اختيار الكل"}</button><span class="caret">‹</span></summary>
  ${Ls.map(L=>`<label class="gl"><input type="checkbox" data-sel="${esc(L.key)}" ${G.sel.has(L.key)?"checked":""}><span class="lt">${esc(L.lesson)}<br><small>${s.k} · ${[...L.weeks].map(w=>WEEK_LABEL[w]).join("، ")}</small></span>${studyBtn(L.lesson,true)}<span class="chip">${AR(L.nScore)} سؤال</span></label>`).join("")}</details>`;}).join("");
 const hist=S.exams.length?`<div class="tbl-wrap"><table class="tbl"><thead><tr><th>الامتحان</th><th>التاريخ</th><th>النتيجة</th><th></th></tr></thead><tbody>${S.exams.map(e=>`<tr><td><b>${esc(e.title)}</b><br><small class="muted">${AR(e.units.reduce((s,u)=>s+u.idx.length,0))} سؤال · ${e.cfg.sel.length} درس</small></td><td>${new Date(e.date).toLocaleDateString("ar-EG")}</td><td>${e.result?`<span class="chip ${e.result.pct>=50?"ok":"bad"}">${AR(e.result.pct)}٪</span>`:'<span class="chip">لم يُسلَّم</span>'}</td><td><div class="row">${e.result?`<button class="btn soft sm" data-review="${e.id}">مراجعة الأخطاء</button>`:""}<button class="btn sm" data-retake="${e.id}">إعادة</button><button class="btn ghost sm" data-regen="${e.id}">امتحان جديد بنفس الدروس</button></div></td></tr>`).join("")}</tbody></table></div>`:`<div class="empty">لا توجد امتحانات سابقة بعد.</div>`;
 const estimate=Math.ceil(pickUnits(units,Math.min(G.n,max),G.dist,false).reduce((s,u)=>s+u.min,0));
 return `<div class="eyebrow">الاختبارات</div><h1>منشئ الامتحانات الذكي</h1><p class="muted">اختر الدروس من أي أسبوع وأي مهارة، وحدد عدد الأسئلة والمدة. كل الأسئلة من كتاب التقييمات فقط ومن قاعدة الأسئلة الموحدة نفسها، وتبقى النصوص مع أسئلتها.</p>
 <div class="row" style="margin:10px 0 18px"><button class="btn gold" id="finalExam">الاختبار الشامل (كل الدروس المتاحة)</button></div>
 <div class="gen"><div><div class="panel"><div class="row" style="justify-content:space-between"><h3 style="margin:0">١. اختر الدروس</h3><span class="chip" id="selCount">${AR(G.sel.size)} درس مختار</span></div>
  <div class="filters" style="margin-top:10px"><input id="lsearch" placeholder="ابحث باسم الدرس…" value="${esc(G.q)}" style="flex:1;min-width:160px"><button class="btn soft sm" id="selAll">اختيار الكل</button><button class="btn soft sm" id="selNone">مسح الاختيار</button></div>
  <div class="row" style="margin-bottom:10px"><span class="muted" style="font-size:14px">اختيار حسب الأسبوع:</span>${AVAILABLE_WEEKS.map(w=>`<button class="btn soft sm" data-selweek="${w}">${/^R/.test(w)?({R1:"مراجعة الوحدة ١",R2:"مراجعة الوحدة ٢",R3:"مراجعة الوحدة ٣",RF:"مراجعة الفصل"})[w]:"أسبوع "+AR(w)}</button>`).join("")}</div>
  ${lessonsHTML}</div></div>
 <div class="sticky-side"><div class="panel"><h3>٢. إعدادات الامتحان</h3>
  <div class="field"><label for="gTitle">عنوان الامتحان</label><input id="gTitle" class="inp" value="${esc(G.title)}" placeholder="مثال: امتحان النحو – الشهر الأول"></div>
  <div class="field"><label for="gN">عدد الأسئلة <small class="muted">(المتاح ${AR(max)})</small></label><input id="gN" class="inp" type="number" min="1" max="${max||1}" value="${G.n}">${G.n>max&&max?`<div class="alert">العدد المطلوب أكبر من الأسئلة المتاحة في الدروس المختارة (${AR(max)}). <button class="btn sm gold" id="useMax">استخدم ${AR(max)}</button></div>`:""}</div>
  <div class="field"><label for="gDist">توزيع الأسئلة على الدروس</label><select id="gDist" class="inp"><option value="balanced" ${G.dist==="balanced"?"selected":""}>متوازن بين الدروس المختارة</option><option value="book" ${G.dist==="book"?"selected":""}>حسب المتاح في كل درس</option></select></div>
  <div class="field"><label>أنواع الأسئلة (من الأنواع الموجودة في الكتاب)</label>${typesAvail.size?[...typesAvail].map(t=>`<label class="check"><input type="checkbox" data-type="${t}" ${types.has(t)?"checked":""}> ${TYPE_LABEL[t]}</label>`).join(""):'<span class="muted">اختر دروسًا أولًا</span>'}</div>
  <div class="field"><label for="gDur">مدة الامتحان بالدقائق <small class="muted">(٠ = بدون وقت)</small></label><input id="gDur" class="inp" type="number" min="0" max="240" value="${G.duration}"></div>
  <div class="field"><label>مستوى الصعوبة</label><div class="muted" style="font-size:14px">غير متاح: الكتاب لا يصنّف أسئلته حسب الصعوبة، لذلك لا نضيف تصنيفًا غير موجود في المصدر.</div></div>
  <div class="field"><label class="check"><input type="checkbox" id="gRand" ${G.random?"checked":""}> ترتيب عشوائي للأسئلة</label><label class="check"><input type="checkbox" id="gShow" ${G.showAns?"checked":""}> إظهار الإجابات الصحيحة بعد التسليم</label></div>
  <div class="field"><label>نوع الامتحان</label><div class="seg" style="display:flex;flex-wrap:wrap">${[["practice","تدريبي: تصحيح فوري"],["formal","رسمي: بعد التسليم"],["revision","مراجعة: مع الإجابات"]].map(([m,l])=>`<button class="${G.mode===m?"on":""}" data-gmode="${m}">${l}</button>`).join("")}</div></div>
  <button class="btn gold" style="width:100%" id="preview" ${!G.sel.size||!max?"disabled":""}>معاينة الامتحان</button>
  <p class="muted" style="font-size:13.5px;margin:8px 0 0">الوقت التقديري: ${AR(estimate)} دقيقة تقريبًا.</p></div></div></div>
 <h2 style="margin-top:26px">سجل الامتحانات</h2>${hist}`;}
function bindExams(){const G=GEN;const re=()=>{const y=scrollY;route();scrollTo(0,y);};
 $$("[data-sel]").forEach(c=>c.onchange=()=>{c.checked?G.sel.add(c.dataset.sel):G.sel.delete(c.dataset.sel);re();});
 $$("[data-selskill]").forEach(b=>b.onclick=e=>{e.preventDefault();const s=SKILLS[+b.dataset.selskill];const Ls=LESSONS.filter(L=>L.sec===s.k);const all=Ls.every(L=>G.sel.has(L.key));Ls.forEach(L=>all?G.sel.delete(L.key):G.sel.add(L.key));re();});
 $$("[data-selweek]").forEach(b=>b.onclick=()=>{LESSONS.filter(L=>L.weeks.has(b.dataset.selweek)).forEach(L=>G.sel.add(L.key));re();});
 $("#selAll").onclick=()=>{LESSONS.forEach(L=>G.sel.add(L.key));re();};$("#selNone").onclick=()=>{G.sel.clear();re();};
 const ls=$("#lsearch");ls.oninput=()=>{G.q=ls.value.trim();clearTimeout(ls._t);ls._t=setTimeout(()=>{re();const n=$("#lsearch");n.focus();n.setSelectionRange(n.value.length,n.value.length);},350);};
 $("#gTitle").oninput=e=>G.title=e.target.value;
 $("#gN").onchange=e=>{G.n=Math.max(1,parseInt(e.target.value)||1);re();};const um=$("#useMax");if(um)um.onclick=()=>{G.n=+$("#gN").max;re();};
 $("#gDist").onchange=e=>{G.dist=e.target.value;re();};$("#gDur").onchange=e=>{G.duration=Math.max(0,parseInt(e.target.value)||0);};
 $("#gRand").onchange=e=>G.random=e.target.checked;$("#gShow").onchange=e=>G.showAns=e.target.checked;
 $$("[data-type]").forEach(c=>c.onchange=()=>{const all=$$("[data-type]").filter(x=>x.checked).map(x=>x.dataset.type);G.types=new Set(all);re();});
 $$("[data-gmode]").forEach(b=>b.onclick=()=>{G.mode=b.dataset.gmode;re();});
 $("#finalExam").onclick=()=>{G.sel=new Set(LESSONS.map(L=>L.key));G.title="الاختبار الشامل – الفصل الدراسي الأول";G.n=40;G.mode="formal";G.duration=60;G.types=null;re();$("#preview").click();};
 const pv=$("#preview");if(pv)pv.onclick=async()=>{const types=G.types||null;const units=genUnits([...G.sel],types&&types.size?types:null);const max=units.reduce((s,u)=>s+u.n,0);if(!max)return;let n=Math.min(G.n,max);
  const picked=pickUnits(units,n,G.dist,G.random);const real=picked.reduce((s,u)=>s+u.n,0);const per={};picked.forEach(u=>{const L=LKEY[u.lk];per[L.lesson]=(per[L.lesson]||0)+u.n;});
  const est=Math.ceil(picked.reduce((s,u)=>s+u.min,0));const title=G.title.trim()||"امتحان "+new Date().toLocaleDateString("ar-EG");
  const r=await modal(`<div class="eyebrow">معاينة الامتحان</div><h2>${esc(title)}</h2><div class="kpis" style="margin:10px 0"><div class="kpi"><b>${AR(real)}</b><span>سؤال</span></div><div class="kpi"><b>${AR(G.sel.size)}</b><span>درس</span></div><div class="kpi"><b>${AR(G.duration||est)}</b><span>${G.duration?"دقيقة (محددة)":"دقيقة تقديرية"}</span></div></div>
   ${real<G.n?`<div class="alert">تم اختيار ${AR(real)} سؤالًا لأن بعض النصوص تُعرض مع جميع أسئلتها ولا تُقسَّم، أو لأن المتاح أقل من المطلوب.</div>`:""}
   <div style="max-height:220px;overflow:auto"><table class="tbl"><thead><tr><th>الدرس</th><th>الأسئلة</th></tr></thead><tbody>${Object.entries(per).map(([l,c])=>`<tr><td>${esc(l)}</td><td>${AR(c)}</td></tr>`).join("")}</tbody></table></div>
   <p class="muted" style="font-size:14px">النوع: ${({practice:"تدريبي",formal:"رسمي",revision:"مراجعة"})[G.mode]} · ${G.random?"ترتيب عشوائي":"بترتيب الكتاب"}</p>`,[["ابدأ الامتحان","go","gold"],["رجوع للتعديل",null,"ghost"]]);
  if(r==="go")launchExam({title,sel:new Set(G.sel),n:real,dist:G.dist,types:G.types,duration:G.duration,random:G.random,mode:G.mode,showAns:G.showAns},picked);};
 $$("[data-retake]").forEach(b=>b.onclick=()=>{const e=S.exams.find(x=>x.id===b.dataset.retake);const cfg={...e.cfg,sel:new Set(e.cfg.sel),types:e.cfg.types?new Set(e.cfg.types):null};launchExam(cfg,e.units);});
 $$("[data-regen]").forEach(b=>b.onclick=()=>{const e=S.exams.find(x=>x.id===b.dataset.regen);const cfg={...e.cfg,sel:new Set(e.cfg.sel),types:e.cfg.types?new Set(e.cfg.types):null,random:true};const units=genUnits([...cfg.sel],cfg.types);launchExam(cfg,pickUnits(units,cfg.n,cfg.dist,true));});
 $$("[data-review]").forEach(b=>b.onclick=()=>{const e=S.exams.find(x=>x.id===b.dataset.review);const wrong=new Set(e.result.wrong);const units=e.units.map(u=>({b:u.b,idx:u.idx.filter(i=>wrong.has(u.b+"#"+i))})).filter(u=>u.idx.length);
  SESSION=null;startSession({title:"مراجعة أخطاء: "+e.title,units,mode:"test",exam:true,local:Object.assign({},e.answers||{}),submitted:true,showAns:true,nav:"exams",back:"#exams",examId:null});});
}

/* ---------- progress ---------- */
function vProgress(){ const all=stats(ITEMS); const flagged=ITEMS.filter(x=>x.it.v).length;
 const wkRows=AVAILABLE_WEEKS.map(w=>{const s=stats(weekItems(w));return `<div class="hbar"><span>${WEEK_LABEL[w]}</span><div class="bar"><i style="width:${pct(s.att,s.total)}%"></i></div><span>${AR(pct(s.att,s.total))}٪</span></div>`;}).join("");
 const skRows=SKILLS.filter(s=>skillItems(s.k).some(x=>scorable(x.it))).map(s=>{const st=stats(skillItems(s.k));return `<div class="hbar"><span>${s.k}</span><div class="bar"><i style="width:${st.att?pct(st.ok,st.att):0}%;background:${s.c}"></i></div><span>${st.att?AR(pct(st.ok,st.att))+"٪":"—"}</span></div>`;}).join("");
 const lRows=LESSONS.filter(L=>L.nScore).map(L=>{const st=stats(L.items);const status=st.att===st.total?'<span class="chip ok">مكتمل</span>':st.att?'<span class="chip warn">قيد التقدم</span>':'<span class="chip">لم يبدأ</span>';
  return `<tr><td><a href="#lesson-${L.idx}">${esc(L.lesson)}</a><br><small class="muted">${L.sec}</small></td><td>${AR(st.att)}/${AR(st.total)}</td><td style="color:var(--ok)">${AR(st.ok)}</td><td style="color:var(--bad)">${AR(st.bad)}</td><td>${st.acc==null?"—":AR(Math.round(st.acc*100))+"٪"}</td><td>${status}</td></tr>`;}).join("");
 const wrongKeys=ITEMS.filter(x=>scorable(x.it)&&S.ans[x.key]&&S.ans[x.key].done&&!S.ans[x.key].ok);
 return `<div class="eyebrow">لوحة الطالب</div><h1>نتائجي وتقدمي</h1>
 <div class="panel"><div class="ringwrap"><div class="big-ring">${ring(all.comp,150,14)}</div><div style="flex:1;min-width:240px"><h2 style="margin:0">التقدم العام</h2><p class="muted">أجبت عن ${AR(all.att)} من ${AR(all.total)} سؤالًا يُصحح تلقائيًّا في الأسابيع المتاحة.</p>
 <div class="kpis"><div class="kpi"><b>${AR(all.ok)}</b><span>صحيحة</span></div><div class="kpi"><b>${AR(all.bad)}</b><span>خاطئة</span></div><div class="kpi"><b>${all.acc==null?"—":AR(Math.round(all.acc*100))+"٪"}</b><span>الدقة (الصحيح ÷ المُجاب)</span></div><div class="kpi"><b>${AR(S.pts)}</b><span>نقطة</span></div></div></div></div></div>
 <div class="gen"><div class="panel"><h3>التقدم الأسبوعي (الإنجاز)</h3><div class="hbars">${wkRows}</div></div><div class="panel"><h3>الأداء حسب المهارة (الدقة)</h3><div class="hbars">${skRows}</div></div></div>
 <div class="panel"><h3>الأوسمة والإنجازات</h3><div class="badges">${BADGES.map(b=>`<div class="bdg ${S.badges.includes(b.id)?"on":""}"><div class="em">${b.g}</div><b>${b.n}</b><span>${b.d}</span></div>`).join("")}</div></div>
 <div class="panel"><div class="row" style="justify-content:space-between"><h3 style="margin:0">الأداء حسب الدرس</h3>${wrongKeys.length?`<button class="btn sm" id="practiceWrong">تدرّب على أخطائي (${AR(wrongKeys.length)})</button>`:""}</div><div class="tbl-wrap"><table class="tbl"><thead><tr><th>الدرس</th><th>المُجاب</th><th>صحيحة</th><th>خاطئة</th><th>الدقة</th><th>الحالة</th></tr></thead><tbody>${lRows}</tbody></table></div></div>
 <div class="panel"><h3>ملاحظات</h3><p class="muted" style="margin:0">يُحفظ تقدمك تلقائيًّا${cloud?" في حسابك":" على هذا الجهاز"}. ${AR(flagged)} بندًا معلّمًا «مراجعة المعلم» لا تدخل في الدرجة حتى يؤكدها المعلم.</p><div class="row" style="margin-top:10px"><button class="btn ghost sm" id="resetAll">مسح كل التقدم</button></div></div>`;}
function bindProgress(){const pw=$("#practiceWrong");if(pw)pw.onclick=()=>{const keys=ITEMS.filter(x=>scorable(x.it)&&S.ans[x.key]&&S.ans[x.key].done&&!S.ans[x.key].ok);const m={};keys.forEach(x=>{(m[x.b.id]=m[x.b.id]||[]).push(x.i)});
  const units=BANK.filter(b=>m[b.id]).map(b=>({b:b.id,idx:m[b.id]}));units.forEach(u=>u.idx.forEach(i=>{const k=u.b+"#"+i;S.ans[k]=Object.assign({},S.ans[k],{done:false})}));save();startSession({title:"تدريب على أخطائي",units,mode:"practice",nav:"progress",back:"#progress"});};
 $("#resetAll").onclick=async()=>{const r=await modal(`<h3>مسح كل التقدم؟</h3><p class="muted">سيتم حذف جميع إجاباتك ونقاطك وأوسمتك وسجل الامتحانات. لا يمكن التراجع.</p>`,[["إلغاء",false,"gold"],["نعم، امسح",true,"ghost"]]);if(r){S={ans:{},pts:0,badges:[],exams:[],v:1};save();updatePts();route();toast("تم مسح التقدم");}};}

/* ---------- answer key ---------- */
let KEYF={w:"",s:"",q:""};
function vKey(){ const F=KEYF;const blocks=BANK.filter(b=>(!F.w||wk(b.w)===F.w)&&(!F.s||b.sec===F.s)&&(!F.q||(b.title+b.items.map(i=>i.q||"").join(" ")).includes(F.q)));
 const flagged=ITEMS.filter(x=>x.it.v||x.it.t==="teacher");
 return `<div class="eyebrow">للطالب وولي الأمر والمعلم</div><h1>دليل الإجابات</h1><p class="muted">كل سؤال بنصه الأصلي، والإجابة الصحيحة، والشرح أو القاعدة، ونماذج التعبير. فحص البيانات: ${AR(ITEMS.length)} بندًا · ${VALIDATION.length?`<span style="color:var(--bad)">${AR(VALIDATION.length)} ملاحظة</span>`:"لا أخطاء"} · ${AR(flagged.length)} بندًا يحتاج مراجعة المعلم.</p>
 <div class="filters"><select id="kW"><option value="">كل الأسابيع</option>${AVAILABLE_WEEKS.map(w=>`<option value="${w}" ${F.w===w?"selected":""}>${WEEK_LABEL[w]}</option>`).join("")}</select>
 <select id="kS"><option value="">كل المهارات</option>${SKILLS.filter(s=>BANK.some(b=>b.sec===s.k)).map(s=>`<option ${F.s===s.k?"selected":""}>${s.k}</option>`).join("")}</select><input id="kQ" placeholder="بحث في الأسئلة…" value="${esc(F.q)}" style="flex:1;min-width:180px"></div>
 ${blocks.length?blocks.map(b=>{const sk=SK[b.sec];return `<article class="block" style="--c:${sk.c}"><div class="block-h"><span class="tag"></span><div style="flex:1"><h3>${esc(b.title)}</h3><div class="meta"><span class="chip c" style="--c:${sk.c}">${b.sec}</span><span class="chip">${esc(b.lesson)}</span><span class="chip">${WEEK_LABEL[b.w]}${b.p?" · "+PERIOD_NAME[b.p]:""}${b.grp?" · مجموعة "+b.grp:""}</span><span class="chip">ص ${AR(b.page)}</span>${studyBtn(b.lesson,true)}</div></div></div>${b.note?`<div class="note">${esc(b.note)}</div>`:""}${b.source?`<div class="note" style="background:#EEF2FC;color:var(--navy2)">${esc(b.source)}</div>`:""}${listenHTML(b)}${passageHTML(b)}<div class="items">${b.items.map((it,i)=>it.t?`<div class="key-item"><div>${fmtQ(it.t==="blanks"?it.q.replace(/\{\d\}/g,"……"):it.q||"")}${it.t==="mcq"?` <span class="muted">(${it.opts.map(esc).join(" – ")})</span>`:""}${it.v?'<span class="vflag">مراجعة المعلم</span>':""}</div><div class="ka">✓ ${esc(answerText(it))}</div>${it.ex?`<div class="muted" style="font-size:15px">${esc(it.ex)}</div>`:""}${it.t==="essay"?modelHTML(it,false):""}</div>`:`<div class="sub">${esc(it.sub)}</div>`).join("")}</div></article>`;}).join(""):`<div class="empty">لا توجد نتائج.</div>`}`;}
function bindKey(){const F=KEYF;$("#kW").onchange=e=>{F.w=e.target.value;route();};$("#kS").onchange=e=>{F.s=e.target.value;route();};const q=$("#kQ");q.oninput=()=>{clearTimeout(q._t);q._t=setTimeout(()=>{F.q=q.value.trim();route();const n=$("#kQ");n.focus();n.setSelectionRange(n.value.length,n.value.length);},400);};}

/* ---------- read aloud (speech) ---------- */
let SPK=null, VOICE=null;
function pickVoice(){const sy=window.speechSynthesis;if(!sy)return null;const vs=sy.getVoices().filter(v=>/^ar/i.test(v.lang));
 return vs.find(v=>/eg/i.test(v.lang))||vs.find(v=>/google|natural|online/i.test(v.name))||vs[0]||null;}
if(window.speechSynthesis){VOICE=pickVoice();speechSynthesis.onvoiceschanged=()=>{VOICE=pickVoice();};}
const cleanSpeak=t=>String(t||"").replace(/\[|\]/g,"").replace(/\.{3,}|…+/g," فراغ ").replace(/\.\s*\./g,".").replace(/\*\*\*/g,"، ").replace(/[()«»"]/g," ").replace(/\s+/g," ").trim();
function itemSpeech(key){const x=IT[key];const it=x.it;let t=[];
 if(it.t==="pick"){t.push("ضع خطًّا تحت الكلمة المطلوبة في الجملة: "+it.q);}
 else if(it.t==="blanks"){t.push(it.q.replace(/\{\d\}/g," فراغ "));t.push("الكلمات: "+it.opts.join("، "));}
 else if(it.q)t.push(it.q);
 if(it.t==="mcq")it.opts.forEach((o,i)=>t.push(["أ","ب","ج","د","هـ","و"][i]+"، "+o));
 if(it.t==="multi"&&it.fields.length>1)t.push("المطلوب: "+it.fields.map(f=>f.l).join("، "));
 if(it.t==="set")t.push(it.groups.map(g=>g.l).join("، و"));
 if(it.t==="order")t.push("الكلمات: "+it.opts.join("، "));
 if(it.t==="sort")t.push("الخانات: "+it.cats.join("، ")+". الكلمات: "+it.words.map(w=>w[0]).join("، "));
 if(it.t==="copy")t.push("اكتب: "+it.text);
 if(!it.q&&!t.length)t.push(x.b.title);
 return cleanSpeak(t.join(". "));}
function stopSpeak(){if(window.malek)malek.setNarrationActive(document.body.classList.contains("malek-off"));try{window.speechSynthesis&&speechSynthesis.cancel();}catch(e){} if(SPK){SPK.classList.remove("on");SPK=null;}}
function speak(text,btn){const sy=window.speechSynthesis;
 if(!sy||!window.SpeechSynthesisUtterance){toast("القراءة الصوتية غير متاحة على هذا الجهاز");return;}
 const same=SPK===btn; stopSpeak(); if(same)return;
 if(!VOICE)VOICE=pickVoice();
 const parts=text.match(/[^.؟!\n]+[.؟!\n]?/g)||[text]; // chunk: long utterances get cut on some browsers
 let i=0; SPK=btn; btn&&btn.classList.add("on"); if(window.malek)malek.setNarrationActive(true);
 const next=()=>{ if(SPK!==btn)return; if(i>=parts.length){stopSpeak();return;}
  const u=new SpeechSynthesisUtterance(parts[i++].trim());u.lang=VOICE?VOICE.lang:"ar-EG";try{if(VOICE)u.voice=VOICE;}catch(e){}u.rate=.85;
  u.onend=next; u.onerror=ev=>{ if(ev.error==="interrupted"||ev.error==="canceled")return; stopSpeak(); toast(VOICE?"تعذّر تشغيل الصوت":"لا يوجد صوت عربي مثبت على هذا الجهاز؛ يمكن إضافته من إعدادات الجهاز (تحويل النص إلى كلام)"); };
  sy.speak(u); };
 if(!VOICE&&sy.getVoices().length)toast("لا يوجد صوت عربي على هذا الجهاز؛ قد تكون القراءة غير واضحة");
 next();}
document.addEventListener("click",e=>{const b=e.target.closest("[data-readq],[data-readp],[data-speak],[data-stop]");if(!b)return;e.preventDefault();e.stopPropagation();
 if(b.dataset.stop){stopSpeak();return;}
 if(b.dataset.readq){speak(itemSpeech(b.dataset.readq),b);return;}
 if(b.dataset.readp){const bl=BLOCK[b.dataset.readp];let p=bl.passage;if(p.startsWith("P_"))p=PASSAGES[p];speak(cleanSpeak(p.replace(/\n/g,". ")),b);return;}
 if(b.dataset.speak){speak(cleanSpeak(PASSAGES[b.dataset.speak]),b);}},true);
window.addEventListener("hashchange",stopSpeak);


/* ---------- «ذاكر لي» : revision sheets (source: student book) ---------- */
const REV=window.REVISION||{};
const REV_BY_LESSON={};Object.entries(REV).forEach(([id,r])=>(r.lessons||[]).forEach(l=>REV_BY_LESSON[l]=id));
const revId=l=>REV_BY_LESSON[l];
function studyBtn(lesson,small,big){const id=revId(lesson);if(!id)return"";
 if(SESSION&&SESSION.mode==="test"&&!SESSION.submitted)return"";
 const flag=REV[id].sections.every(x=>x.type==="flag");
 return `<a class="study-btn ${small?"sm":""} ${big?"big":""} ${flag?"muted-s":""}" href="#study-${id}" title="ذاكر لي: ${esc(REV[id].title)}" onclick="event.stopPropagation()"><svg viewBox="0 0 24 24" width="${big?20:16}" height="${big?20:16}" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H2zM22 5h-7a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h8z"/></svg><span>ذاكر لي</span></a>`;}
const hl=t=>esc(t).replace(/\[([^\]]+)\]/g,'<mark>$1</mark>');
const say=t=>String(t).replace(/[\[\]]/g,"");
function secHTML(x,i){const S=(t)=>`data-say="${esc(say(t))}"`;let body="",cls="";
 switch(x.type){
  case"idea":cls="span2 idea";body=`<p class="big-q" ${S(x.text)}>${hl(x.text)}</p>`;break;
  case"objectives":body=`<ul class="obj">${x.items.map(t=>`<li ${S(t)}>${hl(t)}</li>`).join("")}</ul>`;break;
  case"points":cls="span2";body=`<ol class="rpts">${x.items.map(t=>`<li ${S(t)}>${hl(t)}</li>`).join("")}</ol>`;break;
  case"vocab":cls="span2";body=`<div class="vgrid">${x.items.map(v=>{const extra=[v.note?["المراد",v.note.replace(/^المرادُ?:\s*/,"")]:null,v.ant?["المضاد",v.ant]:null,v.pl?["الجمع",v.pl]:null,v.sing?["المفرد",v.sing]:null].filter(Boolean);
    const t=`${v.w}: ${v.m}`+extra.map(e=>`، ${e[0]}: ${e[1]}`).join("");return `<div class="vcard" ${S(t)}><b>${esc(v.w)}</b><span>${esc(v.m)}</span>${extra.length?`<div class="vx">${extra.map(e=>`<i>${e[0]}: ${esc(e[1])}</i>`).join("")}</div>`:""}</div>`;}).join("")}</div>`;break;
  case"rule":cls="span2 rulebox";body=x.items.map(r=>`<div class="rule" ${S(r.k+": "+r.v)}><b>${esc(r.k)}</b><span>${hl(r.v)}</span></div>`).join("");break;
  case"cases":body=`<div class="cases">${x.items.map((c,ci)=>`<div class="case" ${S(c.t+". مثل: "+c.ex)}><span class="cn">${AR(ci+1)}</span><div><div>${hl(c.t)}</div><em>${esc(c.ex)}</em></div></div>`).join("")}</div>`;break;
  case"examples":cls=x.cols.length>2?"span2":"";body=`<div class="tbl-wrap"><table class="tbl ex-t"><thead><tr>${x.cols.map(c=>`<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${x.rows.map(r=>`<tr ${S(r.join("، "))}>${r.map(c=>`<td>${hl(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;break;
  case"explain":cls="span2";body=x.items.map(t=>`<p class="exp" ${S(t)}>${hl(t)}</p>`).join("");break;
  case"steps":cls="span2";body=`<div class="tl">${x.items.map((st,si)=>`<div class="tl-i" ${S(st.t+". "+st.d)}><span class="tl-n">${AR(si+1)}</span><div><b>${esc(st.t)}</b><p>${hl(st.d)}</p></div></div>`).join("")}</div>`;break;
  case"stairs":body=`<div class="stairs ${x.up===false?"":"up"}">${x.items.map((st,si)=>`<div class="stp" style="--i:${si}" ${S(st)}><span>${AR(si+1)}</span>${esc(st)}</div>`).join("")}</div>${x.foot?`<p class="foot" ${S(x.foot)}>${hl(x.foot)}</p>`:""}`;break;
  case"questions":cls="span2";body=`<div class="qgrid">${x.items.map((q,qi)=>`<div class="qc" ${S(q)}><span>؟</span>${hl(q)}</div>`).join("")}</div>`;break;
  case"compare":body=`<div class="cmp"><div ${S(x.a.t+": "+x.a.d)}><b>${esc(x.a.t)}</b><span>${esc(x.a.d)}</span></div><div class="vs">≠</div><div ${S(x.b.t+": "+x.b.d)}><b>${esc(x.b.t)}</b><span>${esc(x.b.d)}</span></div></div>`;break;
  case"beauty":cls="span2";body=`<div class="bgrid">${x.items.map(b=>`<div class="bc" ${S(b.e+". "+b.why)}><b>${esc(b.e)}</b><span><small>لماذا هو جميل؟</small>${hl(b.why)}</span></div>`).join("")}</div>`;break;
  case"poem":cls="span2";body=`<div class="poem rev-poem">${x.lines.map(l=>`<div ${S(l[0])}>${esc(l[0])}</div><div class="st">***</div><div ${S(l[1])}>${esc(l[1])}</div>`).join("")}</div>`;break;
  case"bio":body=`<p class="exp" ${S(x.text)}>${hl(x.text)}</p>`;break;
  case"text":cls="span2";body=x.parts.map(pt=>`<div class="tpart" ${S(pt.l+": "+pt.t)}><span class="tl-tag">${esc(pt.l)}</span><p>${hl(pt.t)}</p></div>`).join("");break;
  case"note":cls="note-s";body=`<p ${S(x.text)}>${hl(x.text)}</p>`;break;
  case"flag":cls="span2 flag-s";body=`<p ${S(x.text)}>${esc(x.text)}</p>`;break;}
 const ico={idea:"💡",objectives:"🎯",points:"📌",vocab:"📖",rule:"📐",cases:"🧭",examples:"🔍",explain:"👀",steps:"🪜",stairs:"📶",questions:"❓",compare:"⚖",beauty:"✨",poem:"📜",bio:"👤",text:"📄",note:"⚠",flag:"🚩"}[x.type];
 return `<section class="rsec ${cls}" style="--d:${i*60}ms">${x.h?`<h3 ${S(x.h)}><span class="ri">${ico}</span>${esc(x.h)}</h3>`:""}${body}</section>`;}
function pairSecs(arr){const half=h=>!/class="rsec [^"]*span2/.test(h);const out=[];for(let i=0;i<arr.length;i++){const h=arr[i];if(half(h)){if(i+1<arr.length&&half(arr[i+1])){out.push(h,arr[i+1]);i++;}else out.push(h.replace('class="rsec ','class="rsec span2 '));}else out.push(h);}return out.join("");}
function vStudy(id){const R=REV[id];if(!R)return `<div class="empty">لا توجد بطاقة مراجعة. <a href="#skills">عودة</a></div>`;
 const sk=SK[R.kind]||SK["النحو"]; const Ls=LESSONS.filter(L=>R.lessons.includes(L.lesson)); const n=Ls.reduce((a,L)=>a+L.nScore,0);
 const isFlag=R.sections.every(x=>x.type==="flag");
 return `<div class="crumbs"><a href="#skills">التدريب حسب المهارة</a> / ذاكر لي</div>
 <div class="rev" style="--c:${sk.c}">
  <header class="rev-hero"><div class="rev-hero-in"><img src="assets/logo.png" alt="International Education Egypt" class="rev-logo"><div><div class="eyebrow" style="color:#fff;opacity:.85">ذاكر لي · ${esc(R.kind)}</div><h1 data-say="${esc(say(R.title))}">${esc(R.title)}</h1><div class="rev-src">📘 المصدر: ${esc(R.src)}</div></div><span class="rev-ico" aria-hidden="true">${R.icon||"📘"}</span></div>
  ${isFlag?"":`<div class="player" id="player" role="region" aria-label="مشغل القراءة الصوتية">
   <button class="btn gold pl-main" id="plMain"><span>🔊</span> اقرأ لي</button>
   <button class="btn soft sm" id="plPause" disabled>⏸ إيقاف مؤقت</button>
   <button class="btn soft sm" id="plResume" disabled>▶ استكمال</button>
   <button class="btn soft sm" id="plStop" disabled>■ إيقاف</button>
   <button class="btn soft sm" id="plRepeat">↺ إعادة</button>
   <label class="pl-speed">السرعة <select id="plRate"><option value=".7">بطيئة</option><option value=".85" selected>عادية</option><option value="1">متوسطة</option><option value="1.15">سريعة</option></select></label>
   <span class="pl-stat" id="plStat"></span></div>`}</header>
  <div class="rgrid" id="sheet">${pairSecs(R.sections.map(secHTML))}</div>
  <div class="rev-end"><div><h3 style="margin:0">جاهز؟ ابدأ حل التقييم</h3><p class="muted" style="margin:4px 0 0">${AR(n)} سؤالًا من كتاب التقييمات لهذا الدرس.</p></div>
   <div class="row">${PREV_SESSION?`<button class="btn soft" id="backSess">العودة إلى ما كنت تحله</button>`:""}${Ls.length?`<button class="btn gold" id="startRev">ابدأ حل التقييم ←</button>`:""}</div></div>
  <div id="adminBox"></div>
 </div>`;}
function bindStudy(id){const R=REV[id];if(!R)return;
 const st=$("#startRev");if(st)st.onclick=()=>{const Ls=LESSONS.filter(L=>R.lessons.includes(L.lesson));const ord=Object.fromEntries(BANK.map((b,i)=>[b.id,i]));const bs=Ls.flatMap(L=>L.blocks).sort((a,b)=>ord[a.id]-ord[b.id]);PREV_SESSION=null;startSession({title:"تقييم: "+R.title,units:unitsFromBlocks(bs),mode:"practice",nav:"skills",back:"#study-"+id});};
 const bk=$("#backSess");if(bk)bk.onclick=()=>{const X=PREV_SESSION;PREV_SESSION=null;startSession(Object.assign({},X,{local:X.local}));};
 if($("#plMain"))Reader.bind();
 adminUI(id);}

/* full-sheet reader: sequential segments, sentence chunks, highlight, pause/resume/stop/repeat/speed */
const Reader={segs:[],i:0,j:0,state:"idle",rate:.85,
 chunks(t){const out=[];String(t).split(/(?<=[.!؟?:؛\n])\s+/).forEach(s=>{s=s.trim();if(!s)return;while(s.length>180){let k=s.lastIndexOf("،",180);if(k<60)k=s.lastIndexOf(" ",180);if(k<1)k=180;out.push(s.slice(0,k+1));s=s.slice(k+1).trim();}if(s)out.push(s);});return out;},
 bind(){const R=this;R.stop(true);R.segs=$$("#app [data-say]").map(el=>({el,parts:R.chunks(cleanSpeak(el.dataset.say))})).filter(s=>s.parts.length);
  $("#plMain").onclick=()=>R.play(0);$("#plPause").onclick=()=>R.pause();$("#plResume").onclick=()=>R.resume();$("#plStop").onclick=()=>R.stop();$("#plRepeat").onclick=()=>R.play(0);
  $("#plRate").onchange=e=>{R.rate=+e.target.value;if(R.state==="playing"){try{speechSynthesis.cancel();}catch(_){}setTimeout(()=>R.speakNext(),60);}};
  R.segs.forEach((s,si)=>{s.el.addEventListener("dblclick",()=>R.play(si));});R.ui();},
 ui(){const st=this.state,set=(id,d)=>{const b=$("#"+id);if(b)b.disabled=d;};set("plPause",st!=="playing");set("plResume",st!=="paused");set("plStop",st==="idle");
  const m=$("#plMain");if(m)m.classList.toggle("on",st==="playing");const s=$("#plStat");if(s)s.textContent=st==="idle"?"":`${st==="paused"?"متوقف مؤقتًا · ":""}الجزء ${AR(this.i+1)} من ${AR(this.segs.length)}`;},
 mark(){$$(".reading").forEach(e=>e.classList.remove("reading"));const s=this.segs[this.i];if(!s)return;s.el.classList.add("reading");const r=s.el.getBoundingClientRect();if(r.top<120||r.bottom>innerHeight-40)s.el.scrollIntoView({behavior:"smooth",block:"center"});},
 play(from){const sy=window.speechSynthesis;if(!sy||!window.SpeechSynthesisUtterance){toast("القراءة الصوتية غير متاحة على هذا الجهاز");return;}
  stopSpeak();try{sy.cancel();}catch(_){} this.i=from||0;this.j=0;this.state="playing";this.gen=(this.gen||0)+1;this.ui();
  if(!VOICE)VOICE=pickVoice(); if(!VOICE&&sy.getVoices().length)toast("لا يوجد صوت عربي مثبت على هذا الجهاز؛ أضِفه من إعدادات (تحويل النص إلى كلام) لقراءة أوضح");
  setTimeout(()=>this.speakNext(),80);},
 speakNext(){const R=this;if(R.state!=="playing")return;const s=R.segs[R.i];if(!s){R.done();return;}R.mark();R.ui();
  const g=R.gen;const u=new SpeechSynthesisUtterance(s.parts[R.j]);u.lang=VOICE?VOICE.lang:"ar-EG";try{if(VOICE)u.voice=VOICE;}catch(_){}u.rate=R.rate;
  let ended=false;const adv=()=>{if(ended||g!==R.gen||R.state!=="playing")return;ended=true;clearTimeout(R.wd);R.j++;if(R.j>=s.parts.length){R.i++;R.j=0;}R.speakNext();};
  u.onend=adv;u.onerror=ev=>{if(ev.error==="interrupted"||ev.error==="canceled")return;adv();};
  clearTimeout(R.wd);R.wd=setTimeout(()=>{if(!ended&&g===R.gen&&R.state==="playing"&&!speechSynthesis.speaking)adv();},Math.max(6000,s.parts[R.j].length*260/R.rate));
  try{speechSynthesis.speak(u);}catch(e){R.stop();toast("تعذّر تشغيل الصوت");}},
 pause(){if(this.state!=="playing")return;this.state="paused";this.gen++;clearTimeout(this.wd);try{speechSynthesis.cancel();}catch(_){}this.ui();},
 resume(){if(this.state!=="paused")return;this.state="playing";this.gen++;this.ui();setTimeout(()=>this.speakNext(),60);},
 stop(silent){this.state="idle";this.gen=(this.gen||0)+1;clearTimeout(this.wd);try{window.speechSynthesis&&speechSynthesis.cancel();}catch(_){}$$(".reading").forEach(e=>e.classList.remove("reading"));if(!silent)this.ui();},
 done(){this.state="idle";$$(".reading").forEach(e=>e.classList.remove("reading"));this.ui();toast("✓ انتهت قراءة المراجعة كاملة. ابدأ حل التقييم الآن!");}};
window.addEventListener("hashchange",()=>Reader.stop(true));

/* admin overrides: stored once in db (revisions/<id>), editable by Editors/Owner only */
let ADMIN=false, REVDB=null; const REV_ORIG={};
(async()=>{try{if(!window.claude||!window.claude.use)return;const db=await window.claude.use("db");const user=await window.claude.use("user");if(!db)return;REVDB=db;
  try{ADMIN=!!(user&&await user.canEdit());}catch(e){}
  const snap=await db.collection("revisions").get();snap.docs.forEach(d=>{const v=d.data();if(v&&v.json&&REV[d.id]){try{const o=JSON.parse(v.json);REV_ORIG[d.id]=REV[d.id];REV[d.id]=Object.assign({},REV[d.id],o);REV[d.id].lessons=REV_ORIG[d.id].lessons;}catch(e){}}});
  if(/^#study-/.test(location.hash)&&!SESSION)route();
 }catch(e){}})();
function adminUI(id){const box=$("#adminBox");if(!box||!ADMIN||!REVDB)return;const R=REV[id];
 box.innerHTML=`<details class="model" style="margin-top:16px"><summary>⚙ تعديل البطاقة (للمسؤول فقط)</summary><div style="padding:0 14px 14px"><p class="muted" style="font-size:14px">عدّل الأقسام (JSON) إذا تغيّر كتاب الطالب. يُحفظ التعديل مرة واحدة ويظهر لجميع الطلاب.</p><textarea class="inp" id="revJson" style="min-height:260px;direction:ltr;font-family:monospace;font-size:13px">${esc(JSON.stringify({title:R.title,src:R.src,sections:R.sections},null,1))}</textarea><div class="row" style="margin-top:8px"><button class="btn sm" id="revSave">حفظ</button>${REV_ORIG[id]?`<button class="btn ghost sm" id="revReset">استعادة النسخة الأصلية</button>`:""}</div></div></details>`;
 $("#revSave").onclick=async()=>{let o;try{o=JSON.parse($("#revJson").value);if(!Array.isArray(o.sections))throw 0;}catch(e){toast("صيغة غير صحيحة");return;}
  try{await REVDB.doc("revisions/"+id).set({json:JSON.stringify(o),at:Date.now()});if(!REV_ORIG[id])REV_ORIG[id]=REV[id];REV[id]=Object.assign({},REV[id],o);toast("تم الحفظ");route();}catch(e){toast("تعذّر الحفظ");}};
 const rr=$("#revReset");if(rr)rr.onclick=async()=>{try{await REVDB.doc("revisions/"+id).delete();REV[id]=REV_ORIG[id];delete REV_ORIG[id];toast("تمت الاستعادة");route();}catch(e){toast("تعذّر");}};}

/* ---------- boot ---------- */
window.__IEE={BANK,ITEMS,LESSONS,grade,norm,kwMatch,VALIDATION,get S(){return S},get SESSION(){return SESSION}};
updatePts(); route();
})();
