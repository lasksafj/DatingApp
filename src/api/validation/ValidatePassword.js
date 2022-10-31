/**
 * Created by minhphan on 7/19/2017.
 */
const validatePassword = (pass) => {
    //a password between 6 to 20 characters which contain at least one numeric digit, one uppercase, and one lowercase letter
    const pass_valid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    return (pass.match(pass_valid));
};
module.exports = validatePassword;