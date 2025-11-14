module.exports = {
    apps: [
        {
            name: "haozi-ui",
            script: "npm",
            args: "start",
            cwd: "/root/project/haozi-ui", // 确保指向最新的部署目录
            env: {
                NODE_ENV: "production",
                PORT: 3000,
                NEXT_PUBLIC_API_BASE_URL: "https://admin.lliyuu520.cn/api",
                // 关键限制：将最大内存限制在 1024MB (1GB)
                NODE_OPTIONS: '--max-old-space-size=1024',
            },
            // 对于 2GB 内存，集群模式 (cluster) 实例数建议设为 1 或 2 (取决于依赖大小)
            instances: 1,
            exec_mode: "fork", // 推荐在内存极度受限时使用 fork 模式，避免集群模式下的内存叠加
            watch: false,
        },
    ],
};