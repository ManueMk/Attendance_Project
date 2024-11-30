const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, "the-super-strong-secrect", (err, decoded) => {
      if (err) {
        //return res.status(401).json({ message: err });
        // Le token est invalide ou a expiré
        if (err.name === "TokenExpiredError") {
          const refreshToken = req.cookies.refreshToken;

          if (!refreshToken) {
            return res.status(401).json({ message: "Accès non autorisé. Token invalide ou expiré." });
          }

          jwt.verify(refreshToken, "the-super-strong-refresh-secrect", (err, decoded) => {
            if (err) {
              return res.status(401).json({ message: "Accès non autorisé. Token invalide ou expiré." });
            }

            // Générez un nouveau token
            const newToken = jwt.sign({ id: decoded.id }, "the-super-strong-secrect", {
              expiresIn: "1h",
            });

            // Ajoutez le nouveau token à la réponse
            res.setHeader("Authorization", `Bearer ${newToken}`);
          });
        } else {
          return res.status(401).json({ message: "Accès non autorisé. Token invalide." });
        }
      }

      // Ajoutez les informations de l'utilisateur à la requête pour une utilisation ultérieure
      req.user = decoded;
      next();
    });
  } else {
    return res.status(401).json({ message: "Accès non autorisé. Token manquant." });
  }
};

module.exports = authMiddleware;