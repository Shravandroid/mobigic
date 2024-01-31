const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const excludeRoutes = ["/user", "/login"];
  if (req.method == "POST" && excludeRoutes.includes(req.url)) {
    next();
  } else {
    const token = req.headers.authorization || req.headers.Authorization;
    if (!token) {
      res.status(401).send({ message: "Unauthorized" });
    }
    const tokenString = token.split(" ")[1];

    try {
      const tokenPayload = jwt.verify(tokenString, process.env.JWT_PRIVATE_KEY);
      req.userId = tokenPayload.sub;
      next();
    } catch (error) {
      return res.status(401).send(error);
    }
  }
}

module.exports = { auth };
