/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // 开启 Webpack 5 对 WebAssembly 的原生支持
    config.experiments = { ...config.experiments, asyncWebAssembly: true };

    // 针对服务端渲染的特殊处理，防止在 Node.js 端找不到 WASM 而报错
    if (isServer) {
      config.output.webassemblyModuleFilename = './../static/wasm/[modulehash].wasm';
    } else {
      config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm';
    }
    return config;
  },
};

module.exports = nextConfig;
