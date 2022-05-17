/**
 * css —— 自动引入 全局变量 和 混合mixin 样式
 */
module.exports = {
  productionSourceMap: false,
  publicPath: './', // 部署应用包时的基本 URL
  outputDir: 'dist', // 打包输出的文件夹名称
  assetsDir: 'static', // 静态文件存放地址
  devServer: {
    port: 4567,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/mapapi': {
        target: 'http://192.168.2.103:9001/map/map', // 后台接口域名
        ws: true, // 如果要代理 websockets，配置这个参数
        secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/mapapi': '/'
        }
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import '@/styles/variable.scss';
          @import '@/styles/mixins.scss';
          @import '@/styles/global.scss';
          @import '@/styles/font.scss';
        `
      }
    }
  },
  configureWebpack: config => {
    return {
      optimization: {
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            elementPlus: {
              name: `chunk-element`,
              test: /[\\/]node_modules[\\/]_?element-plus(.*)/,
              priority: 20
            },
            echarts: {
              name: 'chunk-echarts',
              test: /[\\/]node_modules[\\/]_?echarts(.*)/,
              priority: 25
            }
          }
        }
      }
    }
  }
}
