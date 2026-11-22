// test-e2e.mjs - Comprehensive Multi-Tenant SaaS Testing for QRDENING
const BASE = "http://localhost:3000";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("  QRDENING E2E AUTOMATED VERIFICATION SUITE");
  console.log("=======================================================\n");

  // TEST SUITE 1: PUBLIC PAGES & WEBSITE
  console.log("[SUITE 1] Public Landing Page & Info Pages");
  const pages = ["/", "/pricing", "/features", "/how-it-works", "/demo", "/faq", "/contact", "/privacy", "/terms", "/refund", "/register", "/restaurant/login", "/kitchen/login", "/super-admin/login"];
  for (const page of pages) {
    const res = await fetch(`${BASE}${page}`);
    assert(res.status === 200, `GET ${page} returns HTTP 200`);
  }

  // TEST SUITE 2: DYNAMIC DATABASE PRICING PLANS
  console.log("\n[SUITE 2] Dynamic Database Pricing Plans API");
  const plansRes = await fetch(`${BASE}/api/plans`);
  const plansData = await plansRes.json();
  assert(plansData.success === true, "GET /api/plans returns success");
  assert(Array.isArray(plansData.data) && plansData.data.length >= 4, `Database has ${plansData.data?.length} pricing plans`);

  // TEST SUITE 3: RESTAURANT REGISTRATION & APPROVAL WORKFLOW
  console.log("\n[SUITE 3] Restaurant Registration & Approval Flow");
  const testRestPayload = {
    restaurantName: `Emerald Grill ${Date.now().toString().slice(-4)}`,
    ownerName: "Karan Patel",
    email: `karan.${Date.now()}@emeraldgrill.in`,
    phone: "+91 98888 12345",
    password: "password123",
    confirmPassword: "password123",
    address: "Road No. 36, Jubilee Hills",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500033",
    restaurantType: "Restaurant",
    agreedToTerms: true,
  };

  const regRes = await fetch(`${BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testRestPayload),
  });
  const regJson = await regRes.json();
  assert(regJson.success === true, "Restaurant registration API accepted submission");
  assert(regJson.pendingApproval === true, "Account status marked 'pendingApproval: true'");
  assert(regJson.restaurant?.approvalStatus === "pending", "Restaurant entity approvalStatus is 'pending'");

  // Try to login while pending
  const pendingLoginRes = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: testRestPayload.email, password: testRestPayload.password }),
  });
  const pendingLoginJson = await pendingLoginRes.json();
  assert(pendingLoginRes.status === 403, "Pending restaurant login returns HTTP 403");
  assert(pendingLoginJson.status === "pending", "Login response indicates 'status: pending'");
  assert(pendingLoginJson.error.includes("under review"), "Returns exact 'under review' prompt notification");

  // TEST SUITE 4: SUPER ADMIN AUTHENTICATION & RESTAURANT APPROVAL
  console.log("\n[SUITE 4] Super Admin 2FA & Approval Execution");
  // Step 1: Credentials
  const adminCredRes = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@qrdening.com", password: "password123" }),
  });
  const adminCredJson = await adminCredRes.json();
  assert(adminCredJson.require2FA === true, "Super Admin requires mandatory 2FA TOTP code");

  // Step 2: 2FA Verification
  const admin2faRes = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@qrdening.com", password: "password123", twoFactorCode: "749201" }),
  });
  const admin2faJson = await admin2faRes.json();
  assert(admin2faJson.success === true, "Super Admin authenticated with 2FA code");
  const adminCookie = admin2faRes.headers.get("set-cookie");
  assert(Boolean(adminCookie), "Super Admin session cookie issued");

  // Super Admin queries overview
  const superOverviewRes = await fetch(`${BASE}/api/super-admin`, {
    headers: { cookie: adminCookie || "" },
  });
  const superOverviewJson = await superOverviewRes.json();
  assert(superOverviewJson.success === true, "Super Admin fetched platform overview");
  assert(superOverviewJson.data.totalRestaurants > 0, `Platform tracks ${superOverviewJson.data.totalRestaurants} registered restaurants`);

  // Super Admin approves the newly registered restaurant
  const newRestId = regJson.restaurant.id;
  const approveRes = await fetch(`${BASE}/api/super-admin`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", cookie: adminCookie || "" },
    body: JSON.stringify({ action: "approve_restaurant", restaurantId: newRestId }),
  });
  const approveJson = await approveRes.json();
  assert(approveJson.success === true, `Super Admin approved restaurant ID: ${newRestId}`);

  // Now login as the newly approved restaurant owner with SAME credentials
  const approvedLoginRes = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: testRestPayload.email, password: testRestPayload.password }),
  });
  const approvedLoginJson = await approvedLoginRes.json();
  assert(approvedLoginRes.status === 200, "Approved restaurant owner logs in with HTTP 200");
  assert(approvedLoginJson.success === true, "Owner dashboard access granted with SAME credentials");

  // TEST SUITE 5: STRICT TENANT ISOLATION & ACCESS CONTROL
  console.log("\n[SUITE 5] Strict Multi-Tenant Isolation & Role Guard");
  const ownerLoginRes = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "owner@arabiandelight.in", password: "password123" }),
  });
  const ownerCookie = ownerLoginRes.headers.get("set-cookie");

  // Restaurant A tries to access Super Admin API
  const unauthorizedSuperRes = await fetch(`${BASE}/api/super-admin`, {
    headers: { cookie: ownerCookie || "" },
  });
  assert(unauthorizedSuperRes.status === 403, "Restaurant Owner is BLOCKED from /api/super-admin (HTTP 403)");

  // Restaurant A tries to modify Restaurant B's menu endpoint (Tenant isolation)
  const unauthorizedMenuRes = await fetch(`${BASE}/api/restaurants/royal-biryani/menu`, {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie: ownerCookie || "" },
    body: JSON.stringify({ name: "Intruder Item", basePrice: 200, categoryId: "cat-1" }),
  });
  assert(unauthorizedMenuRes.status === 403, "Restaurant A is BLOCKED from modifying Restaurant B's menu (HTTP 403)");

  // TEST SUITE 6: KITCHEN STAFF AUTHENTICATION (PIN & ROLE)
  console.log("\n[SUITE 6] Kitchen Terminal & Staff PIN Authentication");
  const kitchenLoginRes = await fetch(`${BASE}/api/auth/kitchen-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      restaurantSlug: "arabian-delight",
      pin: "1234",
    }),
  });
  const kitchenLoginJson = await kitchenLoginRes.json();
  assert(kitchenLoginJson.success === true, "Kitchen staff logged in with 4-digit PIN");
  assert(kitchenLoginJson.redirectUrl.includes("/kitchen"), "Redirects to kitchen KDS URL");
  const kitchenCookie = kitchenLoginRes.headers.get("set-cookie");

  // Kitchen staff tries to access restaurant admin route
  const kitchenRestrictedRes = await fetch(`${BASE}/api/restaurants/arabian-delight/menu`, {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie: kitchenCookie || "" },
    body: JSON.stringify({ name: "Malicious Item", basePrice: 250, categoryId: "cat-1" }),
  });
  assert(kitchenRestrictedRes.status === 403, "Kitchen staff is BLOCKED from editing restaurant menu (HTTP 403)");

  // TEST SUITE 7: CUSTOMER QR MENU & LIVE ORDERING WITH INDEPENDENT NUMBERING
  console.log("\n[SUITE 7] Customer QR Ordering & KOT Generation");
  // Fetch menu for Arabian Delight
  const restMenuRes = await fetch(`${BASE}/api/restaurants/arabian-delight`);
  const restMenuJson = await restMenuRes.json();
  assert(restMenuJson.success === true, "Public customer fetched restaurant digital menu");
  const table3 = restMenuJson.data.tables.find((t) => t.tableNumber === "03");
  assert(Boolean(table3 && table3.qrToken), "Table 03 has secure cryptographic QR token");

  // Place order
  const sampleItem = restMenuJson.data.menuItems[0];
  const orderRes = await fetch(`${BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      restaurantId: restMenuJson.data.restaurant.id,
      orderType: "dine_in",
      tableNumber: "03",
      token: table3.qrToken,
      customerName: "Rahul Sharma",
      customerPhone: "+91 98490 99887",
      paymentMethod: "upi",
      items: [
        {
          menuItemId: sampleItem.id,
          name: sampleItem.name,
          quantity: 2,
          unitPrice: sampleItem.basePrice,
          totalPrice: sampleItem.basePrice * 2,
          specialInstructions: "Less spicy, extra crisp",
        },
      ],
    }),
  });
  const orderJson = await orderRes.json();
  assert(orderJson.success === true, "Customer placed dine-in order successfully without login");
  assert(Boolean(orderJson.data?.orderNumber), `Order Number assigned: ${orderJson.data?.orderNumber}`);
  assert(Boolean(orderJson.data?.kotNumber), `KOT Number assigned: ${orderJson.data?.kotNumber}`);
  assert(Boolean(orderJson.data?.billNumber), `Bill Number assigned: ${orderJson.data?.billNumber}`);
  assert(Boolean(orderJson.data?.tokenNumber), `Token Number assigned: ${orderJson.data?.tokenNumber}`);

  // Kitchen updates order status to 'preparing' then 'ready'
  const newOrderId = orderJson.data.id;
  const updateStatusRes = await fetch(`${BASE}/api/orders`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      restaurantId: restMenuJson.data.restaurant.id,
      orderId: newOrderId,
      newStatus: "preparing",
    }),
  });
  const updateJson = await updateStatusRes.json();
  assert(updateJson.success === true, "Kitchen updated order status to 'preparing'");

  // Customer order tracking endpoint
  const trackRes = await fetch(`${BASE}/api/orders/${newOrderId}`);
  const trackJson = await trackRes.json();
  assert(trackJson.data?.orderStatus === "preparing", "Customer tracking timeline shows status 'preparing'");

  // Customer feedback rating
  const feedbackRes = await fetch(`${BASE}/api/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      restaurantId: restMenuJson.data.restaurant.id,
      orderId: newOrderId,
      tableNumber: "03",
      customerName: "Rahul Sharma",
      rating: 5,
      comment: "Superb flavor! QR ordering was lightning fast.",
      tags: ["Delicious Food", "Fast Service"],
    }),
  });
  const feedbackJson = await feedbackRes.json();
  assert(feedbackJson.success === true, "Customer submitted 5-star feedback rating");

  // PRINT SUMMARY
  console.log("\n=======================================================");
  console.log(`  E2E TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("=======================================================\n");

  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error("Test runner encountered error:", err);
  process.exit(1);
});
