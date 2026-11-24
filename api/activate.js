module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { username, durationDays, accessCode } = req.body || {};

  // Kiểm tra mã đơn để tránh bị người lạ kích hoạt miễn phí
  if (process.env.ACCESS_CODE && accessCode !== process.env.ACCESS_CODE) {
    return res.status(403).json({ success: false, error: 'Mã xác nhận không đúng!' });
  }

  if (!username || !durationDays) {
    return res.status(400).json({ success: false, error: 'Vui lòng nhập username và chọn gói.' });
  }

  try {
    const response = await fetch('https://uplocket.io.vn/api/v1/dns/export', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.UPLOCKET_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: String(username).trim().replace(/^@/, ''),
        durationDays: Number(durationDays),
      }),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Lỗi kết nối máy chủ Uplocket' });
  }
};
