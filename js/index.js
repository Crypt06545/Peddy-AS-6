// Fetch pet categories and display them
const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/peddy/categories")
    .then((res) => res.json())
    .then((data) => showCategories(data.categories))
    .catch((error) => console.error("Error fetching categories:", error));
};

// Fetch the pet data
const loadPetData = async () => {
  try {
    // Show the spinner while loading
    document.querySelector(".loading").style.display = "block";

    // Simulate a delay for the spinner (2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const response = await fetch("https://openapi.programming-hero.com/api/peddy/pets");
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

  pets.forEach((pet) => {
    const {
      pet_name = "Not available",
      breed = "Not available",
      date_of_birth = "Not available",
      gender = "Not available",
      price = "Not available",
      image = "https://via.placeholder.com/150",
      petId
    } = pet;

    const formattedPrice = price !== "Not available" ? `$${price}` : "Not available";

    const petCard = `
      <div class="flex flex-col justify-center bg-base-100 shadow-xl p-3 rounded-lg border-2">
        <img class="rounded-lg w-full object-cover" src="${image}" alt="image" />
        <h5 class="text-lg font-bold mt-1">${pet_name}</h5>
        <div class="text-sm text-gray-500 mt-1">
          <i class="fa-solid fa-table-cells-large mr-2"></i> Breed: ${breed}
        </div>
        <div class="text-sm text-gray-500 mt-1">
          <i class="fas fa-calendar-alt mr-2"></i> Birth: ${date_of_birth}
        </div>
        <div class="text-sm text-gray-500 mt-1">
          <i class="fas fa-venus mr-2"></i> Gender: ${gender}
        </div>
        <div class="text-sm text-gray-500 mt-1">
          <i class="fas fa-dollar-sign mr-2"></i> Price: ${formattedPrice}
        </div>
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

// Fetch pet image when 'like' button is clicked and display it in a separate container
const fetchPetImage = async (petId) => {
  try {
    const response = await fetch(`https://openapi.programming-hero.com/api/peddy/pet/${petId}`);
    const data = await response.json();

    if (data.status && data.petData) {
      const { image } = data.petData;

      // Create a new div element for the image
      const imageDiv = document.createElement("div");
      imageDiv.className = "flex justify-center items-center"; // Optional styling for the div

      // Create a new image element
      const newImageElement = document.createElement("img");
      newImageElement.src = image;
      newImageElement.alt = "Liked Pet Image";
      newImageElement.className = "w-[50px] h-[50px] object-cover rounded-lg"; // Adjust size

      // Append the image to the div
      imageDiv.appendChild(newImageElement);

      // Display the fetched image in the container
      const likedImageContainer = document.querySelector("#likedImageContainer .grid");
      likedImageContainer.appendChild(imageDiv); // Append the new div to the grid container
    }
  } catch (error) {
    console.error("Error fetching pet image:", error);
  }
};




// Show categories in buttons
let activeBtn = null;
const showCategories = (categories) => {
  const btnContainer = document.querySelector("#btn-container");
  btnContainer.innerHTML = "";

  categories.forEach((category, index) => {
    const categoryBtn = document.createElement("div");
    categoryBtn.classList.add("flex", "justify-center", "items-center", "gap-10", "mt-5");
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

// Handle category click
const handleCategoryClick = (clickedBtn) => {
  if (activeBtn) {
    activeBtn.classList.remove("rounded-full", "border-[#0E7A81]");
  }
  clickedBtn.classList.add("rounded-full", "border-[#0E7A81]");
  activeBtn = clickedBtn;
};

// Show adoption modal with a countdown
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
        pet_name,
        breed,
        date_of_birth,
        price,
        image,
        gender,
        pet_details,
        vaccinated_status,
      } = data.petData;

      // The HTML structure for the modal content
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
                <strong>Birth:</strong> ${date_of_birth}
            </p>
            <p class="flex items-center">
                <i class="fas fa-venus mr-2"></i>
                <strong>Gender:</strong> ${gender}
            </p>
            <p class="flex items-center">
                <i class="fas fa-dollar-sign mr-2"></i>
                <strong>Price:</strong> ${price}
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

      // Inject the modal content into the #modalContent div
      const detailsModal = document.getElementById("detailsModal");
      detailsModal.querySelector("#modalContent").innerHTML = modalContent;
      detailsModal.classList.remove("hidden"); // Show the modal
    } else {
      console.error("Failed to fetch pet details.");
    }
  } catch (error) {
    console.error("Error fetching pet details:", error);
  }
};

// Close the details modal
const closeDetailsModal = () => {
  const detailsModal = document.getElementById("detailsModal");
  detailsModal.classList.add("hidden");
  detailsModal.querySelector("#modalContent").innerHTML = ""; // Clear modal content when closed
};





// Initialize functions
loadCategories();
loadPetData();
