var gui = require('nw.gui');
var win = gui.Window.get();
var fs = require('fs');
var config = {
    homepage: 'google.com',
    name: 'Aurora Browser',
    showDevTools: false,
    header: {
        back: true,
        forward: true,
        refresh: true,
        dev: true,
        address: true
    },
    proxy: false
};

/**
 * Upload a file.
 * @param {object}    fileObject - File data structure.
 * @param {function}  callBack - callback to be called when the file is loaded.
 * @return            The file is uploaded.
 */
function uploadFile(fileObject, callBack) {
    var input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
        var file = e.target.files[0];
        fileObject.path = file.path;
        fileObject.fullFileName = file.name;
        fileObject.fileName = fileObject.fullFileName.split('.').shift();
        fileObject.fileExtension = fileObject.fullFileName.split('.').pop();
        var reader = new FileReader();
        reader.readAsText(file,'UTF-8');
        reader.onload = readerEvent => {
            fileObject.fileData = readerEvent.target.result;
            if (typeof callBack != 'undefined') {
                callBack(fileObject);
            }
        }
    }
    input.click();
}

/**
 * Load a file.
 * @param {object}    fileObject - File data structure.
 * @param {function}  callBack - callback to be called when the file is loaded.
 * @return            The file is loaded.
 */
function loadFile(fileObject) {
    var address = document.getElementById('address');
    address.value = 'file://' + fileObject.path;
    
    nwjsBrowser.contentWindow.window.location.href = nwjsProxy + address.value;
}

// Read the configuration file.
fs.readFile(
    './browser.config.json',
    {
       encoding: 'utf8' 
    },
    function (err, data) {
        if (err){ 
            console.warn(err);
        }
        
        config = JSON.parse(data);
        
        init();
    }
);

// Setup for init browser after page be completely loaded.
window.addEventListener('DOMContentLoaded', initBrowser);

/**
 * Init the toolbar.
 * @return  Toolbar ready to work.
 */
function init() {
    window.nwjsProxy = '';
    
    if (config.proxy) {
        window.nwjsProxy = 'http://www.webproxy.net/view?q=';
    }
    
    if (config.homepage.indexOf('//') < 0) {
        config.homepage = 'http://' + config.homepage;
    }
    
    if (config.showDevTools) {
        setTimeout(
            function () {
                win.showDevTools();
            },
            2000
        );
    }
}

/**
 * Init browser.
 * @return  Browser ready to work.
 */
function initBrowser() {
    window.nwjsHeader=document.querySelector('header');
    window.nwjsBrowser=document.querySelector('#browser');
    
    if (config.proxy) {
        nwjsBrowser.addEventListener('load', 
            function () {
                setTimeout(
                    function () {
                        try {
                            nwjsBrowser.contentWindow.document.querySelector('#webproxy_wp_bar_brd').click();
                        } catch(err) {
                        }
                    },
                    1000
                );
            }
        );
    }
    
    nwjsHeader.addEventListener('click', navigate);
    nwjsHeader.addEventListener('keyup', go);
    
    setTimeout(
        function () {
            for (var button in config.header) {
                if (!config.header[button]) {
                    document.querySelector('#'+button).classList.add('hidden');
                }
            }
            
            win.title = config.name;
            nwjsHeader.querySelector('#address').value = config.homepage;
            nwjsBrowser.contentWindow.window.location.href = nwjsProxy + config.homepage;
            
            setTimeout(
                function () {
                    nwjsBrowser.style.opacity = 1;
                },
                600
            );
            nwjsHeader.style.opacity = 1;
        },
        300
    );
}

/**
 * Show a URL.
 * @param {object}  e - Event object.
 * @return          URL showed.
 */
function go(e) {
    if (e.keyCode !== 13) {
        return;
    }
    
    if (e.target.value.indexOf('//') < 0) {
        e.target.value = 'http://' + e.target.value;
    }
    
    nwjsBrowser.contentWindow.window.location.href = nwjsProxy + e.target.value;
}

/**
 * Toolbar event handler.
 * @param {object}  e - Event object.
 * @return          Event processed.
 */
function navigate(e) {
    switch (e.target.id) {
        case 'back' :
        case 'forward' :
            nwjsBrowser.contentWindow.window.history[e.target.id]();
            break;
        case 'open' :
            var fileObject = {
                path: '',
                fullFileName: '',
                fileName: '',
                fileExtension: '',
                fileData: ''
            }
            
            uploadFile(fileObject, loadFile);
            break;
        case 'address' :
            e.target.select();
            break;
        case 'refresh' :
            nwjsBrowser.contentWindow.window.location.reload();
            break;
        case 'dev' :
            win.showDevTools();
            break;
    }
}
