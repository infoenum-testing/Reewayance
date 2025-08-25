export const validateInput = (type, value) => {
    let isValid = false;
    let errorMessage = "";

    if (type === "name") {
        isValid = /^[A-Za-z ]+$/.test(value?.trim() || "");
        errorMessage = "Name must contain only letters";
    } else if (type === "email") {
        isValid = /\S+@\S+\.com$/.test(value?.trim() || "");
        errorMessage = "Please enter a valid email (must include @ and .com)";
    } else if (type === "password") {
        isValid = value?.length >= 8;
        errorMessage = "Password must be at least 8 characters";
    } else {
        isValid = value?.trim()?.length > 0;
        errorMessage = "This field is required";
    }

    return { isValid, errorMessage };
};
