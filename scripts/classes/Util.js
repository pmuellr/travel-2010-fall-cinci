//-----------------------------------------------------------------------------
// Copyright (c) 2010 Patrick Mueller
// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
//-----------------------------------------------------------------------------

//----------------------------------------------------------------------------
(function(){

//----------------------------------------------------------------------------
defClass(function Util() {
})

//----------------------------------------------------------------------------
defStaticMethod(function error(message) {
    Transcript.log(message)
})

//----------------------------------------------------------------------------
defStaticMethod(function createElement(elementName, properties) {
    var element = document.createElement(elementName)
    
    _(properties).each(
        function(value, key) { 
            element[key] = value
        }
    )
    
    return element
})

//----------------------------------------------------------------------------
defStaticMethod(function deleteElements(element) {
    _(arguments).toArray().each( 
        function(element) {
            element.parentNode.removeChild(element)
        }
    )
})

//----------------------------------------------------------------------------
defStaticMethod(function appendElements(parent, element) {
    _(arguments).toArray().rest().each( 
        function(element) {
            parent.appendChild(element)
        }
    )
})

//----------------------------------------------------------------------------
defStaticMethod(function prependElements(parent, element) {
    _(arguments).toArray().rest().each( 
        function(element) {
            if (!parent.firstChild) {
                Util.appendElements(parent, element)
            }
            else {
                parent.insertBefore(element, parent.firstChild)
            }
        }
    )
})

//----------------------------------------------------------------------------
defStaticMethod(function hasClass(element, className) {
    var classNames = element.className || ""
    
    return _(classNames.split(" ")).include(className)
})

//----------------------------------------------------------------------------
defStaticMethod(function addClass(element, className) {
    if (Util.hasClass(element, className)) return

    var classNames = element.className || ""
    
    element.className = classNames + " " + className
})

//----------------------------------------------------------------------------
defStaticMethod(function deleteClass(element, className) {
    if (!Util.hasClass(element, className)) return

    element.className = _(element.className.split(" ")).reject( 
        function(value) {
            return value == className
        }
    ).join(" ")
})


//----------------------------------------------------------------------------
})()
