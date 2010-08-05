//-----------------------------------------------------------------------------
// Copyright (c) 2010 Patrick Mueller
// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
//-----------------------------------------------------------------------------

//----------------------------------------------------------------------------
(function(){

//----------------------------------------------------------------------------
defClass(function TitleBar() {})

//----------------------------------------------------------------------------
defStaticMethod(function install() {
    TitleBar._instance = new TitleBar()
    TitleBar._instance._install()
})

//----------------------------------------------------------------------------
defStaticMethod(function setForSection(section) {
    TitleBar._instance._setForSection(section)
})

//----------------------------------------------------------------------------
defMethod(function _install() {
    this._titleBar     = Util.createElement("div",  {id: "title-bar"})
    this._backButton   = Util.createElement("span", {id: "back-button"})
    this._sectionTitle = Util.createElement("span", {id: "section-title"})
    
    Util.appendElements(this._titleBar, this._backButton, this._sectionTitle)
    Util.prependElements(Body, this._titleBar)
    
    this._backButton.addEventListener("click", _el_backButtonClicked, false)
})

//----------------------------------------------------------------------------
defMethod(function _setForSection(section) {
    var buttonText = (null == section.parent()) ? " " : "&lt;"

    this._backButton.innerHTML   = buttonText
    this._sectionTitle.innerHTML = section.title()
})

//----------------------------------------------------------------------------
function _el_backButtonClicked() {
    Section.goToParent()
}

//----------------------------------------------------------------------------
})()
