import { UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";

const createAdmin = async (payload: any) => {
  const hashedPassword: string = await bcrypt.hash(payload.password, 12);

  const userData = {
    email: payload.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    // creating user
    await transactionClient.user.create({
      data: userData,
    });
    // creating admin
    const createAdminData = await transactionClient.admin.create({
      data: payload.admin,
    });

    return createAdminData;
  });

  return result;
};

export const userServices = {
  createAdmin,
};
