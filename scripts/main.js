//-----------------------------------------------------------------------------
// Copyright (c) 2010 Patrick Mueller
// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
//-----------------------------------------------------------------------------

//----------------------------------------------------------------------------
window.addEventListener("load", onLoad, false)

var Body

//----------------------------------------------------------------------------
function onLoad() {
    Body = document.getElementsByTagName("body")[0]
    
    TitleBar.install()
    Transcript.install()
    Section.processDocument()
    
    Transcript.log(scooj.getMethodName(arguments) + " complete")
}
