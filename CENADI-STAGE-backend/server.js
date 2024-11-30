const createError = require("http-errors");
const nodemon = require('nodemon');
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const indexRouter = require("./routes/all_presence");
const login = require("./routes/login");
const signUp = require("./routes/signUp");
const modifier = require("./routes/modifier");
const acceptPermission = require("./routes/acceptPermission");
const suprimer = require("./routes/suprimer");
const assiduiter = require("./routes/assiduiter");
const absence = require("./routes/absence");
const chef_div = require("./routes/chef_div");
const permision = require("./routes/permision");
const permissions = require("./routes/permissions");
const personnel = require("./routes/personnel");
const form_permision = require("./routes/form_permision");
const form_presence = require("./routes/matricule");
const search = require("./routes/search");
const presence = require("./routes/presence");
const absen = require("./routes/absen");
const update = require("./routes/update");
const all_permision = require("./routes/all_permision");
const assidus = require("./routes/10_assidus");
const moins = require("./routes/10_moins");
const token = require("./routes/token");
const suprimerPer = require("./routes/suprimerPer");
const all_absen = require("./routes/all_absen");
const insertPresence = require("./routes/insertPresence");
const updatepe = require("./routes/updatepe");
const all_assidus = require("./routes/all_assidus");
const form_conge = require("./routes/form_conge");
const division = require("./routes/1_division");
const div = require("./routes/last_division");
const conge = require("./routes/all_conge");
const conger = require("./routes/conge");
const admin = require("./routes/all_admin");
const sup= require("./routes/suprimeradmin");
const app = express();

app.use(express.json());

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());

// Middleware authMiddleware
const authMiddleware = (req, res, next) => {
  // Votre logique de middleware ici
  // Par exemple, vérification de l'authentification de l'utilisateur
  if (req.headers.authorization) {
    // L'utilisateur est authentifié, continuez vers la prochaine étape
    next();
  } else {
    // L'utilisateur n'est pas authentifié, renvoyez une erreur
    res.status(401).json({ message: "Unauthorized" });
  }
};

app.use("/api", indexRouter);
app.use("/api", login);
app.use("/api", signUp);
app.use("/api", modifier);
app.use("/api", suprimer);
app.use("/api", assiduiter);
app.use("/api", absence); 
app.use("/api", chef_div);
app.use("/api", permision);
app.use("/api", permissions); 
app.use("/api", token);
app.use("/api", suprimerPer); 
app.use("/api", personnel);
app.use("/api", form_permision);
app.use("/api", form_presence);
app.use("/api", insertPresence);
app.use("/api", search);
app.use("/api", presence); 
app.use("/api", absen);
app.use("/api", update);
app.use("/api", all_permision);
app.use("/api", assidus);
app.use("/api", moins);
app.use("/api", all_absen);
app.use("/api", all_assidus);
app.use("/api", updatepe);
app.use("/api", acceptPermission);
app.use("/api", form_conge);
app.use("/api", division);
app.use("/api", div);
app.use("/api", conger);
app.use("/api", conge);
app.use("/api", admin);
app.use("/api", sup);
// Gestion des erreurs
app.use((err, req, res, next) => {
  // console.log(err);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({
    message: err.message,
  });
});

app.listen(3000, () => console.log("Le serveur fonctionne sur le port 3000"));
