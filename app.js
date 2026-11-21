const DATA = () => window.VET_DATA;
const $ = s => document.querySelector(s);
const get = (k, def = []) => {
  try {
    return JSON.parse(localStorage.getItem('vet360_' + k)) ?? def;
  } catch {
    return def;
  }
};
const set = (k, v) => localStorage.setItem('vet360_' + k, JSON.stringify(v));

let route = 'home';
let selected = null;
let quizIndex = 0;
let quizScore = 0;
let quizAnswered = false;
let installPrompt = null;

const cat = id => DATA().categories.find(c => c[0] === id);
const lesson = id => DATA().lessons.find(l => l.id === id);

function heading(title, sub = '') {
  return `<div class="section-head"><div><h1 class="page-title">${title}</h1>${sub ? `<p class="sub">${sub}</p>` : ''}</div></div>`;
}

function lessonCard(l) {
  if (!l) return '';
  const done = get('done').includes(l.id);
  return `<button class="lesson" data-lesson="${l.id}">
    <span>
      <strong>${done ? '✓ ' : ''}${l.title}</strong>
      <small>${l.en} · ${l.summary}</small>
    </span>
    <span class="tag">${l.level}</span>
  </button>`;
}

function home() {
  const done = get('done');
  const saved = get('saved');
  const totalLessons = DATA().lessons.length;
  const pct = totalLessons ? Math.round((done.length / totalLessons) * 100) : 0;

  return `
    <section class="hero">
      <div class="eyebrow">VETERINARY LEARNING PLATFORM</div>
      <h1>เรียนรู้ เข้าใจ<br>พร้อมใช้งานทางคลินิก</h1>
      <p>คลังความรู้สัตวแพทย์ ครบถ้วน อ่านง่าย เป็นระบบ</p>
      <button class="btn pink" data-go="library">สำรวจคลังความรู้ →</button>
    </section>

    <section class="section">
      <div class="section-head">
        <div>
          <h2>ภาพรวมการเรียน</h2>
          <p class="sub">YOUR LEARNING PROGRESS</p>
        </div>
      </div>
      <div class="panel">
        <div class="row">
          <span>บทเรียนที่เรียนจบ</span>
          <b>${done.length}/${totalLessons} (${pct}%)</b>
        </div>
        <div class="progress"><span style="width:${pct}%"></span></div>
        <div class="stats">
          <div class="stat"><b>${DATA().categories.length}</b><small>หมวดความรู้</small></div>
          <div class="stat"><b>${totalLessons}</b><small>บทเรียน</small></div>
          <div class="stat"><b>${saved.length}</b><small>บันทึกไว้</small></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <div>
          <h2>หมวดหมู่หลัก</h2>
          <p class="sub">เลือกหัวข้อที่ต้องการศึกษา</p>
        </div>
        <a href="#library" class="sub" style="color:var(--mint-dark);font-weight:600;text-decoration:none;">ดูทั้งหมด →</a>
      </div>
      <div class="grid">
        ${DATA().categories.slice(0, 6).map(c => `
          <button class="tile" data-cat="${c[0]}">
            <span class="emoji">${c[3]}</span>
            <strong>${c[1]}</strong>
            <small>${c[2]}</small>
          </button>
        `).join('')}
      </div>
    </section>

    <section class="section">
      <h2>บทเรียนแนะนำ</h2>
      <div class="list">
        ${['a1', 's1', 't1', 'd1'].map(id => lessonCard(lesson(id))).join('')}
      </div>
    </section>
  `;
}

function library() {
  return heading('คลังความรู้', 'เนื้อหาสัตวแพทย์ตั้งแต่พื้นฐานจนถึงระดับคลินิก') +
    `<div class="grid">
      ${DATA().categories.map(c => {
        const count = DATA().lessons.filter(l => l.cat === c[0]).length;
        return `<button class="tile" data-cat="${c[0]}">
          <span class="emoji">${c[3]}</span>
          <strong>${c[1]}</strong>
          <small>${c[2]}</small>
          <div class="count">${count} บทเรียน</div>
        </button>`;
      }).join('')}
    </div>`;
}

function categoryPage(id) {
  const c = cat(id);
  if (!c) return library();
  const items = DATA().lessons.filter(l => l.cat === id);
  return `
    <button class="back" data-go="library">← ทุกหมวดหมู่</button>
    ${heading(c[3] + ' ' + c[1], c[2] + ' · ' + c[4])}
    <div class="list">
      ${items.length ? items.map(lessonCard).join('') : '<div class="panel"><p class="muted">กำลังอัปเดตบทเรียนเพิ่มเติมในหมวดหมู่นี้</p></div>'}
    </div>
  `;
}

function detailPage(id) {
  const l = lesson(id);
  if (!l) {
    return `<button class="back" data-go="library">← กลับคลังความรู้</button><div class="panel"><p>ไม่พบบทเรียนที่ต้องการ</p></div>`;
  }
  const c = cat(l.cat);
  const saved = get('saved');
  const done = get('done');

  return `
    <button class="back" data-cat="${l.cat}">← ${c ? c[1] : 'คลังความรู้'}</button>
    ${heading(l.title, l.en)}
    <span class="tag">ระดับ: ${l.level}</span>
    <p class="sub" style="margin-top:8px;">${l.summary}</p>

    <div class="panel">
      <b>ภาพรวมเนื้อหา</b>
      <p class="content-block">${l.overview}</p>
    </div>

    <div class="panel">
      <b>สาระสำคัญทางคลินิก</b>
      <ul class="content-list">
        ${l.points.map(p => `<li>${p}</li>`).join('')}
      </ul>
    </div>

    <div class="panel">
      <b>คำศัพท์และตัวย่อสำคัญ</b>
      <p class="sub">English · คำอ่านภาษาไทย · ความหมาย</p>
      ${l.terms.map(t => `
        <div class="term">
          <b>${t[0]}</b>
          <div class="pron">${t[1]}</div>
          <small>${t[2]}</small>
        </div>
      `).join('')}
    </div>

    <div class="notice">
      <strong>ข้อควรระวังและความปลอดภัย:</strong> ${l.caution}
    </div>

    <div class="row" style="margin-top:16px">
      <button class="btn" data-done="${l.id}">${done.includes(l.id) ? '✓ เรียนจบแล้ว' : 'ทำเครื่องหมายว่าเรียนจบ'}</button>
      <button class="btn secondary" data-save="${l.id}">${saved.includes(l.id) ? '♥ บันทึกแล้ว' : '♡ บันทึกบทเรียน'}</button>
    </div>
  `;
}

function searchPage() {
  return `
    ${heading('ค้นหาความรู้', 'ค้นหาชื่ออวัยวะ เครื่องมือ ยา ตัวย่อ หรือคำศัพท์')}
    <input id="search" class="searchbox" placeholder="พิมพ์คำค้น เช่น Femur, Hemostat, BID, CBC, เย็บแผล">
    <div id="results" class="list">
      <p class="muted">ลองค้นหาคำสำคัญ เช่น Femur · Linea alba · Metzenbaum · mg/kg · EDTA</p>
    </div>
  `;
}

function searchResults(q) {
  const el = $('#results');
  if (!el) return;
  const s = q.trim().toLowerCase();
  if (!s) {
    el.innerHTML = '<p class="muted">พิมพ์คำที่ต้องการค้นหา</p>';
    return;
  }
  const arr = DATA().lessons.filter(l => JSON.stringify(l).toLowerCase().includes(s));
  el.innerHTML = arr.length ? arr.map(lessonCard).join('') : '<p class="muted">ไม่พบผลลัพธ์ ลองใช้คำค้นอื่น</p>';
}

function savedPage() {
  const ids = get('saved');
  const arr = ids.map(lesson).filter(Boolean);
  return heading('รายการที่บันทึกไว้', 'บทเรียนที่คุณเก็บไว้อ่านทบทวนภายหลัง') +
    (arr.length
      ? `<div class="list">${arr.map(lessonCard).join('')}</div>`
      : `<div class="panel" style="text-align:center;padding:30px">
          <div style="font-size:32px;color:var(--pink);">♡</div>
          <h3>ยังไม่มีบทเรียนที่บันทึก</h3>
          <p class="sub">กดปุ่มบันทึกในหน้าบทเรียนเพื่อเก็บเนื้อหาไว้ทบทวน</p>
          <button class="btn" style="margin-top:10px;" data-go="library">ไปที่คลังความรู้</button>
        </div>`);
}

function quizPage() {
  const qs = DATA().quiz;
  if (quizIndex >= qs.length) {
    return `
      ${heading('ผลการทดสอบ', 'สรุปคะแนนแบบทดสอบทบทวนความรู้')}
      <div class="panel" style="text-align:center;padding:30px">
        <div style="font-size:44px">🏆</div>
        <h2>ทำแบบทดสอบเสร็จสมบูรณ์</h2>
        <h1 style="font-size:40px;color:var(--mint-dark);margin:10px 0;">${quizScore}/${qs.length}</h1>
        <p class="muted">คะแนนของคุณ</p>
        <button class="btn" id="restart" style="margin-top:12px;">ทำแบบทดสอบอีกครั้ง</button>
      </div>
    `;
  }
  const q = qs[quizIndex];
  const pct = Math.round((quizIndex / qs.length) * 100);
  return `
    <section class="hero">
      <div class="eyebrow">KNOWLEDGE CHECK</div>
      <h1>แบบทดสอบท้ายบท</h1>
      <p>ทบทวนความเข้าใจด้านกายวิภาค ศัลยกรรม เภสัชวิทยา และห้องปฏิบัติการ</p>
    </section>
    <div class="panel">
      <div class="row">
        <b>ข้อที่ ${quizIndex + 1} จาก ${qs.length}</b>
        <span class="tag">คะแนนสะสม: ${quizScore}</span>
      </div>
      <div class="progress"><span style="width:${pct}%"></span></div>
      <h3 style="margin-top:20px;line-height:1.45;">${q[0]}</h3>
      ${q[1].map((a, i) => `<button class="answer" data-answer="${i}" ${quizAnswered ? 'disabled' : ''}>${'กขคง'[i]}. ${a}</button>`).join('')}
      <p id="feedback" class="sub" style="margin-top:12px;font-weight:500;">${quizAnswered ? q[3] : 'เลือกคำตอบที่ถูกต้องที่สุด'}</p>
      <button class="btn" id="next" style="margin-top:12px;${quizAnswered ? '' : 'opacity:.45;'}" ${quizAnswered ? '' : 'disabled'}>
        ${quizIndex === qs.length - 1 ? 'ดูสรุปผลคะแนน' : 'ข้อถัดไป →'}
      </button>
    </div>
  `;
}

function render() {
  const app = $('#app');
  const html = selected
    ? detailPage(selected)
    : route === 'home'
    ? home()
    : route === 'library'
    ? library()
    : route === 'search'
    ? searchPage()
    : route === 'saved'
    ? savedPage()
    : route === 'quiz'
    ? quizPage()
    : route.startsWith('cat:')
    ? categoryPage(route.slice(4))
    : home();

  app.innerHTML = html;
  document.querySelectorAll('[data-nav]').forEach(a => {
    a.classList.toggle('active', a.dataset.nav === route);
  });
}

function navigate() {
  const h = location.hash.slice(1) || 'home';
  selected = null;
  if (h.startsWith('lesson/')) {
    selected = h.split('/')[1];
    route = 'library';
  } else {
    route = h;
  }
  render();
  window.scrollTo(0, 0);
}

document.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.go) {
    location.hash = b.dataset.go;
    return;
  }
  if (b.dataset.cat) {
    location.hash = 'cat:' + b.dataset.cat;
    return;
  }
  if (b.dataset.lesson) {
    location.hash = 'lesson/' + b.dataset.lesson;
    return;
  }
  if (b.dataset.save) {
    const a = get('saved');
    const id = b.dataset.save;
    set('saved', a.includes(id) ? a.filter(x => x !== id) : [...a, id]);
    render();
    return;
  }
  if (b.dataset.done) {
    const a = get('done');
    const id = b.dataset.done;
    set('done', a.includes(id) ? a.filter(x => x !== id) : [...a, id]);
    render();
    return;
  }
  if (b.dataset.answer !== undefined && !quizAnswered) {
    const q = DATA().quiz[quizIndex];
    const i = +b.dataset.answer;
    const ok = i === q[2];
    quizAnswered = true;
    if (ok) quizScore++;
    document.querySelectorAll('[data-answer]').forEach((x, n) => {
      if (n === q[2]) x.classList.add('correct');
      else if (n === i) x.classList.add('wrong');
    });
    const fb = $('#feedback');
    fb.style.color = ok ? 'var(--mint-dark)' : '#b84a66';
    fb.textContent = (ok ? '✓ ถูกต้อง! ' : '✕ ยังไม่ถูกต้อง: ') + q[3];
    const nextBtn = $('#next');
    nextBtn.disabled = false;
    nextBtn.style.opacity = 1;
    return;
  }
  if (b.id === 'next') {
    quizIndex++;
    quizAnswered = false;
    render();
    return;
  }
  if (b.id === 'restart') {
    quizIndex = 0;
    quizScore = 0;
    quizAnswered = false;
    render();
  }
});

document.addEventListener('input', e => {
  if (e.target.id === 'search') searchResults(e.target.value);
});

window.addEventListener('hashchange', navigate);
navigate();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('./sw.js').catch(console.warn);
}

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  installPrompt = e;
  $('#installBtn').hidden = false;
});

$('#installBtn').addEventListener('click', async () => {
  if (!installPrompt) return;
  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
  $('#installBtn').hidden = true;
});

if (/iphone|ipad|ipod/i.test(navigator.userAgent) && !window.matchMedia('(display-mode: standalone)').matches) {
  setTimeout(() => {
    if (!localStorage.getItem('vet360_ios_tip')) {
      const n = document.createElement('div');
      n.className = 'notice';
      n.innerHTML = '<b>ติดตั้งบน iPhone/iPad:</b> กดปุ่มแชร์ใน Safari แล้วเลือก “เพิ่มไปยังหน้าจอโฮม” <button id="closeTip" style="float:right;border:0;background:none;color:inherit;font-weight:bold;cursor:pointer;">ปิด</button>';
      $('#app').prepend(n);
      $('#closeTip').onclick = () => {
        n.remove();
        localStorage.setItem('vet360_ios_tip', '1');
      };
    }
  }, 800);
}
