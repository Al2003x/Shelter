let slider = document.querySelector(".sliders");
let closePopup = document.querySelector(".popup__close");
let firstBtn = document.querySelector(".pagination__btn-first");
let prevBtn = document.querySelector(".pagination__btn-prev");
let numberBtn = document.querySelector(".pagination__btn-number");
let nextBtn = document.querySelector(".pagination__btn-next");
let headerBurger = document.querySelector(".header-burger");
let mainNav = document.querySelector(".main-nav");
let mainNavItems = document.querySelectorAll(".main-nav__item");
let body = document.querySelector("body");
let lockBlock = document.querySelector(".lock-block");
let lastBtn = document.querySelector(".pagination__btn-last");
let pets = [];
let petsList = [];
let currentPage = 1;
let itemsPage = 8;
let sliderShift = 930;

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
  const modal = document.createElement("div");
  modal.classList.add("popup__wrapper");
  document.querySelector("body").classList.add("lock");

  for (let i = 0; i < pets.length; i++) {
    if (pets[i].name === pet) {
      modal.insertAdjacentHTML(
        "afterbegin",
        `
				<div class="pets__popup">
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
  document.querySelector("body").classList.remove("lock");

  const modal = document.querySelector(".popup__wrapper");
  modal.parentNode.removeChild(modal);
};

const checkItemsPage = () => {
  if (
    document.querySelector("body").offsetWidth > 767 &&
    document.querySelector("body").offsetWidth < 1280
  ) {
    itemsPage = 6;
  } else if (document.querySelector("body").offsetWidth <= 767) {
    itemsPage = 3;
  } else itemsPage = 8;
};

const btnDisabled = () => {
  if (currentPage === 1) {
    firstBtn.classList.add("disabled");
    prevBtn.classList.add("disabled");
  } else {
    firstBtn.classList.remove("disabled");
    prevBtn.classList.remove("disabled");
  }

  if (currentPage === petsList.length / itemsPage) {
    lastBtn.classList.add("disabled");
    nextBtn.classList.add("disabled");
  } else {
    lastBtn.classList.remove("disabled");
    nextBtn.classList.remove("disabled");
  }
};

btnDisabled();

prevBtn.addEventListener("click", (e) => {
  checkItemsPage();

  if (currentPage > 1) currentPage--;
  numberBtn.textContent = currentPage;

  slider.style.top = `calc(0px - ${sliderShift * (currentPage - 1)}px)`;

  btnDisabled();
});

nextBtn.addEventListener("click", (e) => {
  checkItemsPage();

  if (currentPage < petsList.length / itemsPage) {
    currentPage++;
    numberBtn.textContent = currentPage;
  }

  slider.style.top = `calc(0px - ${sliderShift * (currentPage - 1)}px)`;
  slider.style.opacity = 1;

  btnDisabled();
});

firstBtn.addEventListener("click", (e) => {
  checkItemsPage();

  if (currentPage > 1) currentPage = 1;
  numberBtn.textContent = currentPage;

  slider.style.top = `calc(0px)`;

  btnDisabled();
});

lastBtn.addEventListener("click", (e) => {
  checkItemsPage();

  if (currentPage < petsList.length / itemsPage) {
    currentPage = petsList.length / itemsPage;
    numberBtn.textContent = currentPage;
  }
  slider.style.top = `calc(0px - ${sliderShift * (currentPage - 1)}px)`;
  btnDisabled();
});

function removingClassBurger() {
  headerBurger.classList.remove("active");
  mainNav.classList.remove("active");
  body.classList.remove("lock");
  lockBlock.style.display="none";
}

headerBurger.addEventListener('click', () => {
  console.log("nav")
  headerBurger.classList.toggle("active");
  mainNav.classList.toggle("active");
  body.classList.toggle("lock");
  lockBlock.style.display="block";
});

for (let mainNavItem of mainNavItems) {
  mainNavItem.addEventListener("click", removingClassBurger);
};

lockBlock.addEventListener('click', removingClassBurger);

