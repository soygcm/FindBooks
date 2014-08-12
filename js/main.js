Parse.$ = jQuery;
Parse.initialize(appId, jsKey);

var appView = new AppView();
var appRouter;

$(document).ready(function() {
    
    appView.render();

    appRouter = new AppRouter;

    Parse.history.start();

    // Parse.history.start({pushState: true});
    // esta funcion es cool y hay que usarla si o si
    
});