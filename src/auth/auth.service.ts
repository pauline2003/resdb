import {
  AuthOnUsersTable,
  TIAuthOnUser,
  TSAuthOnUser,
} from "../drizzle/schema";
import db from "../drizzle/db";
import { sql } from "drizzle-orm";

export const createAuthUserService = async (
  user: TIAuthOnUser
): Promise<string | null> => {
  await db.insert(AuthOnUsersTable).values(user);
  return "User created successfully";
};

export const userLoginService = async (user: TSAuthOnUser) => {
  const { username, password } = user;
  return await db.query.AuthOnUsersTable.findFirst({
    columns: {
      username: true,
      role: true,
      password: true,
    },
    where: sql` ${AuthOnUsersTable.username} = ${username}`,
    with: {
      user: {
        columns: {
          name: true,
          phone: true,
          phoneVerified: true,
          id: true,
        },
      },
    },
  });
};

export const getEmailByUserId = async (id: number): Promise<string | null> => {
  const result = await db.query.user.findFirst({
    columns: {
      email: true,
    },
    where: (usr, { eq }) => eq(usr.id, id),
  });

  if (!result) {
    return null;
  }

  return result.email;
};
