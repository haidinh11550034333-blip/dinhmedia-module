// Thay chữ/ảnh hiển thị trong phản hồi (phải chạy SAU các script gốc)
// Cụm dài đặt trước cụm ngắn.
const REPLACEMENTS = [
  ["Độc Quyền LAMDev", "Độc quyền ĐÌNH MEDIA"],
  ["Locket Gold VIP - LAMDev", "Locket Gold VIP - ĐÌNH MEDIA"],
  ["LocketLAM", "Locket ĐÌNH MEDIA"],
  ["DaLyMMo.COM", "DinhMedia.COM"],
  ["LAMDev", "ĐÌNH MEDIA"], // quét nốt những chỗ còn sót
];

// Muốn đổi ảnh popup (ảnh QR dalymmo.com) thì dán link ảnh của bạn vào đây (https, ảnh vuông).
// Để trống = không đổi ảnh.
const IMAGE_URL = "";

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
  if (IMAGE_URL) {
    // khớp cả dạng "imageURL":"..." lẫn dạng đã escape \"imageURL\":\"...\"
    body = body.replace(/(\\?"imageURL\\?"\s*:\s*\\?")[^"\\]*(\\?")/g, (m, a, b) => a + IMAGE_URL + b);
  }
}

$done({ body });
