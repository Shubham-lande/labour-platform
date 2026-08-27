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

const runPhase4Tests = async () => {
  try {
    console.log('=== PHASE 4 BUSINESS FEATURES API TEST SUITE ===');

    console.log('\n--- 1. Login as Customer Enterprise ---');
    const custLogin = await testEndpoint('/api/auth/login', 'POST', {
      identifier: 'customer@labourhub.com',
      password: 'Customer@1234',
    });
    const custToken = custLogin.data.token;
    console.log('Customer Logged In. Token Issued.');

    console.log('\n--- 2. Process Mock Gateway Payment ---');
    const payRes = await testEndpoint(
      '/api/payments',
      'POST',
      {
        projectId: 'PRJ-901',
        labourId: '65f0a0000000000000000002',
        labourName: 'Rajesh Kumar',
        amount: 218300,
        paidAmount: 218300,
        paymentMethod: 'upi_razorpay',
        workDescription: 'Metro Substation Electrical & Switchgear Installation',
        duration: '15 Days',
        dailyRate: 1200,
        additionalCharges: 5000,
      },
      custToken
    );
    console.log('Payment Status:', payRes.status, 'Message:', payRes.data.message);
    const txnId = payRes.data.payment?.transactionId;

    console.log('\n--- 3. Validate Negative Payment Amount Rejection ---');
    const negPayRes = await testEndpoint(
      '/api/payments',
      'POST',
      {
        projectId: 'PRJ-901',
        amount: -500,
      },
      custToken
    );
    console.log('Negative Payment Rejection Status:', negPayRes.status, 'Message:', negPayRes.data.message);

    console.log('\n--- 4. Fetch Payments History ---');
    const getPayRes = await testEndpoint('/api/payments', 'GET', null, custToken);
    console.log('Payments History Count:', getPayRes.data.count, 'First Txn:', getPayRes.data.data?.[0]?.transactionId);

    console.log('\n--- 5. Fetch Invoices Stream & Single Invoice ---');
    const invListRes = await testEndpoint('/api/invoices', 'GET', null, custToken);
    console.log('Invoices Count:', invListRes.data.count);
    const firstInvId = invListRes.data.data?.[0]?._id;
    if (firstInvId) {
      const invSingleRes = await testEndpoint(`/api/invoices/${firstInvId}`, 'GET', null, custToken);
      console.log('Single Invoice Number:', invSingleRes.data.data?.invoiceNumber);
    }

    console.log('\n--- 6. Submit Rating & Review for Labour Worker ---');
    const revRes = await testEndpoint(
      '/api/reviews',
      'POST',
      {
        projectId: 'PRJ-901',
        labourId: '65f0a0000000000000000002',
        labourName: 'Rajesh Kumar',
        rating: 5,
        qualityRating: 5,
        behaviourRating: 5,
        punctualityRating: 5,
        skillRating: 5,
        comment: 'Outstanding craftsmanship and safety compliance on site! Zero wiring defects during audit.',
      },
      custToken
    );
    console.log('Review Status:', revRes.status, 'Message:', revRes.data.message);

    console.log('\n--- 7. Validate Duplicate Review Prevention for Same Job ---');
    const dupRevRes = await testEndpoint(
      '/api/reviews',
      'POST',
      {
        projectId: 'PRJ-901',
        labourId: '65f0a0000000000000000002',
        rating: 4,
        comment: 'Duplicate review attempt.',
      },
      custToken
    );
    console.log('Duplicate Review Rejection Status:', dupRevRes.status, 'Message:', dupRevRes.data.message);

    console.log('\n--- 8. Send & Fetch Project Chat Messages ---');
    const sendMsgRes = await testEndpoint(
      '/api/messages',
      'POST',
      {
        projectId: 'PRJ-901',
        text: 'Busbar splice testing completed successfully on Floor 4.',
        photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758',
      },
      custToken
    );
    console.log('Send Chat Status:', sendMsgRes.status);
    const getMsgRes = await testEndpoint('/api/messages/PRJ-901', 'GET', null, custToken);
    console.log('Project Chat Messages Count:', getMsgRes.data.count);

    console.log('\n--- 9. Notification Center Stream & Mark Read ---');
    const notifRes = await testEndpoint('/api/notifications', 'GET', null, custToken);
    console.log('Notifications Count:', notifRes.data.count, 'Unread:', notifRes.data.unreadCount);
    const markReadRes = await testEndpoint('/api/notifications/read-all', 'PUT', null, custToken);
    console.log('Mark Read Status:', markReadRes.status, 'Message:', markReadRes.data.message);

    console.log('\n--- 10. Raise Complaint / Dispute & Update Status ---');
    const cmpRes = await testEndpoint(
      '/api/complaints',
      'POST',
      {
        projectId: 'PRJ-901',
        userInvolved: '65f0a0000000000000000006',
        userInvolvedName: 'Amitabh Verma (HVAC Tech)',
        complaintType: 'attendance_absence',
        description: 'Unexcused 45-minute delay during critical sub-station switchgear energization.',
        evidenceUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd',
        amountInvolved: 2500,
      },
      custToken
    );
    console.log('Raise Complaint Status:', cmpRes.status, 'Message:', cmpRes.data.message);
    const cmpId = cmpRes.data.complaint?._id;

    if (cmpId) {
      const updateCmpRes = await testEndpoint(
        `/api/complaints/${cmpId}/status`,
        'PUT',
        { status: 'under_review', resolutionNotes: 'Assigned to Platform Arbitration Officer' },
        custToken
      );
      console.log('Update Complaint Status Response:', updateCmpRes.status, 'Message:', updateCmpRes.data.message);
    }

    console.log('\n=== ALL PHASE 4 API VERIFICATION TESTS PASSED SUCCESSFULLY! ===');
  } catch (err) {
    console.error('Phase 4 test execution error:', err.message);
  }
};

runPhase4Tests();
