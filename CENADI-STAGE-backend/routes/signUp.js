const express = require("express");
const router = express.Router();
const db = require("../dbConnection");
const { signUpValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../authMiddleware"); 
const { Result } = require("express-validator");


router.post("/signUp",authMiddleware, (req, res) => {
   const { MATRICULE, PASSWORD, ACCESS } = req.body;
//  console.log(req.body)
    // Vérifier si le matricule existe déjà dans la table `personnel`
    db.query(`SELECT * FROM agt WHERE "matricule"=$1`, [MATRICULE], (err, results) => {
      if (err) {
  
      //  console.error('Erreur lors de la vérification du matricule :', err);
        return res.status(500).json({ error: 'Une erreur est survenue lors de la vérification du matricule' });
      }
      //return res.status(200).json({ matricule: MATRICULE });
  
      if (results.rows.length > 0) {
        // Le matricule existe déjà dans la table `personnel`, procéder à l'insertion dans la table `admin`
        async function encryptPassword(password) {
          try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(PASSWORD, salt);
            return hashedPassword;
          } catch (error) {
            console.error("Erreur lors du hachage du mot de passe :", error);
            throw error;
          }
        }
       

        encryptPassword(PASSWORD)
          .then((hashedPassword) => {
            // return res.status(500).json({ error: hashedPassword });
            const data = {
              matricule: MATRICULE,
              password: hashedPassword,
              Access: ACCESS,
            };

          // console.log(data);
  
           db.query(`SELECT * FROM "admin" WHERE "matricule" = $1`, [data.matricule], (err, result) => {
              if (err) {
             //   console.error("Erreur lors de l'insertion des données :", err);
                // return res.status(500).json({ error: result });
                return res.status(401).send({
                  msg: "Erreur lors de l'insertion des données",
                });
              } 
              if (result.rows.length === 0)  {

               // return res.status(200).json({ matricule: result.rows.length });
               db.query(`SELECT * FROM "admin"`, (err, result) => {
                if (err) {
                 // console.error("Erreur lors de l'insertion des données :", err);
                  return res.status(401).send({
                    msg: "Erreur lors de l'insertion des données",
                  });
                } else {
                  //return res.status(200).json({ matricule: result.rows.length });
                  db.query(`INSERT INTO admin ( "matricule", "password", "Access") VALUES ($1, $2, $3)`, [ data.matricule, data.password, data.Access], (err, result) => {
                    // return res.status(200).json({ matricule: data });
                    if (err) {
                     // console.error("Erreur lors de l'insertion des données :", err);
                      return res.status(401).json({
                        msg: "Erreur lors de l'insertion des données doc",
                        erreur:err
                      });
                    } else {
                    //  console.log("Données insérées avec succès");
                      return res.status(200).json({
                        msg: "L'administrateur a été crée", //pourquoi connexion réussie
                        user: data,
                      });
                    }
                  });
                }
              });

                
              }else {
                //  console.log("Données insérées avec succès");
                  return res.status(404).send({
                    msg: "L'administrateur a déjà un compte", //pourquoi connexion réussie
                    user: data,
                  });
                }
            }); 
          })
          .catch((error) => {
           // console.error("Erreur lors du hachage du mot de passe :", error);
            return res.status(500).json({ error: 'Une erreur est survenue lors du hachage du mot de passe' });
          });
      } else {
        // Le matricule n'existe pas dans la table `personnel`, renvoyer une réponse d'erreur
        return res.status(400).json({ error: 'Le matricule n\'existe pas' });
      }
    });
     // db.end();
    });
    

module.exports = router;
