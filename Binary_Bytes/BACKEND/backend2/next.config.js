/** @type {import('next').NextConfig} */
const nextConfig = {
  // Set the port for development server
  // This will be used when running `npm run dev`
  // Note: You can also set it via command: PORT=3001 npm run dev
  
  // Fix the lockfile warning by setting the workspace root
  outputFileTracingRoot: require('path').join(__dirname),
  
  // Enable CORS for API routes (if needed)
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: 'http://localhost:3000' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

