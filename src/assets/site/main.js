import JsonGenerator from '../services/json-generator';

(function initialize() {
    window.addEventListener('WebComponentsReady', function(e) {
        console.log('all webcomponents ready, fully loaded and initialized');
    });

    document.addEventListener("DOMContentLoaded", function(event) {
        console.log("DOM fully loaded and parsed");

        document.getElementById('generate-json-button').addEventListener('click', e => 
            document.getElementById('json-data').value = new JsonGenerator().generateJSON()
        );

        document.getElementById('generate-small-json-button').addEventListener('click', e => 
            document.getElementById('json-data').value = new JsonGenerator().generateJSONWithoutLabel()
        );

        document.getElementById('dispatch-json-button').addEventListener('click', e => 
            document.getElementsByTagName('json-dispatcher')[0].setAttribute('json', document.getElementById('json-data').value)
        );

        document.getElementById('generate-webcomponents-button').addEventListener('click', e => {
            for (let i = 0; i < 100; i++) {
                document.getElementById('webcomponents').appendChild(document.createElement('custom-number-field'))
            }
        }
        );
      });
    

}());
