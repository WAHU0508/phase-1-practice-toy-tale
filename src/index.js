let addToy = false;
const toyCollection = document.getElementById('toy-collection');

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector('.add-toy-form');
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  fetchingToys();
  toyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.querySelector("input[name='name']").value;
    const image = document.querySelector("input[name='image']").value;
    postingToys(name, image);
    e.target.reset();
  });
  toyCollection.addEventListener("click", (e) => {
    if (e.target.classList.contains("like-btn")) {
      const toyId = e.target.dataset.id;
      likeToy(toyId)
        .then(toy => {
          updateToyLikes(toyId, toy.likes);
        })
        .catch(error => console.error('Error:', error));
    }
  });
});

function toyCard(toy) {
  const cardDiv = document.createElement('div');
  cardDiv.className = 'card';
  cardDiv.innerHTML = `
    <h2>${toy.name}</h2>
    <img class="toy-avatar" src="${toy.image}" alt="${toy.name}">
    <p>${toy.likes} Likes</p>
    <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
  `;
  toyCollection.appendChild(cardDiv);
}

function fetchingToys() {
  fetch('http://localhost:3000/toys')
  .then(res => res.json())
  .then(toys => { 
    toys.forEach(toy => toyCard(toy));
  })
  .catch(error => console.error(`Error: ${error}`));
}

function postingToys(name, image) {
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      'name': name, 
      'image': image, 
      'likes': 0
    })
  })
  .then(res => res.json())
  .then(toy => toyCard(toy))
  .catch(error => console.error(`Error: ${error}`));
}
let mewLikes = id.likes
function likeToy(id) {
  fetch(`http://localhost:3000/toys/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ likes: newLikes++})
  })
  .then(res => res.json());
}

function updateToyLikes(id, likes) {
  console.log('Updating likes for toy:', id, 'to', likes);
  const toyCard = document.querySelector(`button[data-id="${id}"]`).closest('.card');
  toyCard.querySelector('p').textContent = `${likes} Likes`;
}