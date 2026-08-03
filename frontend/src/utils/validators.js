export function validatePassword(password) {

    const errors = [];

    if (password.length < 8)
        errors.push("Minimum 8 characters");

    if (!/[A-Z]/.test(password))
        errors.push("One uppercase letter required");

    if (!/[a-z]/.test(password))
        errors.push("One lowercase letter required");

    if (!/[0-9]/.test(password))
        errors.push("One number required");

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
        errors.push("One special character required");

    return errors;
}