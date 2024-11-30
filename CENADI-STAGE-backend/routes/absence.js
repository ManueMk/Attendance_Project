const express = require('express');
const router = express.Router();
const db  = require('../dbConnection');
const authMiddleware = require('../authMiddleware');
 
router.post('/absence',authMiddleware, (req, res, next) => {
 // Récupérer l'heure d'arrivée et l'heure de départ depuis la base de données MySQL
 const division = req.body.DIVISION; // Récupérer l'ID de l'employé depuis le paramètre d'URL 'id'
 const dateA = new Date(req.body.DATEARRIVER); // Récupérer l'ID de l'employé depuis le paramètre d'URL 'id'
 const dateD = new Date(req.body.DATEDEPART); // Récupérer l'ID de l'employé depuis le paramètre d'URL 'id'
 //recuperons le nombre d'employes dans une division donnee
 db.query(`SELECT COUNT(*) AS nombreEmploye
 FROM "agt"
 WHERE "division" = $1;`, [division], (err, result) => {
  if (err) {
    throw err;
  }

  if (result.rows) {
    //return res.status(200).json({ nombreEmployes: result.rows });
    //recuperons le nombre de presence de cette division dans la table presence
    const nombreEmployes = result.rows[0].nombreemploye;

    db.query(`SELECT COUNT(*) AS nombrePresence
    FROM "presences"
    INNER JOIN "agt" ON "presences"."matricule" = "agt"."matricule"
    WHERE "agt"."division" = $1
    AND "presences"."date" BETWEEN $2 AND $3;`,
     [ division,dateA,dateD ], (err, result) => {
      if (err) {
        return res.status(404).send({
          msg: err,
        });
      }
      const nombrePresence = result.rows[0].nombrepresence;

     // return res.status(200).json({ nombreEmployes: result.rows })
   
      if (result.rows) {
        //chercons le nombre de weekend entre les dates donnees

        db.query(`SELECT COUNT(*) AS nombreDeWeekEnd
        FROM (
          SELECT  $1::date + INTERVAL '1 day' * n AS date
          FROM (
            SELECT a.num + b.num * 10 AS n
            FROM (
              SELECT 0 AS num UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
            ) a
            CROSS JOIN (
              SELECT 0 AS num UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
            ) b
          ) c
          WHERE $1::date + INTERVAL '1 day' * n BETWEEN $1::date AND $2::date
          AND EXTRACT(DOW FROM $1::date + INTERVAL '1 day' * n) IN (5, 6)
        ) d`,
        [dateA,dateD ], (err, result) => {
          if (err) {
            throw err;
          }
          const nombreDeWeekEnd = result.rows[0].nombredeweekend;

         //return res.status(200).json({ nombreEmployes: result.rows[0].nombredeweekend })
      
          if (result.rows[0]) {
             //chercons le nombre de jours ouvrables
            db.query(`SELECT ($1::date - $2::date)::integer AS nombreDeJours`,
            [dateD,dateA ], (err, result) => {
              if (err) {
                throw err;
              }
              const nombreDeJours = result.rows[0].nombredejours - nombreDeWeekEnd + 1 ;

              //return res.status(200).json({ nombreDeJours: nombreDeJours })
          
              if (result.rows) {
                //cherchons le nombre de secondes 
                  const nombreDeSecondes = nombreDeJours*8*60*60; // le nombre de temps qu'une personne devrait avoir fait pendant la date donnee
                  const nombrePresenceNormal = nombreEmployes*nombreDeSecondes; //pour tout les employés

                  db.query(`SELECT
                    100 - (COUNT(*) / (CAST($1 AS FLOAT) * CAST($2 AS FLOAT))) * 100 AS absenceCollectif,
                    SUM(EXTRACT(EPOCH FROM ("depart" - "arrive"))) AS temps
                  FROM
                    "presences"
                  INNER JOIN
                    "agt" ON "presences"."matricule" = "agt"."matricule"
                  WHERE
                    "division" = $3
                    AND "date" BETWEEN $4::date AND $5::date;`,//requete pour faire la soustration entre deus heure differente
                  [nombreDeJours,nombreEmployes,division,dateA,dateD ], (err, result) => {
                    if (err) {
                      throw err;
                    }
                    const tauxAbsenceCollectif = result.rows[0].absencecollectif;

                    // return res.status(200).json({ absencecollectif: tauxAbsenceCollectif })
                    
                    if (result.rows) {

                      const nombreDePresenceEffective = result.rows[0].temps  ;

                     // return res.status(200).json({ nombreDePresenceEffective: nombreDePresenceEffective })

                    
                    const nombreDejoursEffectifs = nombreDeSecondes;
                    let heure_sup = nombreDePresenceEffective - nombrePresenceNormal;
                    heure_sup = heure_sup < 0 ? 0 : heure_sup;

                    //le pourcentage d'assiduite de chque employes
                    db.query(`SELECT
                    presences."matricule",
                    agt."nom",
                    agt."prenom",
                    CASE
                        WHEN SUM(EXTRACT(EPOCH FROM ("presences"."depart" - "presences"."arrive"))::BIGINT - 28800) <= 0 THEN '00:00:00'
                        ELSE TO_CHAR(make_interval(secs => SUM(EXTRACT(EPOCH FROM ("presences"."depart" - "presences"."arrive"))::BIGINT - 28800)), 'HH24:MI:SS')
                    END AS "heureSupp",
                    TO_CHAR(make_interval(secs => SUM(EXTRACT(EPOCH FROM ("presences"."depart" - "presences"."arrive"))::BIGINT)), 'HH24:MI:SS') AS "tempsEff",
                    (SUM(EXTRACT(EPOCH FROM ("presences"."depart" - "presences"."arrive"))::BIGINT) / $4)* 100 AS "pourcentage"
                FROM
                    "agt"
                INNER JOIN
                    "presences" ON "presences"."matricule" = "agt"."matricule"
                WHERE
                    "agt"."division" = $1 AND "presences"."date" BETWEEN  $2::date AND $3::date
                GROUP BY
                    "presences"."matricule",
                    "agt"."nom",
                    "agt"."prenom"
                ORDER BY
                    "pourcentage" DESC`,
                      [division,dateA,dateD,nombreDeSecondes ], (err, result) => {
                        if (err) {
                          throw err;
                        }
                       // const nombreDeJours = result[0].nombreDeJours - nombreDeWeekEnd + 1 ;
      
                        // return res.status(200).json({ resultat: result.rows });
                    
                        if (result.rows) {
                          return res.status(200).json({ 
                            tauxAbsenceCollectif: tauxAbsenceCollectif,
                            tauxAbsencePersonnel: result.rows
                          })
                        } else {
                          return res.status(500).json({ erreur: 'une erreur est survenue sur le calcul des ABSENCE personnelles' })
                        }
                      });
                    // return res.status(200).json({ tauxAssiduite: tauxAssiduite })
                    } else {
                      return res.status(500).json({ erreur: 'une erreur est survenue sur le calcul des secondes' })
                    }
                  });


                
              } else {
                return res.status(500).json({ erreur: 'une erreur est survenue sur le calcul des jours' })
              }
            });
          } else {
            return res.status(500).json({ erreur: 'une erreur est survenue sur le calcul de weekends' })
          }
        });
      } else {
        return res.status(500).json({ erreur: 'une erreur est survenue sur le calcul de presence' })
      }
    });
  } else {
    return res.status(500).json({ erreur: 'une erreur est survenue sur le calcul d\'employes' })
  }
});

});

 
module.exports = router;