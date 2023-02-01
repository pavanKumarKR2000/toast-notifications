import Toast from './toast.js';

// let toast1 = new Toast({ type: "success", position: "top-center", "message": "this is success message" ,autoClose:3000});

// setTimeout(() => {
//     toast1.remove();
// }, 5000);

let pos = "top-right";

const toastButtons = document.querySelectorAll(".toast-btn");
const positionSelectors = document.querySelectorAll("input");

positionSelectors.forEach((ps) => {
    ps.addEventListener('change', (e) => {
        pos = e.target.value;
    });
})

toastButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let position=pos[Math.floor(Math.random()*pos.length)]
        let toast=new Toast({ type: `${e.target.dataset.type}`, position:`${pos}`, "message": `This is ${e.target.dataset.type} message` ,autoClose:3500})
    })
})