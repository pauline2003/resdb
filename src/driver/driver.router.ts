import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIDriver, driver } from "../drizzle/schema";

export const driverService = async (limit?: number): Promise<TIDriver[] | null> => {
  if (limit) {
    return await db.query.driver.findMany({ limit });
  }
  return await db.query.driver.findMany();
};

export const createdriverService = async (newDriver: TIDriver) => {
  await db.insert(driver).values(newDriver);
  return true;
};

export const updatedriverService = async (id: number, updatedDriverData: TIDriver) => {
  const updatedDriver = await db.update(driver).set(updatedDriverData).where(eq(driver.id, id));
  return updatedDriver !== null;
};

export const deletedriverService = async (id: number) => {
  const deletedDriver = await db.delete(driver).where(eq(driver.id, id));
  return deletedDriver !== null;
};

// router.ts
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { driverSchema } from "../validators";
import {
  createDriver,
  deleteDriver,
  getDriver,
  listDriver,
  updateDriver,
  userdriverController,
} from "./driver.controller";

export const driversRouter = new Hono();

driversRouter.get("/drivers", listDriver);
driversRouter.get("/drivers/:id", getDriver);
driversRouter.post("/drivers", zValidator("json", driverSchema), createDriver);
driversRouter.put("/drivers/:id", zValidator("json", driverSchema), updateDriver);
driversRouter.delete("/drivers/:id", deleteDriver);

driversRouter.get("/user-drivers/:id", userdriverController);
