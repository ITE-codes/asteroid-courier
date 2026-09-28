const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');
const $ = selector => document.querySelector(selector);
const keys = new Set();
let best = Number(localStorage.getItem('courier-best')) || 0;
let score = 0, lives = 3, player = null, objects = [], elapsed = 0, spawnTimer = 0, running = false, paused = false, last = 0, invincible = 0;
$('#best').textContent = best;
const stars = Array.from({length: 52}, () => ({x: Math.random()*480, y: Math.random()*600, r: .5+Math.random()*1.5}));
function reset() {
  score = 0; lives = 3; player = {x:224, y:535, w:32, h:35}; objects = [];
  elapsed = 0; spawnTimer = .5; invincible = 0; running = true; paused = false;
  $('#overlay').classList.add('hidden'); updateHud(); last = performance.now();
}
function updateHud() { $('#score').textContent = score; $('#lives').textContent = lives; $('#best').textContent = best; }
function end() {
  running = false; $('#message').textContent = 'Mission complete';
  $('#hint').textContent = `You delivered ${score} parcel${score===1?'':'s'}. Go again?`;
  $('#start').textContent = 'Try again'; $('#overlay').classList.remove('hidden');
}
function overlap(a,b) { return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y; }
function update(dt) {
  elapsed += dt; invincible = Math.max(0, invincible-dt);
  const direction = (keys.has('ArrowRight') || keys.has('d') ? 1 : 0) - (keys.has('ArrowLeft') || keys.has('a') ? 1 : 0);
  player.x = Math.max(0, Math.min(480-player.w, player.x + direction*320*dt));
  spawnTimer -= dt;
  if (spawnTimer <= 0) {
    const parcel = Math.random() < .32;
    const size = parcel ? 22 : 27+Math.random()*19;
    objects.push({x:Math.random()*(480-size), y:-size, w:size, h:size, parcel, speed:150+elapsed*4+Math.random()*90});
    spawnTimer = Math.max(.25, .78-elapsed*.009);
  }
  for (const obj of objects) {
    obj.y += obj.speed*dt;
    if (overlap(player,obj)) {
      obj.y = 700;
      if (obj.parcel) { score++; if (score > best) { best = score; localStorage.setItem('courier-best', best); } }
      else if (invincible === 0) { lives--; invincible = 1.2; if (lives <= 0) end(); }
      updateHud();
    }
  }
  objects = objects.filter(obj => obj.y < 630);
}
function draw() {
  ctx.clearRect(0,0,480,600);
  ctx.fillStyle='#081326'; ctx.fillRect(0,0,480,600);
  for (const star of stars) {ctx.fillStyle='#4879a7';ctx.beginPath();ctx.arc(star.x,star.y,star.r,0,Math.PI*2);ctx.fill();}
  ctx.fillStyle='#173252'; ctx.fillRect(0,590,480,10);
  for (const obj of objects) {
    ctx.save(); ctx.translate(obj.x+obj.w/2,obj.y+obj.h/2);
    if (obj.parcel) { ctx.fillStyle='#f9c75b';ctx.shadowColor='#ffd66b';ctx.shadowBlur=18;ctx.fillRect(-obj.w/2,-obj.h/2,obj.w,obj.h);ctx.shadowBlur=0;ctx.fillStyle='#805c12';ctx.fillRect(-2,-obj.h/2,4,obj.h); }
    else { ctx.fillStyle='#e77481';ctx.beginPath();ctx.arc(0,0,obj.w/2,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ac425d';ctx.beginPath();ctx.arc(-5,-4,4,0,Math.PI*2);ctx.fill(); }
    ctx.restore();
  }
  if (player && (invincible === 0 || Math.floor(invincible*10)%2===0)) {
    ctx.save();ctx.translate(player.x+16,player.y+16);ctx.fillStyle='#80e2e6';ctx.beginPath();ctx.moveTo(0,-21);ctx.lineTo(17,17);ctx.lineTo(0,10);ctx.lineTo(-17,17);ctx.closePath();ctx.fill();ctx.fillStyle='#f9c75b';ctx.fillRect(-5,17,10,8);ctx.restore();
  }
  if (paused) { ctx.fillStyle='#07101fdc';ctx.fillRect(0,0,480,600);ctx.fillStyle='white';ctx.textAlign='center';ctx.font='bold 32px system-ui';ctx.fillText('Paused',240,300); }
}
function frame(now) { const dt=Math.min((now-last)/1000,.05); last=now; if(running&&!paused) update(dt); draw(); requestAnimationFrame(frame); }
$('#start').addEventListener('click',reset);
window.addEventListener('keydown',e=>{const key=e.key.length===1?e.key.toLowerCase():e.key;if(['ArrowLeft','ArrowRight',' ','p'].includes(key))e.preventDefault();keys.add(key);if(key===' '&&!running)reset();if(key==='p'&&running)paused=!paused;});
window.addEventListener('keyup',e=>keys.delete(e.key.length===1?e.key.toLowerCase():e.key));
window.addEventListener('blur',()=>{keys.clear();if(running)paused=true;});
for(const [id,key] of [['#left','ArrowLeft'],['#right','ArrowRight']]) {const button=$(id);button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);keys.add(key)});for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,()=>keys.delete(key));}
requestAnimationFrame(frame);
