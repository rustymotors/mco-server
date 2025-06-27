export const apps = [{
  name: "server",
  script: 'tsx ./server.ts',
  watch: ['./src'],
  log_file: "./logs/server.log"
}];
export const deploy = {
  production: {
    user: 'SSH_USERNAME',
    host: 'SSH_HOSTMACHINE',
    ref: 'origin/master',
    repo: 'GIT_REPOSITORY',
    path: 'DESTINATION_PATH',
    'pre-deploy-local': '',
    'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
    'pre-setup': ''
  }
};
