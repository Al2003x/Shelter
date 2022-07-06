let btnNext = document.querySelector(".slider__btn-next");
let btnPrev = document.querySelector(".slider__btn-prev");
let slider = document.querySelector(".sliders");
let closePopup = document.querySelector(".popup__close");
let headerBurger = document.querySelector(".header-burger");
let mainNav = document.querySelector(".main-nav");
let mainNavItems = document.querySelectorAll(".main-nav__item");
let body = document.querySelector("body");
let lockBlock = document.querySelector(".lock-block");
let pets = [];
let petsList = [];
let sliderShift = 320;
let currentPage = 1;
let itemsPage = 3;

const request = new XMLHttpRequest();
request.open("GET", "./pets.json");

request.onload = () => {
  pets = JSON.parse(request.response);

  petsList = (() => {
    let tempArr = [];
    for (let i = 0; i < 6; i++) {
      const newPets = pets;

      for (let j = pets.length; j > 0; j--) {
        let randInd = Math.floor(Math.random() * j);
        const randElem = newPets.splice(randInd, 1)[0];
        newPets.push(randElem);
      }
      tempArr = [...tempArr, ...newPets];
    }
    return tempArr;
  })();

  petsList = sort(petsList);

  createPets(petsList);
};

const sort = (list) => {
  list = sortrecursively(list);
  return list;
};

const sortrecursively = (list) => {
  const length = list.length;

  for (let i = 0; i < length / 6; i++) {
    const stepList = list.slice(i * 6, i * 6 + 6);

    for (let j = 0; j < 6; j++) {
      const duplicatedItem = stepList.find((item, ind) => {
        return item.name === stepList[j].name && ind !== j;
      });

      if (duplicatedItem !== undefined) {
        const ind = i * 6 + j;
        const which8OfList = Math.trunc(ind / 8);
        const slider = list.splice(ind, 1)[0];
        list.splice(which8OfList * 8, 0, slider);

        sortrecursively(list);
      }
    }
  }
  return list;
};

request.send();

const createPets = (pets) => {
  for (let i = 0; i < pets.length; i++) {
    slider.insertAdjacentHTML("beforeend", createElements(pets[i], i));
  }
};

const createElements = (pet) => {
  return `<div class="pets-slider__card" onclick="createPopCard('${pet.name}')">
  <div class="pets-slider__photo">
    <img
      src="${pet.img}"
      width="270"
      height="270"
      alt="pets-photo"
      class="pets-content__photo-img"
    />
  </div>
  <div class="pets-slider__name">${pet.name}</div>
  <button class="btn pets-slider__btn">Learn more</button>
</div>`;
};

const createPopCard = (pet) => {
  const modal = document.createElement('div');
  modal.classList.add("popup__wrapper");
  body.classList.add("lock");

  for (let i = 0; i < pets.length; i++) {
    if (pets[i].name === pet) {
      modal.insertAdjacentHTML(
        "afterbegin",
        `<div class="pets__popup">
					<button class="popup__close" onclick="closePopupBlock()"> x </button>
					<div class="popup__block">
							<img class="popup__img" src="${pets[i].img}" alt="${pets[i].name}">
							<div class="popup__info">
									<div class="popup__title">${pets[i].name}</div>
									<div class="popup__subtitle">${pets[i].type} - ${pets[i].breed}</div>
									<div class="pet-description">${pets[i].description}</div>
									<ul class="popup__list">
											<li class="popup__item">
													<span> Age: </span><span class="pet__age">${pets[i].age}</span>
											</li>
											<li class="popup__item">
													<span>Inoculations: </span><span class="pet__inoculations">${pets[i].inoculations}</span>
											</li>
											<li class="popup__item">
													<span>Diseases: </span><span class="pet__diseases">${pets[i].diseases}</span>
											</li>
											<li class="popup__item">
													<span> Parasites: </span><span class="pet__parasites">${pets[i].parasites}</span>
											</li>
									</ul>
							</div>
					</div>
				</div>
			`
      );

      document.body.appendChild(modal);
      return modal;
    }
  }
};

const closePopupBlock = () => {
  body.classList.remove("lock");
  const modal = document.querySelector(".popup__wrapper");
  modal.parentNode.removeChild(modal);
};

const checkItemsPage = () => {
  if (
    document.querySelector("body").offsetWidth > 767 &&
    document.querySelector("body").offsetWidth < 1280
  ) {
    itemsPage = 2;
  } else if (document.querySelector("body").offsetWidth <= 767) {
    itemsPage = 1;
  } else itemsPage = 3;
};


btnNext.addEventListener('click', (e) => {
  checkItemsPage();

  if (currentPage === 1) currentPage = (petsList.length / itemsPage + 1);
  if (currentPage > 1) currentPage--;

  slider.style.left = `calc(0px - ${sliderShift * itemsPage * (currentPage - 1)}px)`;

});


btnPrev.addEventListener('click', (e) => {
  checkItemsPage();

   if (currentPage < petsList.length / itemsPage) {
       currentPage++;
   }
   if (currentPage === petsList.length / itemsPage) currentPage = 1;

   slider.style.left = `calc(0px - ${sliderShift * itemsPage * (currentPage - 1)}px)`;
});

function removingClassBurger() {
  headerBurger.classList.remove("active");
  mainNav.classList.remove("active");
  body.classList.remove("lock");
  lockBlock.style.display="none";
}

lockBlock.addEventListener('click', removingClassBurger);

headerBurger.addEventListener('click', () => {
  headerBurger.classList.toggle("active");
  mainNav.classList.toggle("active");
  body.classList.toggle("lock");
  lockBlock.style.display="block";
});

for (let mainNavItem of mainNavItems) {
  mainNavItem.addEventListener("click", removingClassBurger);
};
