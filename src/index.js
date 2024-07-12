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
  const heading = document.createElement('h2');
  heading.textContent = toy.name
  const image = document.createElement('img');
  image.src = toy.image
  image.alt = toy.name
  image.className = "toy-avatar"
  const p = document.createElement('p');
  p.textContent = toy.likes
  const button = document.createElement('button')
  button.className = "like-btn"
  button.textContent = 'Like ❤️'
  button.addEventListener('click', () => {
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ likes: toy.likes + 1 })
    })
    .then(res => res.json())
    .then(toy => {
      p.textContent = toy.likes;
    })
    .catch(error => console.error(`Error: ${error}`));
  })
  cardDiv.appendChild(heading)
  cardDiv.appendChild(image)
  cardDiv.appendChild(p)
  cardDiv.appendChild(button)
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



