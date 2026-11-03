FOODIEHUB - OOP FOOD ORDERING PROJECT
======================================

WHAT IS THIS?
A Zomato-inspired, offline-friendly food ordering demo. It has a home page,
food categories, search, menu cards, cart, bill calculation and demo checkout.

HOW TO RUN (WINDOWS 10)
1. Extract the ZIP file.
2. Open the FoodieHub_OOP_Project folder.
3. Double-click index.html.
4. It opens in your browser. No installation, server or internet is required.
   (The font may use a default font when offline.)

HOW TO USE
- Click a category to filter dishes.
- Type in the search box to find food.
- Click + ADD to add food to your cart.
- Click Cart to view the order.
- Use + and - to change quantities.
- Click Place demo order to see the confirmation.

OOP CONCEPTS USED
1. Class and Object:
   MenuItem, Restaurant, Cart and FoodApp are classes.
   Each new MenuItem(...) and new Cart() creates an object.
2. Encapsulation:
   Cart manages its own item list through addItem(), changeQuantity(),
   getSubtotal(), getCount() and clear().
3. Constructors:
   constructor() initializes each object's data.
4. Abstraction:
   FoodApp hides the detailed steps of rendering and cart updates behind
   methods such as renderMenu(), updateCart() and checkout().
5. Object interaction:
   FoodApp uses Restaurant and Cart objects; Restaurant provides MenuItem
   objects to the app.

PROJECT STRUCTURE
index.html  - application structure
style.css   - design and responsive layout
app.js      - data, OOP classes and application behaviour
README.txt  - project guide

IMPORTANT
This is a front-end OOP demonstration using JavaScript classes. It does not
process real payments, connect to restaurants, or send real orders.
For a classroom demonstration, explain that the project applies OOP principles
in JavaScript. If your teacher specifically requires C++, ask for a C++ version.
