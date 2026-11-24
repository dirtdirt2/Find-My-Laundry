export const handleLogin = (email, password) => {
    if (!email || !password) {
        return {
            success: false,
            message: "Please fill in all fields."
        };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return {
            success: false,
            message: "Please enter a valid email address."
        };
    }

    return {
        success: true,
        message: "Login form submitted successfully."
    };
};