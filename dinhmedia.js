// Đổi toàn bộ chữ "độc quyền" / tên tác giả gốc thành ĐÌNH MEDIA (chạy SAU các script gốc)

const BRAND = "ĐÌNH MEDIA";
const HANDLE = "dinhmedia";          // tên tài khoản dùng cho @handle / link mạng xã hội, sửa theo ý bạn
const SITE = "DinhMedia.COM";        // chữ hiển thị thay cho DaLyMMo.COM
const IMAGE_URL = "";                // dán link ảnh vuông của bạn để thay ảnh popup; để trống = không đổi

// Cụm dài đặt trước cụm ngắn. Chỉ thay chữ hiển thị, KHÔNG đụng vào đường link ảnh/script.
const REPLACEMENTS = [
  ["Độc Quyền LAMDev", "Độc quyền " + BRAND],
  ["Locket Gold VIP - LAMDev", "Locket Gold VIP - " + BRAND],
  ["LocketLAM", "Locket " + BRAND],
  ["DaLyMMo.COM", SITE],
  ["LAMDev", BRAND],
  ["Đinh Duy Vinh", BRAND],
  ["Duy Vinh", BRAND],
  ["@duyvinh.09", "@" + HANDLE],
  ["@duyvinh09", "@" + HANDLE],
  ["tiktok.com/@duyvinh.09", "tiktok.com/@" + HANDLE],
  ["instagram.com/duyvinh.09", "instagram.com/" + HANDLE],
];

// Chuyển ký tự không phải ASCII thành \uXXXX (phòng khi server trả JSON đã escape)
const esc = (s) =>
  s.replace(/[^\x00-\x7F]/g, (c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"));

let body = $response.body;

if (typeof body === "string" && body.length) {
  for (const [from, to] of REPLACEMENTS) {
    body = body.split(from).join(to);
    body = body.split(esc(from)).join(esc(to));
    body = body.split(esc(from).toUpperCase()).join(esc(to));
  }

  // Bắt nốt mọi tiêu đề kiểu "Độc quyền <tên khác>" (ngắn, không chứa dấu nháy/phẩy)
  body = body.replace(/Độc [Qq]uyền [^"\\,]{1,30}/g, (m) =>
    m.includes(BRAND) ? m : "Độc quyền " + BRAND
  );

  if (IMAGE_URL) {
    body = body.replace(/(\\?"imageURL\\?"\s*:\s*\\?")[^"\\]*(\\?")/g, (m, a, b) => a + IMAGE_URL + b);
  }
}

$done({ body });
