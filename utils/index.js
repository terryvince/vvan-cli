const fs = require("fs");
const path = require("path");
const {promisify} = require('util');
module.exports = {
  // 检查path目录或文件是否存在
  exists(path){
    return new Promise((resolve,reject) => {
      promisify(fs.stat)(path).then(stat => resolve(true)).catch(err => {
        if(err && err.code === "ENOENT"){
          resolve(false) // 文件不存在
          return
        }
        reject(err) // 发生错误
      })
    })
  },
  // 遍历目录，取得所有文件的path
  eachFiles(src) {
    var fileList = [];
    return new Promise((resolve, reject) => {
      +(function readDirRecur(folder, callback) {
        fs.readdir(folder, (err, files) => {
          if (err) return reject(err);
          var count = 0;
          var checkEnd = function () {
            ++count == files.length && resolve(fileList);
          };

          files.forEach((file) => {
            var fullPath = path.resolve(folder, file);

            fs.stat(fullPath, (err, stats) => {
              if (err) return reject(err);
              if (stats.isDirectory()) {
                return readDirRecur(fullPath, checkEnd);
              } else {
                fileList.push(fullPath);
                checkEnd();
              }
            });
          });
          //为空时直接回调
          files.length === 0 && resolve(fileList);
        });
      })(src, resolve);
    });
  },
  // 复制目录
  copyDir(srcDir, outDir) {
    const { resolve, join } = path;
    srcDir = resolve(srcDir); // 改成全路径
    outDir = resolve(outDir); // 改成全路径

    function copy(srcDir, outDir, callback) {
      fs.readdir(srcDir, (err, files) => {
        if (err) return callback(err);
        var count = 0;
        var checkEnd = function () {
          ++count == files.length && callback();
        };

        files.forEach((file) => {
          var curPath = resolve(srcDir, file);

          fs.stat(curPath, (err, stats) => {
            if (err) return callback(err);
            let tempPath = curPath.replace(srcDir, ""); //取得目录层级

            let fullPath = join(outDir, tempPath);

            if (stats.isDirectory()) {
              fs.mkdir(fullPath, function (err) {
                //创建目录后继续复制该目录下的文件
                if (err) return callback(err);
                copy(curPath, fullPath, checkEnd);
              });
              return;
            }

            let readable = fs.createReadStream(curPath);
            let writable = fs.createWriteStream(fullPath);
            readable.pipe(writable);
            checkEnd();
          });
        });
        //为空时直接回调
        files.length === 0 && callback();
      });
    }

    return new Promise((resolve, reject) => {
      fs.stat(outDir, (err) => {
        if (err && err.code === "ENOENT") {
          // 如果输出目录不存在就先创建目录
          fs.mkdirSync(outDir);
        }
        copy(srcDir, outDir, (err) => {
            if(err) return reject(err)
            resolve()
        })
      })
    })
  },
};
