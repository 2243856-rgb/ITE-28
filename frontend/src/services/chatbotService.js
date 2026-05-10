export const sendMessageToBot = (
    message
) => {
    const lower =
        message.toLowerCase();

    if (
        lower.includes("dog")
    ) {
        return "DOGS NEED DAILY EXERCISE.";
    }

    if (
        lower.includes("cat")
    ) {
        return "CATS REQUIRE CLEAN LITTER.";
    }

    if (
        lower.includes("food")
    ) {
        return "AVOID OVERFEEDING PETS.";
    }

    return "I AM READY TO HELP.";
};