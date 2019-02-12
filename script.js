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

// Testing basic lock functions

// "Test that screen.orientation.unlock() doesn't throw when there is no lock");
function unlock() {
  screen.orientation.unlock();
}

// "Test that screen.orientation.unlock() returns a void value"

function voidLock() {
  const value = screen.orientation.unlock();
  console.log(`${value} should be undefined`);
}

// "Test that screen.orientation.lock returns a promise which will be fulfilled with a void value."
async function lockPromise() {
  await document.documentElement.requestFullscreen();
  const value = await screen.orientation.lock("any");
  console.log(`${value} should be undefined`);
}

// "Test that screen.orientation.lock returns a pending promise
async function lockTest() {
  const orientations = [
    "any",
    "natural",
    "portrait",
    "landscape",
    "portrait-secondary",
    "landscape-primary",
    "landscape-secondary",
    "portrait-primary"
  ];
  await document.documentElement.requestFullscreen();
  for (const orientation of orientations) {
    const promiseToChange = screen.orientation.lock(orientation);
    console.log(`instance of promise?: ${promiseToChange instanceof Promise}`);
    await promiseToChange;
    const type = screen.orientation.type;
    switch (orientation) {
      case "any":
        break;
      case "natural":
        console.log(`${type}should be portrait-primary or landscape-primary`);
        break;
      case "portrait":
        console.log(`${type} should be portrait-primary or portrait-secondary`);
        break;
      case "landscape":
        console.log(`${type} should be landscape-primary or landscape-secondary`);
        break;
      default:
        console.log(`${type} & ${orientation}: Expected orientation to change`);
        break;
    }
  }
  screen.orientation.unlock();
}

// promise_test(async t => {
//   const preType = screen.orientation.type;
//   const isPortrait = preType.includes("portrait");
//   const newType = `${isPortrait ? "landscape" : "portrait"}-primary`;
//   const p = screen.orientation.lock(newType);
//   assert_equals(
//     screen.orientation.type,
//     preType,
//     "Must not change orientation until next spin of event loop"
//   );
//   await p;
//   assert_equals(screen.orientation.type, newType);
// }, "Test that screen.orientation.lock() is actually async");

