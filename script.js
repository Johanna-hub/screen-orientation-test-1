//         function show(e) {
//   const { type, angle } = screen.orientation;
//   console.log(`Orientation type is ${type} & angle is ${angle}.`);
//   console.log(`event is ${event.type}`);
// }
// screen.orientation.addEventListener("change", (e) => {
//     show(e);
// })

const eventChange = new Promise(function(resolve, reject) {
  screen.orientation.addEventListener("change", e => {
    resolve(e.type);
  });
});

function orderCheck() {
  Promise.race([screen.orientation.lock("landscape"), eventChange])
    .then(response => console.log(response))
    .catch(error => console.log(error));
}

function eventCheck() {
  eventChange.then(response => console.log(response));
}
