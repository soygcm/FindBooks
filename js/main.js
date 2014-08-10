AddBookView = Parse.View.extend({

});

FindBooksView = Parse.View.extend({
    el: "#findbooks",
    events:{
        "click #type a":"selectType",
        'click #offer button.done': 'doneOffer',
    },
    selectType: function(e){
        e.preventDefault();
        this.type = $(e.target).data('value');
        this.$("#values > .form-group").hide();
        this.$("#values ."+this.type).show();
    },
    render: function() {
        this.findSearch =  new SearchOrAddBooks({el:"#find>.search"});
        this.offerSearch = new SearchOrAddBooks({el:"#offer>.search"});
        this.$("#values > div").hide();
        // this.$selectType= this.$('#type');
        this.$inputPrice= this.$('input.price');
        this.$inputMaxTime= this.$('input.max-time');
        this.$selectTimeType= this.$('select.time-type');
        this.$inputPriceTime= this.$('input.price-time');
        this.$inputEmail= this.$('input.email');
    },
    doneOffer: function(e){
        e.preventDefault();
        book = this.offerSearch.selectedResult || this.offerSearch.createBook();
        self = this;
        console.log(book);
        if (typeof(book.get('thumbnails'))!='undefined') {
            this.uploadImageBook(book, function(data, textStatus, xhr) {
                console.log(data);
                if(data.url != null){
                    book.set('picture', {"name": data.name, 'url': data.url, "__type": "File"});
                    book.save(null, {success: self.saveBookSuccess, error: self.saveError});
                }
            }); 
        }else{
            book.save(null, {success: self.saveBookSuccess, error: self.saveError});
        }
    },
    saveBookSuccess: function(book){
        self.saveOffer(book);
        self.$el.css('background-color', 'lightgreen');
    },
    saveError: function(model, error){
        console.log(error);
    },
    saveOffer: function(book){
        // e.preventDefault();
        var offer = new Offer;
        offer.set('type', this.type);
        offer.set('email', this.$inputEmail.val());
        offer.set('book', book);
        switch(this.type){
          case 'sell':
            offer.set('price', this.$inputPrice.val());
            break;
          case 'lend':
            offer.set('time', this.$inputMaxTime.val());
            offer.set('timeType', this.$selectTimeType.val());
            break;
          case 'rent':
            offer.set('priceTime', this.$inputPriceTime.val());
            offer.set('time', this.$inputMaxTime.val());
            offer.set('timeType', this.$selectTimeType.val());
            break;
        }
        offer.save();
        console.log(offer);
    },
    uploadImageBook: function(book, success){
        $.post('http://localhost/parse-services/upload-images.php',
            {   appid: appId,
                url: book.get('thumbnails').thumbnail,
                apikey: rApiKey,
                name: book.get('idGBook') || 'googleimages'
        },function(data, textStatus, xhr){
            success(data, textStatus, xhr);
        }, 'json').error(function( jqXHR, textStatus, errorThrown) {
            console.log( jqXHR, textStatus, errorThrown);
        });
    }
});

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


