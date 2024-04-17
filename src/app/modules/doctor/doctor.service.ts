import prisma from "../../../shared/prisma";

const updateDoctor = async (id: string, payload: any) => {
  const { specialities, ...doctorData } = payload;

  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: { id },
  });

  await prisma.$transaction(async (transactionClient) => {
    // update doctor data
    await transactionClient.doctor.update({
      where: { id },
      data: doctorData,
    });

    // updatte doctor specialites

    if (specialities && specialities.length > 0) {
      // delete specialities
      const deleteSpecialitesIds = specialities.filter(
        (speciality: any) => speciality.isDeleted
      );
      for (const speciality of deleteSpecialitesIds) {
        await transactionClient.doctorSpecialites.deleteMany({
          where: {
            doctorId: doctorInfo.id,
            specialitiesId: speciality.specialitiesId,
          },
        });
      }

      // create specilites
      const createSpecialitesIds = specialities.filter(
        (speciality: any) => !speciality.isDeleted
      );
      for (const speciality of createSpecialitesIds) {
        await transactionClient.doctorSpecialites.create({
          data: {
            doctorId: doctorInfo.id,
            specialitiesId: speciality.specialitiesId,
          },
        });
      }
    }
  });

  const result = await prisma.doctor.findUniqueOrThrow({
    where: { id: doctorInfo.id },
    include: {
      doctorSpecialites: {
        include: { specialities: true },
      },
    },
  });

  return result;
};

export const DoctorServices = {
  updateDoctor,
};
