const url = "https://randomuser.me/api/?results=16";
const usersContainer = document.querySelector(".users-container");

const errorMessage = (message) => `<p class="error-message">${message}</p>`;

const userTemplate = (photo, name, email, gender, age) => {
  return `
	<div class="user">
		 <img
			class="user__photo"
			src=${photo}
			alt="user-photo"
		 />
		 <div class="user__info">
			<h3 class="user__name">${name}</h3>
			<a class="user__email" href="mailto:${email}">
			 ${email}
			</a>
			<span class="user__gender">gender: ${gender}</span>
			<span class="user__age">age: ${age}</span>
		 </div>
	</div>`;
};

async function getUsers() {
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json.results;
  } catch {
    usersContainer.innerHTML += errorMessage("oops :( users fetch failed");
  }
}

async function app() {
  const initUsers = await getUsers();
  const users = initUsers.slice();
  renderUsers(users);
  handleSearch(users);
  handleSort(users, sortByAge, ["#sort-ascending", "#sort-descending"]);
  handleSort(users, sortByName, ["#sort-az", "#sort-za"]);
  handleFilterByGender(users, initUsers);
  handleResetToDefault(initUsers);
}

const renderUsers = (users) => {
  let renderedUsers = "";
  users.forEach(
    ({
      picture: { medium: photo },
      name: { first, last },
      email,
      gender,
      dob: { age },
    }) => {
      const name = `${first} ${last}`;
      renderedUsers += userTemplate(photo, name, email, gender, age);
    }
  );
  usersContainer.innerHTML = "";
  usersContainer.innerHTML += renderedUsers;
};

const handleSort = (users, sortFunc, [ascendingTrigger, descendingTrigger]) => {
  ascendingTrigger = document.querySelector(ascendingTrigger);
  descendingTrigger = document.querySelector(descendingTrigger);

  ascendingTrigger.addEventListener("click", () => {
    sortFunc(users);
    renderUsers(users);
  });
  descendingTrigger.addEventListener("click", () => {
    sortFunc(users).reverse();
    renderUsers(users);
  });
};

const handleFilterByGender = (users, initUsers) => {
  const maleTrigger = document.querySelector("#gender-male");
  const femaleTrigger = document.querySelector("#gender-female");
  const allGendersTrigger = document.querySelector("#gender-all");

  maleTrigger.addEventListener("click", () => {
    const men = filterByGender(users, "male");
    renderUsers(men);
  });
  femaleTrigger.addEventListener("click", () => {
    const women = filterByGender(users, "female");
    renderUsers(women);
  });
  allGendersTrigger.addEventListener("click", () => {
    renderUsers(initUsers);
  });
};

const handleResetToDefault = (initUsers) => {
  const resetBtn = document.querySelector("#reset-btn");
  resetBtn.addEventListener("click", () => {
    renderUsers(initUsers);
  });
};
const handleSearch = (users) => {
  const searchInput = document.querySelector("#search-input");
  searchInput.addEventListener("input", ({ target: { value } }) => {
    searchUsers(users, value);
  });
};

const sortByAge = (users) => {
  return users.sort((a, b) => a.dob.age - b.dob.age);
};
const sortByName = (users) => {
  return users.sort((a, b) => (a.name.first > b.name.first ? 1 : -1));
};
const filterByGender = (users, gender) => {
  return users.filter(({ gender: userGender }) => userGender === gender);
};

const searchUsers = (users, searchValue) => {
  searchValue = searchValue.toLowerCase();
  if (searchValue) {
    const searchResults = users.filter(({ name: { first: firstName } }) => {
      firstName = firstName.toLowerCase();
      return firstName.includes(searchValue);
    });
    renderUsers(searchResults);

    if (searchResults.length === 0) {
      usersContainer.innerHTML = "";
      usersContainer.innerHTML += errorMessage("users not found :(");
    }
  } else {
    renderUsers(users);
  }
};

app();
