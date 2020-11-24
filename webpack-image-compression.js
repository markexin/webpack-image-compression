/*
 * @Description: webpack 打包编译图片压缩
 * @Author: maqun
 * @LastAuthor: Please set LastEditors
 * @since: 2019-04-18 16:56:15
 * @lastTime: 2020-11-24 17:12:53
 */
const fs = require('fs');
const path = require('path');
const tinify = require("tinify");
const crypto = require('crypto');
const md5 = crypto.createHash('md5');


const BASE_TINIFY_KEY = "5Xr3p0upUdjyn7Gksj6NoHY5A8A5U8dL";
const MD_KEY = "webpackImageCompression";

/**
 * 创建本地缓存文件
 * @param {string} source 创建文件路径
 */
function createCacheFile (source) {
    fs.writeFileSync(path.resolve(process.cwd() + (source || '')), "");
    return ;
}

/**
 * 判断图片格式
 * @param {string} file 文件路径
 */
function isImage (file) {
    return (/\.(png|jpe?g|gif|svg)(\?.*)?$/).test(file);
}

// 主程序
class webpackImageCompression {

    constructor (options) {
        // default
        this.options = options || {
            compressDir: "src",
            key: BASE_TINIFY_KEY
        };

        tinify.key = this.options.key;
    
    }

    tinyCompress (filePath) {
        // 根据文件路径读取文件，返回文件列表
        fs.readdir(filePath, { encoding: 'utf8' }, (err, files) => {

            if(err) throw err;
            
            // 遍历读取到的文件列表
            files.forEach(filename => {
                // 获取当前文件的绝对路径
                const fileAbsoluteAddress = path.join(filePath, filename);
                // 根据文件路径获取文件信息，返回一个fs.Stats对象
                fs.stat(fileAbsoluteAddress, (error, stats) => {
                    
                    if(err) throw error;

                    const isFile = stats.isFile();
                    const isDir = stats.isDirectory();

                    if (isDir) {
                        this.tinyCompress(fileAbsoluteAddress);
                        return
                    }
                    
                    if(isFile && isImage(filename)) {
                        const hashPassd = md5.update(filename).digest(MD_KEY);
                        // 更新缓存
                        tinify.fromFile(`${filePath}/${filename}`).toFile(`${filePath}/${filename}`);
                    }

                })
            });
        });
        
    }

    apply (compiler) {
        // 指定要附加到的事件钩子函数
        compiler.hooks.emit.tapAsync('webpackImageCompression', (compilation, callback) => {

                fs.access(path.resolve(`${process.cwd()}/.imageCache.md`), fs.constants.F_OK, (err) => {

                    if (err) {
                        createCacheFile('/.imageCache.md');
                    }

                    // 执行压缩
                    this.tinyCompress(
                        path.resolve(process.cwd() + `/${this.options.compressDir}`)
                    );

                });

                callback();
            }
        );

    }
    
}


module.exports = webpackImageCompression;