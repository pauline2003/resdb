
import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIDriver, TSDriver, driver } from "../drizzle/schema";

export const driverService = async (limit?: number): Promise<TSDriver[] | null> => {
    if (limit) {
        return await db.query.driver.findMany({
            limit: limit
        });
    }
    return await db.query.driver.findMany();
}

export const driveruserService = async (id: number) => {
    return await db.query.driver.findMany({
        columns: {
            carMake: true,
            carModel: true,
        },
        with: {
            user: {
                columns: {
                    name: true,
                    phone: true
                }
            },
        },
        where: eq(driver.id, id)
    });
};

export const createdriverService = async (User: TIDriver) => {
    await db.insert(driver).values(User)
    return "driver created successfully";
}

export const updatedriverService = async (id: number, driverData: TIDriver) => {
    await db.update(driver).set(driverData).where(eq(driver.id, id))
    return "driver updated successfully";
}

export const deletedriverService = async (id: number) => {
    await db.delete(driver).where(eq(driver.id, id))
    return "driver deleted successfully";
}
