const pets = [
    {
        id: 1,
        name: "MILO",
        breed: "GOLDEN RETRIEVER",
    },

    {
        id: 2,
        name: "LUNA",
        breed: "PERSIAN CAT",
    },
];

export const getPets = () => {
    return pets;
};

export const addPet = (
    name,
    breed
) => {
    const newPet = {
        id: Date.now(),
        name,
        breed,
    };

    pets.push(newPet);

    return newPet;
};