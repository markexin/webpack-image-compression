/*
 * @Description: webpack 打包编译图片压缩
 * @Author: maqun02
 * @LastAuthor: maqun02
 * @since: 2019-04-18 16:56:15
 * @lastTime: 2019-04-18 17:00:49
 */

class webpackImageCompression {
    apply (compiler) {
        // 指定要附加到的事件钩子函数
        compiler.hooks.emit.tapAsync('webpackImageCompression', (compilation, callback) => {
                console.log('This is an example plugin!');
                console.log('Here’s the `compilation` object which represents a single build of assets:', compilation);
                // 使用 webpack 提供的 plugin API 操作构建结果
                compilation.addModule(/* ... */);
                callback();
            }
        );
    }
}


module.exports = webpackImageCompression;