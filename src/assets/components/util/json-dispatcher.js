export default class JsonDispatcher extends HTMLElement {

    constructor(...args) {
        super(...args);
        console.info('json-dispatcher constructor');
    }

    static get observedAttributes() {
        return ['json'];
    }

    connectedCallback() {
        console.info('json-dispatcher connectedCallback');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // console.info(`json-dispatcher attributeChangedCallback ${name} from ${oldValue} to ${newValue}`)
        if (name === 'json') {
            this.dispatch(newValue);
        }
    }

    dispatch(json) {
        try {
            console.time('json-dispatcher.dispatch');
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

            Object.keys(obj).forEach(function (id) {
                //console.info(`updating ${id}`)
                document.getElementById(id).updateJSON(JSON.stringify(obj[`${id}`]));
            });
            console.timeEnd('json-dispatcher.dispatch');
        } catch (err) {
            console.warn(`invalid json: ${err}`);
        }
    }
}

customElements.define('json-dispatcher', JsonDispatcher);
