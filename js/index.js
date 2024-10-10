// Fetch pet categories
const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/peddy/categories")
    .then((res) => res.json())
    .then((data) => showCategories(data.categories))
    .catch((error) => console.error("Error fetching categories:", error));
};

// Fetch the pet data
const loadPetData = async () => {
  try {
    document.querySelector(".loading").style.display = "block";

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const response = await fetch(
      "https://openapi.programming-hero.com/api/peddy/pets"
    );
    const data = await response.json();

    // Hide the spinner
    document.querySelector(".loading").style.display = "none";

    if (data.status && data.pets) {
      displayPets(data.pets);
    } else {
      console.error("Failed to fetch pet data.");
    }
  } catch (error) {
    console.error("Error fetching pet data:", error);
  }
};

// Display pet cards in the container

const displayPets = (pets) => {
  const petContainer = document.getElementById("petContainer");
  petContainer.innerHTML = "";

  if (pets.length === 0) {
    petContainer.innerHTML = "<p>No pets available</p>";
    return;
  }

  pets.forEach((pet) => {
    const {
      pet_name = "Not available",
      breed = "Not available",
      date_of_birth,
      gender = "Not available",
      price = null,
      image = "https://via.placeholder.com/150",
      petId,
    } = pet;

    // Handle null or undefined date_of_birth
    const formattedBirthDate = date_of_birth ? date_of_birth : "Not available";

    // Handle null or undefined price
    const formattedPrice =
      price === null || price === undefined ? "Not available" : `$${price}`;

    const petCard = `
      <div class="flex flex-col justify-center bg-base-100 shadow-xl p-3 rounded-lg border-2">
        <img class="rounded-lg w-full object-cover" src="${image}" alt="image" />
        <h5 class="text-lg font-bold mt-1">${pet_name}</h5>
        <div class="text-sm text-gray-500 mt-1">
          <i class="fa-solid fa-table-cells-large mr-2"></i> Breed: ${breed}
        </div>
        <div class="text-sm text-gray-500 mt-1">
          <i class="fas fa-calendar-alt mr-2"></i> Birth: ${formattedBirthDate}
        </div>
        <div class="text-sm text-gray-500 mt-1">
          <i class="fas fa-venus mr-2"></i> Gender: ${gender}
        </div>
        <div class="text-sm text-gray-500 mt-1">
          <i class="fas fa-dollar-sign mr-2"></i> Price: ${formattedPrice}
        </div>
        <div class="border-b-2 my-2"></div>
        <div class="flex justify-between gap-2 mt-2">
          <button class="btn p-1 like-btn" data-id="${petId}">
            <i class="fa-regular fa-thumbs-up mr-2 text-xl text-[#0E7A81] font-bold"></i>
          </button>
          <button class="btn p-3 text-[#0E7A81] font-bold adopt-btn" data-id="${petId}">Adopt</button>
          <button class="btn p-3 text-[#0E7A81] font-bold details-btn" data-id="${petId}">Details</button>
        </div>
      </div>
    `;

    petContainer.innerHTML += petCard;
  });

  attachEventListeners();
};

// Show categories in buttons
let activeBtn = null;
const showCategories = (categories) => {
  const btnContainer = document.querySelector("#btn-container");
  btnContainer.innerHTML = "";

  if (categories.length === 0) {
    btnContainer.innerHTML = 
    `
          <div class="flex flex-col justify-center text-center items-center bg-gray-200 p-10 rounded-lg">
            <div >
              <img src="./images/error.webp" alt="No Data Available" class="w-32 h-32 mb-4"/>
            </div>
            <h1 class="text-4xl font-bold text-gray-600">No Information Available</h1>
            <p class="text-gray-500 mt-4 text-center">
              We couldn't find any pets under this category. Please try selecting a different category.
            </p>
          </div>
    `
    return;
  }

  categories.forEach((category, index) => {
    const categoryIcon =
      category.category_icon || "https://via.placeholder.com/50";
    const categoryName = category.category || "Not available";

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
        <img class="w-8" src="${categoryIcon}" alt="Category Icon" />
        <span class="font-bold text-xl">${categoryName}</span>
      </button>`;
    btnContainer.appendChild(categoryBtn);

    const button = document.querySelector(`#category-btn-${index}`);
    button.addEventListener("click", () =>
      handleCategoryClick(button, category.category)
    );
  });
};

// Handle category click
const handleCategoryClick = (clickedBtn, categoryName) => {
  if (activeBtn) {
    activeBtn.classList.remove("rounded-full", "border-[#0E7A81]");
  }
  clickedBtn.classList.add("rounded-full", "border-[#0E7A81]");
  activeBtn = clickedBtn;

  const petContainer = document.getElementById("petContainer");
  petContainer.innerHTML = "";

  document.querySelector(".loading").style.display = "block";

  // Set a 2-second delay
  setTimeout(() => {
    logCategoryName(categoryName);

    document.querySelector(".loading").style.display = "none";
  }, 2000);
};

// Fetch category name
const logCategoryName = (categoryName) => {
  const petContainer = document.getElementById("petContainer");

  fetch(
    `https://openapi.programming-hero.com/api/peddy/category/${categoryName}`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.data.length === 0) {
        petContainer.innerHTML = `
          <div class="flex flex-col justify-center text-center items-center bg-gray-200 p-10 rounded-lg">
            <div >
              <img src="./images/error.webp" alt="No Data Available" class="w-32 h-32 mb-4"/>
            </div>
            <h1 class="text-4xl font-bold text-gray-600">No Information Available</h1>
            <p class="text-gray-500 mt-4 text-center">
              We couldn't find any pets under this category. Please try selecting a different category.
            </p>
          </div>
        `;
        petContainer.classList.remove("grid");
      } else {
        displayPets(data.data);

        petContainer.classList.add("grid");
      }
    })
    .catch((error) => console.error("Error fetching category data:", error));
};

// Add event listener for Sort By Price button
const sortByPriceBtn = document.getElementById("sortPriceBtn");
sortByPriceBtn.addEventListener("click", handleSortByPrice);

function handleSortByPrice() {
  // Show the spinner
  document.querySelector(".loading").style.display = "block";

  // Set a 2-second delay
  setTimeout(() => {
    fetchSortedPets();
    document.querySelector(".loading").style.display = "none";
  }, 2000);
}

// Fetch and display sorted pets
const fetchSortedPets = () => {
  fetch("https://openapi.programming-hero.com/api/peddy/pets")
    .then((res) => res.json())
    .then((data) => {
      if (data.status && data.pets) {
        const sortedPets = data.pets.sort((a, b) => {
          const priceA =
            a.price === null || a.price === undefined ? 0 : a.price;
          const priceB =
            b.price === null || b.price === undefined ? 0 : b.price;
          return priceB - priceA;
        });

        displayPets(sortedPets);
      } else {
        console.error("Failed to fetch or sort pet data.");
      }
    })
    .catch((error) => console.error("Error fetching or sorting pets:", error));
};

// Attach event listeners to buttons
const attachEventListeners = () => {
  // Like button event listeners
  document.querySelectorAll(".like-btn").forEach((button) => {
    button.addEventListener("click", () => fetchPetImage(button.dataset.id));
  });

  // Adopt button event listeners
  document.querySelectorAll(".adopt-btn").forEach((button) => {
    button.addEventListener("click", () => showAdoptionModal(button));
  });

  // Details button event listeners
  document.querySelectorAll(".details-btn").forEach((button) => {
    button.addEventListener("click", () => showDetailsModal(button.dataset.id));
  });
};

// Fetch pet image
const fetchPetImage = async (petId) => {
  try {
    const response = await fetch(
      `https://openapi.programming-hero.com/api/peddy/pet/${petId}`
    );
    const data = await response.json();

    if (data.status && data.petData) {
      const { image } = data.petData;

      const imageDiv = document.createElement("div");
      imageDiv.className =
        "flex justify-center border p-1 rounded-lg items-center";

      const newImageElement = document.createElement("img");
      newImageElement.src = image;
      newImageElement.alt = "Liked Pet Image";
      newImageElement.className = "object-cover rounded-lg";

      imageDiv.appendChild(newImageElement);

      const likedImageContainer = document.querySelector(
        "#likedImageContainer .grid"
      );
      likedImageContainer.appendChild(imageDiv);
    }
  } catch (error) {
    console.error("Error fetching pet image:", error);
  }
};

// Show adoption modal
let countdownInterval;
const showAdoptionModal = (button) => {
  const modal = document.getElementById("adoptModal");
  const countdownElement = document.getElementById("countdown");
  let countdown = 3;

  clearInterval(countdownInterval);
  modal.classList.remove("hidden");

  button.disabled = true;
  button.textContent = "Adopting...";

  countdownElement.textContent = countdown;

  countdownInterval = setInterval(() => {
    countdownElement.textContent = countdown;
    countdown--;

    if (countdown < 0) {
      clearInterval(countdownInterval);
      modal.classList.add("hidden");
      button.textContent = "Adopted";
    }
  }, 1000);
};

// Show pet details modal
const showDetailsModal = async (petId) => {
  try {
    const response = await fetch(
      `https://openapi.programming-hero.com/api/peddy/pet/${petId}`
    );
    const data = await response.json();

    if (data.status && data.petData) {
      const {
        pet_name = "Not available",
        breed = "Not available",
        date_of_birth,
        price,
        image = "https://via.placeholder.com/300x200",
        gender = "Not available",
        pet_details = "No additional details available.",
        vaccinated_status = "Unknown",
      } = data.petData;

      // Handle null or undefined values for birth date and price
      const formattedBirthDate = date_of_birth ? date_of_birth : "Not available";
      const formattedPrice = price === null || price === undefined ? "Not available" : `$${price}`;

      const modalContent = `
        <!-- Image with 300x200 size -->
        <img src="${image}" alt="Pet Image" class="rounded-lg mb-2 w-full object-cover" />
        
        <!-- Pet name -->
        <h2 class="text-2xl font-bold mb-2">${pet_name}</h2>

        <!-- Pet info with icons -->
        <div class="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
            <p class="flex items-center">
                <i class="fa-solid fa-table-cells-large mr-2"></i>
                <strong>Breed:</strong> ${breed}
            </p>
            <p class="flex items-center">
                <i class="fas fa-calendar-alt mr-2"></i>
                <strong>Birth:</strong> ${formattedBirthDate}
            </p>
            <p class="flex items-center">
                <i class="fas fa-venus mr-2"></i>
                <strong>Gender:</strong> ${gender}
            </p>
            <p class="flex items-center">
                <i class="fas fa-dollar-sign mr-2"></i>
                <strong>Price:</strong> ${formattedPrice}
            </p>
            <p class="flex items-center">
                <i class="fa-solid fa-syringe mr-2"></i>
                <strong>Vaccinated status:</strong> ${vaccinated_status}
            </p>
        </div>

        <!-- Details information -->
        <div class="text-sm text-gray-700">
            <h3 class="font-semibold text-lg">Details Information</h3>
            <p class="mt-2">
            ${pet_details}
            </p>
        </div>

        <!-- Cancel button -->
        <div class="flex justify-center">
            <button class="btn w-full py-2 bg-teal-100 text-teal-600 rounded-lg hover:bg-teal-200" onclick="closeDetailsModal()">Cancel</button>
        </div>
      `;

      const detailsModal = document.getElementById("detailsModal");
      detailsModal.querySelector("#modalContent").innerHTML = modalContent;
      detailsModal.classList.remove("hidden");
    } else {
      console.error("Failed to fetch pet details.");
    }
  } catch (error) {
    console.error("Error fetching pet details:", error);
  }
};


const closeDetailsModal = () => {
  const detailsModal = document.getElementById("detailsModal");
  detailsModal.classList.add("hidden");
  detailsModal.querySelector("#modalContent").innerHTML = "";
};

loadCategories();
loadPetData();
