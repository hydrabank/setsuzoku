module.exports = {
    webpack: (defaultConfig, env) =>
        Object.assign(defaultConfig, {
        entry: {
            background: './main/background.js',
            preload: './main/preload.js',
        },
    }),
};