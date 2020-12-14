const url = "https://randomuser.me/api/?results=16";
const usersContainer = document.querySelector(".users-container");
console.log(usersContainer);

async function getUsers() {
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json.results;
  } catch {
    console.log("oops :( fetch failed");
  }
}

async function app() {
  const initUsers = await getUsers();
  const users = initUsers.slice();
  console.log(users);
  renderUsers(users);
  return users;
}

const userTemplate = (photo, name, email, gender, age) => {
  return `<div class="user">
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
  usersContainer.innerHTML += renderedUsers;
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

console.log(app());
