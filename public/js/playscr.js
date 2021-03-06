const answerMap = new Map();
const nextBtn = document.querySelector("#nextBtn");
let progressPercent = 0;

loadNavigator_v2(no_of_ques);
loadQuesArea_v2();
btnGroupAction();
abhisek_feature();
nextBtnMechanism();

function loadNavigator_v2(n = 1) {
  const qsNav = document.querySelector("#quesNavigator_v2");
  for (let i = 0; i < n; i++) {
    let html = `
        <button type="button" 
        name="btnradio" id="btnradio${i + 1}" value="${i}" 
        class="btn btn-light wow fadeInUp navigator_item" data-wow-delay="${
          (i + 1) * 100
        }ms"
        onclick="loadQuesArea_v2(${i});"
        >
        ${i + 1}
    </button>`;
    qsNav.insertAdjacentHTML("beforeend", html);
  }
}

function loadQuesArea_v2(index = 0) {
  const qArea = document.querySelector(".ques-container");
  qArea.id = index;
  const radios = document.querySelector("#quesNavigator_v2").children;

  for (let radio of radios) {
    if (radio.value == index) radio.classList.add("selected-question");
    else radio.classList.remove("selected-question");
  }

  qArea.querySelector("#quesStr").innerText = quesList[index].question;

  qArea.querySelector("#option_a").innerText = quesList[index].option_a;
  qArea.querySelector("#option_b").innerText = quesList[index].option_b;
  qArea.querySelector("#option_c").innerText = quesList[index].option_c;
  qArea.querySelector("#option_d").innerText = quesList[index].option_d;

  const mychoice = answerMap.get(index.toString());

  if (mychoice != null) qArea.querySelector(`#${mychoice}`).click();
  else {
    qArea
      .querySelectorAll("#options button")
      .forEach((elem) => elem.classList.remove("btn-primary"));
  }
}

function btnGroupAction() {
  const qArea = document.querySelector(".ques-container");

  const buttonA = qArea.querySelector("#option_a");
  const buttonB = qArea.querySelector("#option_b");
  const buttonC = qArea.querySelector("#option_c");
  const buttonD = qArea.querySelector("#option_d");

  buttonA.addEventListener("click", function (e) {
    buttonA.classList.add("btn-primary");

    buttonB.classList.remove("btn-primary");
    buttonC.classList.remove("btn-primary");
    buttonD.classList.remove("btn-primary");

    const index = document.querySelector(".ques-container").id;
    answerMap.set(index, "option_a");
  });

  buttonB.addEventListener("click", function (e) {
    buttonB.classList.add("btn-primary");

    buttonA.classList.remove("btn-primary");
    buttonC.classList.remove("btn-primary");
    buttonD.classList.remove("btn-primary");

    const index = document.querySelector(".ques-container").id;
    answerMap.set(index, "option_b");
  });

  buttonC.addEventListener("click", function (e) {
    buttonC.classList.add("btn-primary");

    buttonB.classList.remove("btn-primary");
    buttonA.classList.remove("btn-primary");
    buttonD.classList.remove("btn-primary");

    const index = document.querySelector(".ques-container").id;
    answerMap.set(index, "option_c");
  });

  buttonD.addEventListener("click", function (e) {
    buttonD.classList.add("btn-primary");

    buttonB.classList.remove("btn-primary");
    buttonC.classList.remove("btn-primary");
    buttonA.classList.remove("btn-primary");

    const index = document.querySelector(".ques-container").id;
    answerMap.set(index, "option_d");
  });
}

function abhisek_feature() {
  const qArea = document.querySelector(".ques-container");
  qArea.addEventListener("wheel", (event) => {
    let index = qArea.id;

    if (event.deltaY > 5) {
      let newIndex = (parseInt(index) + 1) % no_of_ques;
      loadQuesArea_v2(newIndex);
    } else if (event.deltaY < -5) {
      let newIndex = parseInt(index) - 1;
      if (newIndex < 0) newIndex += no_of_ques;
      loadQuesArea_v2(newIndex);
    }
  });
}

function nextBtnMechanism() {
  nextBtn.addEventListener("click", () => {
    const index = parseInt(nextBtn.parentElement.id);

    if (index < no_of_ques - 1 && progressPercent < 100) {
      const futureNav = (qsNav =
        document.querySelector("#quesNavigator_v2").children[
          (index + 1) % no_of_ques
        ]);
      futureNav.click();
    } else if (progressPercent == 100) {
      submitMyAns();
    }
  });

  const qArea = document.querySelector(".ques-container");
  qArea.addEventListener("click", () => {
    progressPercent = (answerMap.size / no_of_ques) * 100;

    if (progressPercent == 100) {
      $("#nextBtnTxt").text("Submit my answer");
    }

    nextBtn.querySelector("#nxtBtPrg").style.width = `${progressPercent}%`;
  });
}

function submitMyAns() {
  let score = 0;
  for (let [key, value] of answerMap) {
    if (quesList[key].correctAns == value) score++;
  }

  const jsonBody = {
    answerSheet: Object.fromEntries(answerMap),
    clientName,
    username,
    score,
    max: no_of_ques,
    avatarCode,
  };

  postData(`/${username}/playscr`, jsonBody).then((data) => {
    console.log(data.message);
    window.location.href = data.redirect;
  });
}

// Example POST method implementation:
async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
