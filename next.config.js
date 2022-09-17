/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['br', 'en'],
    defaultLocale: 'br',
    localeDetection: false
  }
}

module.exports = nextConfig
