var SB_URL='https://pgslacpkdhanzylahsaz.supabase.co';
var SB_KEY='sb_publishable_8q4PurSj8hd8bOnsDu9m_Q_O4Qm_oIW';
var sb=supabase.createClient(SB_URL,SB_KEY);
var L={views:{},me:null,admin:false,name:'',her:null,tab:'home'};
var $=function(i){return document.getElementById(i)};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var fa=function(n){return String(n).replace(/\d/g,function(d){return '۰۱۲۳۴۵۶۷۸۹'[d]})};
var MN=['','فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
function g2j(gy,gm,gd){var m=[0,31,59,90,120,151,181,212,243,273,304,334];var jy=(gy<=1600)?0:979;gy-=(gy<=1600)?621:1600;var g2=(gm>2)?(gy+1):gy;var days=(365*gy)+parseInt((g2+3)/4)-parseInt((g2+99)/100)+parseInt((g2+399)/400)-80+gd+m[gm-1];jy+=33*parseInt(days/12053);days%=12053;jy+=4*parseInt(days/1461);days%=1461;if(days>365){jy+=parseInt((days-1)/365);days=(days-1)%365;}var jm=(days<186)?1+parseInt(days/31):7+parseInt((days-186)/30);var jdd=1+((days<186)?(days%31):((days-186)%30));return [jy,jm,jdd];}
function j2g(jy,jm,jd){jy+=1595;var days=-355668+(365*jy)+(~~(jy/33))*8+~~(((jy%33)+3)/4)+jd+((jm<7)?(jm-1)*31:((jm-7)*30)+186);var gy=400*~~(days/146097);days%=146097;if(days>36524){gy+=100*~~(--days/36524);days%=36524;if(days>=365)days++;}gy+=4*~~(days/1461);days%=1461;if(days>365){gy+=~~((days-1)/365);days=(days-1)%365;}var gd=days+1;var sal=[0,31,((gy%4==0&&gy%100!=0)||(gy%400==0))?29:28,31,30,31,30,31,31,30,31,30,31];var gm;for(gm=0;gm<13;gm++){var v=sal[gm];if(gd<=v)break;gd-=v;}return [gy,gm,gd];}
function today(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tehran'}).format(new Date());}
function jdate(s){var p=String(s).slice(0,10).split('-');var r=g2j(+p[0],+p[1],+p[2]);return fa(r[2])+' '+MN[r[1]]+' '+fa(r[0]);}
function jts(ts){return jdate(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tehran'}).format(new Date(ts)));}
function toast(m){var t=$('toast');t.textContent=m;t.className='on';setTimeout(function(){t.className='';},2500);}
if(localStorage.getItem('dark')==='1')document.body.classList.add('dk');
L.dark=function(){var d=document.body.classList.toggle('dk');localStorage.setItem('dark',d?'1':'0');};
L.show=function(h){var m=$('main');if(m)m.innerHTML=h;};
L.err=function(e){L.show('<div class="c">⚠️ '+esc(e&&e.message?e.message:e)+'</div>');};
var TABS=[['home','💞 امروز'],['env','✉️ پاکت‌ها']];
L.go=function(t){L.tab=t;var h='';TABS.forEach(function(x){h+='<button class="b'+(x[0]===t?' on':'')+'" onclick="L.go(\''+x[0]+'\')">'+x[1]+'</button>';});$('tabs').innerHTML=h;var v=L.views[t];if(v)v();else L.show('<div class="c">این بخش هنوز نصب نشده</div>');};
function shell(){$('app').innerHTML='<div class="wrap"><div class="row" style="justify-content:space-between"><b>🎀 دخملی بابایی</b><span class="row"><button class="b" onclick="L.dark()">🌙</button><a class="b" href="index.html" style="text-decoration:none">🏠 سایت</a></span></div><div class="row" id="tabs" style="margin:10px 0"></div><div id="main"></div></div>';}
function loginView(){$('app').innerHTML='<div class="wrap"><div class="c" style="text-align:center"><div style="font-size:50px">🎀</div><h2>دخملی بابایی</h2><input id="em" type="email" placeholder="ایمیل" dir="ltr"><input id="pw" type="password" placeholder="رمز" dir="ltr"><button class="b p" style="width:100%;margin-top:8px" onclick="L.login()">ورود 💗</button><div id="le" class="s" style="color:#d33;margin-top:6px"></div></div></div>';}
L.login=async function(){var r=await sb.auth.signInWithPassword({email:$('em').value.trim(),password:$('pw').value});if(r.error){$('le').textContent='ایمیل یا رمز درست نیست';return;}boot();};
async function boot(){
try{
var s=await sb.auth.getSession();
if(!s.data.session){loginView();return;}
L.me=s.data.session.user.id;
var p=await sb.from('profiles').select('role,name').eq('id',L.me).maybeSingle();
L.admin=!!(p.data&&p.data.role==='admin');L.name=(p.data&&p.data.name)||'';
if(L.admin){var h=await sb.from('profiles').select('id,name').neq('role','admin').limit(1);L.her=(h.data&&h.data[0])?h.data[0].id:null;L.herName=(h.data&&h.data[0]&&h.data[0].name)||'یاسمن';}
shell();L.go('home');
}catch(e){$('app').innerHTML='<div class="wrap"><div class="c">⚠️ '+esc(e&&e.message?e.message:e)+'</div></div>';}
}
function ring(done,goal){var p=goal>0?Math.min(done/goal,1):0;var C=327;return '<svg viewBox="0 0 120 120" width="130" height="130"><circle cx="60" cy="60" r="52" fill="none" stroke="#ffe3ee" stroke-width="12"/><circle cx="60" cy="60" r="52" fill="none" stroke="#ff6fa5" stroke-width="12" stroke-linecap="round" stroke-dasharray="'+C+'" stroke-dashoffset="'+Math.round(C*(1-p))+'" transform="rotate(-90 60 60)"/><text x="60" y="58" text-anchor="middle" font-size="20" font-weight="bold" fill="#ff6fa5">'+fa(Math.round(p*100))+'٪</text><text x="60" y="76" text-anchor="middle" font-size="9" fill="#999">'+fa(done)+' از '+fa(goal)+' دقیقه</text></svg>';}
async function prog(uid){var a=await sb.from('study_logs').select('minutes').eq('user_id',uid).eq('day',today());if(a.error)throw a.error;var m=0;(a.data||[]).forEach(function(x){m+=x.minutes||0;});var g=await sb.from('daily_goal').select('minutes').eq('user_id',uid).maybeSingle();return {m:m,g:(g.data&&g.data.minutes)||120};}
var MOODS=['😭','😕','😐','🙂','🥰'];
var MLAB=['خیلی بد','نه‌چندان خوب','معمولی','خوب','عالی'];
L.mood=async function(n){var r=await sb.from('moods').upsert({user_id:L.me,day:today(),mood:n},{onConflict:'user_id,day'});if(r.error)return toast('ذخیره نشد: '+r.error.message);toast('ثبت شد 💗');L.go('home');};
L.goal=async function(cur){var v=prompt('هدف مطالعه‌ی هر روز چند دقیقه باشد؟',cur);if(v===null)return;v=parseInt(String(v).replace(/[۰-۹]/g,function(d){return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d);}),10);if(!(v>=10&&v<=1000))return toast('عدد بین ۱۰ تا ۱۰۰۰ بنویس');var r=await sb.from('daily_goal').upsert({user_id:L.me,minutes:v});if(r.error)return toast('ذخیره نشد: '+r.error.message);toast('هدف ثبت شد 🎯');L.go('home');};
var HK={hug:'بغل می‌خوام 🤗',miss:'دلم برات تنگ شده 🥺',help:'امروز به تشویق نیاز دارم 🥹'};
L.send=async function(k){var r=await sb.from('hugs').insert({kind:k,note:HK[k]});if(r.error)return toast('نرفت: '+r.error.message);toast('برای بابایی فرستاده شد 💞');};
L.seen=async function(id){var r=await sb.from('hugs').update({seen:true}).eq('id',id);if(r.error)return toast(r.error.message);L.go('home');};
L.seenAll=async function(){var r=await sb.from('hugs').update({seen:true}).eq('from_user',L.her).eq('seen',false);if(r.error)return toast(r.error.message);L.go('home');};
L.cheer=async function(){var t=$('ch').value.trim();if(!t)return toast('یک متن بنویس');var r=await sb.from('hugs').insert({kind:'cheer',note:t});if(r.error)return toast('نرفت: '+r.error.message);toast('فرستاده شد 💌');L.go('home');};
async function herHome(){
var h='<div class="c"><b>سلام '+esc(L.name||'دخملی')+' 🌸</b><div class="s">امروز: '+jdate(today())+'</div></div>';
var inc=await sb.from('hugs').select('*').neq('from_user',L.me).eq('seen',false).order('created_at');
if(inc.error)throw inc.error;
(inc.data||[]).forEach(function(x){h+='<div class="c" style="background:#fff0b8;color:#4a3a4a">'+(x.kind==='cheer'?'💌 تشویق از بابایی':'💗 پیام از بابایی')+'<div style="font-size:18px;margin:6px 0">'+esc(x.note||'🤗')+'</div><button class="b p" onclick="L.seen(\''+x.id+'\')">دیدم 💗</button></div>';});
var m=await sb.from('moods').select('mood').eq('user_id',L.me).eq('day',today()).maybeSingle();
var cm=m.data?m.data.mood:0;
h+='<div class="c"><b>امروز چه حالی داری؟</b><div class="em row" style="margin:8px 0">';
MOODS.forEach(function(e,i){h+='<button class="'+(cm===i+1?'on':'')+'" onclick="L.mood('+(i+1)+')">'+e+'</button>';});
h+='</div><div class="s">'+(cm?'امروز: '+MLAB[cm-1]:'یکی را بزن')+'<br>🔎 بابایی حالت را می‌بیند، برای اینکه مراقبت باشد 💞</div></div>';
var p=await prog(L.me);
h+='<div class="c" style="text-align:center"><b>🎯 هدف امروز</b><div>'+ring(p.m,p.g)+'</div>'+(p.m>=p.g?'<div>🎉 به هدف رسیدی!</div>':'')+'<button class="b" onclick="L.goal('+p.g+')">تغییر هدف</button></div>';
h+='<div class="c"><b>برای بابایی بفرست</b><div class="row" style="margin-top:8px"><button class="b" onclick="L.send(\'hug\')">🤗 بغل</button><button class="b" onclick="L.send(\'miss\')">🥺 دلم تنگ شده</button><button class="b" onclick="L.send(\'help\')">🥹 تشویق می‌خوام</button></div></div>';
return h;
}
async function adminHome(){
if(!L.her)return '<div class="c">حساب یاسمن پیدا نشد.</div>';
var h='<div class="c"><b>سلام بابایی 👋</b><div class="s">امروز: '+jdate(today())+'</div></div>';
var p=await prog(L.her);
h+='<div class="c" style="text-align:center"><b>🎯 هدف امروزِ '+esc(L.herName)+'</b><div>'+ring(p.m,p.g)+'</div></div>';
var hg=await sb.from('hugs').select('*').eq('from_user',L.her).order('created_at',{ascending:false}).limit(10);
if(hg.error)throw hg.error;
var un=(hg.data||[]).filter(function(x){return !x.seen;}).length;
h+='<div class="c"><b>💗 پیام‌های او'+(un?' ('+fa(un)+' جدید)':'')+'</b>';
if(!(hg.data||[]).length)h+='<div class="s">هنوز پیامی نفرستاده</div>';
(hg.data||[]).forEach(function(x){h+='<div style="margin:6px 0">'+(x.seen?'':'🆕 ')+esc(x.note||x.kind)+' <span class="s">'+jts(x.created_at)+'</span></div>';});
if(un)h+='<button class="b" onclick="L.seenAll()">همه دیده شد</button>';
h+='</div>';
var mm=await sb.from('moods').select('day,mood').eq('user_id',L.her).order('day',{ascending:false}).limit(14);
if(mm.error)throw mm.error;
h+='<div class="c"><b>🙂 حال این روزهای او</b><div style="margin-top:6px">';
if(!(mm.data||[]).length)h+='<span class="s">هنوز ثبت نشده</span>';
(mm.data||[]).forEach(function(x){h+='<div>'+MOODS[x.mood-1]+' <span class="s">'+jdate(x.day)+' · '+MLAB[x.mood-1]+'</span></div>';});
h+='</div></div>';
h+='<div class="c"><b>💌 تشویق بفرست</b><div class="s">روی صفحه‌ی او نشان داده می‌شود</div><textarea id="ch" rows="2" placeholder="مثلاً: افتخار می‌کنم بهت 💪"></textarea><button class="b p" onclick="L.cheer()">ارسال</button></div>';
return h;
}
L.views.home=async function(){
L.show('<div class="c">⏳</div>');
try{L.show(L.admin?await adminHome():await herHome());}catch(e){L.err(e);}
};
