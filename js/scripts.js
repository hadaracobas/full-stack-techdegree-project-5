// *** API URL
const randomUsersUrl = "https://randomuser.me/api/?results=12&nat=us";

// *** DOM ELEMENTS
const body = document.querySelector("body");
const gallery = document.getElementById("gallery");
const searchContainer = document.querySelector(".search-container");

/**
 * FETCH DATA
 * @return {json} return json data object
 */
async function fetchData(url) {
  try {
    const data = await fetch(url).then((res) => res.json());
    return data;
  } catch (err) {
    alert("We were not able to get the data");
  }
}

/**
 * GET USERS - EXECUTE ONLOAD
 */
let users;
async function getUsers() {
  usersData = await fetchData(randomUsersUrl);
  users = usersData.results;
  displayUsers();
}
window.onload = getUsers;

/**
 * DISPLAY USERS ON PAGE
 */
function displayUsers() {
  // map over users, create html string and display on page
  users.map((user) => {
    let htmlString = `
    <div class="card">
        <div class="card-img-container">
            <img class="card-img" src="${user.picture.medium}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
            <p class="card-text">${user.email}</p>
            <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
        </div>
    </div>
    `;
    gallery.insertAdjacentHTML("beforeend", htmlString);
  });
  userModalOpenOnClick();
  searchUser();
}

/**
 * CREATE USER MODAL
 * @param (number) index - index of active user
 */
function createModal(index) {
  let user = users[index];
  let htmlString = `
  <div class="modal-container">
      <div class="modal">
          <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
          <div class="modal-info-container">
              <img class="modal-img" src="${
                user.picture.large
              }" alt="profile picture">
              <h3 id="name" class="modal-name cap">${user.name.first} ${
    user.name.last
  }</h3>
              <p class="modal-text">${user.email}</p>
              <p class="modal-text cap">${user.location.city}</p>
              <hr>
              <p class="modal-text">${formatPhoneNumber(user.cell)}</p>
              <p class="modal-text">${user.location.street.number} ${
    user.location.street.name
  }, ${user.location.state}, ${user.location.postcode} </p>
              <p class="modal-text">Birthday: ${formatBirthday(
                user.dob.date
              )}</p>
          </div>
      </div>

      // IMPORTANT: Below is only for exceeds tasks 
      <div class="modal-btn-container">
          <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
          <button type="button" id="modal-next" class="modal-next btn">Next</button>
      </div>
  </div>
  `;
  body.insertAdjacentHTML("beforeend", htmlString);
  nextAndPrevUserModal(index);
  removeModalHandleOnClick();
}

/**
 * REMOVE MODAL
 */
function removeUserModal() {
  document.querySelector(".modal-container").remove();
}

/**
 * REMOVE USER MODAL HANDLE ONCLICK
 */
function removeModalHandleOnClick() {
  document.getElementById("modal-close-btn").addEventListener("click", () => {
    removeUserModal();
  });
}

/**
 * NEXT-PREV USER MODAL HANDLE ONCLICK
 *  * @param (number) index - index of active user
 */
function nextAndPrevUserModal(index) {
  const modalBtnsContainer = document.querySelector(".modal-btn-container");
  modalBtnsContainer.addEventListener("click", (event) => {
    if (event.target.id === "modal-prev" && index > 0) {
      let prevIndex = index - 1;
      removeUserModal();
      createModal(prevIndex);
    } else if (event.target.id === "modal-next" && index < users.length - 1) {
      let prevIndex = index + 1;
      removeUserModal();
      createModal(prevIndex);
    }
  });
}

/**
 * OPEN USER MODAL HANDLE ONCLICK
 */
function userModalOpenOnClick() {
  // store cards collection and convert to an array
  const cards = document.getElementsByClassName("card");
  const cardsArr = [...cards];
  cardsArr.forEach((card, index) => {
    card.addEventListener("click", () => {
      createModal(index);
    });
  });
}

/**
 * FORMAT USER PHONE NUMBER
 */
function formatPhoneNumber(number) {
  const onlyNumbers = number.replace(/\D/g, "");
  const numbersArr = [
    onlyNumbers.slice(0, 3),
    onlyNumbers.slice(3, 6),
    onlyNumbers.slice(6, onlyNumbers.length),
  ];
  const phone = `(${numbersArr[0]}) ${numbersArr[1]}-${numbersArr[2]}`;
  return phone;
}

/**
 * FORMAT USER BIRTHDAY
 */
function formatBirthday(dob) {
  const dateObj = new Date(dob);
  const birthday = `${String(dateObj.getMonth() + 1).padStart(2, "0")}/${String(
    dateObj.getDate()
  ).padStart(2, "0")}/${dateObj.getFullYear()}`;
  return birthday;
}

/**
 * SEARCH USER
 */
function searchUser() {
  // insert html string to page
  let htmlString = `
      <form action="#" method="get">
          <input type="search" id="search-input" class="search-input" placeholder="Search...">
          <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
      </form>
      `;
  searchContainer.insertAdjacentHTML("beforeend", htmlString);

  // filter users
  const cards = document.getElementsByClassName("card");
  const input = document.getElementById("search-input");
  input.addEventListener("keyup", () => {
    let searchInputValue = input.value;
    for (let i = 0; i < cards.length; i++) {
      if (
        cards[i]
          .querySelector("#name")
          .innerText.toLowerCase()
          .indexOf(searchInputValue.toLowerCase()) > -1
      ) {
        cards[i].style.display = "block";
      } else {
        cards[i].style.display = "none";
      }
    }
  });
}
