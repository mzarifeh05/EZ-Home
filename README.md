# EZ-Home

EZ-Home is a full-stack e-commerce website for browsing and ordering home products. Customers can discover products and categories, keep a wishlist, manage a cart, and place orders. Administrators have tools to manage the catalog and process orders.

**Live website:** [https://ez-homejo.onrender.com/](https://ez-homejo.onrender.com/)

## Features

### Shopping

- Browse the product catalog and available categories.
- Search products by name from the storefront.
- Open a product detail page, see related products, and choose a quantity.
- Add products to favorites, view the wishlist, and remove or clear saved items.
- Add products to the cart, change quantities, remove items, or clear the cart.
- Confirm an order by providing a city. The order is created from the cart and begins with a `pending` status.
- Sign up, sign in, log out, and update account details.

### Administration

- Manage products with create, read, update, and delete (CRUD) operations.
- Manage product categories with CRUD operations.
- View all customer orders and update an order's status. Supported statuses are `pending`, `paid`, and `shipped`.
- View the embedded analytics dashboard.

Admin-only API actions are protected by role-based access control (RBAC).

## Technology stack

This is a MERN stack project:

- **MongoDB** stores users, products, categories, carts, wishlists, and orders. **Mongoose** defines models and accesses the database.
- **Express.js** provides the REST API, with **Node.js** as the backend runtime.
- **React** builds the storefront and admin interface. **Vite** provides the frontend development server and production build.

Other technologies and implementation details:

- **React hooks:** `useState` and `useEffect` manage component state and data loading; `useNavigate` and `useParams` support navigation and product details; `useRef` is used for DOM/component references.
- **React Router** handles page navigation using a hash-based router.
- **Axios** makes API requests. A shared Axios client reads the JWT from `localStorage` and sends it as a Bearer token.
- **JWT** provides token-based authentication. **bcryptjs** hashes passwords.
- **RBAC** checks authenticated user roles in backend middleware before allowing admin operations.
- **CSS Modules** scope component and page styles.
- **Express middleware** includes request validation, Helmet security headers, CORS, HPP protection, and rate limiting.
- **Analytics:** Python scripts use **PyMongo** and **Pandas** to prepare MongoDB data for **Power BI** dashboards.

## Project structure

```text
Backend/    Express API, Mongoose models, routes, services, and middleware
Frontend/   React storefront and admin application
Analytics/  Python data collection scripts and Power BI dashboard assets
```
