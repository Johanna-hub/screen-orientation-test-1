//         function show(e) {
//   const { type, angle } = screen.orientation;
//   console.log(`Orientation type is ${type} & angle is ${angle}.`);
//   console.log(`event is ${event.type}`);
// }
// screen.orientation.addEventListener("change", (e) => {
//     show(e);
// })
const screenLock =  screen.orientation.lock('portrait');

const eventChange = new Promise(function(resolve, reject) {
    screen.orientation.addEventListener("change", () => {
        resolve();
    })
});

function orderCheck() {

Promise.race([screenLock, eventChange]).then(response => console.log(response)).catch(error => console.log(error))
}