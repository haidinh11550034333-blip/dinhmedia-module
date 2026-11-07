// dinhmedia.js - Đình Media Locket Gold Unlocker
let body = {};

if (typeof $response !== "undefined" && $response.body) {
  try {
    body = JSON.parse($response.body);
  } catch (e) {
    // Tránh treo mạng nếu body không phải JSON
    $done({});
  }
}

// 1. Kích hoạt gói Locket Gold (RevenueCat API)
if (body.subscriber) {
  body.subscriber.subscriptions = body.subscriber.subscriptions || {};
  body.subscriber.subscriptions["com.locket.Locket.premium.yearly"] = {
    is_sandbox: false,
    ownership_type: "PURCHASED",
    period_type: "normal",
    purchase_date: "2026-01-01T00:00:00Z",
    expires_date: "2099-12-31T23:59:59Z"
  };

  body.subscriber.entitlements = body.subscriber.entitlements || {};
  body.subscriber.entitlements["Gold"] = {
    expires_date: "2099-12-31T23:59:59Z",
    product_identifier: "com.locket.Locket.premium.yearly",
    purchase_date: "2026-01-01T00:00:00Z"
  };
}

// 2. Mở khóa tính năng ngầm (Firebase RemoteConfig API)
if (body.entries) {
  if (body.entries.can_show_gold_paywall) {
    body.entries.can_show_gold_paywall.value = "true";
  }
}

// 3. Đổi giao diện thương hiệu sang Đình Media
if (body.data) {
  body.data.title = "Locket Gold VIP - Đình Media 👑";
  body.data.subtitle = "Đã kích hoạt thành công Locket Gold • Đình Media ❤️";
}

$done({ body: JSON.stringify(body) });
