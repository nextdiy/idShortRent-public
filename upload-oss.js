//这里将客户端打包文件上传到阿里oss
//需自行配置accessKeyId、accessKeySecret、bucket、region


//上传打包的客户端文件到oss
const OSS = require("ali-oss");
const fs = require("fs");
const path = require("path");
const os = require("os");
const PUBLIC_PATH = path.join(__dirname, "/");

const client = new OSS({
  accessKeyId: "accessKeyId",
  accessKeySecret: "accessKeySecret",
  bucket: "bucket",
  region: "region"
});

/**
 *获取文件目录并删除
 * @param {*} dir //文件目录
 */
async function deleteDir(dir) {
    let result = await client.list({
      prefix: dir + "/",
      delimiter: "/"
    });
    if (result.objects) {
      let aa = [];
      result.objects.forEach(function(obj) {
        aa.push(obj.name);
      });
      try {
        await client.deleteMulti(aa, {
          quiet: true
        });
        console.log("删除成功");
      } catch (e) {
        console.log("文件删除失败", e);
      }
    }
  }
  
  /**
   * 遍历文件夹递归上传
   * @param {path} src 本地路径
   * @param {string} dist oos文件夹名 www|kouzi
   */
  function addFileToOSSSync(src, dist) {
    let docs = fs.readdirSync(src);
    docs.forEach(function(doc) {
      let _src = src + "/" + doc,
        _dist = dist + "/" + doc;
      let st = fs.statSync(_src);
      // 判断是否为文件
      if (st.isFile() && doc !== ".DS_Store") {
        putOSS(_src, _dist);
      }
      // 如果是目录则递归调用自身
      else if (st.isDirectory()) {
        addFileToOSSSync(_src, _dist);
      }
    });
  }
  /**
   *单个文件上传至oss
   */
  async function putOSS(src, dist) {
    try {
      await client.put("/" + dist, src);
    } catch (e) {
      console.log("上传失败".e);
    }
  }
  /**
   *上传文件启动
   *@param {string} dirName 将要上传的文件名
   */
  async function upFile(dirName) {
    try {
      await deleteDir(dirName);
      await addFileToOSSSync(PUBLIC_PATH + ".nuxt/dist/client", dirName);
      console.log(dirName + "上传oss成功");
    } catch (err) {
      console.log(dirName + "上传oss成功失败", err);
    }
  }

  upFile("");  