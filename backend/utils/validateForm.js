const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  
  const validateConfirmPassword = (password, confirmPassword) => {
    return password === confirmPassword;
  };
  
  module.exports = { validateEmail, validateConfirmPassword };
  