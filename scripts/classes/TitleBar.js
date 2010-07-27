//----------------------------------------------------------------------------
(function(){

//----------------------------------------------------------------------------
defClass(function TitleBar() {})

//----------------------------------------------------------------------------
defStaticMethod(function install() {
    TitleBar._instance = new TitleBar()
    TitleBar._instance.install()
})

//----------------------------------------------------------------------------
defStaticMethod(function setForSection(section) {
    TitleBar._instance.setForSection(section)
})

//----------------------------------------------------------------------------
defMethod(function install() {
    this._titleBar     = Util.createElement("div",  {id: "title-bar"})
    this._backButton   = Util.createElement("span", {id: "back-button"})
    this._sectionTitle = Util.createElement("span", {id: "section-title"})
    
    Util.appendElements(this._titleBar, this._backButton, this._sectionTitle)
    Util.prependElements(Body, this._titleBar)
    
    this._backButton.addEventListener("click", el_backButtonClicked, false)
})

//----------------------------------------------------------------------------
defMethod(function setForSection(section) {
    var buttonText = (null == section.parent()) ? " " : "&lt;"

    this._backButton.innerHTML   = buttonText
    this._sectionTitle.innerHTML = section.title()
})

//----------------------------------------------------------------------------
function el_backButtonClicked() {
    Section.goToParent()
}

//----------------------------------------------------------------------------
})()
