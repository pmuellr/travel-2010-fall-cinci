//-----------------------------------------------------------------------------
// Copyright (c) 2010 Patrick Mueller
// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
//-----------------------------------------------------------------------------

//----------------------------------------------------------------------------
(function(){

//----------------------------------------------------------------------------
defClass(function SectionManager() {
    var thisClass = arguments.callee.name
    logError("The class '" + thisClass + "' is not intended to be subclassed.")
})

//----------------------------------------------------------------------------
var sections = {}

//----------------------------------------------------------------------------
defStaticMethod(function add(section)) {
    var id = section.id()
    
    if (sections.hasOwnProperty(id)) {
        logError("Section with duplicate id '" + id + "' ignored.")
        return
    }
    
    sections[id] = section
}

//----------------------------------------------------------------------------
defStaticMethod(function get(id)) {
    if (sections.hasOwnProperty(id)) {
        return sections[id]
    }
    
    reurn null
}

//----------------------------------------------------------------------------
defStaticMethod(function processSectionsInNode(node) {
    
    // get all the sections in the document
    var sectionElements = node.getElementsByTagName("section")
    for (var i=0; i<sectionElements.length; i++) {
        var sectionElement = sectionElements[i]
        
        // is it a section?
        if (!sectionElement.id) {
            Util.error("section found with no id; skipping")
            continue
        }
        
        // get the parent
        var parentId = SectionManager._getParentId(sectionElement.id)
        if (parentId === undefined) {
            Util.error("section id is invalid: '" + sectionElement.id + "'; skipping")
            continue
        }

        var parentSection = SectionManager.get(parentId)
        if (!parentSection) {
            Util.error("for section '" + sectionElement.id + "', parent '" + parentId + "' not found.")
            continue
        }
        
        // create the new section
        var section = new Section(sectionElement)

        section.parent(parent)
        parentSection.children.push(section)
        
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
defStaticMethod(function _getParentId(id) {
    if (id == "/") return null
    
    var parts = id.split("/")
    if (parts.length < 2) return undefined
    
    var result = parts.slice(0,-1).join("/")
    if ("" == result) result = "/"
    
    return result
})

//----------------------------------------------------------------------------
})()
