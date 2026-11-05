// ĐÌNH MEDIA – bản "bọc": tự chạy script gốc rồi đổi chữ ngay sau đó trong CÙNG một lần chạy.
// Nhờ vậy không phụ thuộc thứ tự chạy của Shadowrocket.
const VERSION = "w1";
const BRAND = "ĐÌNH MEDIA";
const HANDLE = "dinhmedia";
const SITE = "DinhMedia.COM";
const IMAGE_URL = "";            // link ảnh vuông thay ảnh popup; để trống = không đổi
const CACHE_HOURS = 6;           // lưu script gốc trong máy bao nhiêu giờ rồi tải lại

const BASE = "https://raw.githubusercontent.com/leanhminh2104/locketlam/refs/heads/shadowrocket/locketlam/";
function pickSource(url) {
  if (/firebaseremoteconfig\.googleapis\.com/.test(url)) return "locket_remote.js";
  if (/api\.(revenuecat|rc-backup)\.com/.test(url)) return "locketlam.js";
  if (/api\.locketcamera\.com/.test(url)) return "locket_profile.js";
  return null;
}

const REPLACEMENTS = [
  ["Độc Quyền LAMDev", "Độc quyền " + BRAND],
  ["Locket Gold VIP - LAMDev", "Locket Gold VIP - " + BRAND],
  ["LocketLAM", "Locket " + BRAND],
  ["DaLyMMo.COM", SITE],
  ["LAMDev", BRAND],
  ["Đinh Duy Vinh", BRAND],
  ["Duy Vinh", BRAND],
  ["tiktok.com/@duyvinh.09", "tiktok.com/@" + HANDLE],
  ["instagram.com/duyvinh.09", "instagram.com/" + HANDLE],
  ["@duyvinh.09", "@" + HANDLE],
  ["@duyvinh09", "@" + HANDLE],
];

const esc = (s, upper) =>
  s.replace(/[^\x00-\x7F]/g, (c) => {
    const h = c.charCodeAt(0).toString(16).padStart(4, "0");
    return "\\u" + (upper ? h.toUpperCase() : h);
  });
const countLam = (b) =>
  b.split("LAMDev").length - 1 + (b.split("Độc Quyền").length - 1) + (b.split("\\u1ed9c Quy").length - 1);

function rebrand(body) {
  for (const [from, to] of REPLACEMENTS) {
    body = body.split(from).join(to);
    body = body.split(esc(from, false)).join(esc(to, false));
    body = body.split(esc(from, true)).join(esc(to, false));
  }
  body = body.replace(/Độc [Qq]uyền [^"\\,]{1,30}/g, (m) => (m.includes(BRAND) ? m : "Độc quyền " + BRAND));
  if (IMAGE_URL) {
    body = body.replace(/(\\?"imageURL\\?"\s*:\s*\\?")[^"\\]*(\\?")/g, (m, a, b) => a + IMAGE_URL + b);
  }
  return body;
}

const url = ($request && $request.url) || "";
const tag = "[dinhwrap " + VERSION + "] " + url.slice(0, 70);

function finish(o, from) {
  try {
    if (o && typeof o.body === "string") {
      const before = countLam(o.body);
      o.body = rebrand(o.body);
      console.log(tag + " | " + from + " | truoc=" + before + " sau=" + countLam(o.body));
    } else {
      console.log(tag + " | " + from + " | script goc khong tra body");
    }
  } catch (e) {
    console.log(tag + " | loi doi chu: " + e);
  }
  $done(o || {});
}

function runOriginal(src, from) {
  try {
    // Truyền các biến toàn cục của Shadowrocket vào script gốc một cách tường minh
    const g = (n) => { try { return eval("typeof " + n + " !== 'undefined' ? " + n + " : undefined"); } catch (e) { return undefined; } };
    new Function(
      "$done", "$request", "$response", "$httpClient", "$persistentStore", "$notification", "$argument", "console",
      src
    )(
      (o) => finish(o, from),
      g("$request"), g("$response"), g("$httpClient"), g("$persistentStore"), g("$notification"), g("$argument"), console
    );
  } catch (e) {
    console.log(tag + " | loi chay script goc: " + e);
    $done({});
  }
}

const name = pickSource(url);
if (!name) {
  $done({});
} else {
  const kSrc = "dinhwrap_src_" + name, kTs = "dinhwrap_ts_" + name;
  const cached = $persistentStore.read(kSrc);
  const ts = parseInt($persistentStore.read(kTs) || "0", 10);
  const fresh = cached && Date.now() - ts < CACHE_HOURS * 3600 * 1000;
  if (fresh) {
    runOriginal(cached, "cache");
  } else {
    $httpClient.get({ url: BASE + name, timeout: 15 }, (err, resp, data) => {
      if (!err && data && data.length > 50) {
        $persistentStore.write(data, kSrc);
        $persistentStore.write(String(Date.now()), kTs);
        runOriginal(data, "tai-moi");
      } else if (cached) {
        runOriginal(cached, "cache-du-phong");
      } else {
        console.log(tag + " | khong tai duoc script goc: " + err);
        $done({});
      }
    });
  }
}
