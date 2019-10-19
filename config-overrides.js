const {
  override, useBabelRc, addLessLoader, addWebpackAlias
} = require('customize-cra')
const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

module.exports = {
  webpack: override(
    useBabelRc(),
    addWebpackAlias({
      '@': resolve('src')
    }),
    addLessLoader({
      javascriptEnabled: true,
      modifyVars: { '@base-color': '#607d8b' }
    })
  )
}
