// FOODIEHUB - Object-Oriented Programming Demonstration
// The application works offline. All ordering is simulated.

class MenuItem {
  constructor(id, name, category, price, emoji, description, rating, tag) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.price = price;
    this.emoji = emoji;
    this.description = description;
    this.rating = rating;
    this.tag = tag;
  }
  getDetails() {
    return `${this.name} - ₹${this.price}`;
  }
}

class Restaurant {
  constructor(name, menuItems) {
    this.name = name;
    this.menuItems = menuItems;
  }
  getMenu() {
    return this.menuItems;
  }
}

// Cart demonstrates encapsulation: item data is managed through methods.
class Cart {
  constructor() {
    this.items = [];
  }
  addItem(menuItem) {
    const existing = this.items.find(entry => entry.item.id === menuItem.id);
    if (existing) existing.quantity++;
    else this.items.push({ item: menuItem, quantity: 1 });
  }
  changeQuantity(itemId, change) {
    const entry = this.items.find(row => row.item.id === itemId);
    if (!entry) return;
    entry.quantity += change;
    if (entry.quantity <= 0) this.items = this.items.filter(row => row.item.id !== itemId);
  }
  getSubtotal() {
    return this.items.reduce((sum, row) => sum + row.item.price * row.quantity, 0);
  }
  getCount() {
    return this.items.reduce((sum, row) => sum + row.quantity, 0);
  }
  clear() {
    this.items = [];
  }
}

// FoodApp coordinates the objects and handles the user interface.
class FoodApp {
  constructor(restaurant) {
    this.restaurant = restaurant;
    this.cart = new Cart();
    this.activeCategory = "All";
    this.searchTerm = "";
    this.renderCategories();
    this.renderMenu();
    this.bindEvents();
    this.updateCart();
  }

  renderCategories() {
    const categories = [
      { name: "All", emoji: "🍽️" }, { name: "Pizza", emoji: "🍕" },
      { name: "Burgers", emoji: "🍔" }, { name: "Indian", emoji: "🍛" },
      { name: "Desserts", emoji: "🍰" }, { name: "Drinks", emoji: "🥤" }
    ];
    document.getElementById("categories").innerHTML = categories.map(category => `
      <button class="category ${category.name === this.activeCategory ? "active" : ""}" data-category="${category.name}">
        <span class="emoji">${category.emoji}</span><strong>${category.name}</strong>
      </button>`).join("");
    document.querySelectorAll(".category").forEach(button => {
      button.addEventListener("click", () => {
        this.activeCategory = button.dataset.category;
        this.renderCategories();
        this.renderMenu();
      });
    });
  }

  renderMenu() {
    let items = this.restaurant.getMenu();
    if (this.activeCategory !== "All") items = items.filter(item => item.category === this.activeCategory);
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      items = items.filter(item => item.name.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term) || item.description.toLowerCase().includes(term));
    }
    document.getElementById("resultCount").textContent = `${items.length} delicious choices`;
    document.getElementById("emptyState").classList.toggle("hidden", items.length !== 0);
    document.getElementById("foodGrid").innerHTML = items.map(item => `
      <article class="food-card">
        <div class="food-image"><span class="tag">${item.tag}</span>${item.emoji}</div>
        <div class="food-info"><div class="food-title-row"><h3>${item.name}</h3><span class="rating">★ ${item.rating}</span></div>
          <p>${item.description}</p><div class="food-bottom"><span class="price">₹${item.price}</span>
          <button class="add-button" data-add="${item.id}">+ ADD</button></div></div>
      </article>`).join("");
    document.querySelectorAll("[data-add]").forEach(button => {
      button.addEventListener("click", () => this.addToCart(Number(button.dataset.add)));
    });
  }

  addToCart(itemId) {
    const item = this.restaurant.getMenu().find(food => food.id === itemId);
    if (item) this.cart.addItem(item);
    this.updateCart();
  }

  updateCart() {
    document.getElementById("cartCount").textContent = this.cart.getCount();
    document.getElementById("subtotal").textContent = `₹${this.cart.getSubtotal()}`;
    const delivery = this.cart.getCount() ? 25 : 0;
    document.getElementById("delivery").textContent = `₹${delivery}`;
    document.getElementById("total").textContent = `₹${this.cart.getSubtotal() + delivery}`;
    const container = document.getElementById("cartItems");
    if (!this.cart.items.length) {
      container.innerHTML = '<p class="empty-state">Your cart is empty.<br>Find something delicious!</p>';
      return;
    }
    container.innerHTML = this.cart.items.map(row => `
      <div class="cart-line"><span class="cart-emoji">${row.item.emoji}</span>
        <div class="cart-line-info"><strong>${row.item.name}</strong><small>₹${row.item.price} each</small></div>
        <div class="qty"><button data-qty="${row.item.id}" data-change="-1">−</button><b>${row.quantity}</b><button data-qty="${row.item.id}" data-change="1">+</button></div>
      </div>`).join("");
    container.querySelectorAll("[data-qty]").forEach(button => {
      button.addEventListener("click", () => {
        this.cart.changeQuantity(Number(button.dataset.qty), Number(button.dataset.change));
        this.updateCart();
      });
    });
  }

  openCart() {
    document.getElementById("overlay").classList.remove("hidden");
    document.getElementById("cartDrawer").classList.add("open");
  }
  closeCart() {
    document.getElementById("overlay").classList.add("hidden");
    document.getElementById("cartDrawer").classList.remove("open");
  }

  checkout() {
    if (!this.cart.getCount()) {
      alert("Your cart is empty. Add a dish before placing an order!");
      return;
    }
    const count = this.cart.getCount();
    const total = this.cart.getSubtotal() + 25;
    document.getElementById("successMessage").textContent =
      `Your demo order of ${count} item(s), worth ₹${total}, has been confirmed. Thank you!`;
    this.cart.clear();
    this.updateCart();
    this.closeCart();
    document.getElementById("successModal").classList.remove("hidden");
  }

  bindEvents() {
    document.getElementById("cartButton").addEventListener("click", () => this.openCart());
    document.getElementById("closeCart").addEventListener("click", () => this.closeCart());
    document.getElementById("overlay").addEventListener("click", () => this.closeCart());
    document.getElementById("checkoutButton").addEventListener("click", () => this.checkout());
    document.getElementById("doneButton").addEventListener("click", () =>
      document.getElementById("successModal").classList.add("hidden"));
    const search = () => {
      this.searchTerm = document.getElementById("searchInput").value.trim();
      this.activeCategory = "All";
      this.renderCategories();
      this.renderMenu();
    };
    document.getElementById("searchButton").addEventListener("click", search);
    document.getElementById("searchInput").addEventListener("input", search);
  }
}

const menu = [
  new MenuItem(1, "Classic Cheese Pizza", "Pizza", 249, "🍕", "Loaded with mozzarella and fresh herbs", "4.8", "BESTSELLER"),
  new MenuItem(2, "Farmhouse Pizza", "Pizza", 299, "🍕", "Garden-fresh veggies with a cheesy base", "4.7", "POPULAR"),
  new MenuItem(3, "Crispy Veg Burger", "Burgers", 149, "🍔", "Crunchy patty, lettuce and house sauce", "4.6", "CHEF'S PICK"),
  new MenuItem(4, "Double Cheese Burger", "Burgers", 199, "🍔", "Double cheese, double happiness", "4.9", "MUST TRY"),
  new MenuItem(5, "Paneer Butter Masala", "Indian", 229, "🍛", "Creamy tomato gravy with soft paneer", "4.8", "POPULAR"),
  new MenuItem(6, "Masala Dosa", "Indian", 129, "🥞", "Golden crisp dosa with potato masala", "4.5", "CLASSIC"),
  new MenuItem(7, "Chocolate Brownie", "Desserts", 99, "🍫", "Rich, fudgy and freshly baked", "4.9", "SWEET PICK"),
  new MenuItem(8, "Strawberry Pastry", "Desserts", 119, "🍰", "Soft sponge with strawberry cream", "4.7", "FRESH"),
  new MenuItem(9, "Cold Coffee", "Drinks", 89, "🥤", "Chilled coffee topped with creamy foam", "4.6", "COOL"),
  new MenuItem(10, "Fresh Lemonade", "Drinks", 69, "🍹", "Refreshing lemon with a mint twist", "4.5", "REFRESHING")
];

const foodieHub = new FoodApp(new Restaurant("FoodieHub Kitchen", menu));
