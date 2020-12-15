const url = "https://randomuser.me/api/?results=16";
const usersContainer = document.querySelector(".users-container");
const errorTemplate = `<p class="error-message">oops :( users fetch failed</p>`;

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
    usersContainer.innerHTML += errorTemplate;
  }
}

async function app() {
  const initUsers = await getUsers();
  const users = initUsers.slice();
  renderUsers(users);
  handleSort(users, sortByAge, ["#sort-ascending", "#sort-descending"]);
  handleSort(users, sortByName, ["#sort-az", "#sort-za"]);
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

function sortByAge(users) {
  return users.sort((a, b) => a.dob.age - b.dob.age);
}
function sortByName(users) {
  return users.sort((a, b) => (a.name.first > b.name.first ? 1 : -1));
}
function filterByGender(users, gender) {
  return users.filter((user) => user.gender === gender);
}

app();
