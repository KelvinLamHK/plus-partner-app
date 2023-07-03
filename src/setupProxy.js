const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function(app){
    
    app.use(
        createProxyMiddleware('/v1',{
            // target: "https://flexuat.interconnect.systems",
            target: "https://dev-plus-partner-api.apps.ocpuat.interconnect.systems",
            changeOrigin: true,
            secure: false,
            headers:{
                'Content-Type': 'application/json',
                // client_id: "56ac48f8228b4602a56097d390b91786",
                // client_secret: "5fFe2DE79D4247288f8BE2462ebd7Bb4",
            }
            
        })
    )
};