const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// 정적 파일 제공을 위한 디렉토리 설정
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// 파일 저장 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // 영어와 숫자를 포함한 7자로 된 파일명 생성
    let customFileName = crypto.randomBytes(3).toString('hex');
    let fileExtension = path.extname(file.originalname).toLowerCase();
    cb(null, customFileName + fileExtension);
  }
});

const upload = multer({ storage: storage });

// 이미지 업로드 폼을 제공하는 라우트
app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, '/upload.html'));
});

// 이미지 업로드를 처리하는 라우트
app.post('/upload', upload.single('image'), (req, res) => {
  res.send(`<h2>업로드 성공</h2><img src="/uploads/${req.file.filename}" alt="uploaded image"/>`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
