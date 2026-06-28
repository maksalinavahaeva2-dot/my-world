document.addEventListener('DOMContentLoaded',()=>{
const D={u:JSON.parse(localStorage.u||'[]'),p:JSON.parse(localStorage.p||'[]'),g:JSON.parse(localStorage.g||'[]'),m:JSON.parse(localStorage.m||'[]'),n:JSON.parse(localStorage.n||'[]'),cc:+localStorage.cc||0,cu:JSON.parse(localStorage.cu||'null')}
function S(){['u','p','g','m','n'].forEach(k=>localStorage[k]=JSON.stringify(D[k]));localStorage.cc=D.cc;localStorage.cu=JSON.stringify(D.cu)}
function H(n,p){let h=0;for(let i=0;i<(n+p).length;i++)h=(n+p).charCodeAt(i)+((h<<5)-h);return`hsl(${Math.abs(h%360)},70%,65%)`}
function F(ts){return new Date(ts).toLocaleString('ru-RU')}
function U(){return D.cu?D.u.find(u=>u.id===D.cu.id):null}
function R(u){return u?u.role==='creator'?'Создатель':u.premium?'Премиум-гость':'Гость':''}
let cpid=null,opid=null
const LS=document.getElementById('login-screen'),AS=document.getElementById('app')
document.getElementById('login-btn').onclick=()=>{
const n=document.getElementById('login-username').value.trim(),p=document.getElementById('login-password').value.trim()
if(!n||!p)return alert('Введи имя и пароль')
let u=D.u.find(u=>u.username===n)
if(!u){let r='guest';if(p==='959506'&&D.cc<2){r='creator';D.cc++}
u={id:Date.now().toString(),username:n,password:p,role:r,premium:!1,avatar:'',banUntil:null,color:r==='creator'?'gold':H(n,p),followers:[],following:[]}
D.u.push(u)}else{if(u.password!==p)return alert('Неверный пароль!')
if(p==='959506'&&D.cc<2&&u.role!=='creator'){u.role='creator';u.color='gold';D.cc++}}
if(u.banUntil&&u.banUntil>Date.now())return alert(`Забанен ещё на ${Math.ceil((u.banUntil-Date.now())/3600000)} ч.`)
D.cu={id:u.id,username:u.username,role:u.role};S();SH()}
function SH(){LS.classList.add('hidden');AS.classList.remove('hidden');const u=U();if(u)document.getElementById('current-username').textContent=`${u.username} (${R(u)})`;ST('feed')}
document.getElementById('logout-btn').onclick=()=>{D.cu=null;S();AS.classList.add('hidden');LS.classList.remove('hidden');document.getElementById('login-username').value='';document.getElementById('login-password').value=''}
document.querySelectorAll('.nav-btn').forEach(b=>b.onclick=()=>ST(b.dataset.tab))
document.getElementById('current-username').onclick=()=>ST('profile')
document.getElementById('notif-icon').onclick=()=>ST('notifications')
function ST(tab,arg){
document.querySelectorAll('.tab').forEach(t=>t.classList.add('hidden'))
document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'))
const tt=document.getElementById(`tab-${tab}`);if(tt)tt.classList.remove('hidden')
const tb=document.querySelector(`.nav-btn[data-tab="${tab}"]`);if(tb)tb.classList.add('active')
cpid=(tab==='profile'?arg:null);opid=(tab==='messages'?arg:null)
if(tab==='feed')RF();else if(tab==='groups')RGr();else if(tab==='messages')RC();else if(tab==='profile')RP();else if(tab==='notifications')RN();else if(tab==='admin')RA()
}
document.getElementById('publish-btn').onclick=()=>{
const u=U();if(!u||(u.banUntil&&u.banUntil>Date.now()))return alert('Ты забанен')
const tx=document.getElementById('post-text').value.trim(),im=document.getElementById('post-image').files[0],vi=document.getElementById('post-video').files[0]
if(!tx&&!im&&!vi)return alert('Добавь текст, фото или видео')
const proc=(f,t)=>new Promise(res=>{const r=new FileReader();r.onload=()=>res({type:t,data:r.result});r.readAsDataURL(f)})
const pr=[];if(im)pr.push(proc(im,'image'));if(vi)pr.push(proc(vi,'video'))
Promise.all(pr).then(m=>{const po={id:Date.now().toString(),authorId:u.id,text:tx,media:m[0]||null,timestamp:Date.now(),likes:[],comments:[]}
D.p.unshift(po);S();document.getElementById('post-text').value='';document.getElementById('post-image').value='';document.getElementById('post-video').value='';ST('feed')})
}
function RF(){
const con=document.querySelector('.feed-container');if(!con)return;con.innerHTML=''
if(!D.p.length){con.innerHTML='<div style="color:white;text-align:center;margin-top:40vh;">Нет постов</div>';return}
const um=new Map(D.u.map(u=>[u.username,u]))
D.p.forEach(po=>{const au=D.u.find(u=>u.id===po.authorId);if(!au)return
const d=document.createElement('div');d.className='post'
d.innerHTML=`<div class="post-media">${po.media?.type==='image'?`<img src="${po.media.data}" alt="pic">`:''}${po.media?.type==='video'?`<video src="${po.media.data}" controls muted autoplay loop playsinline style="width:100%;height:100%;object-fit:contain" onerror="this.style.display='none'"></video>`:''}${!po.media?`<div style="color:white;padding:20px;font-size:1.5rem;">${po.text||''}</div>`:''}</div><div class="post-caption"><span class="post-author-small" style="cursor:pointer" data-uid="${au.id}">${au.username} – ${R(au)}</span><div>${po.media?po.text:''}</div><div class="post-actions-feed"><span class="like-btn" data-postid="${po.id}">❤️ ${po.likes.length}</span><span class="comment-btn" data-postid="${po.id}">💬 ${po.comments.length}</span></div><div>${po.comments.slice(-2).map(c=>{const cu=um.get(c.author);return`<div><b>${c.author} ${cu?'('+R(cu)+')':''}</b>: ${c.text}</div>`}).join('')}</div><input type="text" class="comment-input" data-postid="${po.id}" placeholder="Комментарий..."></div>`
con.appendChild(d)})
document.querySelectorAll('.post-author-small').forEach(el=>el.onclick=(e)=>{e.stopPropagation();ST('profile',el.dataset.uid)})
document.querySelectorAll('.like-btn').forEach(b=>b.onclick=()=>{const po=D.p.find(p=>p.id===b.dataset.postid),u=U();if(!po||!u)return;if(po.likes.includes(u.id))po.likes=po.likes.filter(id=>id!==u.id);else{po.likes.push(u.id);AN(po.authorId,'❤️',u)}S();RF()})
document.querySelectorAll('.comment-input').forEach(i=>i.onkeypress=e=>{if(e.key==='Enter'){const po=D.p.find(p=>p.id===i.dataset.postid),u=U();if(!po||!u||(u.banUntil&&u.banUntil>Date.now()))return;const tx=i.value.trim();if(!tx)return;po.comments.push({author:u.username,text:tx});AN(po.authorId,'💬',u);i.value='';S();RF()}})
}
function RP(){
const u=cpid?D.u.find(u=>u.id===cpid):U();if(!u)return
const me=U(),isMe=!cpid||cpid===me?.id
const likes=D.p.filter(p=>p.authorId===u.id).reduce((s,p)=>s+p.likes.length,0)
document.getElementById('profile-info').innerHTML=`<div class="profile-container"><img class="profile-avatar" src="${u.avatar||'default-avatar.png'}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><rect width=%22120%22 height=%22120%22 fill=%22%23ddd%22/></svg>'"><h2>${u.username} ${u.role==='creator'?'👑':u.premium?'⭐':''}</h2><p>Роль: ${R(u)}</p><p>Цвет души: <span class="profile-color-dot" style="background:${u.color}"></span></p><p>👥 Подписчики: ${u.followers.length} | Подписки: ${u.following.length}</p><p>❤️ Лайков: ${likes}</p>${isMe?`<input type="file" id="avatar-upload" accept="image/*"><button id="change-avatar" class="btn-small">Сменить аватар</button>${u.banUntil&&u.banUntil>Date.now()?'<p style="color:red">⛔ Забанен</p>':''}`:`<button id="follow-btn" class="btn-small">${me.following.includes(u.id)?'Отписаться':'Подписаться'}</button><button id="write-btn" class="btn-small">✉️ Написать</button><button id="add-grp-btn" class="btn-small">➕ В группу</button>`}</div>`
if(isMe){document.getElementById('change-avatar').onclick=()=>{const f=document.getElementById('avatar-upload').files[0];if(f){const r=new FileReader();r.onload=()=>{u.avatar=r.result;S();RP()};r.readAsDataURL(f)}}}
else{
document.getElementById('follow-btn').onclick=()=>{if(me.following.includes(u.id)){me.following=me.following.filter(id=>id!==u.id);u.followers=u.followers.filter(id=>id!==me.id)}else{me.following.push(u.id);u.followers.push(me.id)}S();RP()}
document.getElementById('write-btn').onclick=()=>ST('messages',u.id)
document.getElementById('add-grp-btn').onclick=()=>{const gn=prompt('Название группы:');if(!gn)return;const g=D.g.find(g=>g.name===gn&&(g.creatorId===me.id||g.admins.includes(me.id)));if(!g)return alert('Группа не найдена или нет прав!');if(g.members.includes(u.id))return alert('Уже в группе!');if(g.banned.includes(u.id))return alert('Забанен в группе!');g.members.push(u.id);S();alert('Добавлен!')}
}
document.getElementById('profile-posts').innerHTML='<h3>Посты</h3>'+D.p.filter(p=>p.authorId===u.id).map(p=>`<div class="glass" style="margin-bottom:10px">${p.media?.data?(p.media.type==='image'?`<img src="${p.media.data}" style="max-width:100%;border-radius:15px;">`:`<video src="${p.media.data}" controls muted style="max-width:100%;"></video>`):''}<p>${p.text||''}</p><small>${F(p.timestamp)}</small></div>`).join('')
}
function AN(uid,type,actor){const txt=type==='❤️'?`${actor.username}, ${R(actor)}, лайкнул(а) пост.`:`${actor.username}, ${R(actor)}, прокомментировал(а) пост.`;D.n.push({id:Date.now().toString(),userId:uid,type,text:txt,read:!1,timestamp:Date.now()});S();UNB()}
function RN(){const u=U(),l=document.getElementById('notifications-list');if(!l)return;l.innerHTML='<h3>Уведомления</h3>'+(u?D.n.filter(n=>n.userId===u.id).reverse().map(n=>{n.read=!0;return`<div class="glass" style="padding:8px">${n.type} ${n.text} <small>${F(n.timestamp)}</small></div>`}).join(''):'');S();UNB()}
function UNB(){const u=U(),c=u?D.n.filter(n=>n.userId===u.id&&!n.read).length:0;document.getElementById('notif-badge').textContent=c;document.getElementById('notif-badge').classList.toggle('hidden',c===0)}
document.getElementById('create-group-btn').onclick=()=>{const u=U(),n=prompt('Название группы:');if(n){D.g.push({id:Date.now().toString(),name:n,avatar:'',creatorId:u.id,admins:[u.id],members:[u.id],banned:[],posts:[]});S();RGr()}}
function RGr(){const l=document.getElementById('groups-list');l.innerHTML='<h3>Мои группы</h3>'+D.g.map(g=>`<div class="group-card" data-groupid="${g.id}"><strong>${g.name}</strong> (${g.members.length} уч.)</div>`).join('');document.querySelectorAll('.group-card').forEach(c=>c.onclick=()=>VG(c.dataset.groupid))}
function VG(gid){const g=D.g.find(g=>g.id===gid),u=U();if(!g)return;const v=document.getElementById('group-view');v.classList.remove('hidden')
v.innerHTML=`<h3>${g.name}</h3><p>Создатель: ${D.u.find(u=>u.id===g.creatorId)?.username} (Создатель)</p><button id="join-leave" class="btn-small">${g.members.includes(u.id)?'Выйти':'Вступить'}</button>${(g.creatorId===u.id||g.admins.includes(u.id))?`<button id="del-grp" class="btn-small" style="background:#f55;color:white;">🗑️ Удалить</button>`:''}${g.creatorId===u.id?`<button id="ren-grp" class="btn-small">✏️ Переименовать</button><button id="ch-ava" class="btn-small">🖼️ Иконка</button>`:''}<div style="margin-top:10px;"><strong>Участники:</strong>${g.members.map(mid=>{const mu=D.u.find(u=>u.id===mid);if(!mu)return'';const isAdm=g.admins.includes(mid);return`<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;"><span style="cursor:pointer" class="mem-name" data-uid="${mid}">${mu.username} ${isAdm?'(Админ)':''}</span>${g.creatorId===u.id&&mid!==u.id?`<button class="btn-small tog-adm" data-uid="${mid}">${isAdm?'Убрать админа':'Сделать админом'}</button>`:''}</div>`}).join('')}</div><div style="margin-top:10px;"><h4>Посты</h4><div id="group-posts"></div><textarea id="group-post-text" placeholder="Новый пост"></textarea><button id="group-post-btn" class="btn-glow">Опубликовать</button></div>`
document.getElementById('join-leave').onclick=()=>{if(g.members.includes(u.id)){g.members=g.members.filter(id=>id!==u.id);g.admins=g.admins.filter(id=>id!==u.id)}else{if(g.banned.includes(u.id))return alert('Ты в бане!');g.members.push(u.id)}S();VG(gid)}
const db=document.getElementById('del-grp');if(db)db.onclick=()=>{if(confirm('Удалить группу?')){D.g=D.g.filter(g=>g.id!==gid);S();ST('groups')}}
if(g.creatorId===u.id){document.getElementById('ren-grp').onclick=()=>{const nn=prompt('Новое имя:',g.name);if(nn){g.name=nn;S();VG(gid)}}
document.getElementById('ch-ava').onclick=()=>{const url=prompt('Ссылка на иконку:');if(url){g.avatar=url;S();VG(gid)}}}
document.querySelectorAll('.tog-adm').forEach(b=>b.onclick=()=>{const uid=b.dataset.uid;if(g.admins.includes(uid))g.admins=g.admins.filter(id=>id!==uid);else g.admins.push(uid);S();VG(gid)})
document.querySelectorAll('.mem-name').forEach(el=>el.onclick=()=>ST('profile',el.dataset.uid))
document.getElementById('group-posts').innerHTML=g.posts.map(p=>{const pu=D.u.find(u=>u.username===p.author);return`<div><b>${p.author} ${pu?'('+R(pu)+')':''}</b>: ${p.text} <small>${F(p.timestamp)}</small></div>`}).join('')
document.getElementById('group-post-btn').onclick=()=>{const tx=document.getElementById('group-post-text').value.trim();if(tx&&g.members.includes(u.id)){g.posts.push({author:u.username,text:tx,timestamp:Date.now()});S();VG(gid)}}
}
function RA(){const u=U();if(!u||u.role!=='creator')return;const l=document.getElementById('admin-users-list');l.innerHTML='<h3>Все пользователи</h3>'+D.u.map(u=>{const ban=u.banUntil&&u.banUntil>Date.now();return`<div class="glass" style="display:flex;justify-content:space-between;margin:5px 0;padding:10px;"><span>${u.username} – ${R(u)} ${ban?'⛔':''}</span><div><button class="btn-small ban-btn" data-userid="${u.id}">⛔ Бан</button><button class="btn-small prem-btn" data-userid="${u.id}">⭐ Премиум</button></div></div>`}).join('')
document.querySelectorAll('.ban-btn').forEach(b=>b.onclick=()=>{const u=D.u.find(x=>x.id===b.dataset.userid);const d=prompt('Дни бана (0 - разбан)');if(d!==null&&u){u.banUntil=d>0?Date.now()+d*86400000:null;S();RA()}})
document.querySelectorAll('.prem-btn').forEach(b=>b.onclick=()=>{const u=D.u.find(x=>x.id===b.dataset.userid);if(u&&u.role!=='creator'){u.premium=!u.premium;S();RA()}})}
function RC(openUserId=null){const u=U();const l=document.getElementById('chats-list');l.innerHTML='<h3>Диалоги</h3>'+D.u.filter(u=>u.id!==u.id).map(u=>`<div class="user-chat" data-userid="${u.id}" style="cursor:pointer">${u.username} (${R(u)})</div>`).join('')
document.querySelectorAll('.user-chat').forEach(d=>d.onclick=()=>OC(d.dataset.userid))
if(openUserId)OC(openUserId)}
function OC(pid){const u=U(),p=D.u.find(u=>u.id===pid);if(!p)return;const cw=document.getElementById('chat-window');cw.classList.remove('hidden');const cid=[u.id,p.id].sort().join('_');let c=D.m.find(c=>c.chatId===cid);if(!c){c={chatId:cid,messages:[]};D.m.push(c)}
const um=new Map(D.u.map(u=>[u.id,u]))
cw.innerHTML=`<h4>💬 ${p.username} (${R(p)})</h4><div id="msg-container" style="flex:1;overflow-y:auto;margin-bottom:10px;">${c.messages.map(m=>{const s=um.get(m.from),n=s?s.username:'?',r=s?R(s):'';return`<div class="message ${m.from===u.id?'mine':'other'}"><b>${m.from===u.id?'Вы':n+' ('+r+')'}:</b> ${m.text}</div>`}).join('')}</div><input id="msg-input" placeholder="Сообщение..."><button id="send-msg-btn" class="btn-glow">Отправить</button>`
document.getElementById('send-msg-btn').onclick=()=>{const tx=document.getElementById('msg-input').value.trim();if(tx){c.messages.push({from:u.id,text:tx,timestamp:Date.now()});S();OC(pid)}}}
if(D.cu){const u=D.u.find(x=>x.id===D.cu.id);if(u&&(!u.banUntil||u.banUntil<=Date.now()))SH();else{D.cu=null;S()}}
})const proc=(f,t)=>new Promise(res=>{const r=new FileReader();r.onload=()=>res({type:t,data:r.result});r.readAsDataURL(f)})
const pr=[];if(im)pr.push(proc(im,'image'));if(vi)pr.push(proc(vi,'video'))
Promise.all(pr).then(m=>{const po={id:Date.now().toString(),authorId:u.id,text:tx,media:m[0]||null,timestamp:Date.now(),likes:[],comments:[]}
D.p.unshift(po);S();document.getElementById('post-text').value='';document.getElementById('post-image').value='';document.getElementById('post-video').value='';ST('feed')})
}
function RF(){
const con=document.querySelector('.feed-container');if(!con)return;con.innerHTML=''
if(!D.p.length){con.innerHTML='<div style="color:white;text-align:center;margin-top:40vh;">Нет постов</div>';return}
const um=new Map(D.u.map(u=>[u.username,u]))
D.p.forEach(po=>{const au=D.u.find(u=>u.id===po.authorId);if(!au)return
const d=document.createElement('div');d.className='post'
d.innerHTML=`<div class="post-media">${po.media?.type==='image'?`<img src="${po.media.data}" alt="pic">`:''}${po.media?.type==='video'?`<video src="${po.media.data}" controls muted autoplay loop playsinline style="width:100%;height:100%;object-fit:contain" onerror="this.style.display='none'"></video>`:''}${!po.media?`<div style="color:white;padding:20px;font-size:1.5rem;">${po.text||''}</div>`:''}</div><div class="post-caption"><span class="post-author-small" style="cursor:pointer" data-uid="${au.id}">${au.username} – ${R(au)}</span><div>${po.media?po.text:''}</div><div class="post-actions-feed"><span class="like-btn" data-postid="${po.id}">❤️ ${po.likes.length}</span><span class="comment-btn" data-postid="${po.id}">💬 ${po.comments.length}</span></div><div>${po.comments.slice(-2).map(c=>{const cu=um.get(c.author);return`<div><b>${c.author} ${cu?'('+R(cu)+')':''}</b>: ${c.text}</div>`}).join('')}</div><input type="text" class="comment-input" data-postid="${po.id}" placeholder="Комментарий..."></div>`
con.appendChild(d)})
document.querySelectorAll('.post-author-small').forEach(el=>el.onclick=(e)=>{e.stopPropagation();ST('profile',el.dataset.uid)})
document.querySelectorAll('.like-btn').forEach(b=>b.onclick=()=>{const po=D.p.find(p=>p.id===b.dataset.postid),u=U();if(!po||!u)return;if(po.likes.includes(u.id))po.likes=po.likes.filter(id=>id!==u.id);else{po.likes.push(u.id);AN(po.authorId,'❤️',u)}S();RF()})
document.querySelectorAll('.comment-input').forEach(i=>i.onkeypress=e=>{if(e.key==='Enter'){const po=D.p.find(p=>p.id===i.dataset.postid),u=U();if(!po||!u||(u.banUntil&&u.banUntil>Date.now()))return;const tx=i.value.trim();if(!tx)return;po.comments.push({author:u.username,text:tx});AN(po.authorId,'💬',u);i.value='';S();RF()}})
}
function RP(){
const u=cpid?D.u.find(u=>u.id===cpid):U();if(!u)return
const me=U(),isMe=!cpid||cpid===me?.id
const likes=D.p.filter(p=>p.authorId===u.id).reduce((s,p)=>s+p.likes.length,0)
document.getElementById('profile-info').innerHTML=`<div class="profile-container"><img class="profile-avatar" src="${u.avatar||'default-avatar.png'}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><rect width=%22120%22 height=%22120%22 fill=%22%23ddd%22/></svg>'"><h2>${u.username} ${u.role==='creator'?'👑':u.premium?'⭐':''}</h2><p>Роль: ${R(u)}</p><p>Цвет души: <span class="profile-color-dot" style="background:${u.color}"></span></p><p>👥 Подписчики: ${u.followers.length} | Подписки: ${u.following.length}</p><p>❤️ Лайков: ${likes}</p>${isMe?`<input type="file" id="avatar-upload" accept="image/*"><button id="change-avatar" class="btn-small">Сменить аватар</button>${u.banUntil&&u.banUntil>Date.now()?'<p style="color:red">⛔ Забанен</p>':''}`:`<button id="follow-btn" class="btn-small">${me.following.includes(u.id)?'Отписаться':'Подписаться'}</button><button id="write-btn" class="btn-small">✉️ Написать</button><button id="add-grp-btn" class="btn-small">➕ В группу</button>`}</div>`
if(isMe){document.getElementById('change-avatar').onclick=()=>{const f=document.getElementById('avatar-upload').files[0];if(f){const r=new FileReader();r.onload=()=>{u.avatar=r.result;S();RP()};r.readAsDataURL(f)}}}
else{
document.getElementById('follow-btn').onclick=()=>{if(me.following.includes(u.id)){me.following=me.following.filter(id=>id!==u.id);u.followers=u.followers.filter(id=>id!==me.id)}else{me.following.push(u.id);u.followers.push(me.id)}S();RP()}
document.getElementById('write-btn').onclick=()=>ST('messages',u.id)
document.getElementById('add-grp-btn').onclick=()=>{const gn=prompt('Название группы:');if(!gn)return;const g=D.g.find(g=>g.name===gn&&(g.creatorId===me.id||g.admins.includes(me.id)));if(!g)return alert('Группа не найдена или нет прав!');if(g.members.includes(u.id))return alert('Уже в группе!');if(g.banned.includes(u.id))return alert('Забанен в группе!');g.members.push(u.id);S();alert('Добавлен!')}
}
document.getElementById('profile-posts').innerHTML='<h3>Посты</h3>'+D.p.filter(p=>p.authorId===u.id).map(p=>`<div class="glass" style="margin-bottom:10px">${p.media?.data?(p.media.type==='image'?`<img src="${p.media.data}" style="max-width:100%;border-radius:15px;">`:`<video src="${p.media.data}" controls muted style="max-width:100%;"></video>`):''}<p>${p.text||''}</p><small>${F(p.timestamp)}</small></div>`).join('')
}
function AN(uid,type,actor){const txt=type==='❤️'?`${actor.username}, ${R(actor)}, лайкнул(а) пост.`:`${actor.username}, ${R(actor)}, прокомментировал(а) пост.`;D.n.push({id:Date.now().toString(),userId:uid,type,text:txt,read:!1,timestamp:Date.now()});S();UNB()}
function RN(){const u=U(),l=document.getElementById('notifications-list');if(!l)return;l.innerHTML='<h3>Уведомления</h3>'+(u?D.n.filter(n=>n.userId===u.id).reverse().map(n=>{n.read=!0;return`<div class="glass" style="padding:8px">${n.type} ${n.text} <small>${F(n.timestamp)}</small></div>`}).join(''):'');S();UNB()}
function UNB(){const u=U(),c=u?D.n.filter(n=>n.userId===u.id&&!n.read).length:0;document.getElementById('notif-badge').textContent=c;document.getElementById('notif-badge').classList.toggle('hidden',c===0)}
document.getElementById('create-group-btn').onclick=()=>{const u=U(),n=prompt('Название группы:');if(n){D.g.push({id:Date.now().toString(),name:n,avatar:'',creatorId:u.id,admins:[u.id],members:[u.id],banned:[],posts:[]});S();RGr()}}
function RGr(){const l=document.getElementById('groups-list');l.innerHTML='<h3>Мои группы</h3>'+D.g.map(g=>`<div class="group-card" data-groupid="${g.id}"><strong>${g.name}</strong> (${g.members.length} уч.)</div>`).join('');document.querySelectorAll('.group-card').forEach(c=>c.onclick=()=>VG(c.dataset.groupid))}
function VG(gid){const g=D.g.find(g=>g.id===gid),u=U();if(!g)return;const v=document.getElementById('group-view');v.classList.remove('hidden')
v.innerHTML=`<h3>${g.name}</h3><p>Создатель: ${D.u.find(u=>u.id===g.creatorId)?.username} (Создатель)</p><button id="join-leave" class="btn-small">${g.members.includes(u.id)?'Выйти':'Вступить'}</button>${(g.creatorId===u.id||g.admins.includes(u.id))?`<button id="del-grp" class="btn-small" style="background:#f55;color:white;">🗑️ Удалить</button>`:''}${g.creatorId===u.id?`<button id="ren-grp" class="btn-small">✏️ Переименовать</button><button id="ch-ava" class="btn-small">🖼️ Иконка</button>`:''}<div style="margin-top:10px;"><strong>Участники:</strong>${g.members.map(mid=>{const mu=D.u.find(u=>u.id===mid);if(!mu)return'';const isAdm=g.admins.includes(mid);return`<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;"><span style="cursor:pointer" class="mem-name" data-uid="${mid}">${mu.username} ${isAdm?'(Админ)':''}</span>${g.creatorId===u.id&&mid!==u.id?`<button class="btn-small tog-adm" data-uid="${mid}">${isAdm?'Убрать админа':'Сделать админом'}</button>`:''}</div>`}).join('')}</div><div style="margin-top:10px;"><h4>Посты</h4><div id="group-posts"></div><textarea id="group-post-text" placeholder="Новый пост"></textarea><button id="group-post-btn" class="btn-glow">Опубликовать</button></div>`
document.getElementById('join-leave').onclick=()=>{if(g.members.includes(u.id)){g.members=g.members.filter(id=>id!==u.id);g.admins=g.admins.filter(id=>id!==u.id)}else{if(g.banned.includes(u.id))return alert('Ты в бане!');g.members.push(u.id)}S();VG(gid)}
const db=document.getElementById('del-grp');if(db)db.onclick=()=>{if(confirm('Удалить группу?')){D.g=D.g.filter(g=>g.id!==gid);S();ST('groups')}}
if(g.creatorId===u.id){document.getElementById('ren-grp').onclick=()=>{const nn=prompt('Новое имя:',g.name);if(nn){g.name=nn;S();VG(gid)}}
document.getElementById('ch-ava').onclick=()=>{const url=prompt('Ссылка на иконку:');if(url){g.avatar=url;S();VG(gid)}}}
document.querySelectorAll('.tog-adm').forEach(b=>b.onclick=()=>{const uid=b.dataset.uid;if(g.admins.includes(uid))g.admins=g.admins.filter(id=>id!==uid);else g.admins.push(uid);S();VG(gid)})
document.querySelectorAll('.mem-name').forEach(el=>el.onclick=()=>ST('profile',el.dataset.uid))
document.getElementById('group-posts').innerHTML=g.posts.map(p=>{const pu=D.u.find(u=>u.username===p.author);return`<div><b>${p.author} ${pu?'('+R(pu)+')':''}</b>: ${p.text} <small>${F(p.timestamp)}</small></div>`}).join('')
document.getElementById('group-post-btn').onclick=()=>{const tx=document.getElementById('group-post-text').value.trim();if(tx&&g.members.includes(u.id)){g.posts.push({author:u.username,text:tx,timestamp:Date.now()});S();VG(gid)}}
}
function RA(){const u=U();if(!u||u.role!=='creator')return;const l=document.getElementById('admin-users-list');l.innerHTML='<h3>Все пользователи</h3>'+D.u.map(u=>{const ban=u.banUntil&&u.banUntil>Date.now();return`<div class="glass" style="display:flex;justify-content:space-between;margin:5px 0;padding:10px;"><span>${u.username} – ${R(u)} ${ban?'⛔':''}</span><div><button class="btn-small ban-btn" data-userid="${u.id}">⛔ Бан</button><button class="btn-small prem-btn" data-userid="${u.id}">⭐ Премиум</button></div></div>`}).join('')
document.querySelectorAll('.ban-btn').forEach(b=>b.onclick=()=>{const u=D.u.find(x=>x.id===b.dataset.userid);const d=prompt('Дни бана (0 - разбан)');if(d!==null&&u){u.banUntil=d>0?Date.now()+d*86400000:null;S();RA()}})
document.querySelectorAll('.prem-btn').forEach(b=>b.onclick=()=>{const u=D.u.find(x=>x.id===b.dataset.userid);if(u&&u.role!=='creator'){u.premium=!u.premium;S();RA()}})}
function RC(openUserId=null){const u=U();const l=document.getElementById('chats-list');l.innerHTML='<h3>Диалоги</h3>'+D.u.filter(u=>u.id!==u.id).map(u=>`<div class="user-chat" data-userid="${u.id}" style="cursor:pointer">${u.username} (${R(u)})</div>`).join('')
document.querySelectorAll('.user-chat').forEach(d=>d.onclick=()=>OC(d.dataset.userid))
if(openUserId)OC(openUserId)}
function OC(pid){const u=U(),p=D.u.find(u=>u.id===pid);if(!p)return;const cw=document.getElementById('chat-window');cw.classList.remove('hidden');const cid=[u.id,p.id].sort().join('_');let c=D.m.find(c=>c.chatId===cid);if(!c){c={chatId:cid,messages:[]};D.m.push(c)}
const um=new Map(D.u.map(u=>[u.id,u]))
cw.innerHTML=`<h4>💬 ${p.username} (${R(p)})</h4><div id="msg-container" style="flex:1;overflow-y:auto;margin-bottom:10px;">${c.messages.map(m=>{const s=um.get(m.from),n=s?s.username:'?',r=s?R(s):'';return`<div class="message ${m.from===u.id?'mine':'other'}"><b>${m.from===u.id?'Вы':n+' ('+r+')'}:</b> ${m.text}</div>`}).join('')}</div><input id="msg-input" placeholder="Сообщение..."><button id="send-msg-btn" class="btn-glow">Отправить</button>`
document.getElementById('send-msg-btn').onclick=()=>{const tx=document.getElementById('msg-input').value.trim();if(tx){c.messages.push({from:u.id,text:tx,timestamp:Date.now()});S();OC(pid)}}}
if(D.cu){const u=D.u.find(x=>x.id===D.cu.id);if(u&&(!u.banUntil||u.banUntil<=Date.now()))SH();else{D.cu=null;S()}}
})
