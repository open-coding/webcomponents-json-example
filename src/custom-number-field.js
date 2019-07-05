
// webcomponents has its own style - 'hidden' by shadow-dom
// just for demonstation-purpose
const getStyle = `
  input {
    width: 120px;
  }

  input:required + label:after {
    color: red;
    content: '*';
  }

  input:disabled + label {
    color: grey;
  }

  :invalid {
    background-color: #fce4e4;
    border: 2px solid #cc0033;
    outline: none;
  }
  
  .grid {
    display: grid;
    grid-template-columns: min-content;
    grid-gap: 5px;
  }

  .col-1 {
    grid-column: 1;
  }

  .col-2 {
    grid-column: 2;
  }

  .row-1 {
    grid-row: 1;
  }

  .row-2 {
    grid-row: 2;
  }
  `

class CustomNumberField extends HTMLElement {

  static get observedAttributes() {
    return ['json'];
  }

  connectedCallback() {
    console.info('custom-number-field connectedCallback')
    this.shadow = this.attachShadow({ mode: 'closed' });

    if (!this.hasAttribute('json')) {
      this.setAttribute('json', '{}')
    }

    // set defaults
    this.currentLabelOrientation = 'west'

    const id = this.getAttribute('id');
    this.id = id ? id : "some-random-id"

    // create HTML-elements 
    this.input = document.createElement('input');
    this.label = document.createElement('label')

    this.render()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.info(`custom-number-field attributeChangedCallback ${name} from ${oldValue} to ${newValue}`)
    if (name === 'json') {
      this.updateJSON(newValue)
    }
  }

  updateJSON(json) {
    try {
      const obj = JSON.parse(json);

      if (Object.entries(obj).length === 0 && obj.constructor === Object) {
        // fail fast ... nothing todo, because empty object
        return
      }
      console.info('parsing json...')
      // parse label infos
      if (obj.label != undefined) {
        if (obj.label.text != undefined && this.label.innerText != obj.label.text) {
          this.label.innerText = obj.label.text
        }
        if (obj.label.orientation != undefined) {
          this.handleLabelOrientation(obj.label.orientation)
        }
      }

      this.setIfValueExists(obj.max, 'max', this.input)
      this.setIfValueExists(obj.min, 'min', this.input)
      this.setBooleanAttrIfValueExists(obj.disabled, 'disabled', this.input, true)
      this.setBooleanAttrIfValueExists(obj.mandatory, 'required', this.input, true)
      this.setBooleanAttrIfValueExists(obj.editable, 'readonly', this.input, false)
      this.setBooleanAttrIfValueExists(obj.visible, 'hidden', this, false)

      if (obj.value != undefined) {
        this.input.value = obj.value
      }

      if (obj.commands != undefined) {
        const currentThis = this;
        obj.commands.forEach((command) => currentThis.handleCommand(command))
      }


    } catch (err) {
      console.warn(`invalid json: ${err}`)
    }
  }

  setBooleanAttrIfValueExists(value, attribute, obj, valueShouldBe) {
    if (value != undefined) {
      if (value == valueShouldBe) {
        obj.setAttribute(attribute, attribute)
      } else {
        obj.removeAttribute(attribute)
      }
    }
  }

  setIfValueExists(value, attribute, obj) {
    if (value != undefined) {
      obj.setAttribute(attribute, value)
    }
  }

  handleCommand(command) {
    if (command == undefined) {
      // fail fast nothing to do
      return
    }
    switch (command) {
      case 'focus':

        if (
                !this.input.hasAttribute('readonly')
              || !this.input.hasAttribute('disabled')
              || !this.input.hasAttribute('hidden')
           ) 
        {
          this.input.focus();
        }

        break;
      default:
        break;
    }
  }

  // perhaps extract if more webcomponents with included labels are build...
  handleLabelOrientation(orientation) {

    if (orientation == this.currentLabelOrientation) {
      // fail fast ... nothing to do
      return
    }

    this.removeGridClasses()
    switch (orientation) {
      case 'north':
        this.label.classList.add('col-1', 'row-1')
        this.input.classList.add('col-1', 'row-2')
        this.currentLabelOrientation = 'north'
        break;
      case 'south':
        this.label.classList.add('col-1', 'row-2')
        this.input.classList.add('col-1', 'row-1')
        this.currentLabelOrientation = 'south'
        break;
      case 'east':
        this.label.classList.add('col-2', 'row-1')
        this.input.classList.add('col-1', 'row-1')
        this.currentLabelOrientation = 'east'
        break;
      case 'west':
        this.label.classList.add('col-1', 'row-1')
        this.input.classList.add('col-2', 'row-1')
        this.currentLabelOrientation = 'west'
        break;
      default:
        // same as north
        this.label.classList.add('col-1', 'row-1')
        this.input.classList.add('col-1', 'row-2')
        this.currentLabelOrientation = 'north'
        break;
    }
  }

  removeGridClasses() {
    // find a better solution for that!
    this.label.classList.remove('col-1')
    this.label.classList.remove('col-2')
    this.label.classList.remove('row-1')
    this.label.classList.remove('row-2')

    this.input.classList.remove('col-1')
    this.input.classList.remove('col-2')
    this.input.classList.remove('row-1')
    this.input.classList.remove('row-2')
  }

  addStyle() {
    const styleTag = document.createElement('style')
    styleTag.textContent = getStyle
    this.shadow.appendChild(styleTag)
  }


  // maybe use templates instead
  render() {
    this.addStyle()
    const div = document.createElement('div')
    div.classList.add('grid')

    // configure input
    this.input.setAttribute('type', 'number')
    this.input.setAttribute('min', '10')
    this.input.setAttribute('max', '15')
    this.input.setAttribute('id', `${this.id}-delegate`)
    // configure label
    this.label.setAttribute('for', `${this.id}-delegate`)
    this.label.innerText = 'labeltext'
    this.handleLabelOrientation(this.currentLabelOrientation)

    // append to div
    div.appendChild(this.input)
    div.appendChild(this.label)

    div.classList.add('grid')
    this.shadow.appendChild(div)
  }
}

try {
  if (document.head.createShadowRoot == undefined || document.head.attachShadow == undefined) {
    throw "Your browser does not support ShadowDOM"
  }
  customElements.define('custom-number-field', CustomNumberField)
} catch (err) {
  document.addEventListener("DOMContentLoaded", function (event) {
    const h1 = document.createElement('h1')
    const body = document.body;
    h1.innerHTML = "This site uses webcomponents which don't work in all browsers!<br>Try this site in a browser that supports them!"

    while (body.firstChild) {
      body.removeChild(body.firstChild);
    }
    document.body.appendChild(h1)
  });
}