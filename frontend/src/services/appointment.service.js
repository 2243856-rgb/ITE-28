const appointments = [
    {
        id: 1,
        petName: "MILO",
        date: "MAY 20",
        service: "CHECKUP",
    },
];

export const getAppointments =
    () => {
        return appointments;
    };

export const createAppointment = (
    petName,
    date,
    service
) => {
    const newAppointment = {
        id: Date.now(),
        petName,
        date,
        service,
    };

    appointments.push(
        newAppointment
    );

    return newAppointment;
};