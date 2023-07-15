let counter = 0;
let counterElement;

window.onload = () => {
    counterElement = document.getElementById('counter');
};

let increment = () => {
    counter = counter + 1;
    counterElement.innerText = counter;
};

let decrement = () => {
    counter = counter - 1;
    counterElement.innerText = counter;
};
