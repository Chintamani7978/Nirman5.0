export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Backend API Server</h1>
      <p>API endpoints are available at:</p>
      <ul>
        <li>POST /api/auth/login</li>
        <li>POST /api/auth/signup</li>
      </ul>
    </div>
  );
}

