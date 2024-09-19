

export const fieldsForReservations = {
    user: {
        select: {
            id: true,
            identificationNumber: true,
            email: true,
            names: true,
            lastNames: true,
            role: true
        }
    },
    room: {
        select: {
            id: true,
            name: true,
            capacity: true,
            location: true,
            roomType: true,
        }
    }
};