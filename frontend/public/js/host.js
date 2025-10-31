/* =========================================================
   SOCKET INITIALIZATION & CONNECTION
   ========================================================= */
const socket = io();

/* =========================================================
   DOM ELEMENTS
   ========================================================= */
const selectGameContent = document.querySelector(".dashboard-container");
const createGameContent = document.querySelector(".create-game-container");
const gamesContainer = document.querySelector(".game-list");
const selectedGameText = document.querySelector(".selected-game-set-text");
const hostGameBtn = document.querySelector(".host-game-button");
const createNewGameSetBtn = document.querySelector(".create-new-gameset");
const backToStartPageBtn = document.querySelector(".back-start-button");
const questionSettingInputs = document.querySelectorAll(".question-settings-container input");
const answerInputs = document.querySelectorAll(".answer-container .answer_input");
const addQuestionBtn = document.querySelector(".create-question-button");
const correctCheckboxBtns = document.querySelectorAll(".answers-container .checkbox");
const questionsList = document.querySelector(".questions-container .questions-list");
const questionsContainer = document.querySelector(".questions-container");
const createGameTemplateBtn = document.querySelector(".create-game-template-button");
const backToHostBtn = document.querySelector(".back-dashboard-button");

/* =========================================================
   LOCAL STORAGE VARIABLES
   ========================================================= */
let lastView = localStorage.getItem("lastView");
let currentSelectedGame = 0;
let questionIndexCounter = 0;

let localQuestionsArr = []

/* =========================================================
   SOCKET CONNECTION HANDLING
   ========================================================= */
socket.on("connect", () => {
  console.log("Connected with Socket:", socket.id);

  // Restore last view
  switch (lastView) {
    case "create-new-game":
      createGameContent.style.display = "flex";
      selectGameContent.style.display = "none";

      const storedQuestionArr = JSON.parse(localStorage.getItem("question-array")) || []
      console.log(`question arr that got loaded: ${storedQuestionArr}`)
      

      storedQuestionArr.forEach(element => {
        questionsList.appendChild(element.question)
      });

      break;
    case null:
      createGameContent.style.display = "none";
      selectGameContent.style.display = "flex";
      break;
  }

  // Register or request client ID
  if (!localStorage.getItem("clientID")) {
    socket.emit("requestClientID");
  } else {
    const clientID = localStorage.getItem("clientID");
    socket.emit("registerClient", { clientID });
  }

  // Request game data
  socket.emit("requestGamesData");
  console.log("Requested Game Data from Server");
});

/* =========================================================
   SOCKET EVENTS
   ========================================================= */

// Server assigns new client ID
socket.on("assignClientID", (data) => {
  console.log("Server assigned you a new ID:", data.clientID);
  localStorage.setItem("clientID", data.clientID);
});

// Receive all game data
socket.on("sendGameData", (data) => {
  const games = data.gamesData;

  for (let i = 0; i < games.length; i++) {
    const selectBtn = document.createElement("button");
    selectBtn.className = "gamesbutton";
    selectBtn.innerText = games[i].gameName;

    selectBtn.addEventListener("click", () => {
      currentSelectedGame = i;
      console.log("Selected Game Button:", i);
      selectedGameText.textContent = games[i].gameName;
    });

    gamesContainer.appendChild(selectBtn);
  }
});

/* =========================================================
   HOST GAME LOGIC
   ========================================================= */
hostGameBtn.addEventListener("click", () => {
  if (selectedGameText.textContent) {
    socket.emit("startGame", { gameSetIndex: currentSelectedGame });
  }
});

/* =========================================================
   DASHBOARD VIEW TOGGLING
   ========================================================= */
createNewGameSetBtn.addEventListener("click", () => {
  lastView = "create-new-game";
  localStorage.setItem("lastView", lastView);

  createGameContent.style.display = "flex";
  selectGameContent.style.display = "none";
});

backToStartPageBtn.addEventListener("click", () => {
  lastView = null;
  localStorage.setItem("lastView", lastView);

  console.log("Back Start");
  window.location.href = "./index.html";
});

/* =========================================================
   CREATE NEW GAME LOGIC
   ========================================================= */
addQuestionBtn.addEventListener("click", () => {
  let allValid = true;
  const answersArr = [];

  // Validate question settings inputs
  questionSettingInputs.forEach((element) => {
    if (element.value === "") {
      element.style.border = "solid 1px red";
      allValid = false;
    } else {
      element.style.border = "1px solid #ccc";
    }
  });

  // Validate answers and push to array
  answerInputs.forEach((element, index) => {
    if (element.required && element.value === "") {
      element.style.border = "solid 1px red";
      allValid = false;
    } else {
      element.style.border = "1px solid #ccc";
      if (element.value !== "") {
        answersArr.push({
          id: index,
          text: element.value,
          correct: correctCheckboxBtns[index].checked,
        });
      }
    }
  });

  // If valid, save question & reset inputs
  if (allValid) {
    const questionData = {
      question: questionSettingInputs[0].value,
      timeLimit: questionSettingInputs[1].value,
      points: questionSettingInputs[2].value,
      answers: answersArr,
    };

    let tmpQuestionArr = []
    tmpQuestionArr = JSON.parse(localStorage.getItem("questions-array")) || []
    
    tmpQuestionArr.push(questionData)

    localStorage.setItem("questions-array", JSON.stringify(tmpQuestionArr))

    // Add question to visual list
    const questionBox = document.createElement("div");
    questionBox.className = "qu";
    questionBox.id = questionIndexCounter++;
    questionBox.textContent = questionSettingInputs[0].value;

    questionsList.appendChild(questionBox);
    resetAll();
  }
});

/* =========================================================
   CREATE GAME TEMPLATE
   ========================================================= */
createGameTemplateBtn.addEventListener("click", () => {
  
  if (questionsList.children.length <= 0) {
    questionsContainer.style.border = "solid 1px red";
  } else {

    socket.emit("createNewGameSet", { newGameData: questionsList})
    questionsContainer.style.border = "1px solid #ccc";
  }
});

/* =========================================================
   BACK TO DASHBOARD
   ========================================================= */
backToHostBtn.addEventListener("click", () => {
  lastView = null;
  localStorage.setItem("lastView", lastView);

  createGameContent.style.display = "none";
  selectGameContent.style.display = "flex";
});

/* =========================================================
   HELPER FUNCTIONS
   ========================================================= */
function resetAll() {
  const allInputs = document.querySelectorAll(".right-side-container input");

  allInputs.forEach((element) => {
    element.value = "";
  });

  correctCheckboxBtns.forEach((element) => {
    element.checked = false;
  });
}
