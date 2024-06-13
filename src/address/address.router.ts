import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { addressSchema } from "../validators";
import {
  createAddress,
  deleteAddress,
  getAddress,
  listAddress,
  searchAddress,
  updateAddress,
} from "./adress.controller";
import {
  adminRoleAuth,
  bothRoleAuth,
  userRoleAuth,
} from "../middleware/bearAuth";
import { user } from "../drizzle/schema";
export const AddressRouter = new Hono();

//get all address
AddressRouter.get("/address", bothRoleAuth, listAddress);
//get a single address
AddressRouter.get("/address/:id", userRoleAuth, getAddress);
// create a address
AddressRouter.post(
  "/address",
  zValidator("json", addressSchema, (result, c) => {
    if (!result.success) {
      return c.json(result.error, 400);
    }
  }),
  adminRoleAuth,
  createAddress
);
//update aaddress
AddressRouter.put("address/:id", adminRoleAuth, updateAddress);

AddressRouter.delete("/address/:id", adminRoleAuth, deleteAddress);
