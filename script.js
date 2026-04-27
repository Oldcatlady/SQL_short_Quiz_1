let questions = [];
let current = 0;
let correct = 0;
let wrong = 0;
let answered = false;

fetch("questions.json")
  .then(res => res.json())
  .then(data => {
    questions = data;
    loadQuestion();
  });

function loadQuestion() {
  let q = questions[current];

  answered = false;

  document.getElementById("question").innerText = q.question;
  document.getElementById("feedback").innerHTML = "";
  document.getElementById("textAnswer").value = "";

  document.getElementById("nextBtn").style.display = "none";

  let answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  // MC
  if (q.type === "mc") {
    q.options.forEach(opt => {
      let btn = document.createElement("button");
      btn.innerText = opt;
      btn.className = "answer-btn";

      btn.onclick = () => checkAnswer(opt);

      answersDiv.appendChild(btn);
    });

    document.getElementById("textAnswer").style.display = "none";
  }

  // TEXT
  else if (q.type === "text") {
    document.getElementById("textAnswer").style.display = "block";

    document.getElementById("textAnswer").onkeydown = (e) => {
      if (e.key === "Enter") {
        checkAnswer(document.getElementById("textAnswer").value);
      }
    };
  }

  // COPY
  else if (q.type === "copy") {
    q.options.forEach(opt => {
      let btn = document.createElement("button");
      btn.innerText = opt;
      btn.className = "answer-btn";

      btn.onclick = () => {
        document.getElementById("textAnswer").value = opt;
        checkAnswer(opt);
      };

      answersDiv.appendChild(btn);
    });

    document.getElementById("textAnswer").style.display = "block";
  }

  updateProgress();
}

function checkAnswer(value) {
  if (answered) return;

  answered = true;

  let q = questions[current];
  let feedback = document.getElementById("feedback");

  // Buttons deaktivieren
  document.querySelectorAll(".answer-btn").forEach(btn => {
    btn.disabled = true;
    btn.style.opacity = "0.6";
  });

  let userAnswer = value;

  if (
    userAnswer &&
    userAnswer.trim().toLowerCase() === q.answer.trim().toLowerCase()
  ) {
    correct++;
    feedback.className = "correct";
    feedback.innerHTML = `
      <b>Richtig!</b><br>
      ${q.explanation}
      <br><br>
      <b>Antwort:</b> ${q.answer}
    `;
  } else {
    wrong++;
    feedback.className = "wrong";
    feedback.innerHTML = `
      <b>Falsch!</b><br>
      Richtige Antwort:<br>
      <b>${q.answer}</b>
      <br><br>
      ${q.explanation}
    `;
  }

  document.getElementById("nextBtn").style.display = "block";

  updateProgress();
}

function nextQuestion() {
  current++;

  if (current < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function updateProgress() {
  document.getElementById("progressText").innerText =
    `Frage ${current + 1} / ${questions.length}`;

  document.getElementById("scoreText").innerText =
    `✔ ${correct} | ✖ ${wrong}`;

  document.getElementById("percentText").innerText =
    `(${Math.round((correct / questions.length) * 100)}%)`;

  document.getElementById("progressFill").style.width =
    ((current + 1) / questions.length) * 100 + "%";
}

function showResult() {
  let percent = (correct / questions.length) * 100;
  let grade = getGrade(percent);

  document.querySelector(".card").innerHTML = `
    <h2>Ergebnis</h2>
    <p>Punkte: ${percent.toFixed(1)}%</p>
    <p>Note (IHK): ${grade}</p>
    <p>✔ ${correct} richtige | ✖ ${wrong} falsche</p>
  `;
}

function getGrade(p) {
  if (p >= 90) return 1;
  if (p >= 80) return 2;
  if (p >= 70) return 3;
  if (p >= 60) return 4;
  if (p >= 50) return 5;
  return 6;
}