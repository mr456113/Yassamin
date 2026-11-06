/* q2.js: آزمون‌گیری */
Object.assign(Q.tabOf,{exam:'new',result:'new'});
Q.S={type:'subj',subj:new Set(),book:new Set(),topic:null,n:10,min:12};
Q.D={subs:[],books:[],hist:[],topicName:''};
const TYPES=[['subj','🎨 ترکیبی از چند درس'],['book','📚 جامع از چند کتاب'],['wrong','🔁 از غلط‌های قبلی']];
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const fa=n=>String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
const jd=x=>new Date(x).toLocaleDateString('fa-IR-u-ca-persian');

(function(){
  const st=document.createElement('style');
  st.textContent='.opt{display:block;width:100%;text-align:right;border:2px solid #f0d9f5;background:#fff;border-radius:14px;padding:12px;margin:8px 0;font:inherit;color:inherit;cursor:pointer;line-height:1.8}.opt.sel{background:#ffe0ef;border-color:#ff9ec4;font-weight:600}.qnav{display:flex;flex-wrap:wrap;gap:6px}.qn{width:38px;height:38px;border-radius:12px;border:2px solid #f0d9f5;background:#fff;font:inherit;color:inherit;cursor:pointer}.qn.dn{background:#d9f5e5;border-color:#9fdcb8}.qn.cur{border-color:#ff7eb0;background:#ffe0ef}.chk{display:flex;align-items:center;gap:8px;padding:8px;background:#fff;border-radius:12px;margin:6px 0;font-size:15px;opacity:1}.ro{border-radius:14px;padding:10px;margin:6px 0;background:#fff}.ro.ok{background:#dff7e8;border:2px solid #9fdcb8}.ro.bad{background:#ffe3e3;border:2px solid #f3a6a6}.ex{font-size:13px;margin-top:6px;opacity:.9;line-height:1.9}.tip{background:#fff6cf;border-radius:12px;padding:8px;margin:8px 0;font-size:13px}.stat{display:flex;gap:8px;flex-wrap:wrap}.stat div{flex:1;min-width:80px;background:#fff;border-radius:16px;padding:10px;text-align:center}.stat b{display:block;font-size:20px}.hideok .good{display:none}.qb{white-space:pre-line;line-height:2}';
  document.head.appendChild(st);
  window.addEventListener('beforeunload',e=>{if(Q.E&&!Q.E.fin&&Q.cur==='exam'){e.preventDefault();e.returnValue='';}});
})();

/* ---------- صفحه‌ی ساخت آزمون ---------- */
Q.views.new=async arg=>{
  Q.show(LOAD);
  const S=Q.S;
  if(arg){
    S.subj=new Set();S.book=new Set();S.topic=null;
    if(arg.subject){S.type='subj';S.subj.add(arg.subject);}
    if(arg.book){S.type='book';S.book.add(arg.book);}
    if(arg.topic){S.type='topic';S.topic=arg.topic;}
  }
  const r=await Promise.all([
    sb.from('subjects').select('id,name').order('sort'),
    sb.from('books').select('id,name,subject_id,grade').eq('active',true).order('grade'),
    sb.from('attempts').select('id,title,percent,total,finished_at').not('finished_at','is',null).order('finished_at',{ascending:false}).limit(5),
    S.topic?sb.from('topics').select('name').eq('id',S.topic).maybeSingle():Promise.resolve({data:null})]);
  if(r[0].error)throw r[0.0];
  Q.D={subs:r[0].data||[],books:r[1].data||[],hist:r[2].data||[],topicName:(r[3].data&&r[3].data.name)||''};
  paintNew();
};
function chk(k,id,label,on){return '<label class="chk"><input type="checkbox" style="width:auto;margin:0" '+(on?'checked':'')+' onchange="Q.tog(\''+k+'\',\''+id+'\')"> '+esc(label)+'</label>';}
function paintNew(){
  const S=Q.S,D=Q.D;
  const types=TYPES.slice();if(S.topic)types.push(['topic','🎯 فقط این مبحث']);
  let h='<h2>📝 آزمون جدید</h2><div class="card"><div class="row" style="flex-wrap:wrap">'+types.map(t=>'<button class="btn sm'+(S.type===t[0]?'':' ghost')+'" onclick="Q.setT(\''+t[0]+'\')">'+t[1]+'</button>').join('')+'</div>';
  if(S.type==='subj')h+='<p>درس‌ها را انتخاب کن:</p>'+D.subs.map(s=>chk('subj',s.id,(EM[s.name]||'📚')+' '+s.name,S.subj.has(s.id))).join('');
  else if(S.type==='book'){
    const sn={};D.subs.forEach(s=>{sn[s.id]=s.name;});
    h+='<p>کتاب‌ها را انتخاب کن:</p>'+(D.books.map(b=>chk('book',b.id,(sn[b.subject_id]||'')+' – '+b.name,S.book.has(b.id))).join('')||'<div>هنوز کتابی نیست.</div>');
  }
  else if(S.type==='topic')h+='<p>آزمون از مبحث: <b>'+esc(D.topicName)+'</b></p>';
  else h+='<p>سوال‌هایی که قبلاً غلط زده‌ای و بعدش هنوز درست جواب نداده‌ای.</p>';
  h+='<label>تعداد سوال (حداکثر ۱۰۰)</label><input id="fn" type="number" min="1" max="100" value="'+S.n+'" oninput="Q.setN(this.value)">';
  h+='<label>زمان (دقیقه)</label><input id="fmin" type="number" min="1" max="300" value="'+S.min+'" oninput="Q.S.min=+this.value||1">';
  h+='<button class="btn" onclick="Q.start()">🚀 شروع آزمون</button></div>';
  if(D.hist.length)h+='<h2>آزمون‌های اخیر</h2>'+D.hist.map(a=>'<div class="item"><div><b>'+esc(a.title||'آزمون')+'</b><br><small>'+jd(a.finished_at)+' · '+fa(a.total)+' سوال · '+fa(a.percent)+'٪</small></div><div class="acts"><button class="btn sm" onclick="Q.go(\'result\',\''+a.id+'\')">مرور</button></div></div>').join('');
  $('#main').innerHTML=h;
}
Q.setT=t=>{Q.S.type=t;paintNew();};
Q.setN=v=>{const n=Math.max(1,Math.min(100,+v||1));Q.S.n=n;Q.S.min=Math.ceil(n*1.2);const e=$('#fmin');if(e)e.value=Q.S.min;};
Q.tog=(k,id)=>{const s=Q.S[k];s.has(id)?s.delete(id):s.add(id);};

/* ---------- شروع آزمون ---------- */
Q.start=async()=>{
  const S=Q.S;let ids=[],title='',sub=[],bk=[];
  try{
    toast('در حال آماده‌سازی… ⏳');
    if(S.type==='wrong'){
      const a=await sb.from('answers').select('question_id,is_correct').eq('user_id',Q.uid).not('chosen','is',null).order('created_at',{ascending:false}).limit(1000);
      if(a.error)throw a.error;
      const seen={};(a.data||[]).forEach(x=>{if(!(x.question_id in seen))seen[x.question_id]=x.is_correct;});
      ids=Object.keys(seen).filter(k=>!seen[k]);title='آزمون از غلط‌های قبلی';
    }else{
      let q=sb.from('questions').select('id').eq('active',true).limit(1000);
      if(S.type==='subj'){sub=[...S.subj];if(!sub.length){toast('حداقل یک درس انتخاب کن');return;}q=q.in('subject_id',sub);title='آزمون ترکیبی';}
      else if(S.type==='book'){bk=[...S.book];if(!bk.length){toast('حداقل یک کتاب انتخاب کن');return;}q=q.in('book_id',bk);title='آزمون جامع';}
      else{q=q.eq('topic_id',S.topic);title='آزمون مبحث: '+Q.D.topicName;}
      const r=await q;if(r.error)throw r.error;
      ids=(r.data||[]).map(x=>x.id);
    }
    if(!ids.length){toast(S.type==='wrong'?'هنوز غلطی نداری 🎉':'سوالی پیدا نشد');return;}
    const n=Math.max(1,Math.min(100,S.n));
    ids=shuf(ids).slice(0,n);
    const f=await sb.from('questions').select('id,body,options,correct,expl').in('id',ids);
    if(f.error)throw f.error;
    const m={};f.data.forEach(x=>{m[x.id]=x;});
    const qs=ids.map(i=>m[i]).filter(Boolean);
    if(qs.length<n)toast('فقط '+fa(qs.length)+' سوال موجود بود');
    const mins=Math.max(1,S.min||Math.ceil(qs.length*1.2));
    const at=await sb.from('attempts').insert({kind:S.type,title,subject_ids:sub,book_ids:bk,total:qs.length,duration_sec:mins*60}).select('id').single();
    if(at.error)throw at.error;
    Q.E={att:at.data.id,qs,i:0,a:qs.map(()=>null),start:Date.now(),end:Date.now()+mins*60000,fin:false,saved:false};
    Q.go('exam');
  }catch(e){toast('خطا: '+(e.message||e));}
};

/* ---------- خود آزمون ---------- */
Q.views.exam=()=>{
  const E=Q.E;if(!E){Q.go('new');return;}
  $('#nav').style.display='none';
  paintExam();
  clearInterval(E.iv);E.iv=setInterval(tick,1000);tick();
};
function paintExam(){
  const E=Q.E,q=E.qs[E.i];
  const nv=E.qs.map((x,i)=>'<button class="qn'+(i===E.i?' cur':'')+(E.a[i]?' dn':'')+'" onclick="Q.jump('+i+')">'+fa(i+1)+'</button>').join('');
  const op=q.options.map((o,k)=>'<button class="opt'+(E.a[E.i]===k+1?' sel':'')+'" onclick="Q.pick('+(k+1)+')">'+fa(k+1)+') '+esc(o)+'</button>').join('');
  $('#main').innerHTML='<div class="card"><div class="row" style="justify-content:space-between;margin:0"><b>سوال '+fa(E.i+1)+' از '+fa(E.qs.length)+'</b><b id="tm"></b></div></div>'+
   '<div class="card"><div class="qb">'+esc(q.body)+'</div>'+op+'<button class="btn sm ghost" onclick="Q.pick(null)">پاک کردن جواب</button></div>'+
   '<div class="card"><div class="qnav">'+nv+'</div></div>'+
   '<div class="row"><button class="btn ghost" onclick="Q.jump('+(E.i-1)+')">← قبلی</button><button class="btn ghost" onclick="Q.jump('+(E.i+1)+')">بعدی →</button><button class="btn" onclick="Q.finish()">🏁 پایان</button></div>'+
   '<div class="row"><button class="btn sm ghost" onclick="Q.quit()">خروج بدون ذخیره</button></div>';
  tick();
}
function tick(){
  const E=Q.E,el=document.getElementById('tm');
  if(!E||E.fin||!el){if(E)clearInterval(E.iv);return;}
  const s=Math.max(0,Math.round((E.end-Date.now())/1000));
  el.textContent='⏱ '+fa(String(Math.floor(s/60)).padStart(2,'0'))+':'+fa(String(s%60).padStart(2,'0'));
  el.style.color=s<60?'#e0457b':'';
  if(s<=0){clearInterval(E.iv);toast('وقت تمام شد ⏰');Q.finish(true);}
}
Q.pick=v=>{const E=Q.E;E.a[E.i]=v;paintExam();};
Q.jump=i=>{const E=Q.E;if(i<0||i>=E.qs.length)return;E.i=i;paintExam();window.scrollTo(0,0);};
Q.quit=()=>{
  if(!confirm('از آزمون خارج می‌شوی و چیزی ذخیره نمی‌شود. مطمئنی؟'))return;
  clearInterval(Q.E.iv);Q.E=null;$('#nav').style.display='';Q.go('home');
};
Q.finish=async auto=>{
  const E=Q.E;if(!E||E.fin)return;
  const blank=E.a.filter(x=>!x).length;
  if(!auto&&!confirm(blank?fa(blank)+' سوال بی‌جواب مانده. آزمون تمام شود؟':'آزمون تمام شود؟'))return;
  E.fin=true;clearInterval(E.iv);
  Q.show('<div class="card">در حال ثبت نتیجه… 🐻</div>');
  let c=0,w=0;
  E.qs.forEach((q,i)=>{const ch=E.a[i];if(ch){ch===q.correct?c++:w++;}});
  const total=E.qs.length,pct=Math.round(((c-w/3)/total)*1000)/10;
  try{
    if(!E.saved){
      const rows=E.qs.map((q,i)=>({attempt_id:E.att,question_id:q.id,chosen:E.a[i],is_correct:!!E.a[i]&&E.a[i]===q.correct}));
      const r=await sb.from('answers').insert(rows);
      if(r.error)throw r.error;
      E.saved=true;
    }
    const u=await sb.from('attempts').update({total,correct:c,wrong:w,blank:total-c-w,percent:pct,used_sec:Math.round((Date.now()-E.start)/1000),finished_at:new Date().toISOString()}).eq('id',E.att);
    if(u.error)throw u.error;
  }catch(e){
    E.fin=false;
    Q.show('<div class="card">😿 ثبت نشد: <code>'+esc(e.message||e)+'</code><br><br><button class="btn" onclick="Q.finish(true)">دوباره تلاش کن</button></div>');
    return;
  }
  $('#nav').style.display='';
  Q.go('result',E.att);
};

/* ---------- نتیجه و پاسخ تشریحی ---------- */
Q.views.result=async id=>{
  Q.show(LOAD);
  const r=await Promise.all([
    sb.from('attempts').select('*').eq('id',id).single(),
    sb.from('answers').select('id,question_id,chosen,is_correct,confused').eq('attempt_id',id)]);
  if(r[0].error)throw r[0].error;
  const A=r[0].data;let an=r[1].data||[];
  const qm={};
  if(an.length){
    const qr=await sb.from('questions').select('id,body,options,correct,expl').in('id',an.map(x=>x.question_id));
    if(qr.error)throw qr.error;
    qr.data.forEach(x=>{qm[x.id]=x;});
  }
  if(Q.E&&Q.E.att===id){const o=Q.E.qs.map(q=>q.id);an.sort((x,y)=>o.indexOf(x.question_id)-o.indexOf(y.question_id));}
  const p=A.percent==null?0:+A.percent;
  const emo=p>=70?'🎉':p>=50?'😊':'🤗';
  const msg=p>=70?'عالی بود! آفرین یاسمن':p>=50?'خوب بود، یه کم دیگه تا قله':'مهم اینه که دیدی کجا بلد نیستی، همین‌جا رشد شروع می‌شود';
  const head='<div class="card" style="text-align:center"><div style="font-size:50px">'+emo+'</div><h2>'+esc(A.title||'آزمون')+'</h2><div style="font-size:34px;font-weight:800">'+fa(p)+'٪</div><p>'+msg+'</p>'+
   '<div class="stat"><div><b>'+fa(A.correct)+'</b>درست</div><div><b>'+fa(A.wrong)+'</b>غلط</div><div><b>'+fa(A.blank)+'</b>نزده</div><div><b>'+fa(Math.floor((A.used_sec||0)/60))+'</b>دقیقه</div></div>'+
   '<small>درصد = (درست − غلط÷۳) ÷ کل × ۱۰۰</small></div>';
  const list=an.map((x,i)=>{
    const q=qm[x.question_id];if(!q)return '';
    const ex=(q.expl&&q.expl.o)||[];
    const ops=q.options.map((o,k)=>{
      const n=k+1;let cls='';if(n===q.correct)cls=' ok';else if(n===x.chosen)cls=' bad';
      const e=String(ex[k]||'').trim();
      return '<div class="ro'+cls+'"><b>'+fa(n)+')</b> '+esc(o)+(n===x.chosen?' <small>(انتخاب تو)</small>':'')+(n===q.correct?' ✅':'')+(e?'<div class="ex">'+(n===q.correct?'چرا درست است: ':'چرا غلط است: ')+esc(e)+'</div>':'')+'</div>';
    }).join('');
    const stt=x.chosen?(x.is_correct?'✅ درست':'❌ غلط'):'⚪ بی‌جواب';
    const tip=q.expl&&q.expl.tip?'<div class="tip">💡 '+esc(q.expl.tip)+'</div>':'';
    return '<div class="card'+(x.is_correct?' good':'')+'"><b>'+fa(i+1)+'. '+stt+'</b><div class="qb">'+esc(q.body)+'</div>'+ops+tip+
      '<div class="row">'+(x.confused?'<button class="btn sm ghost" disabled>ثبت شد 🧠</button>':'<button class="btn sm ghost" id="cf'+x.id+'" onclick="Q.conf(\''+x.id+'\')">🤔 متوجه نشدم</button>')+
      '<button class="btn sm ghost" onclick="Q.rep(\''+q.id+'\')">🚩 گزارش سوال</button></div></div>';
  }).join('');
  Q.show(head+'<div class="row"><button class="btn sm" onclick="document.getElementById(\'rv\').classList.remove(\'hideok\')">همه‌ی سوال‌ها</button><button class="btn sm ghost" onclick="document.getElementById(\'rv\').classList.add(\'hideok\')">فقط غلط و بی‌جواب</button></div><div id="rv">'+list+'</div>'+
    '<div class="row"><button class="btn" onclick="Q.go(\'new\')">📝 آزمون تازه</button><button class="btn ghost" onclick="Q.go(\'weak\')">🧠 ضعف‌ها</button></div>');
};
Q.conf=async id=>{
  const r=await sb.from('answers').update({confused:true}).eq('id',id);
  if(r.error){toast('خطا: '+r.error.message);return;}
  const b=document.getElementById('cf'+id);if(b){b.textContent='ثبت شد 🧠';b.disabled=true;}
  toast('این مبحث به ضعف‌ها اضافه شد 🧠');
};
Q.rep=async qid=>{
  const note=prompt('مشکل سوال چیست؟ (اختیاری)');
  if(note===null)return;
  const r=await sb.from('question_reports').insert({question_id:qid,note:note});
  if(r.error){toast('خطا: '+r.error.message);return;}
  toast('گزارش ثبت شد 🚩');
};
