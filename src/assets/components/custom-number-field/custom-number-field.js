import getStyle from './custom-number-field.shadow.css'
import CustomField from '../custom-field/custom-field'

class CustomNumberField extends CustomField {

    static get observedAttributes() {
        return ['json'];
    }

    connectedCallback() {
        console.info('custom-number-field connectedCallback')

        if (!this.hasAttribute('json')) {
            this.setAttribute('json', '{}');
        }

        const id = this.getAttribute('id');
        this.id = id ? id : this.guidGenerator();

        // create HTML-elements
        this.input = document.createElement('input');
        // this.input.addEventListener('input', this._input)
        this.input.addEventListener('input', this._changed)
        this.input.addEventListener('blur', this._focusLost.bind(this))
        // this.input.addEventListener('change', this._changed)
        this._render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // console.info(`custom-number-field attributeChangedCallback ${name} from ${oldValue} to ${newValue}`)
        if (name === 'json') {
            this.updateJSON(newValue);
        }
    }

    disconnectedCallback(){
        console.log('custom-number-field.disconnectedCallback()')
        this.input.removeEventListener('input', this._changed)
        this.input.removeEventListener('blur', this._focusLost)
    }

    _focusLost(e){
        console.log('_focusLost');
        console.log(e);

        console.log(`old value: ${this.input.defaultValue}`);
        console.log(`cur value: ${this.input.value}`);
        
        this.input.value = this._autocomplete(this.input.value);
        this.input.defaultValue = this.input.value;
    }

    /**
     * 
     * @param {string} value 
     */
    _autocomplete(value){
        if(value == undefined || value == '') {
            return value;
        }
        // replace(/\.*/g,'')
        if(/^-?\d*(?:\.\d{3})*(?:,\d+)?$/.test(value)){
            
            return Intl.NumberFormat('de-DE').format(new Number(value))
            
        } else {
            console.warn('cant autocomplete an incorrect value');
            return value;
        }
    }

    // Research:
    //https://stackoverflow.com/questions/469357/html-text-input-allow-only-numeric-input
    //https://www.debuggex.com/r/OoeEW3N212EGh99K


    /**
     * 
     * @param {*} e 
     */
    _changed(e){
        // console.log(this.value)
        console.log('_changed')
        console.log(e);
        //const valid = /^-?\d{1,3}(?:\.\d{3})*(?:,\d+)?$/;
        const valid = /^-?\d+(?:[\.]\d{0,3})*(?:,\d*)?$/;
        //  var valid = /^\-?\d+\.\d*$|^\-?[\d]*$/;
        const number = /\-\d+\.\d*|\-[\d]*|[\d]+\.[\d]*|[\d]+/;

        //const newValue = this.value + String.fromCharCode(e.charCode)

        console.log(`old value: ${this.defaultValue}`);
        console.log(`cur value: ${this.value}`);
        // console.log(`new value: ${newValue}`);
        
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;

        console.log(`oldSelectionStart: ${this.oldSelectionStart}`);
        console.log(`oldSelectionEnd: ${this.oldSelectionEnd}`);


        if(this.defaultValue == this.value){
            console.log('old = current')
            return;
        } 
         else {
            if(valid.test(this.value)){
                console.log(`current is valid ${this.value}`)
                this.defaultValue = this.value
            } else {
                console.log('reset current')
                // if(!this.hasOwnProperty('defaultValue')){
                //     this.oldValue = "";
                // }
                this.value = this.defaultValue;
            }
        }

        
        
        // console.log('before ##################')
        
        // if (/^\d*\.?\d*$/.test(newValue)) {
        //   //const n = this.value.match(number);
        //   console.log('yes?')
        //   //this.value = n ? n[0] : '';
        //   //this.oldValue = this.value;
        // } else {
        //     //this.value = this.oldValue;
        //     //this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
        //     e.returnValue = false;
        //     if (e.preventDefault) e.preventDefault();
        // } 
        // console.log('after ##################')
        // console.log(`old value: ${this.oldValue}`);
        // console.log(`cur value: ${this.value}`);
        // console.log(`new value: ${newValue}`);
    }

    /**
     * 
     * @param {Event} e 
     */
    _input(e) {
        console.log(this.value)
        console.log(e);
        

        
    }

    updateJSON(json) {
        try {

            if (json == null) {
                return;
            }

            if (json) {
                if (json.trim().length < 4) {
                    // next codeblock should be used instead of the above code
                    // if (Object.keys(json).length === 0 && json.constructor === Object) {
                    // fail fast ... nothing todo, because empty object
                    return;
                }
            }

            const obj = JSON.parse(json);

            // console.info('parsing json...')
            this.updateLabel(obj);

            //this._setIfValueExists(obj.max, 'max', this.input);
            //this._setIfValueExists(obj.min, 'min', this.input);
            this._setBooleanAttrIfValueExists(obj.disabled, 'disabled', this.input, true);
            this._setBooleanAttrIfValueExists(obj.mandatory, 'required', this.input, true);
            this._setBooleanAttrIfValueExists(obj.editable, 'readonly', this.input, false);
            this._setBooleanAttrIfValueExists(obj.visible, 'hidden', this, false);

            if (obj.value != undefined) {
                //  = obj.value;
                 this.input.value = this._autocomplete(obj.value)
            }

            if (obj.commands != undefined) {
                const currentThis = this;
                obj.commands.forEach((command) => currentThis._handleCommand(command));
            }


        } catch (err) {
            console.warn(`invalid json: ${err}`);
        }
    }

    _setBooleanAttrIfValueExists(value, attribute, obj, valueShouldBe) {
        if (value != undefined) {
            if (value == valueShouldBe) {
                obj.setAttribute(attribute, attribute);
            } else {
                obj.removeAttribute(attribute);
            }
        }
    }

    _setIfValueExists(value, attribute, obj) {
        if (value != undefined) {
            obj.setAttribute(attribute, value);
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

    _getDelegate() {
        return this.input;
    }

    // maybe use templates instead
    _render() {
        super._render();
        this.injectWebComponentStyle(this.tagName, getStyle);

        // configure input
        this.input.setAttribute('type', 'text');
        // this.input.setAttribute('min', '0');
        // this.input.setAttribute('max', '100');
        this.input.setAttribute('id', `${this.id}-delegate`);
        // configure label
        this.label.setAttribute('for', `${this.id}-delegate`);
        this.label.innerText = 'labeltext';
        this.root.appendChild(this._getDelegate());
        this.root.appendChild(this.label);
        this._handleLabelOrientation('west');

        // append to div
        //this.delegateContainer.appendChild(this.input)
    }
}

customElements.define('custom-number-field', CustomNumberField);
