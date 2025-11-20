/**
 * =====================================================
 * RESERREGA - PM2 Ecosystem Configuration
 * =====================================================
 * Production process management with PM2
 * =====================================================
 */

module.exports = {
  apps: [
    {
      // -----------------------------------------------------
      // Main Application
      // -----------------------------------------------------
      name: 'reserrega-app',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3434',
      cwd: './',
      instances: 'max', // Use all CPU cores
      exec_mode: 'cluster', // Cluster mode for load balancing
      watch: false, // Don't watch files in production
      max_memory_restart: '1G', // Restart if memory exceeds 1GB

      // Environment variables
      env_production: {
        NODE_ENV: 'production',
        PORT: 3434,
        NEXT_TELEMETRY_DISABLED: 1,
        PUPPETEER_SKIP_DOWNLOAD: true,
      },

      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      merge_logs: true,

      // Advanced
      autorestart: true, // Auto-restart on crash
      max_restarts: 10, // Max restarts within restart_delay
      min_uptime: '10s', // Minimum uptime before considering stable
      listen_timeout: 10000, // Time to wait for app to listen
      kill_timeout: 5000, // Time to wait before force killing
      wait_ready: true, // Wait for process.send('ready')

      // Graceful shutdown
      shutdown_with_message: true,

      // CPU/Memory monitoring
      monitoring: true,

      // Cron restart (optional - restart daily at 3 AM)
      cron_restart: '0 3 * * *',

      // Health check (optional)
      // health_check: {
      //   interval: 30000, // 30 seconds
      //   path: '/api/health',
      //   port: 3434,
      // },
    },
  ],

  // -----------------------------------------------------
  // Deployment Configuration (Optional)
  // -----------------------------------------------------
  deploy: {
    production: {
      user: 'deploy',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:your-username/public.git',
      path: '/var/www/reserrega',
      'post-deploy': 'npm install --legacy-peer-deps && npm run build && pm2 reload ecosystem.config.js --env production',
      env: {
        NODE_ENV: 'production',
      },
    },

    staging: {
      user: 'deploy',
      host: 'staging-server.com',
      ref: 'origin/develop',
      repo: 'git@github.com:your-username/public.git',
      path: '/var/www/reserrega-staging',
      'post-deploy': 'npm install --legacy-peer-deps && npm run build && pm2 reload ecosystem.config.js --env staging',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
  },
};

/**
 * =====================================================
 * PM2 USAGE COMMANDS
 * =====================================================
 *
 * Install PM2 globally:
 *   npm install -g pm2
 *
 * Start application:
 *   pm2 start ecosystem.config.js --env production
 *
 * List running processes:
 *   pm2 list
 *
 * Monitor processes:
 *   pm2 monit
 *
 * View logs:
 *   pm2 logs reserrega-app
 *   pm2 logs --lines 100
 *
 * Restart application:
 *   pm2 restart reserrega-app
 *
 * Reload (zero-downtime restart):
 *   pm2 reload reserrega-app
 *
 * Stop application:
 *   pm2 stop reserrega-app
 *
 * Delete from PM2:
 *   pm2 delete reserrega-app
 *
 * Save PM2 process list:
 *   pm2 save
 *
 * Auto-start on server reboot:
 *   pm2 startup
 *   pm2 save
 *
 * Deploy to production:
 *   pm2 deploy production setup
 *   pm2 deploy production
 *
 * Update PM2:
 *   pm2 update
 *
 * =====================================================
 * MONITORING & MAINTENANCE
 * =====================================================
 *
 * View resource usage:
 *   pm2 status
 *   pm2 describe reserrega-app
 *
 * Flush logs:
 *   pm2 flush
 *
 * Reset restart count:
 *   pm2 reset reserrega-app
 *
 * Generate startup script:
 *   pm2 startup systemd -u deploy --hp /home/deploy
 *
 * =====================================================
 */
