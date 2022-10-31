/**
 * Created by minhphan on 7/19/2017.
 */
const validatePhoneNumber = (phone) => {
    const stripped = phone.replace(/[\(\)\.\-\ ]/g, '');

    if (stripped === "") {
        return false;
    } else if (isNaN(parseInt(stripped))) {
        return false;
    } else if (!(stripped.length >= 10 && stripped.length <= 13)) {
        return false
    } else {
        return true;
    }
};
module.exports = validatePhoneNumber;