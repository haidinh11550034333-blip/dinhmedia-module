let body = {};
if (typeof $response !== "undefined" && $response.body) {
  try {
    body = JSON.parse($response.body);
  } catch (e) {
    body = {};
  }
}

// 1. Kích hoạt Locket Gold
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

// 2. Đổi tên thương hiệu thành Đình Media
if (body.data) {
  body.data.title = "Locket Gold VIP - Đình Media 👑";
  body.data.subtitle = "Đã kích hoạt thành công Locket Gold • Đình Media ❤️";
}

$done({ body: JSON.stringify(body) });
