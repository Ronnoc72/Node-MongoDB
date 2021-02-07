const inputs = document.getElementsByClassName('boxes');
const warn = document.getElementById('warning');

for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('click', () => {
        inputs[i].classList.add('active');
    });
    inputs[i].addEventListener('mouseout', () => {
        if (inputs[i].classList.length >= 1) {
            inputs[i].classList.remove('active');
        }
    });
    inputs[i].addEventListener('change', () => {
        const pos = inputs[i].getBoundingClientRect();
        if (inputs[i].value.includes(" ")) {
            warn.style.top = pos.top + 'px';
            warn.style.left = pos.left + 'px';
            warn.innerHTML = "Spaces aren't allowed.";
        } else {
            warn.innerHTML = "";
        }
    });
}