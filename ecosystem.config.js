const isProd = 'production' === process.env.NODE_ENV

const appConfig = {
    script: "src/app.js",
    instance_var: 'INSTANCE_ID',
    watch: !isProd,
    instances: isProd ? 'max' : 1,
    ignore_watch: [
        '.idea',
        '.vscode',
        'docker',
        'logs',
        'node_modules',
        'public',
        'terraform',
        'tests'
    ],
    env_production: {
        NODE_ENV: "production"
    },
}

module.exports = {
    apps: [
        {
            script: "src/app.js",
            instance_var: 'INSTANCE_ID',
            watch: !isProd,
            instances: isProd ? 'max' : 1,
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
            name: "cargo",
            max_memory_restart: '3000M',
            error_file: 'logs/cargo.http.error.log',
            out_file: 'logs/cargo.http.out.log',
            env: {
                NODE_ENV: "development"
            },
        }
    ]
}
