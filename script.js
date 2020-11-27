const url = "https://randomuser.me/api/?results=16";

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
  console.log("init: ", initUsers);
  //   console.log(sortByAge(users));
  //   console.log(sortByName(users));
  //   console.log(filterByGender(users, "female"));
  return users;
}
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
