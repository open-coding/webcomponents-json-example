
  const gridStyle =
  `
  .grid {
    display: grid;
    display: -ms-grid;
    grid-template-columns: min-content;
    -ms-grid-columns: min-content;
    grid-gap: 5px;
  }
  
  .col-1 {
    grid-column: 1;
    -ms-grid-column: 1;
  }

  .col-2 {
    grid-column: 2;
    -ms-grid-column: 2;
  }

  .row-1 {
    grid-row: 1;
    -ms-grid-row: 1;
  }

  .row-2 {
    grid-row: 2;
    -ms-grid-row: 2;
  }
`

export default class CustomField extends HTMLElement {

    constructor(...args) {
        super(...args);

        this.shadow = this.attachShadow({ mode: 'closed' });

        // set defaults
        this.currentLabelOrientation = 'none'
        this.root = document.createElement('div')
        this.root.classList.add('grid')
        this.label = document.createElement('label')
        this.shadow.appendChild(this.root)
    }

    _getDelegate(){
      // code here what element should be added to this.root
      //throw new Error('You have to implement the method _getDelegate!')
    }

    guidGenerator()  {
        const S4 = function () {
          return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }


    updateLabel(jsonObject){
      // parse label infos
      if (jsonObject.label != undefined) {
        if (jsonObject.label.text != undefined && this.label.innerText != jsonObject.label.text) {
          this.label.innerText = jsonObject.label.text
        }
        if (jsonObject.label.orientation != undefined) {
          this._handleLabelOrientation(jsonObject.label.orientation, this._getDelegate())
        }
      }
    }

      // perhaps extract if more webcomponents with included labels are build...
    _handleLabelOrientation(orientation) {

        if (orientation == this.currentLabelOrientation) {
        // fail fast ... nothing to do
        return
        }

        this._removeGridClasses()
        switch (orientation) {
        case 'north':
            this.label.classList.add('col-1', 'row-1')
            this._getDelegate().classList.add('col-1', 'row-2')
            this.currentLabelOrientation = 'north'
            break;
        case 'south':
            this.label.classList.add('col-1', 'row-2')
            this._getDelegate().classList.add('col-1', 'row-1')
            this.currentLabelOrientation = 'south'
            break;
        case 'east':
            this.label.classList.add('col-2', 'row-1')
            this._getDelegate().classList.add('col-1', 'row-1')
            this.currentLabelOrientation = 'east'
            break;
        case 'west':
            this.label.classList.add('col-1', 'row-1')
            this._getDelegate().classList.add('col-2', 'row-1')
            this.currentLabelOrientation = 'west'
            break;
        default:
            // same as north
            this.label.classList.add('col-1', 'row-1')
            this._getDelegate().classList.add('col-1', 'row-2')
            this.currentLabelOrientation = 'north'
            break;
        }
    }

    _addGridStyle() {
        const styleTag = document.createElement('style')
        styleTag.textContent = gridStyle
        this.shadow.appendChild(styleTag)
      }

    _render() {
        this._addGridStyle()
        this._handleLabelOrientation('west')
    }

    _removeGridClasses() {
        // find a better solution for that!
        const list = ['col-1', 'col-2', 'row-1', 'row-2'];
        this.label.classList.remove(...list)
        this._getDelegate().classList.remove(...list)
      }
}
