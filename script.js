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

