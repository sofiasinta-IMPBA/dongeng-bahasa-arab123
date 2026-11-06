import "./css/style.css";
import story from "./data/story.json";
import vocabulary from "./data/vocabulary.json";
import questions from "./data/quiz.json";

const STORAGE_KEY = "dongeng-ceria-progress-v1";

const defaultProgress = {
  storyRead: false,
  viewedWords: [],
  attempts: [],
  bestScore: null,
  lastScore: null
};

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved && typeof saved === "object" ? { ...defaultProgress, ...saved } : { ...defaultProgress };
  } catch {
    return { ...defaultProgress };
  }
}

let progress = loadProgress();
let currentView = "home";
let storyStep = 0;
let quizIndex = 0;
let selectedAnswer = null;
let quizAnswers = [];
let quizFinished = false;
let activeFilter = "all";

const app = document.querySelector("#app");

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}

function navButton(view, label, icon) {
  const active = currentView === view ? "active" : "";
  return `<button class="nav-link ${active}" data-view="${view}" type="button"><span>${icon}</span>${label}</button>`;
}

function header() {
  return `
    <header class="site-header">
      <a class="brand" href="#" data-view="home" aria-label="Dongeng Ceria - Beranda">
        <span class="brand-mark">📚</span>
        <span class="brand-copy"><strong>dongeng<span>ceria</span></strong><small>Belajar sambil berpetualang</small></span>
      </a>
      <nav class="main-nav" aria-label="Navigasi utama">
        ${navButton("home", "Beranda", "⌂")}
        ${navButton("story", "Cerita", "📖")}
        ${navButton("vocabulary", "Mufradat", "🔤")}
        ${navButton("quiz", "Kuis", "✦")}
        ${navButton("progress", "Progres", "🏅")}
      </nav>
      <div class="header-pill"><span class="online-dot"></span> Kelas 2 SD</div>
    </header>`;
}

function footer() {
  return `<footer class="site-footer">
    <div class="footer-brand">📚 <strong>Dongeng Ceria</strong></div>
    <p>Belajar hal baik dari cerita sederhana.</p>
    <span>© ${new Date().getFullYear()} Dongeng Ceria · Belajar jadi menyenangkan!</span>
  </footer>`;
}

function shell(content) {
  app.innerHTML = `${header()}<main class="page-wrap">${content}</main>${footer()}`;
  bindGlobalEvents();
}

function bindGlobalEvents() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const view = button.dataset.view;
      if (view) navigate(view);
    });
  });

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => handleAction(button.dataset.action, button));
  });
}

function navigate(view) {
  currentView = view;
  if (view === "quiz") resetQuiz();
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function render() {
  const views = {
    home: renderHome,
    story: renderStory,
    vocabulary: renderVocabulary,
    quiz: renderQuiz,
    result: renderResult,
    progress: renderProgress
  };
  (views[currentView] || renderHome)();
}

function renderHome() {
  const wordsLearned = progress.viewedWords.length;
  const best = progress.bestScore === null ? "—" : `${progress.bestScore}`;
  shell(`
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow"><span>🌟</span> PETUALANGAN BARU MENANTI</span>
        <h1>Yuk, belajar dari <span>cerita seru!</span></h1>
        <p>Ikuti petualangan Kelinci dan Kura-kura. Baca ceritanya, kenali kosakata Arab, lalu buktikan kemampuanmu lewat kuis!</p>
        <div class="hero-actions">
          <button class="btn btn-primary" data-action="start-story">Mulai membaca <span>→</span></button>
          <button class="btn btn-secondary" data-view="vocabulary">Belajar mufradat</button>
        </div>
        <div class="hero-trust"><span>🧒</span><span>Seru dan mudah dipahami</span><i></i><span>⏱️ 10 menit belajar</span></div>
      </div>
      <div class="hero-art">
        <div class="art-spark spark-one">✦</div><div class="art-spark spark-two">✧</div>
        <img src="${story.cover}" alt="Ilustrasi kelinci dan kura-kura di hutan" />
        <div class="floating-note note-top"><span>🐰</span><div><b>Si Kelinci</b><small>Si paling cepat!</small></div></div>
        <div class="floating-note note-bottom"><span>🐢</span><div><b>Si Kura-kura</b><small>Jangan menyerah!</small></div></div>
      </div>
    </section>

    <section class="stats-strip">
      <div class="stat-item"><span class="stat-icon peach">📖</span><div><strong>${progress.storyRead ? "Selesai" : "Belum dibaca"}</strong><small>Status cerita</small></div></div>
      <div class="stat-item"><span class="stat-icon lilac">🔤</span><div><strong>${wordsLearned}/${vocabulary.length}</strong><small>Mufradat dipelajari</small></div></div>
      <div class="stat-item"><span class="stat-icon mint">🏆</span><div><strong>${best}${best === "—" ? "" : "/100"}</strong><small>Nilai terbaik</small></div></div>
    </section>

    <section class="section-block">
      <div class="section-heading"><div><span class="eyebrow">MULAI PETUALANGAN</span><h2>Belajar dalam 3 langkah</h2></div><span class="heading-doodle">✳</span></div>
      <div class="learning-grid">
        <article class="learning-card story-card">
          <div class="card-visual visual-story"><span>📚</span><span class="visual-orbit">✦</span></div>
          <div class="card-body"><span class="step-label">LANGKAH 01</span><h3>Baca cerita</h3><p>Ikuti kisah seru dan temukan pesan baik di dalamnya.</p><button class="text-link" data-view="story">Baca cerita <span>→</span></button></div>
        </article>
        <article class="learning-card vocab-card">
          <div class="card-visual visual-vocab"><span>أ ب ت</span><span class="visual-star">✦</span></div>
          <div class="card-body"><span class="step-label">LANGKAH 02</span><h3>Kenali mufradat</h3><p>Pelajari kosakata Bahasa Arab dengan gambar dan suara.</p><button class="text-link" data-view="vocabulary">Belajar mufradat <span>→</span></button></div>
        </article>
        <article class="learning-card quiz-card">
          <div class="card-visual visual-quiz"><span>✏️</span><span class="quiz-mini-star">★</span></div>
          <div class="card-body"><span class="step-label">LANGKAH 03</span><h3>Kerjakan kuis</h3><p>Jawab pertanyaan dan kumpulkan bintang terbaikmu.</p><button class="text-link" data-view="quiz">Mulai kuis <span>→</span></button></div>
        </article>
      </div>
    </section>

    <section class="featured-story">
      <div class="featured-copy"><span class="eyebrow">CERITA PILIHAN HARI INI</span><h2>${escapeHtml(story.title)}</h2><p>${escapeHtml(story.subtitle)}. Cerita singkat yang mengajarkan kita untuk rendah hati dan terus berusaha.</p><div class="story-meta"><span>📚 ${story.level}</span><span>⏱️ ${story.duration}</span></div><button class="btn btn-dark" data-action="start-story">Buka cerita <span>→</span></button></div>
      <div class="featured-illustration"><img src="${story.cover}" alt="Kelinci dan kura-kura berlomba di hutan"></div>
    </section>
  `);
}

function renderStory() {
  const segment = story.segments[storyStep];
  const percent = ((storyStep + 1) / story.segments.length) * 100;
  shell(`
    <section class="page-intro">
      <span class="eyebrow">WAKTUNYA MEMBACA</span>
      <h1>${escapeHtml(story.title)}</h1>
      <p>${escapeHtml(story.subtitle)}. Baca perlahan, ya!</p>
    </section>
    <section class="story-reader">
      <div class="reader-top"><span class="reader-label">📖 CERITA DONGENG</span><span class="reader-count">Bagian ${storyStep + 1} dari ${story.segments.length}</span></div>
      <div class="reader-progress"><span style="width:${percent}%"></span></div>
      <div class="story-scene">
        <img src="${story.cover}" alt="Ilustrasi hutan tempat kelinci dan kura-kura berlomba">
        <div class="scene-sticker">${segment.illustration}</div>
      </div>
      <div class="story-text">
        <span class="step-label">BAGIAN ${String(storyStep + 1).padStart(2, "0")}</span>
        <h2>${escapeHtml(segment.heading)}</h2>
        <p>${escapeHtml(segment.text)}</p>
      </div>
      <div class="reader-controls">
        <button class="btn btn-secondary" data-action="story-prev" ${storyStep === 0 ? "disabled" : ""}>← Sebelumnya</button>
        <button class="btn btn-primary" data-action="story-next">${storyStep === story.segments.length - 1 ? "Selesai membaca ✓" : "Lanjut membaca →"}</button>
      </div>
    </section>
    ${storyStep === story.segments.length - 1 ? `<div class="moral-box"><span>💡</span><div><strong>Pesan cerita</strong><p>${escapeHtml(story.moral)}</p></div></div>` : ""}
    <div class="center-actions"><button class="text-link" data-view="vocabulary">Lanjut belajar mufradat <span>→</span></button></div>
  `);
}

function renderVocabulary() {
  const filtered = activeFilter === "all" ? vocabulary : vocabulary.filter((word) => progress.viewedWords.includes(word.id));
  shell(`
    <section class="page-intro">
      <span class="eyebrow">KAMUS MINI CERIA</span>
      <h1>Yuk, kenali <span>mufradat!</span></h1>
      <p>Temukan kosakata Bahasa Arab dari cerita. Tekan tombol suara untuk mendengarkan pengucapannya.</p>
    </section>
    <div class="vocab-toolbar">
      <div class="vocab-count"><strong>${progress.viewedWords.length}</strong> dari ${vocabulary.length} kosakata sudah dipelajari</div>
      <div class="filter-tabs">
        <button class="${activeFilter === "all" ? "selected" : ""}" data-action="filter-all">Semua</button>
        <button class="${activeFilter === "learned" ? "selected" : ""}" data-action="filter-learned">Sudah dipelajari</button>
      </div>
    </div>
    <section class="vocab-grid">
      ${filtered.map((word) => `
        <article class="vocab-card-item ${progress.viewedWords.includes(word.id) ? "is-learned" : ""}">
          <div class="vocab-card-top"><span class="vocab-emoji">${word.emoji}</span><span class="learned-tag">${progress.viewedWords.includes(word.id) ? "✓ Dipelajari" : "Kosakata"}</span></div>
          <div class="arabic-word" lang="ar" dir="rtl">${word.arabic}</div>
          <div class="latin-word">${escapeHtml(word.latin)}</div>
          <div class="meaning-word">${escapeHtml(word.meaning)}</div>
          <div class="example-line"><span lang="ar" dir="rtl">${word.example}</span><small>${escapeHtml(word.exampleMeaning)}</small></div>
          <button class="sound-button" data-action="speak" data-word="${word.id}">🔊 Dengarkan</button>
          <button class="learn-button" data-action="mark-word" data-word="${word.id}">${progress.viewedWords.includes(word.id) ? "Sudah kupahami ✓" : "Tandai dipelajari"}</button>
        </article>
      `).join("")}
    </section>
    ${filtered.length === 0 ? `<div class="empty-state"><span>🌱</span><h3>Belum ada kosakata yang dipelajari</h3><p>Ayo mulai dari kartu mufradat pertama!</p><button class="btn btn-primary" data-action="filter-all">Lihat semua kosakata</button></div>` : ""}
    <div class="tip-banner"><span>💡</span><p><strong>Tips belajar:</strong> Ucapkan kosakatanya dengan suara lantang, lalu coba ingat artinya tanpa melihat kartu.</p></div>
    <div class="center-actions"><button class="btn btn-primary" data-view="quiz">Aku siap mengerjakan kuis! →</button></div>
  `);
}

function resetQuiz() {
  quizIndex = 0;
  selectedAnswer = null;
  quizAnswers = [];
  quizFinished = false;
}

function renderQuiz() {
  if (quizFinished) return renderResult();
  const q = questions[quizIndex];
  const percent = (quizIndex / questions.length) * 100;
  shell(`
    <section class="page-intro quiz-intro">
      <span class="eyebrow">TANTANGAN CERDAS</span>
      <h1>Siap jadi <span>juara?</span></h1>
      <p>Jawab pertanyaan berikut berdasarkan cerita dan mufradat yang sudah kamu pelajari.</p>
    </section>
    <section class="quiz-panel">
      <div class="quiz-topline"><span class="quiz-chip">✦ KUIS CERIA</span><span class="question-counter">Soal ${quizIndex + 1} <span>/ ${questions.length}</span></span></div>
      <div class="quiz-progress"><span style="width:${percent}%"></span></div>
      <div class="question-area">
        <div class="question-number">${String(quizIndex + 1).padStart(2, "0")}</div>
        <h2>${escapeHtml(q.question)}</h2>
        <div class="answer-list">
          ${q.options.map((option, index) => {
            let stateClass = "";
            if (selectedAnswer !== null) {
              if (index === q.answer) stateClass = "correct";
              else if (index === selectedAnswer) stateClass = "wrong";
            }
            return `<button class="answer-option ${stateClass}" data-action="answer" data-answer="${index}" ${selectedAnswer !== null ? "disabled" : ""}>
              <span class="answer-letter">${String.fromCharCode(65 + index)}</span><span>${escapeHtml(option)}</span>
              ${selectedAnswer !== null && index === q.answer ? `<b class="answer-status">✓</b>` : ""}
              ${selectedAnswer === index && selectedAnswer !== q.answer ? `<b class="answer-status">×</b>` : ""}
            </button>`;
          }).join("")}
        </div>
        ${selectedAnswer !== null ? `<div class="feedback-box ${selectedAnswer === q.answer ? "feedback-correct" : "feedback-wrong"}"><span>${selectedAnswer === q.answer ? "🎉" : "💛"}</span><div><strong>${selectedAnswer === q.answer ? "Hebat, jawabanmu benar!" : "Belum tepat, jangan menyerah!"}</strong><p>${escapeHtml(q.explanation)}</p></div></div>` : ""}
      </div>
      <div class="quiz-bottom"><span>⭐ Setiap jawaban benar bernilai ${Math.round(100 / questions.length)} poin</span><button class="btn btn-primary" data-action="quiz-next" ${selectedAnswer === null ? "disabled" : ""}>${quizIndex === questions.length - 1 ? "Lihat hasilku" : "Soal berikutnya →"}</button></div>
    </section>
  `);
}

function renderResult() {
  const correct = quizAnswers.filter((answer, index) => answer === questions[index].answer).length;
  const score = Math.round((correct / questions.length) * 100);
  const message = score === 100 ? "Sempurna! Kamu hebat sekali!" : score >= 70 ? "Bagus! Terus pertahankan!" : score >= 50 ? "Kamu sudah berusaha dengan baik!" : "Ayo belajar lagi, kamu pasti bisa!";
  shell(`
    <section class="result-panel">
      <div class="result-confetti">✦　✧　★　✦　✧</div>
      <div class="result-medal">${score >= 70 ? "🏆" : "🌟"}</div>
      <span class="eyebrow">HASIL PETUALANGANMU</span>
      <h1>${message}</h1>
      <p>Kamu sudah menyelesaikan kuis Kelinci dan Kura-kura.</p>
      <div class="score-circle"><div><strong>${score}</strong><span> / 100</span></div><small>NILAI KAMU</small></div>
      <div class="result-stats"><div><strong>${correct}</strong><span>Jawaban benar</span></div><div><strong>${questions.length - correct}</strong><span>Jawaban salah</span></div><div><strong>${questions.length}</strong><span>Total soal</span></div></div>
      <div class="result-actions"><button class="btn btn-primary" data-action="retry-quiz">Ulangi kuis ↻</button><button class="btn btn-secondary" data-view="progress">Lihat progres</button></div>
      <button class="text-link" data-view="home">Kembali ke beranda</button>
    </section>
  `);
}

function renderProgress() {
  const attempts = [...progress.attempts].reverse();
  const best = progress.bestScore === null ? "—" : `${progress.bestScore}/100`;
  const viewedCount = progress.viewedWords.length;
  shell(`
    <section class="page-intro">
      <span class="eyebrow">CATATAN PETUALANGANMU</span>
      <h1>Lihat <span>progres belajar!</span></h1>
      <p>Setiap langkah kecil adalah kemajuan. Terus semangat belajar, ya!</p>
    </section>
    <section class="progress-summary">
      <article class="progress-tile"><span class="tile-icon peach">📖</span><strong>${progress.storyRead ? "1/1" : "0/1"}</strong><small>Cerita selesai</small></article>
      <article class="progress-tile"><span class="tile-icon lilac">🔤</span><strong>${viewedCount}/${vocabulary.length}</strong><small>Mufradat dipelajari</small></article>
      <article class="progress-tile"><span class="tile-icon mint">🏆</span><strong>${best}</strong><small>Nilai terbaik</small></article>
      <article class="progress-tile"><span class="tile-icon yellow">✏️</span><strong>${progress.attempts.length}</strong><small>Kuis dikerjakan</small></article>
    </section>
    <section class="history-panel">
      <div class="section-heading"><div><span class="eyebrow">RIWAYAT KUIS</span><h2>Perjalanan nilaimu</h2></div><span class="history-icon">📈</span></div>
      ${attempts.length ? `<div class="history-list">${attempts.map((attempt, index) => `
        <div class="history-row"><span class="history-rank">${attempt.score >= 70 ? "⭐" : "📝"}</span><div class="history-info"><strong>Kuis Dongeng Ceria</strong><small>${new Date(attempt.date).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</small></div><div class="history-score ${attempt.score >= 70 ? "good" : ""}">${attempt.score}<small>/100</small></div></div>
      `).join("")}</div>` : `<div class="empty-state compact"><span>🧩</span><h3>Belum ada riwayat kuis</h3><p>Kerjakan kuis pertamamu dan hasilnya akan muncul di sini.</p><button class="btn btn-primary" data-view="quiz">Mulai kuis</button></div>`}
    </section>
    <section class="progress-bottom">
      <div><span>🌱</span><div><strong>Terus bertumbuh!</strong><p>Progres ini tersimpan di browser pada perangkat yang kamu gunakan.</p></div></div>
      <button class="text-link danger-link" data-action="reset-progress">Atur ulang progres</button>
    </section>
  `);
}

function speakArabic(word) {
  if (!("speechSynthesis" in window)) {
    alert("Fitur suara belum didukung oleh browser ini.");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "ar-SA";
  utterance.rate = 0.78;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function handleAction(action, button) {
  switch (action) {
    case "start-story":
      storyStep = 0;
      navigate("story");
      break;
    case "story-prev":
      storyStep = Math.max(0, storyStep - 1);
      renderStory();
      break;
    case "story-next":
      if (storyStep < story.segments.length - 1) {
        storyStep += 1;
        renderStory();
      } else {
        progress.storyRead = true;
        saveProgress();
        renderStory();
      }
      break;
    case "filter-all":
      activeFilter = "all";
      renderVocabulary();
      break;
    case "filter-learned":
      activeFilter = "learned";
      renderVocabulary();
      break;
    case "speak": {
      const word = vocabulary.find((item) => item.id === Number(button.dataset.word));
      if (word) speakArabic(word.arabic);
      break;
    }
    case "mark-word": {
      const id = Number(button.dataset.word);
      if (!progress.viewedWords.includes(id)) {
        progress.viewedWords.push(id);
        saveProgress();
      }
      renderVocabulary();
      break;
    }
    case "answer":
      if (selectedAnswer === null) {
        selectedAnswer = Number(button.dataset.answer);
        quizAnswers[quizIndex] = selectedAnswer;
        renderQuiz();
      }
      break;
    case "quiz-next":
      if (selectedAnswer === null) return;
      if (quizIndex < questions.length - 1) {
        quizIndex += 1;
        selectedAnswer = null;
        renderQuiz();
      } else {
        finishQuiz();
      }
      break;
    case "retry-quiz":
      resetQuiz();
      currentView = "quiz";
      renderQuiz();
      break;
    case "reset-progress":
      if (confirm("Yakin ingin menghapus semua progres belajar di browser ini?")) {
        progress = { ...defaultProgress, viewedWords: [], attempts: [] };
        saveProgress();
        renderProgress();
      }
      break;
  }
}

function finishQuiz() {
  const correct = quizAnswers.filter((answer, index) => answer === questions[index].answer).length;
  const score = Math.round((correct / questions.length) * 100);
  const attempt = { date: new Date().toISOString(), score, correct, total: questions.length };
  progress.attempts.push(attempt);
  progress.attempts = progress.attempts.slice(-20);
  progress.lastScore = score;
  progress.bestScore = progress.bestScore === null ? score : Math.max(progress.bestScore, score);
  saveProgress();
  quizFinished = true;
  currentView = "result";
  renderResult();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

render();
