document.addEventListener("DOMContentLoaded", () => {
  let userLevel = 0;
  let questionIndex = 0;

  const allScenarios = {
    0: [
      {
        title: 'What is a share?',
        text: 'If a company pie is 10 slices, owning 1 slice means you own...',
        A: 'A) 1/10',
        B: 'B) 1/2',
        C: 'C) 1/100',
        correct: 'A',
        tip: 'Each share is like a slice of a company pie!'
      },
      {
        title: 'Why do people invest?',
        text: 'What’s a smart reason to buy shares?',
        A: 'A) For fun',
        B: 'B) Hoping for growth',
        C: 'C) To get free stuff',
        correct: 'B',
        tip: 'Most people invest expecting long-term gains.'
      }
    ],
    1: [
      {
        title: 'Market Buy Price',
        text: 'Bid: $9.95 | Ask: $10.05 — You place a market buy. You pay...',
        A: '$9.95',
        B: '$10.05',
        C: '$10.00',
        correct: 'B',
        tip: 'Market buys go to the ask price (the seller’s price).'
      },
      {
        title: 'Order Types',
        text: 'You want to buy instantly at the current price. You choose...',
        A: 'A) Limit Order',
        B: 'B) Market Order',
        C: 'C) Stop Order',
        correct: 'B',
        tip: 'Market orders execute right away.'
      }
    ],
    2: [
      {
        title: 'Time Horizon',
        text: 'Which time frame is generally safer for investing?',
        A: 'A) 6 months',
        B: 'B) 5 years',
        C: 'C) Doesn’t matter',
        correct: 'B',
        tip: 'Longer time horizons reduce risk from volatility.'
      },
      {
        title: 'Volatility',
        text: 'What does volatility mean?',
        A: 'A) Prices jump around',
        B: 'B) Guaranteed returns',
        C: 'C) No movement',
        correct: 'A',
        tip: 'Volatility = Ups and downs!'
      }
    ],
    3: [
      {
        title: 'Risk Management',
        text: 'What’s one way to reduce investment risk?',
        A: 'A) Invest in one hot stock',
        B: 'B) Diversify your portfolio',
        C: 'C) Panic sell',
        correct: 'B',
        tip: 'Diversifying spreads out your risk.'
      },
      {
        title: 'Stop Orders',
        text: 'What’s a stop order used for?',
        A: 'A) Lock in profits or prevent losses',
        B: 'B) Buy at market price',
        C: 'C) Avoid paying taxes',
        correct: 'A',
        tip: 'Stops help manage downside risk!'
      }
    ]
  };

  function goTo(id) {
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
  }

  window.setLevel = (level) => {
    userLevel = level;
    questionIndex = 0;
    if (userLevel < 2) {
      goTo("primer");
    } else {
      goTo("scenario");
      setTimeout(() => loadQuestion(), 100);
    }
  };

  window.resetToExperience = () => {
    userLevel = 0;
    questionIndex = 0;
    goTo("experience");
  };

  window.goBack = () => {
    if (userLevel < 2 && questionIndex === 0) {
      goTo("primer");
    } else {
      resetToExperience();
    }
  };

  window.startScenario = () => {
    goTo("scenario");
    loadQuestion();
  };
  function loadQuestion() {
    const scenario = allScenarios[userLevel][questionIndex];
    if (!scenario) return goTo("summary");
  
    const answers = [
      { label: "A", text: scenario.A },
      { label: "B", text: scenario.B },
      { label: "C", text: scenario.C }
    ];
  
    const shuffled = answers.sort(() => 0.5 - Math.random());
  
    // Track correct answer after shuffle
    let correctLabel = "";
    for (const ans of shuffled) {
      if (ans.text === scenario[scenario.correct]) {
        correctLabel = ans.label;
        break;
      }
    }
  
    document.getElementById("scenario-title").innerText = scenario.title;
    document.getElementById("scenario-body").innerText = scenario.text;
  
    // Attach text and handler
    document.getElementById("optA").innerText = shuffled[0].text;
    document.getElementById("optB").innerText = shuffled[1].text;
    document.getElementById("optC").innerText = shuffled[2].text;
  
    document.getElementById("optA").onclick = () => checkAnswer(shuffled[0].label, scenario, correctLabel);
    document.getElementById("optB").onclick = () => checkAnswer(shuffled[1].label, scenario, correctLabel);
    document.getElementById("optC").onclick = () => checkAnswer(shuffled[2].label, scenario, correctLabel);
  
    document.getElementById("feedback").style.display = "none";
    document.getElementById("takeaway").style.display = "none";
    document.getElementById("nextBtn").style.display = "none";
  }

  async function checkAnswer(choice, scenario, correctLabel) {
    const fb = document.getElementById("feedback");
    const tip = document.getElementById("takeaway");
  
    fb.style.display = "block";
    tip.style.display = "block";
    document.getElementById("nextBtn").style.display = "block";
  
    if (choice === correctLabel) {
      fb.textContent = "✅ Nailed it!";
      tip.textContent = scenario.tip;
    } else {
      fb.textContent = "❌ Oops! Not quite.";
  
      const prompt = `Question: ${scenario.text}\nUser chose: ${choice}\nCorrect answer: ${correctLabel}\nExplain why this answer is wrong in a short, encouraging tone.`;
  
      try {
        const response = await fetch("https://finpal-ai.onrender.com/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt })
        });
  
        const data = await response.json();
        const hint = data.choices?.[0]?.message?.content?.trim();
        tip.textContent = hint || scenario.tip;
      } catch (error) {
        console.error("AI fetch failed:", error);
        tip.textContent = scenario.tip;
      }
    }
    fb.style.display = "block";
    tip.style.display = "block";
    document.getElementById("nextBtn").style.display = "block";
  }

  window.nextScenario = () => {
    questionIndex++;
    if (questionIndex < allScenarios[userLevel].length) {
      loadQuestion();
    } else {
      goTo("summary");
    }
  };

  async function getAIHint(question, userChoice, correctChoice) {
  const prompt = `Question: ${question}
User chose: ${userChoice}
Correct answer: ${correctChoice}

Now give a short, friendly response (2–3 lines max) that:
- explains in plain words why the answer was wrong,
- encourages the user without sounding robotic,
- avoids emojis, hashtags, or motivational fluff,
- sounds like a helpful peer, not an app.`;
    const response = await fetch("https://finpal-ai.onrender.com/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "We'll make this clearer in the next version!";
  }
});


