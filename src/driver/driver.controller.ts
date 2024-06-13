import { Context } from "hono";
import { createdriverService, driveruserService, deletedriverService, driverService, updatedriverService } from "./driver.service";

export const listDriver = async (c: Context) => {
    try {
        const limit = Number(c.req.query('limit'))
        const data = await driverService(limit);
        if (!data || data.length === 0) {
            return c.text("Driver not found", 404);
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}

export const getDriver = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const driver = await driverService(id);
    if (!driver) {
        return c.text("Driver not found", 404);
    }
    return c.json(driver, 200);
}

export const createDriver = async (c: Context) => {
    try {
        const newDriver = await c.req.json();
        const createdDriver = await createdriverService(newDriver);
        if (!createdDriver) return c.text("Driver not created", 404);
        return c.json({ msg: "Driver created successfully" }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}

export const updateDriver = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
        const updatedDriverData = await c.req.json();
        const updatedDriver = await updatedriverService(id, updatedDriverData);
        if (!updatedDriver) return c.text("Driver not updated", 404);
        return c.json({ msg: "Driver updated successfully" }, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}

export const deleteDriver = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
        const deletedDriver = await deletedriverService(id);
        if (!deletedDriver) return c.text("Driver not deleted", 404);
        return c.json({ msg: "Driver deleted successfully" }, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}

export const userdriverController = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
        const userDetails = await driveruserService(id);
        if (!userDetails || userDetails.length === 0) {
            return c.text("User not found", 404);
        }
        return c.json(userDetails, 200);
    } catch (error) {
        console.error(error);
        return c.text("Internal Server Error", 500);
    }
};