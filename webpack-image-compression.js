/*
 * @Description: webpack 打包编译图片压缩
 * @Author: maqun
 * @LastAuthor: maqun
 * @since: 2019-04-18 16:56:15
 * @lastTime: 2019-04-22 20:48:14
 */
const fs = require('fs');
const path = require('path');
const tinify = require("tinify");
const config = require('./config/key');

// 工具类
class utils {

    filePathMethod (fileString) {
        return path.resolve(__dirname + (fileString || ''));
    }

    isImage (file) {
        return (/\.(png|jpe?g|gif|svg)(\?.*)?$/).test(file);
    }

    timeFormat (time) {
        const date = new Date(time),
        Y = date.getFullYear() + '-',
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
        D = date.getDate() + ' ',
        h = date.getHours() + ':',
        m = date.getMinutes() + ':',
        s = date.getSeconds()
        return Y + M + D + h + m + s;
    }

}

// 主程序
class webpackImageCompression extends utils {

    constructor (options) {
        super(options);
        this.cache = {};
        this.props = options;
        // 默认每个月500张
        tinify.key = (options && options.key) || config.PRIVATE_KEY;
    }

    reWrite () {
        // 复写缓存cache
        fs.writeFile(this.filePathMethod('/.imageCache.js'), `module.exports = ${JSON.stringify(this.cache)}`);
    }

    fileDisplay (filePath) {
        // 根据文件路径读取文件，返回文件列表
        fs.readdir(filePath, { encoding: 'utf8' }, (err, files) => {

            if(err) throw err;
            
            // 遍历读取到的文件列表
            files.forEach( filename => {
                // 获取当前文件的绝对路径
                let fileAbsoluteAddress = path.join(filePath, filename);
                // 根据文件路径获取文件信息，返回一个fs.Stats对象
                fs.stat(fileAbsoluteAddress, (error, stats) => {
                    if(err) throw error;

                    const isFile = stats.isFile();
                    const isDir = stats.isDirectory();
                    const { compressDir } = this.props;
                    const num = `${filePath}/${filename}`.indexOf(`${compressDir}`);
                    const cacheKey = `${filePath}/${filename}`.substring(num);
                    if(isFile && this.isImage(filename) && !Object.prototype.hasOwnProperty.call(this.cache, cacheKey)) {
                        // 更新缓存
                        this.cache[cacheKey] = this.timeFormat(new Date());
                        tinify.fromFile(`${filePath}/${filename}`).toFile(`${filePath}/${filename}`);
                    }
                    // 递归，如果是文件夹，就继续遍历该文件夹下面的文件
                    if(isDir) 
                        this.fileDisplay(fileAbsoluteAddress);
                })
            });
        });
        
    }

    apply (compiler) {
        // 指定要附加到的事件钩子函数
        compiler.hooks.emit.tapAsync('webpackImageCompression', (compilation, callback) => {
                // 判断是否存在 cache 镜像 
                try {
                    const imageCache = require('./.imageCache');
                    this.cache = imageCache;
                } catch (error) {
                    fs.writeFile(this.filePathMethod('/.imageCache.js'), 'module.exports = {}');
                }
                // 调用递归
                this.fileDisplay(this.filePathMethod(`/${this.props.compressDir}`));
                callback();
            }
        );

         // 异步的事件钩子
        compiler.plugin('afterEmit', () => this.reWrite());

    }
    
}


module.exports = webpackImageCompression;