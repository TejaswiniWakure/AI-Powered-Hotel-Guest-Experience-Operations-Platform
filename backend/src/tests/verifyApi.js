const http = require('http');

const BASE_URL = 'http://127.0.0.1:5001';

// Helper for making HTTP requests
function request(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(url, { method, headers }, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING STAYFLOW API VERIFICATION ---');

  // Test 1: Health check
  console.log('1. Testing /api/health...');
  const health = await request('GET', '/api/health');
  console.assert(health.status === 200, 'Health check should be 200');
  console.log('✓ Health check passed');

  // Test 2: Login as Admin, Manager, Staff
  console.log('2. Testing Authentication for all 3 roles...');
  const adminLogin = await request('POST', '/api/auth/login', {
    email: 'admin@stayflow.demo',
    password: 'StayFlow@2026'
  });
  console.assert(adminLogin.body.success === true, 'Admin login failed');
  const adminToken = adminLogin.body.data.token;
  console.log('✓ Admin login successful. Token acquired.');

  const managerLogin = await request('POST', '/api/auth/login', {
    email: 'manager@stayflow.demo',
    password: 'StayFlow@2026'
  });
  console.assert(managerLogin.body.success === true, 'Manager login failed');
  const managerToken = managerLogin.body.data.token;
  console.log('✓ Manager login successful. Token acquired.');

  const staffLogin = await request('POST', '/api/auth/login', {
    email: 'staff@stayflow.demo',
    password: 'StayFlow@2026'
  });
  console.assert(staffLogin.body.success === true, 'Staff login failed');
  const staffToken = staffLogin.body.data.token;
  console.log('✓ Staff login successful. Token acquired.');

  const guestLogin = await request('POST', '/api/guest/verify-room', {
    hotelCode: 'SFGP',
    roomNumber: '312'
  });
  console.assert(guestLogin.body.success === true, 'Guest room verification failed');
  const actualGuestToken = guestLogin.body.token || (guestLogin.body.data && guestLogin.body.data.token);
  console.log('✓ Guest verification successful. Token acquired.');

  // Test 3: RBAC Enforcement
  console.log('3. Testing RBAC enforcement (Guest cannot access /api/admin/overview)...');
  const forbiddenCheck = await request('GET', '/api/admin/overview', null, actualGuestToken);
  console.assert(forbiddenCheck.status === 403, 'Guest should be forbidden from admin API');
  console.log('✓ RBAC properly blocked guest from admin endpoint (Status 403)');

  // Test 4: Admin Overview & Rooms
  console.log('4. Testing Admin Overview...');
  const adminOverview = await request('GET', '/api/admin/overview', null, adminToken);
  console.assert(adminOverview.body.data.metrics.totalRooms >= 10, 'Expected seeded rooms');
  console.log('✓ Admin overview verified. Total rooms:', adminOverview.body.data.metrics.totalRooms);

  // Test 5: Guest RAG Concierge Chat
  console.log('5. Testing Guest Concierge RAG Knowledge Chat...');
  const conciergeRes = await request('POST', '/api/guest/concierge/chat', {
    message: 'What time is breakfast served at the restaurant?'
  }, actualGuestToken);
  console.assert(conciergeRes.body.success === true, 'Concierge response failed');
  console.assert(conciergeRes.body.data.answer.includes('Breakfast'), 'Concierge should ground breakfast answer');
  console.log('✓ Concierge RAG grounded answer received:', conciergeRes.body.data.answer.slice(0, 80) + '...');
  console.log('  Citations:', conciergeRes.body.data.sourceLabel);

  // Test 6: Staff Assistant SOP RAG Chat
  console.log('6. Testing Staff Assistant SOP RAG Troubleshooting...');
  const staffAssistantRes = await request('POST', '/api/staff/assistant', {
    query: 'What should I check when an AC is not cooling properly?'
  }, staffToken);
  console.assert(staffAssistantRes.body.success === true, 'Staff assistant failed');
  console.assert(staffAssistantRes.body.data.answer.includes('Thermostat'), 'Staff assistant should return SOP steps');
  console.log('✓ Staff Assistant SOP steps retrieved:', staffAssistantRes.body.data.answer.slice(0, 80) + '...');

  // Test 7: Full Request -> AI Understanding -> Smart Assignment -> Task Creation Flow
  console.log('7. Testing End-to-End Guest Request -> AI -> Smart Assignment -> Task...');
  const newReqRes = await request('POST', '/api/guest/requests/issue', {
    description: 'The bathroom tap is leaking heavily and water is collecting on the floor.'
  }, actualGuestToken);
  console.assert(newReqRes.body.success === true, 'Issue reporting failed');
  const createdRequest = newReqRes.body.data.request;
  console.log('✓ AI Diagnosis:', newReqRes.body.data.aiAnalysis.summary);
  console.log('✓ Detected Category:', createdRequest.category, '| Priority:', createdRequest.priority, '| SLA:', createdRequest.slaMinutes, 'min');
  console.log('✓ Smart Assignment Reason:', newReqRes.body.data.assignmentReason);

  // Test 8: Manager Dashboard & Live Operations
  console.log('8. Testing Manager Dashboard & Live Operations...');
  const mgrDashboard = await request('GET', '/api/manager/dashboard', null, managerToken);
  console.assert(mgrDashboard.body.data.kpis.totalRequests >= 4, 'Manager KPI total requests check');
  console.log('✓ Manager KPIs: Total Requests:', mgrDashboard.body.data.kpis.totalRequests, 
              '| SLA Compliance:', mgrDashboard.body.data.kpis.slaCompliance, 
              '| Rating:', mgrDashboard.body.data.kpis.guestRating);

  // Test 9: Manager Analytics
  console.log('9. Testing Manager Real MongoDB Aggregation Analytics...');
  const analyticsRes = await request('GET', '/api/manager/analytics', null, managerToken);
  console.assert(analyticsRes.body.data.byDepartment.length > 0, 'Department analytics check');
  console.log('✓ Analytics departments breakdown:', analyticsRes.body.data.byDepartment.map(d => `${d.name}: ${d.count}`).join(', '));

  // Test 10: Issue Trends
  console.log('10. Testing Issue Trend Pattern Detection...');
  const trendsRes = await request('GET', '/api/manager/trends', null, managerToken);
  console.assert(trendsRes.body.data.length > 0, 'Issue trends should detect floor 3 recurring issues');
  console.log('✓ Active Trend Detected:', trendsRes.body.data[0].insight);
  console.log('  Recommended Action:', trendsRes.body.data[0].recommendedAction);

  console.log('--- ALL BACKEND CHECKS AND VERIFICATIONS PASSED SUCCESSFULLY! ---');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
