document.addEventListener('DOMContentLoaded', function () {
    function init() {
        gapi.load('client', function () {
            gapi.client.init({
                apiKey: "api_key",
                clientId: 'client_id',
                scope: 'https://www.googleapis.com/auth/earthengine.readonly'
            }).then(function () {
                ee.data.authenticateViaOauth(gapi.auth2.getAuthInstance(), function () {
                    console.log('Autenticação bem-sucedida!');
                    // ee.initialize();
                    // runAnalysis();
                }, function (e) {
                    console.error('Autenticação falhou: ', e);
                });
            });
        });
    }
    
    window.onload = init;
});
