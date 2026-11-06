(function(){
function pd(s){return String(s).replace(/[۰-۹]/g,function(d){return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d);});}
function p2(n){return (n<10?'0':'')+n;}
function parseJ(v){
v=pd(v||'').trim();if(!v)return '';
var m=v.match(/^(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})$/);
if(!m)return null;
var jm=+m[2],jd=+m[3];
if(jm<1||jm>12||jd<1||jd>31)return null;
var g=j2g(+m[1],jm,jd);
return g[0]+'-'+p2(g[1])+'-'+p2(g[2]);
}
function errMsg(e){var s=(e&&e.message)||String(e);if(s.indexOf('locked')>=0)return 'هنوز زمانش نرسیده 🔒';if(s.indexOf('notfound')>=0)return 'پاکت پیدا نشد';return s;}

L.addEnv=async function(){
var t=$('ev_t').value.trim(),b=$('ev_b').value.trim(),d=parseJ($('ev_d').value);
if(!t)return toast('عنوان پاکت را بنویس');
if(!b)return toast('متن پیام را بنویس');
if(d===null)return toast('تاریخ را مثل ۱۴۰۶/۰۴/۱۲ بنویس');
var r=await sb.from('envelopes').insert({title:t,unlock_day:d||null}).select('id').single();
if(r.error)return toast('نشد: '+r.error.message);
var s=await sb.from('envelope_secrets').insert({id:r.data.id,body:b});
if(s.error){await sb.from('envelopes').delete().eq('id',r.data.id);return toast('نشد: '+s.error.message);}
toast('پاکت ساخته شد ✉️');L.go('env');
};

L.delEnv=async function(id){
if(!confirm('این پاکت پاک شود؟'))return;
var r=await sb.from('envelopes').delete().eq('id',id);
if(r.error)return toast(r.error.message);
toast('پاک شد');L.go('env');
};

L.readEnv=async function(id,title){
var r=await sb.rpc('open_envelope',{eid:id});
if(r.error)return toast(errMsg(r.error));
var o=document.createElement('div');
o.id='ov';
o.style.cssText='position:fixed;inset:0;background:#0007;z-index:50;display:flex;align-items:center;justify-content:center;padding:16px';
o.innerHTML='<div class="c" style="max-width:480px;width:100%;max-height:85vh;overflow:auto;text-align:center"><div style="font-size:44px">💌</div><b>'+esc(title)+'</b><div style="white-space:pre-wrap;line-height:2;margin:14px 0;font-size:17px">'+esc(r.data)+'</div><button class="b p" onclick="L.closeEnv()">بستن 💗</button></div>';
document.body.appendChild(o);
};
L.closeEnv=function(){var o=$('ov');if(o)o.remove();L.go('env');};

L.views.env=async function(){
L.show('<div class="c">⏳</div>');
try{
var r=await sb.from('envelopes').select('*').order('created_at',{ascending:true});
if(r.error)throw r.error;
var rows=r.data||[];
var td=today();
var h='<h2>✉️ پاکت‌ها</h2>';
if(L.admin){
h+='<div class="c"><b>➕ پاکت جدید</b><input id="ev_t" placeholder="عنوان، مثلاً: وقتی دلت گرفت بازکن"><textarea id="ev_b" rows="4" placeholder="متن پیام تو"></textarea><input id="ev_d" placeholder="تاریخ باز شدن (اختیاری)، مثل ۱۴۰۶/۰۴/۱۲" dir="ltr"><div class="s">اگر تاریخ را خالی بگذاری، هر وقت یاسمن بخواهد بازش می‌کند. اگر تاریخ بگذاری، تا آن روز قفل است.</div><button class="b p" style="margin-top:8px" onclick="L.addEnv()">ساخت پاکت</button></div>';
}
if(!rows.length){
h+='<div class="c">'+(L.admin?'هنوز پاکتی نساخته‌ای.':'هنوز پاکتی نیست. بعداً سر بزن 💞')+'</div>';
L.show(h);return;
}
rows.forEach(function(x){
var locked=x.unlock_day&&String(x.unlock_day).slice(0,10)>td;
h+='<div class="c"><b>'+(locked?'🔒':(x.opened_at?'💌':'✉️'))+' '+esc(x.title)+'</b>';
if(x.unlock_day)h+='<div class="s">'+(locked?'باز می‌شود در ':'تاریخ باز شدن: ')+jdate(x.unlock_day)+'</div>';
if(L.admin){
h+='<div class="s">'+(x.opened_at?'✅ یاسمن بازش کرد ('+jts(x.opened_at)+')':'هنوز باز نشده')+'</div>';
h+='<div class="row" style="margin-top:8px"><button class="b" onclick="L.readEnv(\''+x.id+'\',\''+esc(x.title).replace(/&#39;/g,'')+'\')">👁 خواندن</button><button class="b" onclick="L.delEnv(\''+x.id+'\')">🗑 پاک کردن</button></div>';
}else{
if(locked)h+='<div class="s" style="margin-top:6px">هنوز زمانش نرسیده 🤫</div>';
else h+='<div style="margin-top:8px"><button class="b p" onclick="L.readEnv(\''+x.id+'\',\''+esc(x.title).replace(/&#39;/g,'')+'\')">'+(x.opened_at?'دوباره بخوان 💞':'باز کن 💌')+'</button></div>';
}
h+='</div>';
});
L.show(h);
}catch(e){L.err(e);}
};
})();
