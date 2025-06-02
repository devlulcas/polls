import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {};
 
const withNextIntl = createNextIntlPlugin('./src/modules/i18n/lib/request.ts');
export default withNextIntl(nextConfig);