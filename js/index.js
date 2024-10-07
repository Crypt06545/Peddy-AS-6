// Fetch pet categories
const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/peddy/categories")
    .then((res) => res.json())
    .then((data) => showCategories(data.categories))
    .catch((error) => console.log(error));
};

// Fetching the pet data
const loadPetData = () => {
  fetch("https://openapi.programming-hero.com/api/peddy/pets")
    .then((response) => response.json())
    .then((data) => petDetailsCard(data.pets));
};

let activeBtn = null;

const showCategories = (categories) => {
  const btnContainer = document.querySelector("#btn-container");
  btnContainer.innerHTML = "";

  categories.forEach((category, index) => {
    const categoryBtn = document.createElement("div");
    categoryBtn.classList.add(
      "flex",
      "justify-center",
      "items-center",
      "gap-10",
      "mt-5"
    );

    categoryBtn.innerHTML = `
        <button id="category-btn-${index}" class="category-btn flex items-center gap-2 border-2 px-6 py-2">
          <img class="w-8" src="${category.category_icon}" alt="${category.category}" />
          <span class="font-bold text-xl">${category.category}</span>
        </button>
      `;

    btnContainer.appendChild(categoryBtn);

    const button = document.querySelector(`#category-btn-${index}`);
    button.addEventListener("click", () => handleCategoryClick(button));
  });
};

const handleCategoryClick = (clickedBtn) => {
  if (activeBtn) {
    activeBtn.classList.remove("rounded-full", "border-[#0E7A81]");
  }

  clickedBtn.classList.add("rounded-full", "border-[#0E7A81]");

  activeBtn = clickedBtn;
};

// Fetching the pet data from the API
fetch("https://openapi.programming-hero.com/api/peddy/pets")
  .then((response) => response.json())
  .then((data) => {
    if (data.status && data.pets) {
      const pets = data.pets;
      const petContainer = document.getElementById("petContainer");
      petContainer.innerHTML = "";

      // Loop through each pet and create a card
      pets.forEach((pet) => {
        const {
          pet_name = "Not available",
          breed = "Not available",
          date_of_birth = "Not available",
          gender = "Not available",
          price = "Not available",
          image = "https://via.placeholder.com/150",
        } = pet;

        const formattedPrice =
          price && price !== "Not available" ? `$${price}` : "Not available";

        const petCard = `
          <div class="flex flex-col justify-center bg-base-100 shadow-xl p-3 rounded-lg border-2">
            <div>
              <img class="rounded-lg" src="${image}" alt="image" />
            </div>
            <div class="">
              <h5 class="text-lg font-bold mt-1">${pet_name}</h5>
              <div class="flex items-center text-sm text-gray-500 mt-1 gap-1">
                <i class="fa-solid fa-table-cells-large"></i> Breed: ${breed}
              </div>
              <div class="flex items-center text-sm text-gray-500 mt-1">
                <i class="fas fa-calendar-alt mr-2"></i> Birth: ${
                  date_of_birth || "Not available"
                }
              </div>
              <div class="flex items-center text-sm text-gray-500 mt-1">
                <i class="fas fa-venus mr-2"></i> Gender: ${gender}
              </div>
              <div class="flex items-center text-sm text-gray-500 mt-1">
                <i class="fas fa-dollar-sign mr-2"></i> Price: ${formattedPrice}
              </div>
              <div class="flex justify-between gap-2 mt-2">
                <button class="btn p-1">
                  <i class="fa-regular fa-thumbs-up mr-2 text-xl text-[#0E7A81] font-bold"></i>
                </button>
                <button class="btn p-3 text-[#0E7A81] font-bold">Adopt</button>
                <button class="btn p-3 text-[#0E7A81] font-bold">Details</button>
              </div>
            </div>
          </div>
        `;

        petContainer.innerHTML += petCard;
      });
    } else {
      console.error("Failed to fetch pet data.");
    }
  })
  .catch((error) => console.error("Error fetching data:", error));

loadCategories();
