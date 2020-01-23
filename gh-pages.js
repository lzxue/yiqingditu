/**
 * 因为 gh-pages 默认仓库地址是 https, 但是 travis CI 里，用 https 会报 `remote: Invalid username or password.`
 * 参考 https://www.hidennis.tech/2015/07/07/deploy-blog-using-travis/
 * 将 github 地址改为 'git@github.com:chenwangji/recipe.git'
 * 最终能解决问题。
 */

var ghpages = require('gh-pages')
var REPO = 'git@github.com:lzxue/yiqingditu.git'

function callback(e) {
  console.log(e)
  if (e) {
    console.err(e)
    return
  }
  console.log('deploy succeed !')
}

ghpages.publish('build', {
  repo: REPO,
}, callback)