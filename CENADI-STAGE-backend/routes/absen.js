const express = require('express');
const router = express.Router();
const db  = require('../dbConnection');
const authMiddleware = require('../authMiddleware');
 
router.post('/absen',authMiddleware, (req, res, next) => {
 // Récupérer l'heure d'arrivée et l'heure de départ depuis la base de données MySQL
 const division = req.body.DIVISION; // Récupérer l'ID de l'employé depuis le paramètre d'URL 'id'
 const dateA = new Date(req.body.DATEARRIVER); // Récupérer l'ID de l'employé depuis le paramètre d'URL 'id'
 const dateD = new Date(req.body.DATEDEPART); // Récupérer l'ID de l'employé depuis le paramètre d'URL 'id'
 //recuperons le nombre d'employes dans une division donnee
// console.log(division)
                    db.query(`SELECT
                    agt."matricule",
                    agt."nom",
                    agt."prenom",
                    agt."division",
                    dates_absence."date"
                   FROM
                    agt
                   CROSS JOIN
                    (
                      SELECT
                        "date"
                      FROM
                        generate_series(
                          DATE_TRUNC('month', $1::date) + INTERVAL '1 DAY',
                          DATE_TRUNC('month', $2::date) + INTERVAL '1 MONTH' - INTERVAL '1 DAY',
                          INTERVAL '1 DAY'
                        ) AS "date"
                      WHERE
                        "date" BETWEEN $1 AND $2
                        
                    ) AS dates_absence
                   LEFT JOIN
                    presences ON presences."matricule" = agt."matricule" AND presences."date" = dates_absence."date"
                   WHERE
                     presences."matricule" IS NULL
                     AND
                     agt."division"=$3  
                   ORDER BY
                     dates_absence."date" DESC;`,
                      [ dateA, dateD, division ], (err, result) => {
                        if (err) {
                          throw err;
                        }
                        //return res.status(200).json({ resultat: result.rows });
                    
                        if (result.rows) {
                          return res.status(200).json({ 
                           
                            tauxAbsencePersonnel: result.rows
                          })
                        } else {
                          return res.status(500).json({ erreur: 'une erreur est survenue sur le calcul des ABSENCE personnelles' })
                        }
                      });
                    // return res.status(200).json({ tauxAssiduite: tauxAssiduite })
                   
                  });
              
 
module.exports = router;