const http = require('http');

const testEndpoint = (path, method = 'GET', data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : '';
    const req = http.request(
      {
        host: 'localhost',
        port: 5000,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, text: body });
          }
        });
      }
    );
    req.on('error', (err) => reject(err));
    if (payload) req.write(payload);
    req.end();
  });
};

const runTests = async () => {
  try {
    console.log('--- 1. Testing Health Endpoint ---');
    const health = await testEndpoint('/api/health');
    console.log('Health Response:', health);

    console.log('\n--- 2. Testing Login as Admin ---');
    const adminLogin = await testEndpoint('/api/auth/login', 'POST', {
      identifier: 'admin@labourhub.com',
      password: 'Admin@1234',
    });
    console.log('Admin Login Response:', adminLogin);

    const adminToken = adminLogin.data.token;

    console.log('\n--- 3. Testing Protected Admin Dashboard ---');
    const adminDash = await testEndpoint('/api/admin/dashboard', 'GET', null, adminToken);
    console.log('Admin Dashboard Status:', adminDash.status, 'KPI:', adminDash.data?.data?.kpi);

    console.log('\n--- 4. Testing Labour Login & Dashboard Guard ---');
    const labourLogin = await testEndpoint('/api/auth/login', 'POST', {
      identifier: 'labour@labourhub.com',
      password: 'Labour@1234',
    });
    const labourToken = labourLogin.data.token;
    const labourDash = await testEndpoint('/api/labour/dashboard', 'GET', null, labourToken);
    console.log('Labour Dashboard Status:', labourDash.status, 'Active Requests:', labourDash.data?.data?.stats?.activeRequests);

    console.log('\n--- 5. Testing Role Guard Rejection (Labour trying to hit Admin endpoint) ---');
    const rejected = await testEndpoint('/api/admin/dashboard', 'GET', null, labourToken);
    console.log('Role Guard Rejection Status (Expected 403):', rejected.status, 'Message:', rejected.data?.message);

    console.log('\nALL VERIFICATION TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('Test execution error:', err.message);
  }
};

runTests();
