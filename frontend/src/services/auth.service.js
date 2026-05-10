const demoUser = {
    email: "admin",
    password: "admin",
};

export const loginUser = (
    email,
    password
) => {
    if (
        email === demoUser.email &&
        password === demoUser.password
    ) {
        return {
            success: true,
            user: {
                name: "ADMIN",
                email,
            },
        };
    }

    return {
        success: false,
        message: "INVALID CREDENTIALS",
    };
};

export const registerUser = (
    name,
    email,
    password
) => {
    return {
        success: true,

        user: {
            name,
            email,
        },
    };
};