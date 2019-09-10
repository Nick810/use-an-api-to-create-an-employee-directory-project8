const randomUserUrl = 'https://randomuser.me/api/?inc=name,nat,location,email,login,phone,picture,dob&results=12';
const gridContainer = document.querySelector('.grid-container');
const main = document.getElementById('main');
const searchBar = document.getElementById('search-bar');
const overlay = document.querySelector('.modal-overlay');
const modalCard = document.querySelector('.modal-card');
const modalContainer = document.querySelector('.modal-content');
const closeButton = document.querySelector('.close-button');
const employeesInfo = [];
let indexCounter = 0;
let modalSwitch = false;
let avartarIndex;

// ----- FUNCTIONS ----- //
// Generate Cards HTML
function generateHTML(data) {
  const div = document.createElement('div');
  const fullName = capitalize(data.name.first, data.name.last);
  employeesInfo.push(data)
  div.className = 'container';
  div.setAttribute('data-index', `${indexCounter}`);
  main.appendChild(div);
  div.innerHTML = `
    <div class="profile-card">
      <img class="avartar" src="${data.picture.large}" alt="A picture of ${data.name.first} ${data.name.last}" data-username="${data.login.username}">
    </div>
    <div class="profile-text">
      <h2 class="profile-name">${fullName}</h2>
      <p>${data.email}</p>
      <p>${data.location.city}</p>
    </div>
  `;
  indexCounter += 1;
}

// Display Modal
function displayModal(index) {
  const { name, dob, phone, email, location: {city, street, state, postcode}, picture} = employeesInfo[index];
  const fullName = capitalize(name.first, name.last);
  let date = new Date(dob.date);
  const modalHTML = `
    <img src="${picture.large}" class="avartar-modal" alt="A picture of ${name.first} ${name.last}" data-index="${index}">
    <div class="proile-text">
      <h2 class="modal-heading">${fullName}</h2>
      <p>${email}</p>
      <p>${city}</p>
      <div class="hr"></div>
      <p>${phone}</p>
      <p>${street}, ${state} ${postcode}</p>
      <p>Birthday: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
    </div>
    <span class="prev-arrow" data-index="${index}"></span>
    <span class="next-arrow" data-index="${index}"></span>
  `;

  overlay.classList.remove('hidden');
  modalContainer.innerHTML = modalHTML;
  checkDataIndex(index);
}

// Check Index
function checkDataIndex(index) {
  if (parseInt(index) === 0) {
    modalContainer.removeChild(modalContainer.lastElementChild.previousElementSibling);
  } else if (parseInt(index) === 11) {
    modalContainer.removeChild(modalContainer.lastElementChild);
  }
}

// Modal Animation
function overlayAnimation() {
  if (modalSwitch === false) {
    modalSwitch = true;
    overlay.style.background = 'rgba(51,51,51,0.9)';
    setTimeout(() => {
      modalCard.style.opacity = '1';
      modalCard.style.transform = 'translateY(25%) scale(1)';
    }, 400)
  } else {
    modalSwitch = false;
    overlay.style.background = 'rgba(0,0,0,0)';
    modalCard.style.transform = 'translateY(25%) scale(.5)';
    modalCard.style.opacity = '0';
    overlay.classList.add('hidden');
    gridContainer.classList.remove('no-scroll');
  }
}

// Switching Modal Animation
function switchModal(index) {
  const modalCardChildren = modalCard.children;
  if (modalSwitch === true) {
    for (let i=0; i<modalCardChildren.length; i++) {
      modalCardChildren[i].style.transition = 'all 0.1s';
      modalCardChildren[i].style.opacity = '0';
      modalCard.style.background = 'rgba(46, 49, 49, 1)';
      setTimeout(() => {
        displayModal(index);
        modalCardChildren[i].style.transition = 'all 0.5s';
        modalCard.style.background = '#fbfbf0';
        modalCardChildren[i].style.opacity = '1';
      }, 400);
    }
  }
}

// Capitalize First & Last Name
function capitalize(fname, lname) {
  fname = fname.charAt(0).toUpperCase() + fname.slice(1);
  lname = lname.charAt(0).toUpperCase() + lname.slice(1);
  const fullName = fname + ' ' + lname;
  return fullName;
}


// ----- FETCH DATA ----- //
fetch(randomUserUrl)
  .then(response => response.json())
  .then((data) => {
    let people = data.results;
    return people.map((employee) => generateHTML(employee));
  })
  .catch(err => console.log(err));


// ----- EVENTLISTENERS ----- //
// Main
main.addEventListener('click', (e) => {
  if (e.target !== main) {
    const card = e.target.closest('.container');
    const index = card.getAttribute('data-index');
    avartarIndex = parseInt(index);
    overlayAnimation();
    displayModal(index);
    gridContainer.classList.add('no-scroll');
  }
});

// Search Bar
searchBar.addEventListener('input', () => {
  const employees = document.querySelectorAll('.avartar');
  let inputValue = searchBar.value.toLowerCase();

  for (let i=0; i<employees.length; i++) {
    if (employees[i].getAttribute('alt').toLowerCase().includes(inputValue) || employees[i].getAttribute('data-username').toLowerCase().includes(inputValue)) {
      employees[i].parentNode.parentNode.style.display = 'flex';
    } else {
      employees[i].parentNode.parentNode.style.display = 'none';
    }
  }
});

// Close Button
closeButton.addEventListener('click', () => {
  overlayAnimation();
});

// Listen for Keyboards
window.addEventListener('keyup', (e) => {
  if (e.key === 'Escape') {
    modalSwitch = true;
    overlayAnimation();
    overlay.classList.add('hidden');
    gridContainer.classList.remove('no-scroll');
  }

  if (e.key === 'ArrowLeft' && avartarIndex === 0) {
    return false;
  } else if (e.key === 'ArrowRight' && avartarIndex === 11) {
    return false
  }

   if (e.key === 'ArrowLeft') {
     avartarIndex -= 1;
     switchModal(avartarIndex);
   } else if (e.key === 'ArrowRight') {
     avartarIndex = avartarIndex + 1;
     switchModal(avartarIndex);
   }
});

// Listen for Clicks
overlay.addEventListener('click', (e) => {
  let previous = e.target.closest('.prev-arrow')
  let next = e.target.closest('.next-arrow')
  if (e.target === previous) {
    avartarIndex -= 1;
    switchModal(avartarIndex);
  } else if (e.target === next) {
    avartarIndex =+ 1;
    switchModal(avartarIndex);
  }
});
