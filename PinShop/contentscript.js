$(document).ready(function () {
    
    initPinShop();
});

//check whether it is a product link
function isProdLink(sourceURL, callback) {
    var request2 = new XMLHttpRequest();
    try {
        request2.overrideMimeType('text/xml');
        request2.open("GET", sourceURL, true);
        request2.onreadystatechange = function () {
            if (request2.readyState === 4) {
                if (request2.status === 200) {
                    sourcetext = request2.responseText.toLowerCase();
                    if (sourcetext.indexOf("add to cart") != -1)
                        callback(true);
                    else if (sourcetext.indexOf("add to bag") != -1)
                        callback(true);
                    else if (sourcetext.indexOf("cart") != -1)
                        callback(true);
                    else if (sourcetext.indexOf("shopping bag") != -1)
                        callback(true);
                    else if (sourcetext.indexOf("buy it now") != -1)
                        callback(true);
                    else
                        callback(false);
                }
            }
        }
        request2.send(null);
    } catch (e) {
        console.log(e);
        callback(false);
    }
}

//go to the Pinterest item's page and extract the source link
function isValid(pinhref, callback) {
    var pinURL = "http://pinterest.com" + pinhref;
    var request = new XMLHttpRequest();
    request.overrideMimeType('text/xml');
    request.open("GET", pinURL, true);
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                pintext = request.responseText;
                var div = document.createElement('div');
                div.innerHTML = pintext;
                var sourceURL = div.querySelector("#PinSource a");
                isProdLink(sourceURL, function(tf) {
                    callback(tf);
                });
            }
        }
        callback(false);
    }
    request.send(null);
}

function initPinShop() {
    index = 0;
    setInterval(function() {
        var pins = $('.pin'),
            $pinprod = $('<li id = "pinprod"></li>').prependTo(pins);
        pins.each(function(e) {
            if (e >= index) {
                var i = $(this);
                j = i.children('div');
                k = j.children('a');
                pinhref = k.attr("href");
                if (typeof pinhref === "string") {
                    isValid(pinhref, function(tf) {
                        if (tf == true) {
                            $m = i.children('li');
                            k = i.find('.ImgLink');
                            kPos = k.position();
                            var obj = {
                                    'position': 'absolute',
                                    'top': kPos.top,
                                    'left': kPos.left,
                                    'z-index': '1'
                            };
                            //change the next line if you want to change the image labelling the products
                            $m.css(obj).html('<img src="data:image/png;base64,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" alt="">');
                        }
                    });
                }
                index = e + 1;
            }
        });
    }, 1000);
}