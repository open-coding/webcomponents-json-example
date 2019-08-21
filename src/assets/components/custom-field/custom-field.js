
import { customFieldStyles as gridStyle } from '../../component-styles/styles';

const injectedForTags = [];

export default class CustomField extends HTMLElement {

    constructor(...args) {
        super(...args);

        this.shadow = this.attachShadow({ mode: 'closed' });

        // set defaults
        this.currentLabelOrientation = 'none';
        this.root = document.createElement('div');
        this.root.classList.add('grid-horizontal');
        this.label = document.createElement('label');
        this.shadow.appendChild(this.root);
    }

    _getDelegate() {
        // code here what element should be added to this.root
        throw new Error('You have to implement the method _getDelegate!');
    }

    guidGenerator() {
        const S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }


    updateLabel(jsonObject) {
        // parse label infos
        if (jsonObject.label != undefined) {
            if (jsonObject.label.text != undefined && this.label.innerText != jsonObject.label.text) {
                this.label.innerText = jsonObject.label.text;
            }
            if (jsonObject.label.tooltip != undefined && this.label.getAttribute('title') != jsonObject.label.tooltip) {
                this.label.setAttribute('title', jsonObject.label.tooltip);
            }
            if (jsonObject.label.orientation != undefined) {
                this._handleLabelOrientation(jsonObject.label.orientation, this._getDelegate());
            }
        }
    }

    // perhaps extract if more webcomponents with included labels are build...
    _handleLabelOrientation(orientation) {

        if (orientation == this.currentLabelOrientation) {
            // fail fast ... nothing to do
            return;
        }

        this._removeGridClasses()
        switch (orientation) {
            case 'north':
                this.root.classList.add('grid-vertical');
                this.label.classList.add('col-1', 'row-1');
                this._getDelegate().classList.add('col-1', 'row-2');
                this.currentLabelOrientation = 'north';
                break;
            case 'south':
                this.root.classList.add('grid-vertical');
                this.label.classList.add('col-1', 'row-2');
                this._getDelegate().classList.add('col-1', 'row-1');
                this.currentLabelOrientation = 'south';
                break;
            case 'east':
                this.root.classList.add('grid-horizontal');
                this.label.classList.add('col-2', 'row-1');
                this._getDelegate().classList.add('col-1', 'row-1');
                this.currentLabelOrientation = 'east';
                break;
            case 'west':
                this.root.classList.add('grid-horizontal');
                this.label.classList.add('col-1', 'row-1');
                this._getDelegate().classList.add('col-2', 'row-1');
                this.currentLabelOrientation = 'west';
                break;
            default:
                // same as north
                this.root.classList.add('grid-vertical');
                this.label.classList.add('col-1', 'row-1');
                this._getDelegate().classList.add('col-1', 'row-2');
                this.currentLabelOrientation = 'north';
                break;
        }
    }

    /**
     * 
     * @param {string} tagName 
     * @param {*} cssText 
     */
    injectWebComponentStyle(tagName, cssText) {
        const loweredTagName = tagName.toLowerCase();
        // Edge and IE
        if (injectedForTags.indexOf(loweredTagName) !== -1) {
            return;
        }
    
        this.createStyleInHead(cssText, {
            "data-style-for-tag": loweredTagName,
        });
        injectedForTags.push(loweredTagName);
    };

    createStyleInHead(cssText, attributes = {}) {
        const style = document.createElement("style");
        style.type = "text/css";
    
        Object.entries(attributes).forEach(pair => style.setAttribute(...pair));
    
        style.textContent = cssText;
        document.head.appendChild(style);
        return style;
    };

    _render() {
		// IE11, Edge
		if (window.ShadyDOM) {
			this.injectWebComponentStyle('custom-field', gridStyle);
		} else {
            const styleTag = document.createElement('style');
            styleTag.textContent = gridStyle;
            this.shadow.appendChild(styleTag);
        }

        this._handleLabelOrientation('west');
    }

    _removeGridClasses() {
        // find a better solution for that!
        this.root.classList.remove(['grid-horizontal', 'grid-vertical']);
        const list = ['col-1', 'col-2', 'row-1', 'row-2'];
        this.label.classList.remove(...list);
        this._getDelegate().classList.remove(...list);
    }
}