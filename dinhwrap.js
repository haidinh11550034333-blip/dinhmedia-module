// dinhwrap.js - Wrapper chuyển hướng sang script của Đình Media
const url = "https://raw.githubusercontent.com/haidinh1150034333-blip/dinhmedia-module/main/dinhmedia.js";

$httpClient.get(url, function(error, response, data) {
  if (error) {
    $done({});
  } else {
    // Thực thi script nội bộ hoặc trả về body tùy chỉnh
    $done({ body: $response.body });
  }
});
