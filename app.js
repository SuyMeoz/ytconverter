const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

app.use(cors());
app.use(express.json());

// Phục vụ file tĩnh
app.use(express.static(__dirname));

// Route mặc định trả về index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API trả về thông tin video và tạo endpoint tải về
app.post('/api/convert', async (req, res) => {
  const { url, format, quality } = req.body;

  if (!ytdl.validateURL(url)) {
    return res.status(400).json({ error: 'Liên kết YouTube không hợp lệ!' });
  }

  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;
    const thumbnail = info.videoDetails.thumbnails[0].url;

    // Tạo endpoint tải về
    const downloadPath = `/download?url=${encodeURIComponent(url)}&format=${format}&quality=${quality}`;

    res.json({
      title,
      thumbnail,
      downloadUrl: downloadPath,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình chuyển đổi.' });
  }
});

// Endpoint thực hiện tải về thực sự
app.get('/download', (req, res) => {
  const { url, format, quality } = req.query;
  if (!ytdl.validateURL(url)) {
    return res.status(400).send('Liên kết không hợp lệ');
  }
  const filter = format === 'mp3' ? 'audioonly' : 'audioandvideo';
  const options = {
    quality: quality === 'best' ? 'highest' : 'lowest',
    filter,
  };
  res.header('Content-Disposition', `attachment; filename="video.${format}"`);
  ytdl(url, options).pipe(res);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});