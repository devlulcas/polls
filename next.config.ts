import createNextIntlPlugin from "next-intl/plugin";

const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
};

const withNextIntl = createNextIntlPlugin("./src/modules/i18n/lib/request.ts");
export default withNextIntl(nextConfig);
