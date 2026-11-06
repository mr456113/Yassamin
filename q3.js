(function(){
var E=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var F=function(n){return String(n).replace(/\d/g,function(d){return '۰۱۲۳۴۵۶۷۸۹'[d]})};
var MN=['','فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
function g2j(gy,gm,gd){var m=[0,31,59,90,120,151,181,212,243,273,304,334];var jy=(gy<=1600)?0:979;gy-=(gy<=1600)?621:1600;var g2=(gm>2)?(gy+1):gy;var days=(365*gy)+parseInt((g2+3)/4)-parseInt((g2+99)/100)+parseInt((g2+399)/400)-80+gd+m[gm-1];jy+=33*parseInt(days/12053);days%=12053;jy+=4*parseInt(days/1461);days%=1461;if(days>365){jy+=parseInt((days-1)/365);days=(days-1)%365;}var jm=(days<186)?1+parseInt(days/31):7+parseInt((days-186)/30);var jdd=1+((days<186)?(days%31):((days-186)%30));return [jy,jm,jdd];}
function J(ts){var d=new Date(ts);var r=g2j(d.getFullYear(),d.getMonth()+1,d.getDate());return F(r[2])+' '+MN[r[1]]+' '+F(r[0]);}
var st=document.createElement('style');
st.textContent='.w3c{background:#fff;border-radius:18px;padding:14px;margin:10px 0;box-shadow:0 3px 10px #0001}.w3b{height:12px;border-radius:9px;background:#eee;overflow:hidden}.w3b i{display:block;height:100%;border-radius:9px}.w3t{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}.w3t button,.w3a{border:0;border-radius:14px;padding:8px 12px;background:#ffe3ee;font-family:inherit;cursor:pointer}.w3t button.on{background:#ff8fb8;color:#fff}.w3s{font-size:12px;color:#777;margin-top:4px}.w3c details{margin-top:8px}.w3c summary{cursor:pointer}';
document.head.appendChild(st);
var W={who:'me',rep:0,ans:[],subs:[],sub:'all'};
function isAdmin(){var a=Q.admin;return typeof a==='function'?a():!!a;}
async function me(){var u=Q.uid;if(typeof u==='function')u=u();if(u&&typeof u.then==='function')u=await u;if(u&&u.id)u=u.id;if(!u){var r=await sb.auth.getUser();u=r.data.user.id;}return u;}
async function target(){if(!isAdmin()||W.who==='me')return me();var r=await sb.from('profiles').select('id').neq('role','admin').limit(1);return(r.data&&r.data[0])?r.data[0].id:me();}
function whoBar(v){if(!isAdmin())return '';return '<div class="w3t"><button class="'+(W.who==='me'?'on':'')+'" onclick="Q.w3who(\'me\',\''+v+'\')">🧑‍💻 حساب من</button><button class="'+(W.who==='her'?'on':'')+'" onclick="Q.w3who(\'her\',\''+v+'\')">🌸 یاسمن</button></div>';}
Q.w3who=function(w,v){W.who=w;Q.go(v);};
function fail(e){Q.show('<div class="w3c">⚠️ '+E(e&&e.message?e.message:e)+'</div>');}
function emo(n){return(typeof EM!=='undefined'&&EM[n])||'📚';}
function col(p){return p>=85?'#7ed6a4':p>=70?'#a6e0b5':p>=50?'#ffd27a':'#ff9aa8';}
function lab(p,n){if(n<3)return 'هنوز داده کم است 🌱';return p>=85?'عالی 🌟':p>=70?'خوب 👍':p>=50?'در حال رشد 🌱':'نیاز به تمرین 💪';}
function uniq(a){return a.filter(function(x,i){return x&&a.indexOf(x)===i;});}

Q.views.weak=async function(){
Q.show('<div class="w3c">🧠 در حال باز کردن دفتر ضعف‌ها...</div>');
try{
var uid=await target();
var r=await sb.from('topic_stats').select('*').eq('user_id',uid).eq('weak',true);
if(r.error)throw r.error;
var rows=r.data||[];
var h='<h2>🧠 دفتر ضعف‌ها</h2>'+whoBar('weak');
if(!rows.length){Q.show(h+'<div class="w3c">🎉 فعلاً مبحث ضعیفی ثبت نشده. هر وقت یک مبحث دو بار غلط شود، درصدش زیر ۵۰ بیاید یا «متوجه نشدم» بزنی، اینجا می‌آید.</div>');return;}
var t=await sb.from('topics').select('id,name,book_id').in('id',rows.map(function(x){return x.topic_id;}));
var tp={};(t.data||[]).forEach(function(x){tp[x.id]=x;});
var b=await sb.from('books').select('id,name,subject_id').in('id',uniq((t.data||[]).map(function(x){return x.book_id;})));
var bk={};(b.data||[]).forEach(function(x){bk[x.id]=x;});
var s=await sb.from('subjects').select('id,name,sort').order('sort');
var sj={};(s.data||[]).forEach(function(x){sj[x.id]=x;});
var g={};
rows.forEach(function(x){var k=x.subject_id;(g[k]=g[k]||[]).push(x);});
h+='<div class="w3s">این دفتر فقط مبحث‌های ضعیف را نشان می‌دهد، نه جواب سوال‌ها. بعد از ۳ پاسخ درست پشت‌سرهم، مبحث خودکار از دفتر بیرون می‌رود ✨</div>';
Object.keys(g).forEach(function(k){
var sn=sj[k]?sj[k].name:'درس';
h+='<h3>'+emo(sn)+' '+E(sn)+' <span class="w3s">('+F(g[k].length)+' مبحث)</span></h3>';
g[k].forEach(function(x){
var tt=tp[x.topic_id]||{name:'مبحث',book_id:null};var bb=bk[tt.book_id]||{name:''};
var rs=[];
if(x.wrong_run>=2)rs.push('دو بار غلط');
if(x.confused)rs.push('گفتی متوجه نشدم');
if(x.win_total>=3&&x.win_correct*2<x.win_total)rs.push('درصد زیر ۵۰٪ ('+F(Math.round(x.win_correct*100/x.win_total))+'٪)');
var sk=Math.min(x.streak||0,3);
h+='<div class="w3c"><b>'+E(tt.name)+'</b><div class="w3s">📘 '+E(bb.name)+'</div><div class="w3s">چرا اینجاست: '+E(rs.join('، ')||'نیاز به مرور')+'</div><div class="w3s">برای بیرون رفتن: '+F(sk)+' از ۳ پاسخ درست پشت‌سرهم</div><div class="w3b" style="margin-top:6px"><i style="width:'+(sk*100/3)+'%;background:#ff8fb8"></i></div>'+(tt.book_id?'<button class="w3a" style="margin-top:8px" onclick="Q.go(\'book\',\''+tt.book_id+'\')">📖 رفتن به کتاب</button>':'')+'</div>';
});
});
Q.show(h);
}catch(e){fail(e);}
};

function curve(p){var d='M'+p[0][0]+' '+p[0][1];for(var i=0;i<p.length-1;i++){var a=p[i-1]||p[i],b=p[i],c=p[i+1],e=p[i+2]||c;d+=' C'+(b[0]+(c[0]-a[0])/6)+' '+(b[1]+(c[1]-a[1])/6)+' '+(c[0]-(e[0]-b[0])/6)+' '+(c[1]-(e[1]-b[1])/6)+' '+c[0]+' '+c[1];}return d;}
function wave(){
var list=W.ans.filter(function(a){return W.sub==='all'||a.subject_id===W.sub;});
var bd={};
list.forEach(function(a){var d=new Date(a.created_at);var k=new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime();var o=bd[k]=bd[k]||{t:k,n:0,c:0};o.n++;if(a.is_correct)o.c++;});
var days=Object.keys(bd).map(function(k){return bd[k];}).sort(function(a,b){return a.t-b.t;});
if(days.length<2)return '<div class="w3s">برای رسم موج حداقل دو روز تمرین لازم است 🌊</div>';
var vals=days.map(function(d,i){var n=0,c=0;for(var j=Math.max(0,i-2);j<=i;j++){n+=days[j].n;c+=days[j].c;}return c*100/n;});
var Wd=320,H=170,pl=32,pr=10,pt=10,pb=26;
var t0=days[0].t,t1=days[days.length-1].t;
var pts=days.map(function(d,i){return[Math.round(pl+(d.t-t0)/(t1-t0)*(Wd-pl-pr)),Math.round(pt+(100-vals[i])/100*(H-pt-pb))];});
var cv=curve(pts),base=H-pb;
var s='<svg viewBox="0 0 '+Wd+' '+H+'" direction="ltr" style="width:100%;direction:ltr">';
[0,50,100].forEach(function(v){var y=Math.round(pt+(100-v)/100*(H-pt-pb));s+='<line x1="'+pl+'" x2="'+(Wd-pr)+'" y1="'+y+'" y2="'+y+'" stroke="#eee"/><text x="2" y="'+(y+4)+'" font-size="10" fill="#999">'+F(v)+'٪</text>';});
s+='<path d="'+cv+' L'+pts[pts.length-1][0]+' '+base+' L'+pts[0][0]+' '+base+' Z" fill="#ffd1e3" opacity=".55"/><path d="'+cv+'" fill="none" stroke="#ff6fa5" stroke-width="3" stroke-linecap="round"/>';
pts.forEach(function(p){s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="3.5" fill="#fff" stroke="#ff6fa5" stroke-width="2"/>';});
s+='<text x="'+pl+'" y="'+(H-6)+'" font-size="10" fill="#999">'+J(t0)+'</text><text x="'+(Wd-pr)+'" y="'+(H-6)+'" font-size="10" fill="#999" text-anchor="end">'+J(t1)+'</text></svg>';
return s+'<div class="w3s">محور افقی: زمان، محور عمودی: درصد پاسخ درست (میانگین سه روز اخیر)</div>';
}
Q.w3sub=function(id){W.sub=id;var el=document.getElementById('w3wave');if(el)el.innerHTML=wave();var bs=document.querySelectorAll('#w3chips button');for(var i=0;i<bs.length;i++){bs[i].className=(bs[i].getAttribute('data-id')===id)?'on':'';}};

Q.views.mastery=async function(){
Q.show('<div class="w3c">🌊 در حال محاسبه...</div>');
try{
var uid=await target();
var r=await sb.from('topic_stats').select('*').eq('user_id',uid);
if(r.error)throw r.error;
var rows=r.data||[];
var h='<h2>🌊 تسلط</h2>'+whoBar('mastery');
var t=rows.length?await sb.from('topics').select('id,name').in('id',rows.map(function(x){return x.topic_id;})):{data:[]};
var tp={};(t.data||[]).forEach(function(x){tp[x.id]=x.name;});
var s=await sb.from('subjects').select('id,name,sort').order('sort');
var subs=s.data||[];
var ag={};
rows.forEach(function(x){var o=ag[x.subject_id]=ag[x.subject_id]||{a:0,c:0,t:[]};o.a+=x.answered||0;o.c+=x.correct||0;o.t.push(x);});
var an=await sb.from('answers').select('subject_id,is_correct,created_at').eq('user_id',uid).not('chosen','is',null).order('created_at',{ascending:false}).limit(5000);
W.ans=(an.data||[]).slice().reverse();W.sub='all';W.subs=subs;
var any=false;
subs.forEach(function(sb2){
var o=ag[sb2.id];if(!o||!o.a)return;any=true;
var p=Math.round(o.c*100/o.a);
h+='<div class="w3c"><b>'+emo(sb2.name)+' '+E(sb2.name)+'</b> <span class="w3s">'+F(o.a)+' سوال پاسخ‌داده</span><div class="w3b" style="margin:8px 0"><i style="width:'+p+'%;background:'+col(p)+'"></i></div><b>'+F(p)+'٪</b> · '+lab(p,o.a);
h+='<details><summary>مبحث‌ها</summary>';
o.t.sort(function(a,b){return(a.correct/(a.answered||1))-(b.correct/(b.answered||1));}).forEach(function(x){var q=Math.round((x.correct||0)*100/(x.answered||1));h+='<div style="margin-top:8px">'+E(tp[x.topic_id]||'مبحث')+(x.weak?' 🧠':'')+' <span class="w3s">'+F(x.answered)+' سوال</span><div class="w3b"><i style="width:'+q+'%;background:'+col(q)+'"></i></div><span class="w3s">'+F(q)+'٪ · '+lab(q,x.answered)+'</span></div>';});
h+='</details></div>';
});
if(!any){Q.show(h+'<div class="w3c">هنوز آزمونی داده نشده. بعد از اولین آزمون، تسلط هر درس و مبحث خودکار اینجا حساب می‌شود 🌱</div>');return;}
var ids=uniq(W.ans.map(function(a){return a.subject_id;}));
var ch='<button class="on" data-id="all" onclick="Q.w3sub(\'all\')">همه</button>';
subs.forEach(function(x){if(ids.indexOf(x.id)>=0)ch+='<button data-id="'+x.id+'" onclick="Q.w3sub(\''+x.id+'\')">'+emo(x.name)+' '+E(x.name)+'</button>';});
h+='<h3>🌊 موج مسیر تو</h3><div class="w3c"><div class="w3t" id="w3chips">'+ch+'</div><div id="w3wave">'+wave()+'</div></div>';
Q.show(h);
}catch(e){fail(e);}
};

Q.w3rep=function(v){W.rep=v;Q.go('reports');};
Q.w3res=async function(id){var r=await sb.from('question_reports').update({resolved:true}).eq('id',id);if(r.error)return fail(r.error);if(typeof toast==='function')toast('حل شد ✅');Q.go('reports');};
Q.w3off=async function(qid,rid){if(!confirm('این سوال غیرفعال شود؟ دیگر در آزمون‌ها نمی‌آید.'))return;var r=await sb.from('questions').update({active:false}).eq('id',qid);if(r.error)return fail(r.error);await sb.from('question_reports').update({resolved:true}).eq('id',rid);if(typeof toast==='function')toast('سوال غیرفعال شد 🚫');Q.go('reports');};

Q.views.reports=async function(){
if(!isAdmin()){Q.show('<div class="w3c">این بخش فقط برای مدیر است 🔒</div>');return;}
Q.show('<div class="w3c">🚩 در حال باز کردن گزارش‌ها...</div>');
try{
var qy=sb.from('question_reports').select('*').order('created_at',{ascending:false}).limit(100);
if(!W.rep)qy=qy.eq('resolved',false);
var r=await qy;if(r.error)throw r.error;
var rows=r.data||[];
var h='<h2>🚩 گزارش سوال‌ها</h2><div class="w3t"><button class="'+(W.rep?'':'on')+'" onclick="Q.w3rep(0)">بررسی‌نشده</button><button class="'+(W.rep?'on':'')+'" onclick="Q.w3rep(1)">همه</button></div>';
if(!rows.length){Q.show(h+'<div class="w3c">گزارشی نیست 🎉</div>');return;}
var q=await sb.from('questions').select('id,body,options,correct,expl,active').in('id',uniq(rows.map(function(x){return x.question_id;})));
var qm={};(q.data||[]).forEach(function(x){qm[x.id]=x;});
rows.forEach(function(x){
var qq=qm[x.question_id];
h+='<div class="w3c"><div class="w3s">'+J(x.created_at)+(x.resolved?' · ✅ حل‌شده':'')+'</div>';
if(qq){
h+='<div style="margin:6px 0"><b>'+E(qq.body)+'</b>'+(qq.active===false?' <span class="w3s">(غیرفعال)</span>':'')+'</div>';
(qq.options||[]).forEach(function(o,i){h+='<div style="margin:3px 0;'+((i+1)===qq.correct?'color:#2e9e62;font-weight:bold':'')+'">'+F(i+1)+') '+E(o)+((i+1)===qq.correct?' ✔':'')+'</div>';});
}else h+='<div>سوال پیدا نشد (شاید حذف شده).</div>';
h+='<div style="margin:8px 0;padding:8px;border-radius:12px;background:#fff4d6">📝 '+E(x.note||'(بدون توضیح)')+'</div>';
if(!x.resolved)h+='<button class="w3a" onclick="Q.w3res(\''+x.id+'\')">✅ حل شد</button> ';
if(qq&&qq.active!==false)h+='<button class="w3a" onclick="Q.w3off(\''+qq.id+'\',\''+x.id+'\')">🚫 غیرفعال‌کردن سوال</button>';
h+='</div>';
});
Q.show(h);
}catch(e){fail(e);}
};
})();
