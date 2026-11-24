module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://uplocket.io.vn/api/v1/packages', {
      headers: {
        Authorization: `Bearer ${process.env.UPLOCKET_API_KEY}`,
      },
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Không kết nối được tới Uplocket' });
  }
};