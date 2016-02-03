chrome.devtools.panels.create("sessionID",
    "icon.png",
    "../html/panel.html",
    function(extensionPanel) {

        var show = new Promise(function(resolve, reject) {
            extensionPanel.onShown.addListener(function(panelWindow) {                            
                resolve(panelWindow);
            });                
        });

        show.then(function(_panelWindow) {

            _panelWindow.document.getElementById("copy").addEventListener('click', function(e) {
                _panelWindow.document.execCommand('copy');
            });                

            _panelWindow.document.addEventListener('copy', function (e) {
                e.preventDefault();                
                e.clipboardData.setData('text/plain', getCurrentSessionIdDOM(_panelWindow).textContent);
            });        

            chrome.devtools.network.onRequestFinished.addListener(
                function(request) {
                    var headers = request.request.headers.filter(function(e) {
                        return e.name == "sessionID";
                    });

                    var sessionIdDiv = getCurrentSessionIdDOM(_panelWindow);                    
                    var currentValue = sessionIdDiv.textContent;
                    if (headers.length > 0) {
                        var headerValue = headers[0].value;
                        if (currentValue != headerValue) {
                            sessionIdDiv.textContent = headerValue;
                        }                        
                    }
                                    
                }
            );
        
        });
    }
);

function getCurrentSessionIdDOM(wnd) {
    return wnd.document.getElementById("sessionId");
}