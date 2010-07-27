//----------------------------------------------------------------------------
(function(){

//----------------------------------------------------------------------------
defClass(function Util() {
})

//----------------------------------------------------------------------------
defStaticMethod(function createElement(elementName, properties) {
    var element = document.createElement(elementName)
    
    for (var propertyName in properties) {
        element[propertyName] = properties[propertyName]
    }
    
    return element
})

//----------------------------------------------------------------------------
defStaticMethod(function deleteElements(element) {
    if (!element) return
    
    for (var i=0; i<arguments.length; i++) {
        var element = arguments[i]
        element.parentNode.removeChild(element)
    }
})

//----------------------------------------------------------------------------
defStaticMethod(function appendElements(parent, element) {
    if (!element) return
    
    for (var i=1; i<arguments.length; i++) {
        var element = arguments[i]
        parent.appendChild(element)
    }
})

//----------------------------------------------------------------------------
defStaticMethod(function prependElements(parent, element) {
    if (!element) return
    

    for (var i=1; i<arguments.length; i++) {
        var element = arguments[i]
        
        if (!parent.firstChild) {
            Util.appendElement(parent, element)
        }
        else {
            parent.insertBefore(element, parent.firstChild)
        }
    }
})

//----------------------------------------------------------------------------
defStaticMethod(function hasClass(element, className) {
    var classNames = element.className || ""
    classNames = classNames.split(" ")
    
    for (var i=0; i<classNames.length; i++) {
        if (className == classNames[i]) return true
    }
    
    return false
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

    var classNames = element.className || ""
    classNames = classNames.split(" ")
    
    var newClassNames = []
    for (var i=0; i<classNames.length; i++) {
        if (className == classNames[i]) continue
        newClassNames.push(classNames[i])
    }
    
    element.className = newClassNames.join(" ")
})


//----------------------------------------------------------------------------
})()
