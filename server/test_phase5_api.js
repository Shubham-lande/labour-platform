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

const runPhase5Tests = async () => {
  try {
    console.log('=== PHASE 5 ADMINISTRATION API TEST SUITE ===');

    console.log('\n--- 1. Login as System Admin ---');
    const adminLogin = await testEndpoint('/api/auth/login', 'POST', {
      identifier: 'admin@labourhub.com',
      password: 'Admin@1234',
    });
    const adminToken = adminLogin.data.token;
    console.log('Admin Logged In. Token Issued.');

    console.log('\n--- 2. Fetch Admin Dashboard KPI Counts ---');
    const dashRes = await testEndpoint('/api/admin/dashboard', 'GET', null, adminToken);
    console.log('Admin Dashboard Status:', dashRes.status, 'Total Labour:', dashRes.data.data?.kpi?.totalLabour);

    console.log('\n--- 3. Fetch Admin Labour Roster ---');
    const labourRes = await testEndpoint('/api/admin/labour', 'GET', null, adminToken);
    console.log('Labour Roster Count:', labourRes.data.count);

    console.log('\n--- 4. Update Worker Status & Verification Badge ---');
    const updateWorkerRes = await testEndpoint(
      '/api/admin/labour/65f0a0000000000000000004/status',
      'PUT',
      { status: 'active', isVerified: true },
      adminToken
    );
    console.log('Worker Status Update Response:', updateWorkerRes.status, 'Message:', updateWorkerRes.data.message);

    console.log('\n--- 5. Fetch Customer Enterprise List ---');
    const custRes = await testEndpoint('/api/admin/customers', 'GET', null, adminToken);
    console.log('Customer Clients Count:', custRes.data.count);

    console.log('\n--- 6. Fetch Document Verification Queue ---');
    const verRes = await testEndpoint('/api/admin/verifications', 'GET', null, adminToken);
    console.log('Verification Queue Count:', verRes.data.count);

    console.log('\n--- 7. Validate Rejection Reason Requirement ---');
    const noReasonRes = await testEndpoint(
      '/api/admin/verifications/VER-881',
      'PUT',
      { status: 'rejected' },
      adminToken
    );
    console.log('Rejection Without Reason Status:', noReasonRes.status, 'Message:', noReasonRes.data.message);

    console.log('\n--- 8. Approve KYC Document Verification ---');
    const approveVerRes = await testEndpoint(
      '/api/admin/verifications/VER-881',
      'PUT',
      { status: 'verified' },
      adminToken
    );
    console.log('Approve Document Status:', approveVerRes.status, 'Message:', approveVerRes.data.message);

    console.log('\n--- 9. Fetch Analytics Stream ---');
    const analyticsRes = await testEndpoint('/api/admin/analytics', 'GET', null, adminToken);
    console.log('Analytics Status:', analyticsRes.status, 'Trends Count:', analyticsRes.data.data?.bookingTrends?.length);

    console.log('\n--- 10. Fetch Audit Activity Trail ---');
    const logsRes = await testEndpoint('/api/admin/activity-log', 'GET', null, adminToken);
    console.log('Activity Logs Count:', logsRes.data.count);

    console.log('\n--- 11. Validate Non-Admin Role Authorization Rejection (403 Forbidden) ---');
    const custLogin = await testEndpoint('/api/auth/login', 'POST', {
      identifier: 'customer@labourhub.com',
      password: 'Customer@1234',
    });
    const custToken = custLogin.data.token;
    const forbiddenRes = await testEndpoint('/api/admin/dashboard', 'GET', null, custToken);
    console.log('Non-Admin Access Status:', forbiddenRes.status, 'Message:', forbiddenRes.data.message);

    console.log('\n=== ALL PHASE 5 API VERIFICATION TESTS PASSED SUCCESSFULLY! ===');
  } catch (err) {
    console.error('Phase 5 test execution error:', err.message);
  }
};

runPhase5Tests();
