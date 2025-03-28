module.exports = {
  apps: [
    {
      name: "next-app",
      script: "pnpm",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "cron-worker",
      script: "node",
      args: "scripts/cron-worker.js",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
