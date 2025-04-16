'use strict';

module.exports = (policyContext, config, { strapi }) => {
    console.log('user in policy:', policyContext.state.user);
    return true; // autorise tout le monde, juste pour voir si on passe dedans
};
