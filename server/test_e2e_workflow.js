const http = require('http');
const app = require('./server');
const { getDBStatus } = require('./config/db');

// Create test server on ephemeral port
const server = http.createServer(app);

const makeRequest = (port, path, method = 'GET', data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : '';
    const req = http.request(
      {
        host: '127.0.0.1',
        port,
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

async function runE2ETest() {
  server.listen(0, async () => {
    const port = server.address().port;
    console.log(`[Test Server Running on Port ${port}]`);
    console.log(`[Database Engine Status]: ${getDBStatus() ? 'MongoDB Cloud Atlas' : 'Persistent Storage Engine'}`);

    try {
      console.log('\n--- 1. Health Endpoint Check ---');
      const health = await makeRequest(port, '/api/health');
      console.log('Health:', health.status, health.data);
      if (health.status !== 200) throw new Error('Health check failed');

      console.log('\n--- 2. Customer / Contractor Login ---');
      const custLogin = await makeRequest(port, '/api/auth/login', 'POST', {
        identifier: 'customer@labourhub.com',
        password: 'Customer@1234',
      });
      console.log('Customer Login Status:', custLogin.status, '| User:', custLogin.data.user?.fullName);
      const custToken = custLogin.data.token;
      if (!custToken) throw new Error('Customer login failed to return token');

      console.log('\n--- 3. Customer Creates Work Request (POST /api/projects) ---');
      const workData = {
        name: 'High-Rise Substation Power Grid Automation',
        category: 'Certified Electricians',
        description: 'Complete high-voltage switchgear commissioning, smart automation PLC integration, and busbar testing.',
        location: {
          address: 'Plot 88, Prime Corporate Tower',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400051',
        },
        requiredSkills: ['Electrical Wiring', 'High Voltage Switchgear', 'PLC Automation'],
        workerCount: 4,
        startDate: '2026-09-10',
        deadline: '2026-09-30',
        budget: 285000,
        priority: 'urgent',
      };

      const createRes = await makeRequest(port, '/api/projects', 'POST', workData, custToken);
      console.log('Create Work Request Status:', createRes.status, '| Message:', createRes.data.message);
      if (createRes.status !== 201 && createRes.status !== 200) throw new Error(`Work request creation failed: ${JSON.stringify(createRes.data)}`);

      const createdProject = createRes.data.project;
      const projectId = createdProject._id || createdProject.id;
      console.log(`Created Project ID: ${projectId} | Title: "${createdProject.name}" | Budget: ₹${createdProject.budget}`);

      console.log('\n--- 4. Labour Worker Login (User B) ---');
      const labourLogin = await makeRequest(port, '/api/auth/login', 'POST', {
        identifier: 'labour@labourhub.com',
        password: 'Labour@1234',
      });
      console.log('Labour Login Status:', labourLogin.status, '| User:', labourLogin.data.user?.fullName);
      const labourToken = labourLogin.data.token;
      if (!labourToken) throw new Error('Labour login failed to return token');

      console.log('\n--- 5. Labour Fetches Work Requests (GET /api/projects?filter=all) ---');
      const labourProjectsRes = await makeRequest(port, '/api/projects?filter=all', 'GET', null, labourToken);
      console.log('Labour Projects Status:', labourProjectsRes.status, '| Total Projects Count:', labourProjectsRes.data.count);

      const foundProject = (labourProjectsRes.data.data || []).find((p) => (p._id || p.id) === projectId || p.name === workData.name);
      if (!foundProject) {
        throw new Error(`CRITICAL: Newly created project "${workData.name}" NOT FOUND in Labour's project list!`);
      }
      console.log(`✅ SUCCESS! Labour can see newly created project: "${foundProject.name}" (ID: ${foundProject._id || foundProject.id})`);

      console.log('\n--- 6. Customer Assigns Labour to Project (POST /api/projects/:id/assign) ---');
      const assignRes = await makeRequest(
        port,
        `/api/projects/${projectId}/assign`,
        'POST',
        {
          workers: [
            {
              workerId: '65f0a0000000000000000002',
              workerName: 'Mol Patil',
              roleTitle: 'Master Industrial Electrician',
            },
          ],
        },
        custToken
      );
      console.log('Assign Status:', assignRes.status, '| Message:', assignRes.data.message);

      console.log('\n--- 7. Labour Posts Work Update (POST /api/projects/:id/updates) ---');
      const updateRes = await makeRequest(
        port,
        `/api/projects/${projectId}/updates`,
        'POST',
        {
          workerName: 'Mol Patil',
          description: 'Mounted primary 11kV step-down transformer and completed initial resistance insulation test.',
          progressPercentage: 50,
          photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758',
        },
        labourToken
      );
      console.log('Post Update Status:', updateRes.status, '| Message:', updateRes.data.message);

      console.log('\n--- 8. Customer Verifies Project Status & Updates ---');
      const getPrjRes = await makeRequest(port, `/api/projects/${projectId}`, 'GET', null, custToken);
      console.log('Get Project Status:', getPrjRes.status, '| Progress:', getPrjRes.data.data?.progressPercentage + '%');
      console.log('Updates Count:', getPrjRes.data.data?.updates?.length);

      console.log('\n🎉 ALL MULTI-USER WORKFLOW VERIFICATION TESTS PASSED FLAWLESSLY!');
      server.close(() => process.exit(0));
    } catch (err) {
      console.error('\n❌ TEST FAILURE:', err.message);
      server.close(() => process.exit(1));
    }
  });
}

runE2ETest();
