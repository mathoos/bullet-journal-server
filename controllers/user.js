const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


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
            nom: user.nom,
            prenom: user.prenom,
            genre: user.genre,
            profilePublicId: user.profilePublicId
        });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.updateUserInfo = async (req, res, next) => {
    const userId = req.auth.userId;  

    const updatedData = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        genre: req.body.genre
    };

    try {      
        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé !' });
        }
        res.status(200).json({ message: 'Profil mis à jour avec succès !', user });
    } 
    
    catch (error) {
        res.status(500).json({ error });
    }
};

