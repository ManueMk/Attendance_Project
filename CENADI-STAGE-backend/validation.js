const { check } = require('express-validator');

exports.loginValidation = [
     check('MATRICULE', 'Name must contain only an alpha numerics characters').isLength({ min: 2, max: 30 }),
     check('PASSWORD', 'Password must be 6 or more characters').isLength({ min: 6 })
 
];

exports.signUpValidation = [
     
     check('MATRICULE', 'matricule must be 7 or more characters').isLength({ min: 7 }),
     check('PASSWORD', 'Password must be 35 or more characters').isLength({ min: 36 })
];

exports.modifierValidation = [
     
     check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
     check('name', 'Name must contain only an alpha numerics characters').isLength({ min: 2, max: 30 }),
     check('matricule', 'matricule must be 6 or more characters').isLength({ min: 6 })
];
exports.suprimerValidation = [
     
     check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
     check('name', 'Name must contain only an alpha numerics characters').isLength({ min: 2, max: 30 }),
     check('matricule', 'matricule must be 6 or more characters').isLength({ min: 6 })
];
exports.assiduiterValidation = [
     
     check('HEURE_ARRIVER', 'Password must be 6 or more characters').isLength({ min: 9}),
     check('HEURE_DEPART', 'Name must contain only an alpha numerics characters').isLength({ min: 9}),
];
exports.absenValidation = [
     
     check('HEURE_ARRIVER', 'Password must be 6 or more characters').isLength({ min: 9}),
     check('HEURE_DEPART', 'Name must contain only an alpha numerics characters').isLength({ min: 9}),
    
];
exports.heur_supValidation = [
     
     check('HEURE_ARRIVER', 'Password must be 6 or more characters').isLength({ min: 9}),
     check('HEURE_DEPART', 'Name must contain only an alpha numerics characters').isLength({ min: 9}),
    
];
exports.form_permisionValidation = [
     
     check('MATRICULE', 'Name must contain only an alpha numerics characters').isLength({ min: 9}),
     check('DATE_PER', 'Name must contain only an alpha numerics characters').isLength({ min: 9}),
     check('NB_TEMPS', 'Name must contain only an alpha numerics characters').isLength({ min: 9}),
     check('MOTIF', 'Name must contain only an alpha numerics characters').isLength({ min: 9}),
    
];
exports.form_presenceValidation = [
     
     check('MATRICULE', 'Name must contain only an alpha numerics characters').isLength({ min: 9}),
     check('HEURE_ARRIVER', 'Password must be 6 or more characters').isLength({ min: 9}),
     check('HEURE_DEPART', 'Name must contain only an alpha numerics characters').isLength({ min: 9}),
     check('DATE', 'Name must contain only an alpha numerics characters').isLength({ min: 9}),
    
];
exports.updateValidation = [
     
     
     check('HEURE_ARRIVER', 'Password must be 6 or more characters').isLength({ min: 9}),
     check('HEURE_DEPART', 'Name must contain only an alpha numerics characters').isLength({ min: 9}),
     check('DATE', 'Name must contain only an alpha numerics characters').isLength({ min: 9}),
    
];
exports.updatepeValidation = [
     
     check('MOTIF', 'Name must contain only an alpha numerics characters').isLength({ min: 9}),
     check('DATE_RETOUR', 'Name must contain only an alpha numerics characters').isLength({ min: 9}),
    
];
exports.presenValidation = [
     
     check('HEURE_ARRIVER', 'Password must be 6 or more characters').isLength({ min: 9}),
     check('HEURE_DEPART', 'Name must contain only an alpha numerics characters').isLength({ min: 9}),
];
exports.absenValidation = [
     
     check('HEURE_ARRIVER', 'Password must be 6 or more characters').isLength({ min: 9}),
     check('HEURE_DEPART', 'Name must contain only an alpha numerics characters').isLength({ min: 9}),
];
exports.perValidation = [
     
     check('HEURE_ARRIVER', 'Password must be 6 or more characters').isLength({ min: 9}),
     check('HEURE_DEPART', 'Name must contain only an alpha numerics characters').isLength({ min: 9}),
];
