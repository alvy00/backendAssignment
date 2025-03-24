const supabase = require("../config/supabaseClient");

const checkAuth = async (req, res, next) => {
  const token = req.headers["authorization"]?.split("Bearer ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized. No token provided." });
  }

  const { data: user, error } = await supabase.auth.api.getUser(token);

  if (error || !user) {
    return res.status(401).json({ message: "Unauthorized. Invalid token." });
  }

  req.user = user;
  next();
};

module.exports = checkAuth;
