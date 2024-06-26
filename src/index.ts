import { serve } from "@hono/node-server";
import { Hono } from "hono";
import "dotenv/config";
import { logger } from "hono/logger";
import { csrf } from "hono/csrf";
import { trimTrailingSlash } from "hono/trailing-slash";
import { HTTPException } from "hono/http-exception";
import { rateLimiter } from "hono-rate-limiter";
import { jwt } from "hono/jwt";

import { userRouter } from "./users/user.router";
import { restaurantRouter } from "./restaurant/restaurant.router";
import { statusCatalogRouter } from "./statusCatalog/statuscatalog.router";
import { orderRouter } from "./orders/orders.router";
import { stateRouter } from "./state/state.router";
import { AddressRouter } from "./address/address.router";
// import { categoryRouter } from './category/category.router'
import { cityRouter } from "./city/city.router";
import { categoryRouter } from "./category/category.router";
import { commentsRouter } from "./comments/comments.router";
import { driversRouter } from "./driver/driver.router";
import { menuItemRouter } from "./menu_item/menu_item.router";
import { orderMenuItemRouter } from "./order_menu_item/order_menu_item.router";
import { orderStatusRouter } from "./order_status/order_status.router";
import { restaurantOwnerRouter } from "./restaurant_owner/restaurant_owner.router";
import { authRouter } from "./auth/auth.router";

const app = new Hono();
// rate limiter
const limiter = rateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 10, // Limit each IP to 100 requests per `window`
  standardHeaders: "draft-6", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  keyGenerator: (c) => "<unique_key>", // Method to generate custom identifiers for clients.
  // store: ... , // Redis, MemoryStore, etc. See below.
});

// inbuilt middlewares
app.use(logger()); //logs request and response to the console
app.use(csrf()); //prevents CSRF attacks by checking request headers.
app.use(trimTrailingSlash()); //removes trailing slashes from the request URL
//3rd party middlewares

app.use(limiter); // Apply the rate limiting middleware to all requests.

// JWT Middleware for authentication
app.use(
  "/api/*",
  jwt({
    secret: process.env.JWT_SECRET as string,
  })
);

// default route
app.get('/', (c) => {
  return c.html(
    `
 <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>paline hot dishes</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }

        .container {
            text-align: center;
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            font-size: 2em;
            margin-bottom: 10px;
        }

        .emoji {
            font-size: 1.5em;
        }

        p {
            font-size: 1.1em;
            color: #555;
        }

        footer {
            margin-top: 20px;
            font-size: 0.9em;
            color: #aaa;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome paulines' hot dishes </h1>
        <p>From Our Kitchen to Your Heart </p>
        <p class="emoji">🍟</p>
        <footer>© 2024 paulines mwaura</footer>
    </div>
</body>
</html>


    `)
})

// my custom  routes
app.route("/", userRouter); // /users
app.route("/", categoryRouter); // /cities
app.route("/", restaurantRouter); //restaurants
app.route("/", statusCatalogRouter); //catalogs
app.route("/", orderRouter); //orders
app.route("/", cityRouter); //categories
app.route("/", stateRouter); //states
app.route("/", AddressRouter); //address
app.route("/", commentsRouter); //comments
app.route("/", driversRouter); //drivers
app.route("/", menuItemRouter); //menuItemRouter
app.route("/", orderMenuItemRouter); //orderMenuItemRouter
app.route("/", orderStatusRouter); //orderStatusRouter
app.route("/", restaurantOwnerRouter); //restaurantOwnerRouter
app.route("/auth", authRouter); // Authentication routes

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT),
});
console.log(`Server is running on port ${process.env.PORT}`);
