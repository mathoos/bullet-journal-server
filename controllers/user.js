const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signupUser = (req, res, next) => {
    console.log("Requête d'inscription reçue :", req.body, req.file);
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash,
            statut: req.body.statut,
        });
        user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => {
                console.error("Erreur lors de l'enregistrement de l'utilisateur :", error);
                res.status(400).json({ error });
            });
    })
    .catch(error => {
        console.error("Erreur lors du hash du mot de passe :", error);
        res.status(500).json({ error });
    });
};

exports.loginUser = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET || 'RANDOM_TOKEN_SECRET', // Utiliser la variable d'environnement
                { expiresIn: '24h' }
            );
            res.status(200).json({
                userId: user._id,
                token: token
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getUserInfo = (req, res, next) => {
    const userId = req.auth.userId;
    
    User.findById(userId)
    .then(user => {
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé !' });
        }
        res.status(200).json({
            email: user.email,
            statut: user.statut,
        });
    })
    .catch(error => res.status(500).json({ error }));
};

