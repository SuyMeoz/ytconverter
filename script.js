document.addEventListener('DOMContentLoaded', function() {
  const youtubeUrlInput = document.getElementById('youtubeUrl');
  const mp3Btn = document.getElementById('mp3Btn');
  const mp4Btn = document.getElementById('mp4Btn');
  const qualitySection = document.getElementById('qualitySection');
  const convertBtn = document.getElementById('convertBtn');
  const btnText = document.getElementById('btnText');
  const btnIcon = document.getElementById('btnIcon');
  const progressSection = document.getElementById('progressSection');
  const statusText = document.getElementById('statusText');
  const progressBar = document.getElementById('progressBar');
  const progressPercent = document.getElementById('progressPercent');
  const resultSection = document.getElementById('resultSection');
  const thumbnailPreview = document.getElementById('thumbnailPreview');
  const videoTitle = document.getElementById('videoTitle');
  const fileType = document.getElementById('fileType');
  const fileSize = document.getElementById('fileSize');
  const downloadLink = document.getElementById('downloadLink');
  const downloadInfo = document.getElementById('downloadInfo');

  let selectedFormat = 'mp3';

  mp3Btn.addEventListener('click', function() {
    selectedFormat = 'mp3';
    mp3Btn.classList.add('bg-blue-600', 'text-white');
    mp3Btn.classList.remove('bg-blue-100', 'text-blue-700');
    mp4Btn.classList.add('bg-purple-100', 'text-purple-700');
    mp4Btn.classList.remove('bg-purple-600', 'text-white');
    qualitySection.classList.remove('hidden');
  });

  mp4Btn.addEventListener('click', function() {
    selectedFormat = 'mp4';
    mp4Btn.classList.add('bg-purple-600', 'text-white');
    mp4Btn.classList.remove('bg-purple-100', 'text-purple-700');
    mp3Btn.classList.add('bg-blue-100', 'text-blue-700');
    mp3Btn.classList.remove('bg-blue-600', 'text-white');
    qualitySection.classList.remove('hidden');
  });

  mp3Btn.click();

  convertBtn.addEventListener('click', function() {
    const youtubeUrl = youtubeUrlInput.value.trim();
    if (!youtubeUrl) {
      alert('Vui lòng nhập liên kết YouTube!');
      return;
    }
    if (!youtubeUrl.includes('youtube.com') && !youtubeUrl.includes('youtu.be')) {
      alert('Liên kết YouTube không hợp lệ!');
      return;
    }
    btnText.textContent = 'Đang xử lý...';
    btnIcon.className = 'fas fa-spinner fa-spin ml-2';
    convertBtn.disabled = true;
    progressSection.classList.remove('hidden');
    startConversion();
  });

  async function startConversion() {
    try {
      statusText.textContent = 'Đang kết nối...';
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: youtubeUrlInput.value.trim(),
          format: selectedFormat,
          quality: document.getElementById('qualitySelect').value
        })
      });
      if (!response.ok) throw new Error('Server error');
      const data = await response.json();
      showResult(data);
    } catch (error) {
      statusText.textContent = 'Lỗi: ' + error.message;
      btnText.textContent = 'Thử lại';
      btnIcon.className = 'fas fa-redo ml-2';
      convertBtn.disabled = false;
    }
  }

  function showResult(data) {
    progressSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
    const quality = document.getElementById('qualitySelect').value;
    videoTitle.textContent = `Video YouTube đã chuyển đổi (${quality})`;
    fileType.textContent = selectedFormat.toUpperCase();
    fileSize.textContent = data.fileSize ? `${data.fileSize} MB` : '~ MB';
    thumbnailPreview.src = data.thumbnail || `https://placehold.co/300x200?text=YouTube+Thumbnail`;
    downloadInfo.textContent = selectedFormat === 'mp3'
      ? `Tập tin âm thanh đã sẵn sàng để tải về.`
      : `Tập tin video đã sẵn sàng để tải về.`;
    btnText.textContent = 'Chuyển Đổi Thêm';
    btnIcon.className = 'fas fa-arrow-right ml-2';
    convertBtn.disabled = false;
    downloadLink.href = data.downloadUrl || '#';
    downloadLink.target = '_blank';
  }
});