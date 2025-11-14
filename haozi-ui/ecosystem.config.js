const fs = require('fs');
const path = require('path');

const projectRoot = process.env.HAOZI_UI_ROOT || __dirname;
const envFilePath = path.join(projectRoot, '.env.production');

const parseEnvFile = (filePath) => {
    if (!fs.existsSync(filePath)) {
        return {};
    }

    return fs
        .readFileSync(filePath, 'utf-8')
        .split('\n')
        .reduce((acc, line) => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) {
                return acc;
            }
            const [key, ...rest] = trimmed.split('=');
            const value = rest.join('=').trim().replace(/^"(.*)"$/, '$1');
            acc[key] = value;
            return acc;
        }, {});
};

if (!fs.existsSync(envFilePath)) {
    throw new Error(
        `未找到生产环境变量文件: ${envFilePath}，请在部署前创建 .env.production`,
    );
}

const envFromFile = parseEnvFile(envFilePath);

const runtimeEnv = {
    NODE_ENV: 'production',
    PORT: 3000,
    NODE_OPTIONS: '--max-old-space-size=1024',
    ...envFromFile,
};

if (!runtimeEnv.NEXT_PUBLIC_API_BASE_URL) {
    throw new Error(
        '未在 .env.production 中检测到 NEXT_PUBLIC_API_BASE_URL，请确保部署时提供正确的 API 地址',
    );
}

module.exports = {
    apps: [
        {
            name: 'haozi-ui',
            script: 'npm',
            args: 'start',
            cwd: projectRoot,
            env: runtimeEnv,
            // 对于 2GB 内存，集群模式 (cluster) 实例数建议设为 1 或 2 (取决于依赖大小)
            instances: 1,
            exec_mode: 'fork', // 推荐在内存极度受限时使用 fork 模式，避免集群模式下的内存叠加
            watch: false,
        },
    ],
};
