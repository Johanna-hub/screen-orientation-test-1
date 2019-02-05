const eventChange = new Promise(function(resolve, reject) {
  screen.orientation.addEventListener("change", e => {
    resolve(e.type);
  });
});

function responseCheck(response) {
  if (response === undefined) {
    console.log(`Lock resolved first`);
  } else if (response === "change") {
    console.log(`Event fired and event is ${response}`);
  } else {
    console.log(`${response}`);
  }
}

function orderCheck() {
  Promise.race([screen.orientation.lock("landscape"), eventChange])
    .then(response => responseCheck(response))
    .catch(error => console.log(`error is ${error}`));
}

