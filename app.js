const API_URL = "https://www.thecocktaildb.com/api/json/v1/1/search.php";
const cart = [];

document.addEventListener("DOMContentLoaded", () => {
  fetchDrinks("cocktail");
  const searchButton = document.getElementById("search-btn");
  searchButton.addEventListener("click", () => {
    const searchText = document.getElementById("search-bar").value.trim();
    if (searchText) {
      fetchDrinks(searchText);
    }
  });
});

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("add-to-group")) {
    handleAddToCart(event.target);
  }
  if (event.target.classList.contains("details-btn")) {
    showDrinkDetails(event.target);
  }
});

function handleAddToCart(button) {
  if (button.classList.contains("disabled")) {
    return;
  }
  if (cart.length >= 7) {
    alert("Cannot add more than 7 drinks to the cart!");
    return;
  }
  const drinkId = button.getAttribute("data-drink-id");
  const drinkName = button.getAttribute("data-drink-name");
  const drinkImage = button.getAttribute("data-drink-image");
  if (cart.some((drink) => drink.id === drinkId)) {
    return;
  }
  cart.push({
    id: drinkId,
    name: drinkName,
    image: drinkImage,
  });
  updateCartDisplay();
  button.textContent = "Already Added";
  button.classList.add("disabled", "btn-danger");
  button.classList.remove("btn-outline-secondary");
}

function showDrinkDetails(button) {
  const name = button.getAttribute("data-drink-name");
  const image = button.getAttribute("data-drink-image");
  const category = button.getAttribute("data-drink-category");
  const instructions = button.getAttribute("data-drink-instructions");
  const glass = button.getAttribute("data-drink-glass");
  const alcoholic = button.getAttribute("data-drink-alcoholic");

  document.getElementById("drink-details").innerHTML = `
    <div class="text-center mb-3">
      <img src="${image}" class="img-fluid rounded" alt="${name}" style="max-width: 200px;">
    </div>
    <strong>Name:</strong> ${name}<br>
    <strong>Category:</strong> ${category}<br>
    <strong>Instructions:</strong> ${instructions}<br>
    <strong>Glass:</strong> ${glass}<br>
    <strong>Alcoholic:</strong> ${alcoholic}<br>
  `;
}

function fetchDrinks(searchQuery) {
  fetch(`${API_URL}?s=${searchQuery}`)
    .then((response) => response.json())
    .then((data) => {
      const drinks = data.drinks;
      const container = document.getElementById("drink-cards");
      container.innerHTML = "";

      if (drinks) {
        drinks.forEach((drink) => {
          container.innerHTML += createDrinkCard(drink);
        });
        updateButtonStates();
      } else {
        container.innerHTML = '<p class="text-danger">No drinks found!</p>';
      }
    });
}

function createDrinkCard(drink) {
  return `
    <div class="col-md-4 drink-card mb-2">
      <div class="card">
        <img src="${drink.strDrinkThumb}" class="card-img-top" alt="${
    drink.strDrink
  }">
        <div class="card-body">
          <h5 class="card-title">${drink.strDrink}</h5>
          <p class="card-text">Category: ${drink.strCategory}</p>
          <p class="card-text">Instructions: ${drink.strInstructions.substring(
            0,
            15
          )}...</p>
          <button class="btn btn-outline-secondary add-to-group" 
            data-drink-id="${drink.idDrink}"
            data-drink-name="${drink.strDrink}"
            data-drink-image="${drink.strDrinkThumb}"
            data-drink-category="${drink.strCategory}"
            data-drink-instructions="${drink.strInstructions}"
            data-drink-glass="${drink.strGlass}"
            data-drink-alcoholic="${drink.strAlcoholic}">
            Add to Cart
          </button>
          <button class="btn btn-outline-success details-btn"
            data-drink-id="${drink.idDrink}"
            data-drink-name="${drink.strDrink}"
            data-drink-image="${drink.strDrinkThumb}"
            data-drink-category="${drink.strCategory}"
            data-drink-instructions="${drink.strInstructions}"
            data-drink-glass="${drink.strGlass}"
            data-drink-alcoholic="${drink.strAlcoholic}"
            data-bs-toggle="modal" 
            data-bs-target="#drink-details-modal">
            Details
          </button>
        </div>
      </div>
    </div>
  `;
}

function updateCartDisplay() {
  const cartList = document.getElementById("group-list");
  cartList.innerHTML = "";
  cart.forEach((drink, index) => {
    cartList.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>
          <img src="${
            drink.image
          }" class="mx-3" width="50" style="border-radius: 50%">
        </td>
        <td>${drink.name}</td>
      </tr>
    `;
  });
  document.getElementById(
    "group-count"
  ).textContent = `Total Cart: ${cart.length}`;
}

function updateButtonStates() {
  const buttons = document.querySelectorAll(".add-to-group");
  buttons.forEach((button) => {
    const drinkId = button.getAttribute("data-drink-id");
    if (cart.some((drink) => drink.id === drinkId)) {
      button.textContent = "Already Added";
      button.classList.add("disabled", "btn-secondary");
      button.classList.remove("btn-outline-secondary");
    }
  });
}
