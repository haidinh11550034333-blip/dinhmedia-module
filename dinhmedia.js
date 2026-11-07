// dinhmedia.js - Fix chuẩn kích hoạt Locket Gold & Đình Media
let body = {};
if (typeof $response !== "undefined" && $response.body) {
  try {
    body = JSON.parse($response.body);
  } catch (e) {
    body = {};
  }
}

// Kiểm tra và khởi tạo cấu trúc dữ liệu subscriber của RevenueCat
if (!body.subscriber) {
  body.subscriber = {};
}

if (!body.subscriber.subscriptions) {
  body.subscriber.subscriptions = {};
}

if (!body.subscriber.entitlements) {
  body.subscriber.entitlements = {};
}

// 1. Kịch hoạt đăng ký gói năm (Subscriptions)
body.subscriber.subscriptions["com.locket.Locket.premium.yearly"] = {
  is_sandbox: false,
  ownership_type: "PURCHASED",
  period_type: "normal",
  purchase_date: "2026-01-01T00:00:00Z",
  expires_date: "2099-12-31T23:59:59Z"
};

// 2. Kịch hoạt quyền lợi Gold (Entitlements) - Cực kỳ quan trọng để app nhận diện
body.subscriber.entitlements["Gold"] = {
  expires_date: "2099-12-31T23:59:59Z",
  product_identifier: "com.locket.Locket.premium.yearly",
  purchase_date: "2026-01-01T00:00:00Z",
  ownership_type: "PURCHASED"
};

// 3. Tùy chỉnh giao diện thông báo sang Đình Media
if (body.data) {
  body.data.title = "Locket Gold VIP - Đình Media 👑";
  body.data.subtitle = "Đã kích hoạt thành công Locket Gold • Đình Media ❤️";
}

$done({ body: JSON.stringify(body) });
