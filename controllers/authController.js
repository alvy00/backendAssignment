require('dotenv').config();

const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.split("Bearer ")[1]
    : null;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized. Invalid token." });
  }
};

module.exports = checkAuth;
















// const supabase = require("../config/supabaseClient");

// const checkAuth = async (req, res, next) => {
//   const token = req.headers["authorization"]?.split("Bearer ")[1];

//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized. No token provided." });
//   }

//   try {
//     // Fetch user using the Supabase client's auth API
//     const { data: user, error } = await supabase.auth.api.getUser(token);

//     if (error || !user) {
//       return res.status(401).json({ message: "Unauthorized. Invalid token." });
//     }

//     // Attach the user to the request object
//     req.user = user;
//     next();
//   } catch (err) {
//     return res.status(500).json({ message: "Internal server error", error: err.message });
//   }
// };

// module.exports = checkAuth;
