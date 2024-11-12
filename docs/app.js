let sideBarParent = document.querySelector(".sidebar-div");
let sideBar = document.querySelector(".sidebar");
let body = document.querySelector("body");
let products = document.querySelector(".products"); // This is where all the categories will be placed
let closeSidebar = document.getElementById("close");
let menuBtn = document.getElementById("menu");

let isSidebarOpen = false; // Track sidebar state

let fetchedData = null; // Global variable to store fetched data

// Function to fetch the data once and store it in the global variable
async function fetchData() {
  try {
    const response = await fetch("products.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Store the fetched data in the global variable
    fetchedData = await response.json();
    console.log("Data fetched and stored:", fetchedData); // Optional: Log the fetched data

    // Once data is fetched, load products into the DOM
    loadProducts();
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

// Function to load all categories and products into the DOM dynamically
const loadProducts = () => {
  // Make sure we have fetched data and that 'Products' exists in the data
  if (
    !fetchedData ||
    !fetchedData.Products ||
    fetchedData.Products.length === 0
  ) {
    console.log("No products available to display.");
    return;
  }

  // Loop through the products and categories
  fetchedData.Products.forEach((product) => {
    // Loop through each category in the product
    for (let categoryName in product) {
      if (
        product.hasOwnProperty(categoryName) &&
        Array.isArray(product[categoryName])
      ) {
        const category = product[categoryName];

        // If the category has items, create a bulk-card for it
        if (category.length > 0) {
          // Create a new div for the bulk-card (each category gets its own card)
          const bulkCard = document.createElement("div");
          bulkCard.id = "bulk-card";

          // Create a title for the category
          const categoryTitle = document.createElement("h1");
          categoryTitle.id = "title";
          categoryTitle.textContent = categoryName
            .replace(/([A-Z])/g, " $1") // Format category name (e.g., "Official_Hoodies" -> "Official Hoodies")
            .trim();
          bulkCard.appendChild(categoryTitle);

          // Create a container for all items in the category
          const container = document.createElement("div");
          container.id = "container";

          // Loop through all items in the category
          category.forEach((item) => {
            const itemElement = document.createElement("div");
            itemElement.id = "item";

            // Create image element
            const img = document.createElement("img");
            img.src = item.Image;
            img.alt = item.Title;

            // Create title element
            const itemTitle = document.createElement("h3");
            itemTitle.classList.add("title");
            itemTitle.textContent = item.Title;

            // Append image, title, and price to the item
            itemElement.appendChild(img);
            itemElement.appendChild(itemTitle);

            // Append the item to the container
            container.appendChild(itemElement);
          });

          // Append the container with all items to the bulkCard div
          bulkCard.appendChild(container);

          // Append the bulkCard div to the products div
          products.appendChild(bulkCard);
        }
      }
    }
  });
};

// Sidebar toggle function
const toggleSidebar = () => {
  if (isSidebarOpen) {
    // Closing the sidebar
    sideBar.classList.remove("open");
    sideBar.classList.add("close"); // Slide it out
    setTimeout(() => {
      // Hide the overlay after the closing animation completes
      sideBarParent.classList.remove("visible");
      body.style.overflow = "auto"; // Re-enable body scroll
    }, 300); // Duration of sidebar closing transition
    setTimeout(() => {
      sideBarParent.style.display = "none";
    }, 500);
    isSidebarOpen = false; // Update state
  } else {
    // Opening the sidebar
    sideBar.classList.remove("close"); // Ensure it is not in the close state
    sideBar.classList.add("open"); // Slide it in
    setTimeout(() => {
      sideBarParent.classList.add("visible"); // Show overlay with fade-in
      body.style.overflow = "hidden"; // Disable body scroll
    }, 300); // Delay for sidebar sliding in before overlay appears
    setTimeout(() => {
      sideBarParent.style.display = "block";
    }, 500);
    isSidebarOpen = true; // Update state
  }
};

// Attach event listeners for sidebar toggle
menuBtn.addEventListener("click", toggleSidebar); // Open sidebar when menu button is clicked
closeSidebar.addEventListener("click", toggleSidebar); // Close sidebar when close button is clicked

// Optional: Close sidebar when clicking outside (on the overlay)
sideBarParent.addEventListener("click", (event) => {
  if (event.target === sideBarParent) {
    // Only close if the overlay itself (and not inside the sidebar) is clicked
    toggleSidebar();
  }
});

// Fetch the data when the page loads
fetchData();
