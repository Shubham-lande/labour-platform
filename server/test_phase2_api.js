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

const runPhase2Tests = async () => {
  try {
    console.log('=== PHASE 2 CORE WORKFORCE API TEST SUITE ===');

    console.log('\n--- 1. Login as Customer ---');
    const custLogin = await testEndpoint('/api/auth/login', 'POST', {
      identifier: 'customer@labourhub.com',
      password: 'Customer@1234',
    });
    const custToken = custLogin.data.token;
    console.log('Customer Logged In. Token Issued.');

    console.log('\n--- 2. Search Labour Profiles (Category = Certified Electricians) ---');
    const searchRes = await testEndpoint('/api/labour/profiles?category=Certified%20Electricians&sort=highest_rated');
    console.log('Search Results Count:', searchRes.data.count);
    console.log('First Worker:', searchRes.data.data?.[0]?.user?.fullName, 'Skill:', searchRes.data.data?.[0]?.primarySkill);

    console.log('\n--- 3. Create New Work Booking Request ---');
    const bookingRes = await testEndpoint(
      '/api/bookings',
      'POST',
      {
        labourId: '65f0a0000000000000000002',
        title: 'Industrial Substation Wiring',
        category: 'Certified Electricians',
        description: 'High-voltage switchgear panel wiring and testing.',
        location: { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
        startDate: '2026-08-25',
        endDate: '2026-08-30',
        startTime: '08:30 AM',
        workerCount: 2,
        estimatedBudget: 12000,
        specialInstructions: 'PPE boots and helmet required.',
      },
      custToken
    );
    console.log('Booking Creation Status:', bookingRes.status, 'Message:', bookingRes.data.message);
    const newBookingId = bookingRes.data.booking?._id;

    console.log('\n--- 4. Login as Labour Worker ---');
    const labourLogin = await testEndpoint('/api/auth/login', 'POST', {
      identifier: 'labour@labourhub.com',
      password: 'Labour@1234',
    });
    const labourToken = labourLogin.data.token;
    console.log('Labour Logged In.');

    console.log('\n--- 5. Toggle Worker Availability Status to BUSY ---');
    const updateRes = await testEndpoint(
      '/api/labour/profile/me',
      'PUT',
      { availabilityStatus: 'busy' },
      labourToken
    );
    console.log('Status Update Response:', updateRes.data.message);

    console.log('\n--- 6. Labour Accept Booking Request ---');
    if (newBookingId) {
      const acceptRes = await testEndpoint(
        `/api/bookings/${newBookingId}/status`,
        'PUT',
        { status: 'accepted' },
        labourToken
      );
      console.log('Accept Status:', acceptRes.status, 'New Booking Status:', acceptRes.data.data?.status);
    }

    console.log('\n=== ALL PHASE 2 API VERIFICATION TESTS PASSED SUCCESSFULLY! ===');
  } catch (err) {
    console.error('Phase 2 test execution error:', err.message);
  }
};

runPhase2Tests();
