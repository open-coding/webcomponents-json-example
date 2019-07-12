
import CustomField from '../custom-field/custom-field'

// webcomponents has its own style - 'hidden' by shadow-dom
// just for demonstation-purpose
const getStyle = 
`
  input {
    width: 120px;
  }

  input:required:not(:disabled) + label:after {
    color: red;
    content: ' *';
  }

  input:required:disabled + label:after {
    color: grey;
    content: ' *';
  }

  input:disabled + label {
    color: grey;
  }

  input:read-only {
    background-color: #ebebeb;
    border: 2px solid #a6a6a6;
    outline: none;
  }

  :invalid {
    background-color: #fce4e4;
    border: 2px solid #cc0033;
    outline: none;
  }
  
  .grid {
    display: grid;
    display: -ms-grid;
    grid-template-columns: min-content;
    -ms-grid-columns: min-content;
    grid-gap: 5px;
  }
`

class CustomNumberField extends CustomField {

  static get observedAttributes() {
    return ['json'];
  }

  connectedCallback() {
    console.info('custom-number-field connectedCallback')

    if (!this.hasAttribute('json')) {
      this.setAttribute('json', '{}')
    }

    const id = this.getAttribute('id');
    this.id = id ? id : this.guidGenerator()

    // create HTML-elements 
    this.input = document.createElement('input');
    

    this._render()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.info(`custom-number-field attributeChangedCallback ${name} from ${oldValue} to ${newValue}`)
    if (name === 'json') {
      this.updateJSON(newValue)
    }
  }

  updateJSON(json) {
    try {

      // this codeblock was written because IE11 does not support Object.entries
      // to avoid using a polyfill, the following code was written
      if (json) {
        if (json.trim().length < 4) {
          // fail fast ... nothing todo, because empty object
          return;
        }
      }

      if (json == null) {
        return;
      }

      const obj = JSON.parse(json);

      // next codeblock should be used instead of the above code

      //if (Object.entries(obj).length === 0 && obj.constructor === Object) {
      // // fail fast ... nothing todo, because empty object
      // return
      //}


      console.info('parsing json...')
      this.updateLabel(obj)

      this._setIfValueExists(obj.max, 'max', this.input)
      this._setIfValueExists(obj.min, 'min', this.input)
      this._setBooleanAttrIfValueExists(obj.disabled, 'disabled', this.input, true)
      this._setBooleanAttrIfValueExists(obj.mandatory, 'required', this.input, true)
      this._setBooleanAttrIfValueExists(obj.editable, 'readonly', this.input, false)
      this._setBooleanAttrIfValueExists(obj.visible, 'hidden', this, false)

      if (obj.value != undefined) {
        this.input.value = obj.value
      }

      if (obj.commands != undefined) {
        const currentThis = this;
        obj.commands.forEach((command) => currentThis._handleCommand(command))
      }


    } catch (err) {
      console.warn(`invalid json: ${err}`)
    }
  }

  _setBooleanAttrIfValueExists(value, attribute, obj, valueShouldBe) {
    if (value != undefined) {
      if (value == valueShouldBe) {
        obj.setAttribute(attribute, attribute)
      } else {
        obj.removeAttribute(attribute)
      }
    }
  }

  _setIfValueExists(value, attribute, obj) {
    if (value != undefined) {
      obj.setAttribute(attribute, value)
    }
  }

  _handleCommand(command) {
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
        ) {
          this.input.focus();
        }

        break;
      default:
        break;
    }
  }

  _addStyle() {
    const styleTag = document.createElement('style')
    styleTag.textContent = getStyle
    this.shadow.appendChild(styleTag)
  }

  _getDelegate(){
    return this.input;
  }

  // maybe use templates instead
  _render() {
    super._render()
    this._addStyle()

    // configure input
    this.input.setAttribute('type', 'number')
    this.input.setAttribute('min', '10')
    this.input.setAttribute('max', '15')
    this.input.setAttribute('id', `${this.id}-delegate`)
    // configure label
    this.label.setAttribute('for', `${this.id}-delegate`)
    this.label.innerText = 'labeltext'
    this.root.appendChild(this._getDelegate())
    this.root.appendChild(this.label)
    this._handleLabelOrientation('west')

    // append to div
    //this.delegateContainer.appendChild(this.input) 

  }
}

try {

  // TODO Check if necessary, because now everything is polyfilled or transpiled:
  //if (document.head.createShadowRoot == undefined || document.head.attachShadow == undefined) {
  //  throw "Your browser does not support ShadowDOM"
  //}

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