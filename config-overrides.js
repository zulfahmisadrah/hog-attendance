const {
    override,
    fixBabelImports,
    addLessLoader,
} = require("customize-cra");

module.exports = override(
    fixBabelImports("import", {
        libraryName: "antd",
        libraryDirectory: "es",
        style: true
    }),
    addLessLoader({
        lessOptions: {
            javascriptEnabled: true,
            modifyVars: {
                "@primary-color": '#1890ff',
                '@link-color': '#d09228',
                '@layout-header-background': '#1890ff',
                '@menu-dark-item-active-bg': '#aad09228',
                '@form-item-margin-bottom': '18px',
                '@primary-1': '#fffcf0',
            }
        }
    })
);