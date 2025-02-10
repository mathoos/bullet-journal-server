const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Gestion des erreurs d'unicité proprement
userSchema.post("save", function (error, doc, next) {
    if (error.name === "MongoServerError" && error.code === 11000) {
        next(new Error("L'email est déjà utilisé. Veuillez en choisir un autre."));
    } else {
        next(error);
    }
});

// Gérer aussi les erreurs d'unicité lors des mises à jour
userSchema.post("updateOne", function (error, doc, next) {
    if (error.name === "MongoServerError" && error.code === 11000) {
        next(new Error("L'email est déjà utilisé. Veuillez en choisir un autre."));
    } else {
        next(error);
    }
});

module.exports = mongoose.model('User', userSchema);