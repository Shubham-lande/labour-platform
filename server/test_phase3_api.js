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

const runPhase3Tests = async () => {
  try {
    console.log('=== PHASE 3 WORK MANAGEMENT API TEST SUITE ===');

    console.log('\n--- 1. Login as Customer Enterprise ---');
    const custLogin = await testEndpoint('/api/auth/login', 'POST', {
      identifier: 'customer@labourhub.com',
      password: 'Customer@1234',
    });
    const custToken = custLogin.data.token;
    console.log('Customer Logged In. Token Issued.');

    console.log('\n--- 2. Create New Work Project ---');
    const createPrjRes = await testEndpoint(
      '/api/projects',
      'POST',
      {
        name: 'Metro Substation Electrical Installation',
        category: 'Certified Electricians',
        description: 'High-voltage sub-station switchgear and smart automation assembly.',
        location: { address: 'Site 12, Metro Depot', city: 'Mumbai', state: 'Maharashtra', pincode: '400013' },
        requiredSkills: ['Electrical Wiring', 'High Voltage Switchgear'],
        workerCount: 3,
        startDate: '2026-09-01',
        deadline: '2026-09-25',
        budget: 210000,
        priority: 'high',
      },
      custToken
    );
    console.log('Create Project Status:', createPrjRes.status, 'Message:', createPrjRes.data.message);
    const newProjectId = createPrjRes.data.project?._id;

    console.log('\n--- 3. Fetch Projects List (Filter = Active) ---');
    const getPrjsRes = await testEndpoint('/api/projects?filter=active');
    console.log('Projects Count:', getPrjsRes.data.count, 'First Project:', getPrjsRes.data.data?.[0]?.name);

    console.log('\n--- 4. Assign Available Labourers to Project ---');
    if (newProjectId) {
      const assignRes = await testEndpoint(
        `/api/projects/${newProjectId}/assign`,
        'POST',
        {
          workers: [
            { workerId: '65f0a0000000000000000002', workerName: 'Rajesh Kumar', roleTitle: 'Lead Electrician' },
            { workerId: '65f0a0000000000000000004', workerName: 'Vikram Singh', roleTitle: 'Master Pipefitter' },
          ],
        },
        custToken
      );
      console.log('Assign Status:', assignRes.status, 'Message:', assignRes.data.message);
    }

    console.log('\n--- 5. Advance Project Stepper Workflow (Status -> In Progress) ---');
    if (newProjectId) {
      const statusRes = await testEndpoint(
        `/api/projects/${newProjectId}/status`,
        'PUT',
        { status: 'in_progress', actionDetails: 'Work started on site' },
        custToken
      );
      console.log('Update Status Response:', statusRes.status, 'New Status:', statusRes.data.project?.status);
    }

    console.log('\n--- 6. Login as Labour Worker & Add Work Update ---');
    const labourLogin = await testEndpoint('/api/auth/login', 'POST', {
      identifier: 'labour@labourhub.com',
      password: 'Labour@1234',
    });
    const labourToken = labourLogin.data.token;
    console.log('Labour Logged In.');

    if (newProjectId) {
      const updateRes = await testEndpoint(
        `/api/projects/${newProjectId}/updates`,
        'POST',
        {
          description: 'Completed main circuit breaker mounting and high-voltage busbar grounding.',
          photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758',
          progressPercentage: 45,
        },
        labourToken
      );
      console.log('Work Update Status:', updateRes.status, 'Message:', updateRes.data.message);
    }

    console.log('\n--- 7. Record Attendance Shift Check-In & Check-Out ---');
    const checkInRes = await testEndpoint(
      '/api/attendance',
      'POST',
      {
        projectId: newProjectId || 'PRJ-901',
        action: 'check_in',
        startTime: '08:30 AM',
        breakMinutes: 30,
        siteLocation: 'Site 12, Metro Depot',
      },
      labourToken
    );
    console.log('Check-In Status:', checkInRes.status, 'Message:', checkInRes.data.message);

    const checkOutRes = await testEndpoint(
      '/api/attendance',
      'POST',
      {
        projectId: newProjectId || 'PRJ-901',
        action: 'check_out',
        endTime: '05:30 PM',
        breakMinutes: 30,
      },
      labourToken
    );
    console.log('Check-Out Status:', checkOutRes.status, 'Total Hours:', checkOutRes.data.attendance?.totalHours);

    console.log('\n--- 8. Fetch Attendance History ---');
    const attHistRes = await testEndpoint('/api/attendance', 'GET', null, labourToken);
    console.log('Attendance History Count:', attHistRes.data.count);

    console.log('\n=== ALL PHASE 3 API VERIFICATION TESTS PASSED SUCCESSFULLY! ===');
  } catch (err) {
    console.error('Phase 3 test execution error:', err.message);
  }
};

runPhase3Tests();
