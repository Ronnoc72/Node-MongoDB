const inputs = document.getElementsByClassName('boxes');
const body = document.getElementById('window');

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
            const p = document.createElement('p');
            p.style.top = (pos.top - 10) + 'px';
            p.style.left = (pos.left - 100) + 'px';
            p.innerHTML = "Spaces aren't<br /> allowed.";
            body.appendChild(p);
        } else {
            document.getElementById('window').childNodes.forEach(elmt => {
                if (elmt.nodeName == 'P') {
                    document.getElementById('window').removeChild(elmt);
                }
            })
        }
    });
}