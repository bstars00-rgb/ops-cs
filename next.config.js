/** @type {import('next').NextConfig} */
const isGhPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  reactStrictMode: true,
  // GitHub Pages 정적 export
  output: isGhPages ? "export" : undefined,
  // GitHub Pages 의 sub-path (저장소 이름)
  basePath: isGhPages ? "/ops-cs" : "",
  assetPrefix: isGhPages ? "/ops-cs/" : "",
  // 정적 export 시 next/image 최적화 비활성
  images: { unoptimized: isGhPages },
  // 정적 export 의 디렉토리 라우팅
  trailingSlash: isGhPages,
};

module.exports = nextConfig;
