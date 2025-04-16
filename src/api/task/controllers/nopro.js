'use strict';

/**
 * task controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::task.task', () => ({
    // Nouvelle méthode pour récupérer les tâches non attribuées à un utilisateur pro
    async indexNonPro(ctx) {
        try {
            console.log("Début de la requête pour récupérer les tâches non pro");

            // Récupérer les tâches avec les utilisateurs associés et peupler la relation 'role' de l'utilisateur
            const tasks = await strapi.query('api::task.task').findMany({
                populate: {
                    Userrelated: {
                        populate: ['role'] // Peupler le rôle de l'utilisateur
                    }
                }
            });
            console.log("Tâches récupérées : ", tasks);

            // Filtrer les tâches qui n'ont pas d'utilisateur ou dont aucun utilisateur n'a le rôle 'pro'
            const tasksNonPro = [];
            const seenDocumentIds = new Set(); // Ensemble pour garder une trace des documentId déjà vus

            tasks.forEach(task => {
                // Vérifier si la tâche a déjà été ajoutée à la liste (basé sur le documentId)
                if (!seenDocumentIds.has(task.documentId)) {
                    // Ajouter le documentId à l'ensemble
                    seenDocumentIds.add(task.documentId);

                    // Vérifier si la tâche n'a aucun utilisateur avec le rôle 'pro'
                    if (!task.Userrelated || task.Userrelated.length === 0 || 
                        !task.Userrelated.some(user => user.role && user.role.name === 'pro')) {
                        tasksNonPro.push(task); // Ajouter la tâche à la liste filtrée
                    }
                }
            });

            console.log("Tâches non attribuées à des utilisateurs avec le rôle 'pro' et sans doublon : ", tasksNonPro);

            // Retourner les tâches filtrées
            ctx.send(tasksNonPro);
        } catch (error) {
            // Log de l'erreur
            console.error("Erreur lors de la récupération des tâches non pro:", error);
            ctx.throw(500, 'Erreur interne du serveur');
        }
    }
}));
