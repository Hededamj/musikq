// MusikQ - Skoven Kalder 2026

const EMOJIS = ['🎸', '🥁', '🎤', '🎹', '🎺', '🎷'];
const CATEGORY_ICONS = {
  "80'er Hits": '💿',
  "90'er Hits": '📼',
  "Klassisk Rock": '🤘',
  "Dansk Musik": '🇩🇰',
  "Film Soundtracks": '🎬',
  "Gæt Sangteksten": '📝',
  "One-Hit Wonders": '⭐',
  "70'er Disco & Funk": '🕺',
  "Hvem Er Bandet?": '🎭',
  "2000'er & Nyere": '📱',
  "Album Covers": '🖼️',
  "Årtier Mix": '🎰'
};

let state = {
  teams: [],
  teamCount: 3,
  currentTeam: 0,
  mode: null,
  currentCategory: null,
  questions: [],
  currentQ: 0,
  scores: {},
  playedCategories: new Set(),
  tournamentCategories: [],
  tournamentIndex: 0,
  answered: false,
  // Chess clock
  chessTime: 60,
  timers: [],
  clockInterval: null,
  clockRunning: false,
  eliminated: new Set(),
  eliminationOrder: [],
  allQuestions: []
};

// ─── Stars ───
function createStars() {
  const container = document.getElementById('stars');
  if (!container) return;
  for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 3 + 1;
    star.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      --dur: ${Math.random() * 3 + 2}s;
      animation-delay: ${Math.random() * 3}s;
    `;
    container.appendChild(star);
  }
}

// ─── Team management ───
function setTeams(count) {
  state.teamCount = count;
  document.querySelectorAll('.team-count-btns .btn-small').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.textContent) === count);
  });
  renderTeamInputs();
}

function renderTeamInputs() {
  const container = document.getElementById('teamInputs');
  container.innerHTML = '';
  for (let i = 0; i < state.teamCount; i++) {
    const row = document.createElement('div');
    row.className = 'team-row';
    row.innerHTML = `
      <span class="team-emoji">${EMOJIS[i]}</span>
      <input type="text" class="team-input" placeholder="Hold ${i + 1}" value="Hold ${i + 1}" data-team="${i}">
    `;
    container.appendChild(row);
  }
}

function getTeams() {
  const inputs = document.querySelectorAll('.team-input');
  state.teams = [];
  inputs.forEach((input, i) => {
    state.teams.push({
      name: input.value || `Hold ${i + 1}`,
      emoji: EMOJIS[i],
      score: 0
    });
  });
  state.scores = {};
  state.teams.forEach(t => state.scores[t.name] = 0);
}

// ─── Screen management ───
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);

  // Update navbar
  const quitBtn = document.getElementById('navQuit');
  const isInQuiz = (id === 'quizScreen' || id === 'jeopardyScreen');
  quitBtn.classList.toggle('hidden', !isInQuiz);

  const navTitle = document.getElementById('navTitle');
  if (id === 'landing') navTitle.textContent = 'MusikQ';
  else if (id === 'categoryScreen') navTitle.textContent = 'Vælg Kategori';
  else if (id === 'jeopardyScreen') navTitle.textContent = '🟦 Jeopardy';
  else if (id === 'quizScreen') navTitle.textContent = state.mode === 'chess' ? '⏱️ Skakur' : 'Quiz';
  else if (id === 'resultsScreen') navTitle.textContent = 'Resultater';
  else if (id === 'gameOverScreen') navTitle.textContent = 'Game Over';
}

function goToLanding() {
  stopClock();
  document.getElementById('chessSettings').classList.add('hidden');
  document.getElementById('jeopardyOverlay').classList.add('hidden');
  showScreen('landing');
}

function quitToLanding() {
  if (confirm('Er du sikker på du vil afslutte quizzen?')) {
    goToLanding();
  }
}

// ─── Mode selection ───
function selectMode(mode) {
  getTeams();
  state.mode = mode;
  state.currentTeam = 0;

  if (mode === 'category') {
    renderCategoryGrid();
    showScreen('categoryScreen');
  } else if (mode === 'random') {
    startRandomQuiz();
  } else if (mode === 'full') {
    startTournament();
  } else if (mode === 'jeopardy') {
    startJeopardy();
  } else if (mode === 'chess') {
    document.getElementById('chessSettings').classList.remove('hidden');
    document.getElementById('chessSettings').scrollIntoView({ behavior: 'smooth' });
  }
}

// ─── Chess clock settings ───
function setChessTime(seconds) {
  state.chessTime = seconds;
  document.querySelectorAll('.time-btns .btn-small').forEach(btn => {
    const val = parseInt(btn.textContent);
    const secs = btn.textContent.includes('min') ? val * 60 : val;
    btn.classList.toggle('active', secs === seconds);
  });
}

function startChessClock() {
  getTeams();
  state.mode = 'chess';
  state.timers = state.teams.map(() => state.chessTime * 1000); // ms
  state.eliminated = new Set();
  state.eliminationOrder = [];
  state.currentTeam = 0;
  state.currentQ = 0;
  state.teams.forEach(t => t.score = 0);

  // Infinite question pool — shuffle ALL questions
  const allQ = [];
  Object.entries(QUESTIONS).forEach(([cat, qs]) => {
    qs.forEach(q => allQ.push({ ...q, category: cat }));
  });
  state.allQuestions = shuffle(allQ);
  state.questions = state.allQuestions;

  document.getElementById('chessSettings').classList.add('hidden');
  document.getElementById('chessTimer').classList.remove('hidden');
  document.getElementById('btnPass').classList.remove('hidden');

  showScreen('quizScreen');
  renderChessQuestion();
  startClock();
}

// ─── Clock engine ───
function startClock() {
  stopClock();
  state.clockRunning = true;
  let lastTick = performance.now();

  state.clockInterval = setInterval(() => {
    const now = performance.now();
    const delta = now - lastTick;
    lastTick = now;

    if (!state.clockRunning) return;

    const ti = state.currentTeam;
    state.timers[ti] -= delta;

    if (state.timers[ti] <= 0) {
      state.timers[ti] = 0;
      eliminateTeam(ti);
      return;
    }

    updateTimerDisplay();
  }, 50);
}

function stopClock() {
  state.clockRunning = false;
  if (state.clockInterval) {
    clearInterval(state.clockInterval);
    state.clockInterval = null;
  }
}

function pauseClock() {
  state.clockRunning = false;
}

function resumeClock() {
  state.clockRunning = true;
}

function updateTimerDisplay() {
  const ms = state.timers[state.currentTeam];
  const secs = ms / 1000;
  const display = document.getElementById('timerDisplay');
  display.textContent = secs.toFixed(1);

  display.classList.remove('warning', 'danger');
  if (secs <= 5) {
    display.classList.add('danger');
  } else if (secs <= 15) {
    display.classList.add('warning');
  }

  renderChessScoreboard();
}

function eliminateTeam(teamIndex) {
  state.eliminated.add(teamIndex);
  state.eliminationOrder.push(teamIndex);

  // How many alive?
  const alive = state.teams.filter((_, i) => !state.eliminated.has(i));

  if (alive.length <= 1) {
    // Game over!
    stopClock();
    showChessGameOver();
    return;
  }

  // Move to next alive team
  advanceToNextAliveTeam();
  renderChessQuestion();
}

function advanceToNextAliveTeam() {
  let next = (state.currentTeam + 1) % state.teams.length;
  let safety = 0;
  while (state.eliminated.has(next) && safety < state.teams.length) {
    next = (next + 1) % state.teams.length;
    safety++;
  }
  state.currentTeam = next;
}

// ─── Chess clock question rendering ───
function renderChessQuestion() {
  // Recycle questions if we run out
  if (state.currentQ >= state.questions.length) {
    state.questions = shuffle([...state.allQuestions]);
    state.currentQ = 0;
  }

  state.answered = false;
  const q = state.questions[state.currentQ];

  document.getElementById('quizCategory').textContent =
    `⏱️ Skakur — ${CATEGORY_ICONS[q.category] || '🎵'} ${q.category}`;
  document.getElementById('quizProgress').textContent = '';
  document.getElementById('questionNumber').textContent =
    `Spørgsmål`;
  document.getElementById('questionText').textContent = q.q;

  const letters = ['A', 'B', 'C', 'D'];
  const shuffledOptions = shuffle(q.options);
  const optionsHtml = shuffledOptions.map((opt, i) => `
    <button class="option-btn" data-answer="${opt}" onclick="selectOption(this)">
      <span class="option-letter">${letters[i]}</span>
      <span>${opt}</span>
    </button>
  `).join('');
  document.getElementById('options').innerHTML = optionsHtml;

  // Controls — hide manual buttons, show pass
  document.getElementById('btnReveal').classList.add('hidden');
  document.getElementById('answerButtons').classList.add('hidden');
  document.getElementById('btnPass').classList.remove('hidden');

  // Current team
  const team = state.teams[state.currentTeam];
  document.getElementById('currentTeam').innerHTML =
    `${team.emoji} ${team.name}'s tur`;

  updateTimerDisplay();

  // Animate
  const card = document.getElementById('questionCard');
  card.style.animation = 'none';
  card.offsetHeight;
  card.style.animation = 'fadeInUp 0.4s ease';
}

function renderChessScoreboard() {
  const sb = document.getElementById('scoreboard');
  sb.innerHTML = state.teams.map((t, i) => {
    const ms = state.timers[i];
    const secs = (ms / 1000).toFixed(1);
    const isElim = state.eliminated.has(i);
    const isActive = i === state.currentTeam;
    let cls = 'score-chip';
    if (isActive && !isElim) cls += ' active-team';
    if (isElim) cls += ' eliminated';
    return `
      <div class="${cls}">
        <span>${t.emoji}</span>
        <span class="score-name">${t.name}</span>
        <span class="score-time">${isElim ? '💀' : secs + 's'}</span>
        <span class="score-points">${t.score}</span>
      </div>
    `;
  }).join('');
}

function passQuestion() {
  if (state.mode !== 'chess') return;
  // Pas = wrong answer, time keeps running, get NEW question
  state.currentQ++;
  renderChessQuestion();
}

// Override scoreAnswer for chess mode
const _originalScoreAnswer = scoreAnswer;

function scoreAnswer(correct) {
  if (state.mode === 'chess') {
    chessScoreAnswer(correct);
    return;
  }
  // Normal mode
  if (correct) {
    state.teams[state.currentTeam].score++;
  }
  state.currentTeam = (state.currentTeam + 1) % state.teams.length;
  state.currentQ++;
  renderQuestion();
}

function chessScoreAnswer(correct) {
  if (correct) {
    // Correct! Score a point, turn passes to next team
    state.teams[state.currentTeam].score++;
    advanceToNextAliveTeam();
    state.currentQ++;
    renderChessQuestion();
  } else {
    // Wrong! Time keeps running, get a new question (same team)
    state.currentQ++;
    renderChessQuestion();
  }
}

// Override revealAnswer for chess mode
function revealAnswer() {
  if (state.answered) return;
  state.answered = true;

  const q = state.questions[state.currentQ];
  const correctAnswer = Array.isArray(q.a) ? q.a[0] : q.a;

  document.querySelectorAll('.option-btn').forEach(btn => {
    const val = btn.dataset.answer;
    if (val === correctAnswer) {
      btn.classList.add('correct');
    } else {
      btn.classList.add('wrong');
    }
  });

  document.getElementById('btnReveal').classList.add('hidden');
  document.getElementById('answerButtons').classList.remove('hidden');
  if (state.mode === 'chess') {
    document.getElementById('btnPass').classList.add('hidden');
  }
}

// ─── Chess Game Over ───
function showChessGameOver() {
  showScreen('gameOverScreen');

  // Clean up chess UI
  document.getElementById('chessTimer').classList.add('hidden');
  document.getElementById('btnPass').classList.add('hidden');

  const loserIndex = state.eliminationOrder[state.eliminationOrder.length - 1];
  const loser = state.teams[loserIndex];

  // If only 1 team not eliminated, they're the winner
  const winner = state.teams.find((_, i) => !state.eliminated.has(i));

  document.getElementById('gameoverTitle').textContent = '⏱️ TIDEN ER UDLØBET!';

  document.getElementById('gameoverLoser').innerHTML = `
    <span class="loser-emoji">💀</span>
    <span class="loser-name">${loser.emoji} ${loser.name}</span>
    <div style="color: var(--text-dim); margin-top: 8px;">ramte 0 sekunder!</div>
  `;

  if (winner) {
    document.getElementById('gameoverSurvivors').innerHTML = `
      <div style="font-size: 3rem; margin-bottom: 10px;">🏆</div>
      <div style="font-size: 1.8rem; font-weight: 900; color: var(--green);">${winner.emoji} ${winner.name} VINDER!</div>
      <div style="color: var(--text-dim); margin-top: 5px;">${(state.timers[state.teams.indexOf(winner)] / 1000).toFixed(1)}s tilbage</div>
    `;
  }

  // Final standings — sorted by time remaining (most time = best)
  const standings = state.teams
    .map((t, i) => ({ ...t, index: i, timeLeft: state.timers[i], eliminated: state.eliminated.has(i) }))
    .sort((a, b) => b.timeLeft - a.timeLeft);

  const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣'];

  document.getElementById('chessFinalStandings').innerHTML = `
    <h2 style="margin-bottom: 15px; color: var(--cyan);">Slutstilling</h2>
    ${standings.map((t, i) => `
      <div class="chess-standing-row">
        <span class="standing-rank">${medals[i] || '#' + (i+1)}</span>
        <span class="standing-name">${t.emoji} ${t.name}</span>
        <span class="standing-time ${t.timeLeft > 0 ? 'time-alive' : 'time-dead'}">
          ${t.timeLeft > 0 ? (t.timeLeft / 1000).toFixed(1) + 's' : '💀 0.0s'}
        </span>
        <span style="color: var(--green); font-weight: 900; margin-left: 15px;">${t.score} point</span>
      </div>
    `).join('')}
  `;
}

// ─── Category grid ───
function renderCategoryGrid() {
  const grid = document.getElementById('categoryGrid');
  grid.innerHTML = '';
  Object.keys(QUESTIONS).forEach(cat => {
    const card = document.createElement('div');
    card.className = 'category-card' + (state.playedCategories.has(cat) ? ' played' : '');
    card.innerHTML = `
      <div class="cat-icon">${CATEGORY_ICONS[cat] || '🎵'}</div>
      <h3>${cat}</h3>
      <div class="cat-count">${QUESTIONS[cat].length} spørgsmål</div>
    `;
    card.onclick = () => startCategoryQuiz(cat);
    grid.appendChild(card);
  });
}

// ─── Shuffle ───
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Start normal quizzes ───
function startCategoryQuiz(category) {
  state.currentCategory = category;
  state.questions = shuffle(QUESTIONS[category]).slice(0, 15);
  state.currentQ = 0;
  state.currentTeam = 0;
  state.teams.forEach(t => t.score = 0);
  document.getElementById('chessTimer').classList.add('hidden');
  document.getElementById('btnPass').classList.add('hidden');
  showScreen('quizScreen');
  renderQuestion();
}

function startRandomQuiz() {
  state.currentCategory = 'Random Mix 🎲';
  const allQ = [];
  Object.entries(QUESTIONS).forEach(([cat, qs]) => {
    qs.forEach(q => allQ.push({ ...q, category: cat }));
  });
  state.questions = shuffle(allQ).slice(0, 30);
  state.currentQ = 0;
  state.currentTeam = 0;
  state.teams.forEach(t => t.score = 0);
  document.getElementById('chessTimer').classList.add('hidden');
  document.getElementById('btnPass').classList.add('hidden');
  showScreen('quizScreen');
  renderQuestion();
}

function startTournament() {
  state.tournamentCategories = shuffle(Object.keys(QUESTIONS));
  state.tournamentIndex = 0;
  state.teams.forEach(t => t.score = 0);
  document.getElementById('chessTimer').classList.add('hidden');
  document.getElementById('btnPass').classList.add('hidden');
  nextTournamentCategory();
}

function nextTournamentCategory() {
  if (state.tournamentIndex >= state.tournamentCategories.length) {
    showResults();
    return;
  }
  const cat = state.tournamentCategories[state.tournamentIndex];
  state.currentCategory = cat;
  state.questions = shuffle(QUESTIONS[cat]).slice(0, 10);
  state.currentQ = 0;
  showScreen('quizScreen');
  renderQuestion();
}

// ─── Render normal question ───
function renderQuestion() {
  if (state.currentQ >= state.questions.length) {
    if (state.mode === 'full') {
      state.tournamentIndex++;
      nextTournamentCategory();
    } else {
      if (state.mode === 'category') {
        state.playedCategories.add(state.currentCategory);
      }
      showResults();
    }
    return;
  }

  state.answered = false;
  const q = state.questions[state.currentQ];

  document.getElementById('quizCategory').textContent =
    (q.category ? `${CATEGORY_ICONS[q.category] || '🎵'} ${q.category}` : `${CATEGORY_ICONS[state.currentCategory] || '🎵'} ${state.currentCategory}`);
  document.getElementById('quizProgress').textContent =
    `${state.currentQ + 1} / ${state.questions.length}`;
  document.getElementById('questionNumber').textContent =
    `Spørgsmål ${state.currentQ + 1}`;
  document.getElementById('questionText').textContent = q.q;

  const letters = ['A', 'B', 'C', 'D'];
  const shuffledOptions = shuffle(q.options);
  const optionsHtml = shuffledOptions.map((opt, i) => `
    <button class="option-btn" data-answer="${opt}" onclick="selectOption(this)">
      <span class="option-letter">${letters[i]}</span>
      <span>${opt}</span>
    </button>
  `).join('');
  document.getElementById('options').innerHTML = optionsHtml;

  document.getElementById('btnReveal').classList.add('hidden');
  document.getElementById('answerButtons').classList.add('hidden');

  const team = state.teams[state.currentTeam];
  document.getElementById('currentTeam').innerHTML =
    `${team.emoji} ${team.name}'s tur`;

  renderScoreboard();

  const card = document.getElementById('questionCard');
  card.style.animation = 'none';
  card.offsetHeight;
  card.style.animation = 'fadeInUp 0.4s ease';
}

function selectOption(btn) {
  if (state.answered) return;
  state.answered = true;

  const q = state.questions[state.currentQ];
  const correctAnswer = Array.isArray(q.a) ? q.a[0] : q.a;
  const picked = btn.dataset.answer;
  const isCorrect = picked === correctAnswer;

  // Highlight all options
  document.querySelectorAll('.option-btn').forEach(b => {
    if (b.dataset.answer === correctAnswer) {
      b.classList.add('correct');
    } else {
      b.classList.add('wrong');
    }
  });

  // Score
  if (isCorrect) {
    state.teams[state.currentTeam].score++;
  }

  // Hide manual buttons
  document.getElementById('btnReveal').classList.add('hidden');
  document.getElementById('answerButtons').classList.add('hidden');
  if (state.mode === 'chess') {
    document.getElementById('btnPass').classList.add('hidden');
  }

  // Auto-advance after short delay
  const delay = state.mode === 'chess' ? 1200 : 1500;
  setTimeout(() => {
    if (state.mode === 'chess') {
      if (isCorrect) {
        advanceToNextAliveTeam();
      }
      // Wrong = same team keeps going (timer running)
      state.currentQ++;
      renderChessQuestion();
    } else {
      state.currentTeam = (state.currentTeam + 1) % state.teams.length;
      state.currentQ++;
      renderQuestion();
    }
  }, delay);
}

function renderScoreboard() {
  const sb = document.getElementById('scoreboard');
  sb.innerHTML = state.teams.map((t, i) => `
    <div class="score-chip ${i === state.currentTeam ? 'active-team' : ''}">
      <span>${t.emoji}</span>
      <span class="score-name">${t.name}</span>
      <span class="score-points">${t.score}</span>
    </div>
  `).join('');
}

// ─── Results (normal modes) ───
function showResults() {
  showScreen('resultsScreen');

  document.getElementById('resultsCategory').textContent =
    state.mode === 'full' ? 'Fuld Turnering' : state.currentCategory;

  const sorted = [...state.teams].sort((a, b) => b.score - a.score);
  const medals = ['🥇', '🥈', '🥉'];
  const maxScore = sorted[0]?.score || 1;

  const podium = document.getElementById('podium');
  const podiumOrder = sorted.length >= 3 ? [sorted[1], sorted[0], sorted[2]] : sorted;

  podium.innerHTML = podiumOrder.map((team, i) => {
    const realIndex = sorted.indexOf(team);
    const h = maxScore > 0 ? (team.score / maxScore) * 180 : 20;
    return `
      <div class="podium-place" style="animation-delay: ${i * 0.2}s">
        <div class="place-medal">${medals[realIndex] || '🎵'}</div>
        <div class="place-name">${team.emoji} ${team.name}</div>
        <div class="place-score">${team.score} point</div>
        <div class="podium-bar" style="height: ${Math.max(h, 20)}px"></div>
      </div>
    `;
  }).join('');

  const details = document.getElementById('resultsDetails');
  details.innerHTML = sorted.map((t, i) => `
    <div class="result-row">
      <span class="rank">#${i + 1}</span>
      <span class="name">${t.emoji} ${t.name}</span>
      <span class="points">${t.score} point</span>
    </div>
  `).join('');
}

function playAgain() {
  if (state.mode === 'category') {
    renderCategoryGrid();
    showScreen('categoryScreen');
  } else {
    selectMode(state.mode);
  }
}

// ─── Jeopardy ───
let jeopardyState = {
  board: [],         // 6 selected categories
  used: new Set(),   // "col-row" keys of used cells
  currentQ: null,
  answered: false
};

function startJeopardy() {
  getTeams();
  state.mode = 'jeopardy';
  state.currentTeam = 0;
  state.teams.forEach(t => t.score = 0);

  // Pick 6 random categories
  const shuffled = shuffle([...JEOPARDY_CATEGORIES]);
  jeopardyState.board = shuffled.slice(0, 6);
  jeopardyState.used = new Set();

  showScreen('jeopardyScreen');
  renderJeopardyBoard();
}

function renderJeopardyBoard() {
  const board = document.getElementById('jeopardyBoard');
  const cols = jeopardyState.board.length;
  board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  let html = '';
  // Header row
  jeopardyState.board.forEach(cat => {
    html += `<div class="jp-header-cell">
      <span class="jp-cat-icon">${cat.icon}</span>
      <span>${cat.name}</span>
    </div>`;
  });

  // Point rows: 100, 200, 300, 400, 500
  [100, 200, 300, 400, 500].forEach((pts, row) => {
    jeopardyState.board.forEach((cat, col) => {
      const key = `${col}-${row}`;
      const used = jeopardyState.used.has(key);
      html += `<div class="jp-cell ${used ? 'used' : ''}"
        ${used ? '' : `onclick="pickJeopardyCell(${col}, ${row})"`}>
        ${used ? '' : pts}
      </div>`;
    });
  });

  board.innerHTML = html;

  // Scoreboard
  const sb = document.getElementById('jeopardyScoreboard');
  sb.innerHTML = state.teams.map((t, i) => `
    <div class="score-chip ${i === state.currentTeam ? 'active-team' : ''}">
      <span>${t.emoji}</span>
      <span class="score-name">${t.name}</span>
      <span class="score-points">${t.score}</span>
    </div>
  `).join('');

  // Turn indicator
  const team = state.teams[state.currentTeam];
  document.getElementById('jeopardyTurn').innerHTML =
    `${team.emoji} ${team.name} vælger`;

  // Check if board is complete
  if (jeopardyState.used.size >= jeopardyState.board.length * 5) {
    showResults();
  }
}

function pickJeopardyCell(col, row) {
  const key = `${col}-${row}`;
  if (jeopardyState.used.has(key)) return;

  jeopardyState.used.add(key);
  jeopardyState.answered = false;

  const cat = jeopardyState.board[col];
  const q = cat.questions[row]; // row 0=100, 1=200, etc.

  jeopardyState.currentQ = { ...q, catName: cat.name, catIcon: cat.icon };

  // Show overlay
  const overlay = document.getElementById('jeopardyOverlay');
  overlay.classList.remove('hidden');

  document.getElementById('jpPoints').textContent = q.points;
  document.getElementById('jpCategory').textContent = `${cat.icon} ${cat.name}`;
  document.getElementById('jpQuestion').textContent = q.q;
  document.getElementById('jpPass').classList.remove('hidden');

  const letters = ['A', 'B', 'C', 'D'];
  const shuffledOpts = shuffle(q.options);
  document.getElementById('jpOptions').innerHTML = shuffledOpts.map((opt, i) => `
    <button class="jp-option" data-answer="${opt}" onclick="pickJeopardyAnswer(this)">
      <span class="jp-letter">${letters[i]}</span>
      <span>${opt}</span>
    </button>
  `).join('');
}

function pickJeopardyAnswer(btn) {
  if (jeopardyState.answered) return;
  jeopardyState.answered = true;

  const q = jeopardyState.currentQ;
  const correctAnswer = Array.isArray(q.a) ? q.a[0] : q.a;
  const picked = btn.dataset.answer;
  const isCorrect = picked === correctAnswer;

  // Highlight
  document.querySelectorAll('.jp-option').forEach(b => {
    if (b.dataset.answer === correctAnswer) {
      b.classList.add('correct');
    } else {
      b.classList.add('wrong');
    }
  });
  document.getElementById('jpPass').classList.add('hidden');

  // Score
  if (isCorrect) {
    state.teams[state.currentTeam].score += q.points;
  }

  // Correct = same team picks again, wrong = next team's turn
  setTimeout(() => {
    if (!isCorrect) {
      state.currentTeam = (state.currentTeam + 1) % state.teams.length;
    }
    document.getElementById('jeopardyOverlay').classList.add('hidden');
    renderJeopardyBoard();
  }, 1500);
}

function jeopardyPass() {
  if (jeopardyState.answered) return;
  jeopardyState.answered = true;

  // Show correct answer
  const q = jeopardyState.currentQ;
  const correctAnswer = Array.isArray(q.a) ? q.a[0] : q.a;
  document.querySelectorAll('.jp-option').forEach(b => {
    if (b.dataset.answer === correctAnswer) {
      b.classList.add('correct');
    } else {
      b.classList.add('wrong');
    }
  });
  document.getElementById('jpPass').classList.add('hidden');

  // Pas = wrong, next team's turn
  setTimeout(() => {
    state.currentTeam = (state.currentTeam + 1) % state.teams.length;
    document.getElementById('jeopardyOverlay').classList.add('hidden');
    renderJeopardyBoard();
  }, 1500);
}

function closeJeopardyIfOutside(event) {
  // Only close if clicking the overlay background, not the popup
  if (event.target === document.getElementById('jeopardyOverlay') && jeopardyState.answered) {
    document.getElementById('jeopardyOverlay').classList.add('hidden');
  }
}

// ─── Init ───
createStars();
renderTeamInputs();
