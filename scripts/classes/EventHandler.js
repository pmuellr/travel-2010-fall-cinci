//-----------------------------------------------------------------------------
// Copyright (c) 2010 Patrick Mueller
// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
//-----------------------------------------------------------------------------

//----------------------------------------------------------------------------
(function(){

//----------------------------------------------------------------------------
defClass(function EventHandler(type) {
    this._type     = type
    this._handlers = []
})

//----------------------------------------------------------------------------
defMethod(function add(receiver, methodName, userData) {
    var ehRecord = [receiver, method, userData]
    
    for (var i=0; i<this._handlers.length; i++) {
        var handler = this._handlers[i]
        if (null != handler) continue
        
        this._handlers[i] = ehRecord
        return
    }
    
    this._handlers.push(ehRecord)
})

//----------------------------------------------------------------------------
defMethod(function remove(receiver, methodName) {
    for (var i=0; i<this._handlers.length; i++) {
        var ehRecord = this._handlers[i]
        if (null == ehRecord) continue
        
        if ((ehRecord[0] === receiver) && (ehRecord[1] == methodName)) {
            this._handlers[i] = null
        }
    }
})

//----------------------------------------------------------------------------
defMethod(function fire(target) {
    event = {}
    event.type            = this.type
    event.timeStamp       = new Date()
    event.target          = target
    event.stopPropagation = stopPropagation
    
    for (var i=0; i<this._handlers.length; i++) {
        var ehRecord = this._handlers[i]
        if (null == ehRecord) continue
        
        var receiver   = ehRecord[0]
        var methodName = ehRecord[1]
        var userData   = ehRecord[2]
        
        var method = receiver[methodName]
        if (type method != "function") {
            Util.error("method '" + methodName + "' not found in '" + receiver + "' during event fire")
            continue
        }
        
        try {
            method.call(receiver, event, userData)
            
        }
        catch (e) {
            Util.error("error firing event handler for method '" + methodName + "' in '" + receiver + "': " + e)
            continue
        }
        
        if (event._stopPropagation) break
    }
})

//----------------------------------------------------------------------------
function stopPropagation() {
    this._stopPropagation = true
}

//----------------------------------------------------------------------------
})()
