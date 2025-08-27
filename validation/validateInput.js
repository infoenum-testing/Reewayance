// helpers/validateInput.js
export const validateInput = (type, value) => {
  let isValid = false;
  let errorMessage = "";

  const trimmedValue = value?.trim() || "";

  // 🔹 Empty check (common for all)
  if (!trimmedValue) {
    return { isValid: false, errorMessage: "This field is required" };
  }

  if (type === "name") {
    isValid = /^[A-Za-z ]+$/.test(trimmedValue);
    errorMessage = isValid ? "" : "Name must contain only letters";
  } else if (type === "email") {
    // ✅ Accepts all valid domains, not just .com
    isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue);
    errorMessage = isValid ? "" : "Please enter a valid email address";
  } else if (type === "password") {
    // ✅ Stronger password rule: min 8 chars
    isValid = trimmedValue.length >= 8;
    errorMessage = isValid ? "" : "Password must be at least 8 characters";
  } else {
    // For other fields
    isValid = trimmedValue.length > 0;
    errorMessage = isValid ? "" : "This field is required";
  }

  return { isValid, errorMessage };
};
