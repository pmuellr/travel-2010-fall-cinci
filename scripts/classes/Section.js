//-----------------------------------------------------------------------------
// Copyright (c) 2010 Patrick Mueller
// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
//-----------------------------------------------------------------------------

//----------------------------------------------------------------------------
(function(){
    
//----------------------------------------------------------------------------
defClass(function Section(element) {
    this._element = element
    
    var h1s = element.getElementsByTagName("h1")
    if (h1s.length == 0) {
        alert("found section with no h1 title")
        return
    }
    
    this._title    = h1s[0].innerHTML
    this._children = []
    
    Util.deleteElements(h1s[0])
    Util.addClass(element, "section")
    
    element._section = this
    
    this._autoMenu = Util.hasClass(element, "auto-menu")
    
    this._eventHandlers = {
        show: new EventHandler("show"),
        hide: new EventHandler("hide")
    }
})

//----------------------------------------------------------------------------
Section._currentSection = null
Section._topMenu        = null
Section._idMap          = {}

//----------------------------------------------------------------------------
defStaticMethod(function getSection(id) {
    return Section._idMap[id]
})

//----------------------------------------------------------------------------
defStaticMethod(function processDocument() {
//    var topMenuDiv = "<div id='topMenu'><h1>" + document.title + "</h1></div>"
//    Body.innerHTML += topMenuDiv

    var topMenuDiv = Util.createElement("div", {
        id: "topMenu",
        className: "section",
        innerHTML: "<h1>" + document.title + "</h1>"
    })
    Util.appendElements(Body, topMenuDiv)
    
    var topMenuElement = topMenuDiv // document.getElementById("topMenu")
    var topMenu = new Section(topMenuElement)
    
    // get all the divs in the document
    var divs = Body.getElementsByTagName("div")
    for (var i=0; i<divs.length; i++) {
        var div = divs[i]
        
        // is it a section?
        if (!div.id) continue
        
        var parts = div.id.split("/")
        if (parts.length < 2) continue
        if (parts[0] != "section") continue
        
        // get the parent
        var parentId = parts.slice(0,-1).join("/")
        var parent
        if (parentId == "section") {
            parent = topMenu
        }
        
        else {
            parentElement = document.getElementById(parentId)
            if (!parentElement) {
                alert("unable to find parent element '" + parentId + "'")
                return
            }
            parent = parentElement._section
            if (!parent) {
                alert("parent does not have a section for '" + parentId + "'")
                return
            }
        }
        
        // create the new section
        var section = new Section(div)
        section.parent(parent)
        parent._children.push(section)
        
        section._hide()
    }
    
    // walk the sections, build menus for container sections
    topMenu.setMenuContent()
    
    // set the top menu
    Section._topMenu = topMenu

    // display top menu
    Section.currentSection(topMenu)
    
    Transcript.log(scooj.getMethodName(arguments) + " complete")
    
})

//----------------------------------------------------------------------------
defStaticMethod(function currentSection(section) {
    if (arguments.length == 0) {
        return Section._currentSection
    }
    
    if (!(section instanceof Section)) {
        alert("currentSection called with invalid section")
    }
    
    if (Section._currentSection) Section._currentSection._hide()
    Section._currentSection = section
    Section._currentSection._show()
    
    TitleBar.setForSection(section)
    
    return section
})

//----------------------------------------------------------------------------
defStaticMethod(function goToParent() {
    if (Section._currentSection == Section._topMenu) return
    
    Section.currentSection(Section.currentSection().parent())
})

//----------------------------------------------------------------------------
defMethod(function setMenuContent() {
    if (this._children.length == 0) return
    
    this._element.innerHTML = ""
    for (var i=0; i<this._children.length; i++) {
        var child   = this._children[i]
        var element = Util.createElement("div", {
            className: "menu-item",
            section:   child,
            innerHTML: child.title()
        })
        
        element.addEventListener("click", el_menuItemClicked, false)
        
        Util.appendElements(this._element, element)
    }
})

//----------------------------------------------------------------------------
function el_menuItemClicked(event) {
    var section = event.target.section
    Section.currentSection(section)
}

//----------------------------------------------------------------------------
defMethod(function parent(value) {
    if (arguments.length == 0) return this._parent
    
    this._parent = value
})

//----------------------------------------------------------------------------
defMethod(function title(value) {
    if (arguments.length == 0) return this._title
    
    this._title = value
})

//----------------------------------------------------------------------------
defMethod(function id() {
    return this._element.id
})

//----------------------------------------------------------------------------
defMethod(function show() {
    if (this._autoMenu) {
        if (!this.autoFilled) {
            this.autoFilled = true
            this.setMenuContent()
        }
    }

    
    this._elShow.fireEventListener(receiver, event)
    
    this._element.style.display = "block"
})

//----------------------------------------------------------------------------
defMethod(function _hide() {
    this._element.style.display = "none"
})

//----------------------------------------------------------------------------
defMethod(function addEventHandler(eventName, receiver, methodName, userData){
    var eventHandler = this._getEventHandler(eventName)
    if (!eventHandler) return null
    
    return eventHandler.add(receiver, methodName, userData)
})

//----------------------------------------------------------------------------
defMethod(function removeEventHandler(eventName, receiver, methodName){
    var eventHandler = this._getEventHandler(eventName)
    if (!eventHandler) return null
    
    return eventHandler.remove(receiver, methodName)
})

//----------------------------------------------------------------------------
defMethod(function _getEventHandler(eventName){
    if (this._eventHandlers.hasOwnProperty(eventName)) 
        return this._eventHandlers[eventName]
    
    Util.error("class '" + this.constructor.name + "' doesn't support the  '" + eventName + "' event")
    return null
}

//----------------------------------------------------------------------------
})()
