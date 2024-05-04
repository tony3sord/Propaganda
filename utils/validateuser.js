import User from "../models/users.js";

const validate = async (email, user) => {
  const validate_email = await User.findOne({ email });
  const validate_user = await User.findOne({ user });

  if (validate_email != null) {
    return validate_email;
  } else if (validate_user != null) {
    return validate_user;
  } else {
    return false;
  }
};

export default validate;
