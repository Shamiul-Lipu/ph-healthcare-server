import { Admin, Prisma, UserStatus } from "@prisma/client";
import { adminSearchableFields } from "./admin.constant";
import { paginationHelper } from "../../../helper/paginationHelper";
import prisma from "../../../shared/prisma";

const getAllAdmin = async (params: any, options: any) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.AdminWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: adminSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  andConditions.push({
    isDeleted: false,
  });

  // console.dir(andConditions, {depth: "infinity"})
  const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };

  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.admin.count({
    where: whereConditions,
  });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<Admin>
): Promise<Admin | null> => {
  await prisma.admin.findFirstOrThrow({
    where: { id, isDeleted: false },
  });

  const result = await prisma.admin.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteFromDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findFirstOrThrow({
    where: { id },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.admin.delete({
      where: {
        id,
      },
    });

    const userDeletedData = await transactionClient.user.delete({
      where: {
        email: adminDeletedData.email,
      },
    });

    return adminDeletedData;
  });

  return result;
};

const softDeleteFromDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findFirstOrThrow({
    where: { id, isDeleted: false },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.admin.update({
      where: {
        id,
      },
      data: { isDeleted: true },
    });

    await transactionClient.user.update({
      where: {
        email: adminDeletedData.email,
      },
      data: { status: UserStatus.DELETED },
    });

    return adminDeletedData;
  });

  return result;
};

export const adminServices = {
  getAllAdmin,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};