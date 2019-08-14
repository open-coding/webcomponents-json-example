export default class JsonGenerator {

    constructor() {
        console.info('json-generator constructor');
    }

    generateJSON() {
        console.info('json-generator generating json...');
        let json = {};
        this._generateFields(json, 'custom-number-field');
        return JSON.stringify(json, null, 2);
    }

    generateJSONWithoutLabel() {
        console.info('json-generator generating json without label...');

        let json = {};
        this._generateFieldsWithoutLabel(json, 'custom-number-field');
        return JSON.stringify(json, null, 2);
    }


    _generateFieldsWithoutLabel(json, tagName) {
        const elements = document.getElementsByTagName(tagName);
        for (let i = 0; i < elements.length; i++) {
            const id = elements[i].getAttribute('id');
            switch (tagName) {
                case 'custom-number-field':
                    json[id] = this._generateCustomNumberFieldJSONWithoutLabel();
                    break;
                default:
                    break;
            }
        }
    }

    _generateFields(json, tagName) {
        const elements = document.getElementsByTagName(tagName);
        for (let i = 0; i < elements.length; i++) {
            const id = elements[i].getAttribute('id');
            switch (tagName) {
                case 'custom-number-field':
                    json[id] = this._generateCustomNumberFieldJSON();
                    break;
                default:
                    break;
            }
        }
    }

    _generateLabel() {
        return {
            text: this._randomLabelText(),
            orientation: this._randomLabelOrientation(),
            tooltip: this._randomLabelTooltip()
        };
    }

    _generateCustomNumberFieldJSONWithoutLabel() {
        return {
            min: this._randomIntFromInterval(10, 25),
            max: this._randomIntFromInterval(40, 50),
            disabled: this._randomBoolean(),
            editable: this._randomBoolean(),
            value: this._randomIntFromInterval(25, 40),
            mandatory: this._randomBoolean()
            // ,
            // commands: ["focus"]
        };
    }

    _generateCustomNumberFieldJSON() {
        return {
            label: this._generateLabel(),
            min: this._randomIntFromInterval(10, 25),
            max: this._randomIntFromInterval(40, 50),
            disabled: this._randomBoolean(),
            editable: this._randomBoolean(),
            visible: true,
            value: this._randomIntFromInterval(25, 40),
            mandatory: this._randomBoolean()
            // ,
            // commands: ["focus"]
        };
    }

    _randomLabelOrientation() {
        return ["north", "south", "east", "west"][this._randomIntFromInterval(0, 3)];
    }

    _randomBoolean() {
        return [true, false][this._randomIntFromInterval(0, 1)];
    }

    _randomLabelTooltip() {
        return ["this is a tooltip", "some kind of tooltip", "important information",
            "bar", "foo", "a tooltip", "foobar", "a very special tooltip"][this._randomIntFromInterval(0, 7)];
    }

    _randomLabelText() {
        return ["something", "amount", "current value",
            "bar", "foo", "a labeltext", "label"][this._randomIntFromInterval(0, 6)];
    }

    _randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}