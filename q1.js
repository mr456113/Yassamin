const SB_URL='https://pgslacpkdhanzylahsaz.supabase.co';
const SB_KEY='sb_publishable_8q4PurSj8hd8bOnsDu9m_Q_O4Qm_oIW';
const sb=window.supabase.createClient(SB_URL,SB_KEY);
const Q={views:{},tabOf:{subject:'home',book:'home',topic:'home'},cur:'home',arg:null,uid:null,admin:false};
window.Q=Q;
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LOAD='<div class="card">در حال بارگذاری… 🐻</div>';
const EM={'ریاضی و آمار':'🧮','علوم و فنون ادبی':'🪶','جامعه‌شناسی':'👥','روان‌شناسی':'🧠','عربی':'🕌','تاریخ':'🏺','جغرافیا':'🗺️','فلسفه و منطق':'🤔','اقتصاد':'💰','فارسی':'📖','دین و زندگی':'🌙','زبان انگلیسی':'🔤','سلامت و بهداشت':'🍎'};

function toast(m){const t=$('#toast');t.textContent=m;t.className='show';clearTimeout(toast.t);toast.t=setTimeout(()=>{t.className=''},2600);}
Q.toast=toast;
Q.show=h=>{$('#main').innerHTML=h;window.scrollTo(0,0);};
Q.err=e=>{console.error(e);Q.show('<div class="card">😿 مشکلی پیش آمد:<br><code>'+esc(e.message||e)+'</code></div>');};
Q.reload=()=>Q.go(Q.cur,Q.arg);
Q.go=(v,a)=>{
  Q.cur=v;Q.arg=a;
  const tab=Q.tabOf[v]||v;
  document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.v===tab));
  const f=Q.views[v];
  if(!f){Q.show('<div class="card">این بخش هنوز نصب نشده 🧸</div>');return;}
  try{const r=f(a);if(r&&r.catch)r.catch(e=>Q.err(e));}catch(e){Q.err(e);}
};

Q.form=(title,fields,ok)=>{
  const m=document.createElement('div');m.className='modal';
  const inner=fields.map(f=>{
    let c;
    if(f.type==='area')c='<textarea data-k="'+f.k+'" rows="'+(f.rows||3)+'">'+esc(f.val)+'</textarea>';
    else if(f.type==='sel')c='<select data-k="'+f.k+'">'+f.opts.map(o=>'<option value="'+o[0]+'">'+esc(o[1])+'</option>').join('')+'</select>';
    else c='<input data-k="'+f.k+'" value="'+esc(f.val)+'">';
    return '<label>'+f.label+'</label>'+c;
  }).join('');
  m.innerHTML='<div class="box"><h3>'+title+'</h3>'+inner+'<div class="row"><button class="btn" id="mok">ثبت</button><button class="btn ghost" id="mno">بستن</button></div></div>';
  document.body.appendChild(m);
  $('#mno',m).onclick=()=>m.remove();
  $('#mok',m).onclick=async()=>{
    const v={};m.querySelectorAll('[data-k]').forEach(e=>{v[e.dataset.k]=e.value;});
    const r=await ok(v);
    if(r!==false)m.remove();
  };
};

function loginView(){
  $('#app').innerHTML='<div class="login"><div class="em2">🐻</div><h2>آزمون‌خونه</h2><input id="em" type="email" placeholder="ایمیل" dir="ltr"><input id="pw" type="password" placeholder="رمز" dir="ltr"><button class="btn" id="lg">ورود</button><div id="lerr" style="margin-top:10px;font-size:13px"></div></div>';
  $('#lg').onclick=async()=>{
    const r=await sb.auth.signInWithPassword({email:$('#em').value.trim(),password:$('#pw').value});
    if(r.error){$('#lerr').textContent='ورود نشد: '+r.error.message;return;}
    boot();
  };
}

function shell(){
  const tabs=[['home','🐻 درس‌ها'],['new','📝 آزمون'],['weak','🧠 ضعف‌ها'],['mastery','🌊 تسلط']];
  if(Q.admin)tabs.push(['reports','🚩 گزارش‌ها']);
  $('#app').innerHTML='<header><a href="index.html" class="back">→ سایت اصلی</a><div class="ttl">🐻 آزمون‌خونه</div></header><nav id="nav">'+tabs.map(x=>'<button data-v="'+x[0]+'" onclick="Q.go(\''+x[0]+'\')">'+x[1]+'</button>').join('')+'</nav><main id="main"></main>';
}

async function boot(){
  const s=await sb.auth.getSession();
  if(!s.data.session){loginView();return;}
  Q.uid=s.data.session.user.id;
  const p=await sb.from('profiles').select('role,name').eq('id',Q.uid).maybeSingle();
  Q.admin=!!(p.data&&p.data.role==='admin');
  shell();Q.go('home');
}

/* ---------- درس‌ها ---------- */
Q.views.home=async()=>{
  Q.show(LOAD);
  const r=await Promise.all([
    sb.from('subjects').select('*').order('sort'),
    sb.from('books').select('id,subject_id').eq('active',true)]);
  if(r[0].error)throw r[0].error;
  const cnt={};(r[1].data||[]).forEach(x=>{cnt[x.subject_id]=(cnt[x.subject_id]||0)+1;});
  const grp=k=>r[0].data.filter(x=>x.kind===k).map(x=>'<div class="sub" onclick="Q.go(\'subject\',\''+x.id+'\')"><div class="em">'+(EM[x.name]||'📚')+'</div><b>'+esc(x.name)+'</b><small>'+(cnt[x.id]||0)+' کتاب</small></div>').join('');
  Q.show('<h2>درس‌های تخصصی</h2><div class="grid">'+grp('special')+'</div><h2>درس‌های عمومی</h2><div class="grid">'+grp('general')+'</div>');
};

Q.views.subject=async id=>{
  Q.show(LOAD);
  const r=await Promise.all([
    sb.from('subjects').select('*').eq('id',id).single(),
    sb.from('books').select('*').eq('subject_id',id).eq('active',true).order('grade').order('sort'),
    sb.from('questions').select('book_id').eq('subject_id',id).eq('active',true)]);
  if(r[0].error)throw r[0].error;
  const cnt={};(r[2].data||[]).forEach(x=>{cnt[x.book_id]=(cnt[x.book_id]||0)+1;});
  const books=(r[1].data||[]).map(b=>'<div class="item"><div><b>'+esc(b.name)+'</b><br><small>'+(b.grade?'پایه '+b.grade+' · ':'')+(cnt[b.id]||0)+' سوال</small></div><div class="acts"><button class="btn sm" onclick="Q.go(\'book\',\''+b.id+'\')">باز کن</button></div></div>').join('')||'<div class="card">هنوز کتابی نیست.</div>';
  Q.show('<a class="back" href="#" onclick="Q.go(\'home\');return false">→ برگشت</a><h2>'+(EM[r[0].data.name]||'📚')+' '+esc(r[0].data.name)+'</h2>'+
    '<div class="row"><button class="btn sm" onclick="Q.go(\'new\',{subject:\''+id+'\'})">🎯 آزمون از این درس</button>'+
    (Q.admin?'<button class="btn sm ghost" onclick="Q.addBook(\''+id+'\')">➕ کتاب جدید</button>':'')+'</div>'+books);
};

Q.addBook=sid=>Q.form('کتاب جدید',[
  {k:'name',label:'اسم کتاب (مثلاً ریاضی ۱۱)'},
  {k:'grade',label:'پایه',type:'sel',opts:[[10,'دهم'],[11,'یازدهم'],[12,'دوازدهم']]}
],async v=>{
  if(!v.name.trim()){toast('اسم کتاب را بنویس');return false;}
  const r=await sb.from('books').insert({subject_id:sid,name:v.name.trim(),grade:+v.grade});
  if(r.error){toast('خطا: '+r.error.message);return false;}
  toast('کتاب ساخته شد ✅');Q.reload();
});

Q.views.book=async id=>{
  Q.show(LOAD);
  const r=await Promise.all([
    sb.from('books').select('*').eq('id',id).single(),
    sb.from('topics').select('*').eq('book_id',id).order('sort').order('name'),
    sb.from('questions').select('topic_id').eq('book_id',id).eq('active',true)]);
  if(r[0].error)throw r[0].error;
  const b=r[0].data,tp=r[1].data||[];
  const cnt={};(r[2].data||[]).forEach(x=>{cnt[x.topic_id]=(cnt[x.topic_id]||0)+1;});
  const rows=tp.map(t=>'<div class="item"><div><b>'+esc(t.name)+'</b><br><small>'+(cnt[t.id]||0)+' سوال</small></div><div class="acts">'+
    '<button class="btn sm" onclick="Q.go(\'new\',{topic:\''+t.id+'\'})">🎯 آزمون</button>'+
    (Q.admin?'<button class="btn sm ghost" onclick="Q.addQ(\''+t.id+'\')">➕ سوال</button><button class="btn sm ghost" onclick="Q.importQ(\''+t.id+'\')">📥 دسته‌ای</button><button class="btn sm ghost" onclick="Q.go(\'topic\',\''+t.id+'\')">📋</button>':'')+
    '</div></div>').join('')||'<div class="card">هنوز مبحثی نیست.</div>';
  Q.show('<a class="back" href="#" onclick="Q.go(\'subject\',\''+b.subject_id+'\');return false">→ برگشت</a><h2>📘 '+esc(b.name)+'</h2>'+
    '<div class="row"><button class="btn sm" onclick="Q.go(\'new\',{book:\''+id+'\'})">🎯 آزمون از این کتاب</button>'+
    (Q.admin?'<button class="btn sm ghost" onclick="Q.addTopic(\''+id+'\','+tp.length+')">➕ مبحث جدید</button>':'')+'</div>'+rows);
};

Q.addTopic=(bid,n)=>Q.form('مبحث جدید',[{k:'name',label:'اسم مبحث (مثلاً فصل ۱: تابع)'}],async v=>{
  if(!v.name.trim()){toast('اسم مبحث را بنویس');return false;}
  const r=await sb.from('topics').insert({book_id:bid,name:v.name.trim(),sort:n+1});
  if(r.error){toast('خطا: '+r.error.message);return false;}
  toast('مبحث ساخته شد ✅');Q.reload();
});

Q.addQ=tid=>Q.form('سوال جدید',[
  {k:'body',label:'متن سوال',type:'area',rows:3},
  {k:'o1',label:'گزینه ۱'},{k:'o2',label:'گزینه ۲'},{k:'o3',label:'گزینه ۳'},{k:'o4',label:'گزینه ۴'},
  {k:'c',label:'گزینه‌ی درست',type:'sel',opts:[[1,'۱'],[2,'۲'],[3,'۳'],[4,'۴']]},
  {k:'e1',label:'توضیح گزینه ۱ (چرا درست یا غلط است)',type:'area'},
  {k:'e2',label:'توضیح گزینه ۲',type:'area'},
  {k:'e3',label:'توضیح گزینه ۳',type:'area'},
  {k:'e4',label:'توضیح گزینه ۴',type:'area'},
  {k:'tip',label:'نکته‌ی کلیدی (اختیاری)',type:'area',rows:2}
],async v=>{
  const o=[v.o1,v.o2,v.o3,v.o4].map(x=>x.trim());
  if(!v.body.trim()||o.some(x=>!x)){toast('متن سوال و هر چهار گزینه لازم است');return false;}
  const r=await sb.from('questions').insert({topic_id:tid,body:v.body.trim(),options:o,correct:+v.c,expl:{o:[v.e1,v.e2,v.e3,v.e4].map(x=>x.trim()),tip:v.tip.trim()}});
  if(r.error){toast('خطا: '+r.error.message);return false;}
  toast('سوال ذخیره شد ✅');Q.reload();
});

Q.importQ=tid=>Q.form('ورود دسته‌ای سوال',[{k:'j',label:'متن JSON را اینجا Paste کن',type:'area',rows:10}],async v=>{
  let a;
  try{a=JSON.parse(v.j);}catch(e){toast('JSON درست نیست: '+e.message);return false;}
  if(!Array.isArray(a)||!a.length){toast('باید یک لیست باشد');return false;}
  const rows=[];
  for(let i=0;i<a.length;i++){
    const x=a[i];
    if(!x.q||!Array.isArray(x.o)||x.o.length!==4||!(x.c>=1&&x.c<=4)){toast('سوال شماره '+(i+1)+' ایراد دارد');return false;}
    rows.push({topic_id:tid,body:x.q,options:x.o,correct:x.c,expl:{o:x.e||[],tip:x.t||''},difficulty:x.d||2});
  }
  for(let i=0;i<rows.length;i+=100){
    const r=await sb.from('questions').insert(rows.slice(i,i+100));
    if(r.error){toast('خطا: '+r.error.message);return false;}
  }
  toast(rows.length+' سوال اضافه شد ✅');Q.reload();
});

Q.views.topic=async id=>{
  Q.show(LOAD);
  const r=await Promise.all([
    sb.from('topics').select('*').eq('id',id).single(),
    sb.from('questions').select('id,body,correct').eq('topic_id',id).order('created_at')]);
  if(r[0].error)throw r[0].error;
  const rows=(r[1].data||[]).map((q,i)=>'<div class="item"><div>'+(i+1)+'. '+esc(q.body.slice(0,90))+'</div><div class="acts"><button class="btn sm ghost" onclick="Q.delQ(\''+q.id+'\')">🗑</button></div></div>').join('')||'<div class="card">سوالی نیست.</div>';
  Q.show('<a class="back" href="#" onclick="Q.go(\'book\',\''+r[0].data.book_id+'\');return false">→ برگشت</a><h2>📋 '+esc(r[0].data.name)+'</h2>'+rows);
};
Q.delQ=async id=>{
  if(!confirm('این سوال حذف شود؟'))return;
  const r=await sb.from('questions').delete().eq('id',id);
  if(r.error){toast('خطا: '+r.error.message);return;}
  toast('حذف شد');Q.reload();
};

boot();
