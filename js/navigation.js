const navButtons = document.querySelectorAll('[nav-name]');


navButtons.forEach(function(btn){
  btn.addEventListener('click', function() {
    currentElement = document.querySelector('[current="true"]');
    const btnName = btn.getAttribute('nav-name');
    const chosenElement = document.getElementById(`${btnName}`);

    if(btnName === currentElement.getAttribute('id')) {
      return;
    } else {
      removeElement(currentElement, btnName);
      add(chosenElement);
    }
  });
});

function removeElement(element, attributeVal) {
  element.classList.add('remove');
  element.style.display = 'none';
  element.setAttribute('current', 'false');
}

function add(element) {
  element.classList.add('add');
  element.style.display = 'block';
  element.setAttribute('current', 'true');
}

