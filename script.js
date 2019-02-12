// Testing event fires before promise

const promiseToChange = new Promise(resolve => {
  screen.orientation.addEventListener("change", resolve);
});

function whoWon(response) {
  if (response instanceof Event) {
    return "event";
  } else if (response === undefined) {
    return "promise";
  }
  throw new Error("unexpected result!");
}

async function orderCheck() {
  try {
    const result = await Promise.race([
      screen.orientation.lock("landscape"),
      promiseToChange
    ]);
    console.log(`Who won? ${whoWon(result)}`);
  } catch (err) {
    console.log(`error: ${err}`);
  }
}

// Testing lock throws error if non-valid input or empty input given
const invalid_lock_types = [
  "invalid-orientation",
  null,
  undefined,
  123,
  window,
  "",
  true,
  ["portrait-primary", "landscape-primary"]
];

const promisesToReject = invalid_lock_types.map(type =>
  screen.orientation.lock(type)
);

async function invalidLockCheck() {
  document.documentElement.requestFullscreen();
  try {
    await Promise.all(promisesToReject);
  } catch (err) {
    console.log(`error: ${err}`);
  }
}

async function emptyLockCheck() {
  document.documentElement.requestFullscreen();
  try {
    await screen.orientation.lock();
  } catch (err) {
    console.log(`error: ${err}`);
  }
}
