module.exports = {
  apps: [
    {
      name: "sharpInnovation", // Name of the application
      script: "npm", // Use npm to run the app
      args: "start", // Command to start the Next.js app
      cwd: "./", // Current working directory
      instances: "max", // Use all available CPU cores
      exec_mode: "cluster", // Cluster mode for load balancing
      env: {
        NODE_ENV: "production", 
        PORT: 7890,// Environment variable for production
      },
    },
  ],
};