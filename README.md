###  **webpack-image-compression**

#### 开发灵感：

* 解决项目中压缩频繁在线压缩图片；
* 解决项目中图片被压缩多次导致的图片失真；

#### 使用：

```javascript
const webpackImageCompression = require('webpack-image-compression');
new webpackImageCompression({
  compressDir: 'src',
  key: '**********'
}),
```

#### 参数说明：

| 名称        | 说明                   | 是否必填 |
| ----------- | :--------------------- | -------- |
| compressDir | 压缩图片检索文件夹名称 | true     |
| key         | tinify 压缩图 key      | False    |
|             |                        |          |

#### 常见 Q & A：

1、key 是什么？ 从哪里获取？

答：详情请见： <https://tinypng.com/developers/reference/nodejs> 

2、不设置key的后果？

答： 默认使用插件自带的key，每个月限量 500 张图片，后续迭代会成不限量。

3、compressDir 不设置会有什么后果？

答：压缩检索不到文件夹会导致插件报错。

4、加上插件后为什么会打包这么慢？

答： 由于在打包过程中会逐步压缩图片。导致 Build 时间延长。后续会优化这一点。