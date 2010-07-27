(function(){

//----------------------------------------------------------------------------    
defClass(function CachedResource(url) {
    this._url = url
})

//----------------------------------------------------------------------------    
defMethod(function getRemote() {
    var xhr = new XMLHttpRequest()
    xhr.addEventListener("readystatechange", el_xhr, false)
    xhr.open("GET", this._url)
    xhr.send(null)
})

//----------------------------------------------------------------------------    
function el_xhr(event) {
    var xhr = event.target
    if (xhr.readyState != 4) return
    debugger
    var contentType = xhr.getResponseHeader("Content-Type")
    var txt = xhr.responseText
}

//----------------------------------------------------------------------------    
var cr

cr = new CachedResource("content/sample.html")
cr.getRemote()

cr = new CachedResource("images/icon-32x32.png")
cr.getRemote()

cr = new CachedResource("images/Cincinnati4.jpg")
cr.getRemote()

//----------------------------------------------------------------------------    
})()
