//-----------------------------------------------------------------------------
// Copyright (c) 2010 Patrick Mueller
// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
//-----------------------------------------------------------------------------

//----------------------------------------------------------------------------
(function(){

//----------------------------------------------------------------------------
defClass(function TranscriptClass() {
    this._messages = []
})

//----------------------------------------------------------------------------
window.Transcript = new TranscriptClass()

//----------------------------------------------------------------------------
defMethod(function section(section) {
    if (!section) return this._section
    
    this._section = section
})

//----------------------------------------------------------------------------
defMethod(function log(message, classNames) {
    this._messages.push(message)
    
    if (!this._section) return
    
    if (classNames) 
        classNames = " " + classNames
    else 
        classNames = ""
    
    var msgElement = Util.createElement("div", {
        className: "transcript-message" + classNames,
        innerHTML: message
    })
    
    Util.appendElements(this._section.element(), msgElement)
})

//----------------------------------------------------------------------------
defMethod(function error(message) {
    this.log(message, "error")
})

//----------------------------------------------------------------------------
defMethod(function clear() {
    this._messages = []
    
    var section = this.section()
    if (!section) return
    
    section.innerHTML = ""
})

//----------------------------------------------------------------------------
defMethod(function messages() {
    return this._messages.slice()
})

//----------------------------------------------------------------------------
})()
