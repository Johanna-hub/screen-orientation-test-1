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
    // console.log(`instance of promise?: ${promiseToChange instanceof Promise}`);
    try {
      await promiseToChange;
      const type = screen.orientation.type;
      switch (orientation) {
        case "any":
          break;
        case "natural":
          console.log(`${type}should be portrait-primary or landscape-primary`);
          break;
        case "portrait":
          console.log(
            `${type} should be portrait-primary or portrait-secondary`
          );
          break;
        case "landscape":
          console.log(
            `${type} should be landscape-primary or landscape-secondary`
          );
          break;
        default:
          console.log(
            `${type} & ${orientation}: Expected orientation to change`
          );
          break;
      }
    } catch (err) {
      console.log(`err: ${err}`);
    }
  }
  screen.orientation.unlock();
}

//check that lock is async

async function asyncTest() {
  await document.documentElement.requestFullscreen();
  const preType = screen.orientation.type;
  const isPortrait = preType.includes("portrait");
  const newType = `${isPortrait ? "landscape" : "portrait"}-primary`;
  const p = screen.orientation.lock(newType);
  console.log(`${p}: what is p`);
  console.log(
    `${
      screen.orientation.type
    } + ${preType}: should be same and must not change orientation until next spin of event loop`
  );
  await p;
  console.log(
    `${
      screen.orientation.type
    } + ${newType} lock should be async, both should be the same and different to previous`
  );
}

// onchange event
//"Test that orientationchange event is not fired when the orientation does not change."

async function changeEvent() {
  await document.documentElement.requestFullscreen();
  const type = screen.orientation.type;
  console.log(`${screen.orientation.onchange}: screen.orientation.onchange`);
  await screen.orientation.lock(type);
  console.log(`${screen.orientation.type} + ${type} should be same`);
  return document.exitFullscreen();
}

//"Test that orientationchange event is fired when the orientation changes."

async function changeFired() {
  await document.documentElement.requestFullscreen();
  let orientations = [
    "portrait-primary",
    "portrait-secondary",
    "landscape-primary",
    "landscape-secondary"
  ];
  console.log(`changes made again`);
  if (screen.orientation.type.includes("portrait")) {
    orientations = orientations.reverse();
  }

  function log(orientation) {
    console.log(
      `${screen.orientation.type} + ${orientation}: should be the same`
    );
  }
  for (const orientation of orientations) {
    screen.orientation.addEventListener("change", log(orientation));
    await screen.orientation.lock(orientation);
    screen.orientation.removeEventListener("change", log(orientation));
  }
  screen.orientation.unlock();
  return document.exitFullscreen();
}

// Test that promise rejected with DOMException

async function notSupported() {
  await document.documentElement.requestFullscreen();
  const currentOrientation = screen.orientation.type;
  const isLandscape = currentOrientation.includes("landscape");
  const newOrientation = `${isLandscape ? "portrait" : "landscape"}-primary`;
  await screen.orientation.lock(newOrientation);
}

// Check the angle values

async function angleTest() {
  let angle;
  function updateAngle() {
    angle = screen.orientation.angle;
  }
  await document.documentElement.requestFullscreen();
  await screen.orientation.lock("portrait-primary");
  updateAngle();
  console.log(`${angle} should be 0, 90 or 270`);
  await screen.orientation.lock("portrait-secondary");
  console.log(`${screen.orientation.angle} should be 180, 90 or 270`);
  await screen.orientation.lock("landscape-primary");
  console.log(`${screen.orientation.angle} should be 0, 90 or 270`);
  await screen.orientation.lock("landscape-secondary");
  console.log(`${screen.orientation.angle} should be 180, 90 or 270`);
  screen.orientation.unlock();
  if (screen.width > screen.height) {
    console.log(
      `${
        screen.orientation.type
      } should be landscape-primary or landscape-secondary`
    );
  } else if (screen.width < screen.height) {
    console.log(
      `${
        screen.orientation.type
      } should be portrait-primary or portrait-secondary`
    );
  }
  return document.exitFullscreen();
}

async function angleTest2() {
  await document.documentElement.requestFullscreen();
  const primaryOrientations = ["portrait-primary, landscape-primary"];
  for (const orientation of primaryOrientations) {
    await screen.orientation.lock(orientation);
    const angle = screen.orientation.angle;
    console.log(`${angle} should be 0, 90 or 270`);
  }
  const secondaryOrientations = ["portrait-secondary, landscape-secondary"];
  for (const orientation of secondaryOrientations) {
    await screen.orientation.lock(orientation);
    const angle = screen.orientation.angle;
    console.log(`${angle} should be 180, 90 or 270`);
  }
}
