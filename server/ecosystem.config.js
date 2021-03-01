const isProd = 'production' === process.env.NODE_ENV

module.exports = {
    apps: [
        {
            script: "./src/server.js",
            watch: !isProd,
            ignore_watch: [
                '.idea',
                '.vscode',
                'logs',
                'node_modules',
                'public'
            ],
            env_production: {
                NODE_ENV: "production"
            },
            name: "send_email",
            max_memory_restart: '500M',
            env: {
                NODE_ENV: "development"
            },
        }
    ]
}
