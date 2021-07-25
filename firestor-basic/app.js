const cafeList = document.querySelector("#cafe-list");

const form = document.querySelector("#add-cafe-form");
const searchBar = document.querySelector("#searchBar");

// create element & render cafe
function renderCafe(doc) {
  let li = document.createElement("li");
  let name = document.createElement("span");
  let city = document.createElement("span");
  let cross = document.createElement("div");

  li.setAttribute("data-id", doc.id);
  name.textContent = doc.data().name;
  city.textContent = doc.data().city;
  cross.textContent = "x";

  li.appendChild(name);
  li.appendChild(city);
  li.appendChild(cross);

  cafeList.appendChild(li);

  //deleting data
  cross.addEventListener("click", (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute("data-id");
    db.collection("cafes").doc(id).delete();
  });
}

let ans = [];

searchBar.addEventListener("keyup", (e) => {
  let searchString = e.target.value.toLowerCase();
  const filters = ans.filter((character) => {
    return (
      character.name.toLowerCase().includes(searchString) ||
      character.city.toLowerCase().includes(searchString)
    );
  });
  displayCharacters(filters);
});

const displayCharacters = (characters) => {
  const htmlString = characters
    .map((character) => {
      return `
            <li data-id=${character.id} >
               <span>${character.name}</span>
               <span>${character.city}</span>
               <div id="cros" >x</div>
            </li>
        `;
    })
    .join("");

  cafeList.innerHTML = htmlString;
  const cros = document.querySelector("#cros");
  cros.addEventListener("click", (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute("data-id");
    db.collection("cafes").doc(id).delete();
  });
};

// // // getting data
// db.collection("cafes")
//   .orderBy("name")
//   .get()
//   .then((snapshot) => {
//     snapshot.docs.forEach((doc) => {
//       const config = { ...doc.data() };
//       config["id"] = doc.id;

//       ans.push(config);
//       renderCafe(doc);
//     });
//   });
// console.log(ans);
// saving data
form.addEventListener("submit", (e) => {
  e.preventDefault();
  db.collection("cafes").add({
    name: form.name.value.toLowerCase(),
    city: form.city.value.toLowerCase(),
  });
  form.name.value = "";
  form.city.value = "";
});

//realTime update
db.collection("cafes")
  .orderBy("name")
  .onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    changes.forEach((change) => {
      if (change.type == "added") {
        const config = { ...change.doc.data() };
        config["id"] = change.doc.id;

        ans.push(config);

        renderCafe(change.doc);
      } else if (change.type == "removed") {
        let li = cafeList.querySelector("[data-id=" + change.doc.id + "]");

        cafeList.removeChild(li);
      }
    });
  });
