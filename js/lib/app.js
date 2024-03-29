/*
- Create a gallery of models and move between them with Prev/Next
by toggling the .hidden class
- iframes are generated based on the models array
- Each viewer will start and stop on hover
- The last model is loaded first and the first model is loaded last
so by the time the visible model is loaded, everything is ready
*/

// Navigation event handling
$( document ).ready( function () {
    var next = $( '#next' ),
        previous = $( '#previous' ),
        stop = $( '#stop' );

    next.on( 'click', nextModel );
    previous.on( 'click', previousModel );
    stop.on( 'click', stopAll );
}());

// Models to display
var models = [
    '9ee784a8b87749d8ac3fa2f2a9c64b5a',
    'a01dfad71b0a45b3b4fb678c1a7ada32',
    'aadd5a1ed77e49e38cd432d96afdfb9a',
    'a5b3560ce3cb48e18791ab72143ac3f4',
    '13fe81d0df8d4803be04f74b10ac0556',
    'c4abd02db2d643ab9cdb7ac0618dfe3a',
    '7630f4bf469848a18a67af160c65b461'
],

    version = '1.0.0',
    
    $iframes = [],
    clients = [],
    apis = [],

    loadIndex = models.length - 1, // Load the last model first
    iframeIndex = 0, // Navigation index

    error = function () {
        console.error( 'Sketchfab API Error!' );
    },

    success = function( api ) {
        apis.unshift( api );
        
        // Pre-load the model
        api.load();
        
        /*
        // Hover event
        $iframes[ loadIndex ] ).hover( function () {
            api.start();
        }, function () {
            api.stop();
        } );
        */

        // Load the next model, only autostart the first, visible model
        if ( loadIndex > 0 ) {
            loadIndex--;
            
            var start = 0;
            if ( loadIndex === 0 ) {
                start = 1;
            }
            
            loadModel( clients[ loadIndex ], models[ loadIndex ], start );
        }
    };

// Iterate models
for ( var model = 0; model < models.length; model++ ) {
    
    // Create iframes, one visible, the rest hidden
    if ( model === 0 ) {
        $( '.model-box' ).append( '<iframe class="model" id="api-frame' + model.toString() + '"></iframe>' );
    } else {
        $( '.model-box' ).append( '<iframe class="model hidden" id="api-frame' + model.toString() + '"></iframe>' );
    }
    
    // Populate the arrays
    $iframes.push( $( '#api-frame' + model.toString() ) );
    clients.push( new Sketchfab( version, $iframes[ model ][ 0 ] ) );
}

// Load a model
function loadModel( client, urlid, start ) {
    client.init( urlid, {
        success: success,
        error: error,
        autostart: start,
        camera: 0,
        ui_infos: 0,
        ui_controls: 0,
        ui_stop: 0,
        watermark: 0
    });
}

// Load the last model first
loadModel( clients[ loadIndex ], models[ loadIndex ], 0);

// Navigation
function nextModel() {
    $iframes[ iframeIndex ].toggleClass( 'hidden' );
    apis[ iframeIndex ].stop();
    
    iframeIndex++;
    if ( iframeIndex >= models.length ) {
        iframeIndex = 0;
    }
    
    apis[ iframeIndex ].start();
    $iframes[ iframeIndex ].toggleClass( 'hidden' );
}

function previousModel() {
    $iframes[ iframeIndex ].toggleClass( 'hidden' );
    apis[ iframeIndex ].stop();
    
    iframeIndex--;
    if ( iframeIndex < 0 ) {
        iframeIndex = models.length - 1;
    }
    
    apis[ iframeIndex ].start();
    $iframes[ iframeIndex ].toggleClass( 'hidden' );
}

function stopAll() {
    for ( var model = 0; model < models.length; model++ ) {
        apis[ model ].stop();
    }
}