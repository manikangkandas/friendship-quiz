const clientLoginBtn = document.querySelector("#clientLogin");

clientLoginBtn.addEventListener("click", function () {
  let usercode = document.querySelector("#usercode").value;
  if (usercode == null || usercode == "") {
    modalTrigger(
      "Hello there!",
      "How can you imagine to play quiz without a code",
      "Let's type a code below yaa"
    );
    return;
  }

  if (validURL(usercode)) {
    // usercode = usercode.split("/")[usercode.split("/").length - 3];
    console.log("this is a url " + usercode);
  }
  if (hasLowerCase(usercode)) {
    validate(usercode).then((data) => {
      if (data.userExists) window.location.href = data.redirect;
      else {
        modalTrigger(
          "We're unable to find the code you've entered",
          "Let's try again",
          "Ok, I'll try again"
        );
      }
    });
  } else {
    modalTrigger(
      "Hey there!",
      "That's seems a invalid code, can you reenter a correct code",
      "Yes I do"
    );
  }
});

function hasLowerCase(str) {
  return /^[a-zA-Z]+$/.test(str);
}

async function validate(usercode) {
  const response = await fetch(`/${usercode.toLowerCase()}/validate`, {
    method: "GET",
    redirect: "follow",
  });
  return response.json();
}

function validURL(str) {
  var res = str.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  return res !== null;
}

function liveValidate(code) {
  if (code != null && code != "") {
    validate(code).then((data) => {
      if (data.userExists) {
        $("#clientLogin").text("Cool, let's play");
      } else {
        $("#clientLogin").text("play");
      }
    });
  }
}