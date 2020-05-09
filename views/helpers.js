module.exports = {
  getError(errors, prop) {
    // prop === 'email' || 'password' || passwordConformation
    try {
      return errors.mapped()[prop].msg;
    } catch (err) {
      return "";
    }
  },
};
