const express = require('express');
const upload = require('multer')({ dest: 'uploads/' });
const path = require('path');
const fs = require('fs');
const port = 8088;

let  app = express();
// 允许跨域
app.all('*', function(req, res, next) {
  　　  res.header("Access-Control-Allow-Origin", "*"); // 表示任意的源
 　　　　// res.header("Access-Control-Allow-Origin", "http://www.wtapi.wang"); // 只有这个网址
 　　　　res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 　　　　res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
 　　　　res.header("X-Powered-By",'unknown')
 　　　　res.header("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
 　　　　next();
 });


app.set('port', port);
// index.html, index.js放在static文件夹中
app.use(express.static(path.join(__dirname, 'static')));

// 重定向
app.get('/', function(req, res){
  res.redirect('/ajax-upload');
}); 
app.get('/ajax-upload', function(req, res){  
  res.sendFile('upload.html', { root: __dirname });  
});  
app.post('/upload', upload.single('test-upload'), (req, res) => {
  // 没有附带文件
  if (!req.file) {
    res.json({ ok: false });
    return;
  }

  // 输出文件信息
  console.log('====================================================');
  console.log('fieldname: ' + req.file.fieldname);
  console.log('originalname: ' + req.file.originalname);
  console.log('encoding: ' + req.file.encoding);
  console.log('mimetype: ' + req.file.mimetype);
  console.log('size: ' + (req.file.size / 1024).toFixed(2) + 'KB');
  console.log('destination: ' + req.file.destination);
  console.log('filename: ' + req.file.filename);
  console.log('path: ' + req.file.path);

  // 重命名文件
  let oldPath = path.join(__dirname, req.file.path);
  let newPath = path.join(__dirname, 'uploads/' + req.file.originalname);
  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      res.json({ ok: false });
      console.log(err);
    } else {
      res.json({ ok: true });
    }
  });
});
app.get('/abort', upload.single('test-upload'), (req, res)=>{
  console.log(req, 'abort') // 删除刚才上传的文件
})

app.listen(port, () => {
  console.log(`[Server] localhost:port ${port} ,timeNow: ${new Date()}`);
});
