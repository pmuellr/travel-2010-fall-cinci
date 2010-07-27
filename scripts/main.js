//----------------------------------------------------------------------------
window.addEventListener("load", onLoad, false)

var Body

//----------------------------------------------------------------------------
function onLoad() {
    Body = document.getElementsByTagName("body")[0]
    
    TitleBar.install()
    Section.processDocument()
}
