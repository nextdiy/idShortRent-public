module.exports = {
  apps : [{
    name: "idShortRent",
    script: "server/index.js",
    watch: true,
    env: {
      COMMON_VARIABLE: "true"
    },
    env_development: {
      NODE_ENV: "production",
      PORT: 8082
    },
    env_production: {
      NODE_ENV: "production",
      PORT: 80
    }
  }],
  deploy : {
    productionUAT : {
      user : "root",
      host : "0.0.0.0",
      ref  : "origin/develop",
      repo : "git@github.com:nextdiy/idShortRent-public.git",
      path : "/root/idShortRent",
      'pre-deploy': 'git fetch --all',
      'post-deploy' : "yarn && yarn build && pm2 start ecosystem.config.js --env development"
    },
    // "production" is the environment name
    productionLive : {
      user : "root",
      host : "0.0.0.0",
      ref  : "origin/master",
      repo : "git@github.com:nextdiy/idShortRent-public.git",
      path : "/root/idShortRent",
      'pre-deploy': 'git fetch --all',
      'post-deploy' : "rm -rf node_modules && yarn && yarn build && pm2 start ecosystem.config.js --env production"
     },
  }
}