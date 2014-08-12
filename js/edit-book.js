EditBookView = Parse.View.extend({
    el: "#edit-book",
    events:{
        "click #type a"             : "selectType",
        "hide.bs.modal .modal"      : "onHideModal",
        "hidden.bs.modal .modal"    : "onHiddenModal",        
        "click .save"               : 'saveOffer'
    },

    template: _.template($("#edit-book-template").html()),

    selectType: function(e){
        e.preventDefault();
        this.type = $(e.target).data('value');
        this.$("#values > .form-group").hide();
        this.$("#values ."+this.type).show();
    },

    onHideModal: function(){
        
    },

    onHiddenModal: function(){
        this.delegateEvents();
        appView.navHome();
        this.$el.html('');
    },

    hide: function(){
        if (this.$modal) {
            this.$modal.modal('hide');
        }
    },

    render: function() {

        var bookJson = '';

        if (this.book) {
            bookJson = this.book.toJSON();
        }

        if (bookJson.authors) {
            bookJson.authors = bookJson.authors.join(", ");
        }

        var datos =  {
            'book'  :  bookJson,
            'offer' : ''
         };

        this.$el.html(this.template(datos));

        this.$modal = this.$(".modal");

        this.$price = this.$("input.price");
        this.$stocks = this.$("input.stocks");

        this.$price.number(true, 2, ',', '.' );
        this.$stocks.number( true, 0, ',', '.' );

        this.$modal.modal('show');

        return this;
    },

    saveOffer: function(e){
        e.preventDefault();
        this.$('button').attr("disabled", true);
        // book = this.offerSearch.selectedResult || this.offerSearch.createBook();
        self = this;
        console.log(this.book);

        /*
        if (typeof(book.get('thumbnails'))!='undefined') {
            //Si no tiene miniatura es porque no viene desde Google?
            
            this.uploadImageBook(book, function(data, textStatus, xhr) {
                console.log(data);
                if(data.url != null){
                    book.set('picture', {"name": data.name, 'url': data.url, "__type": "File"});
                    book.save(null, {success: self.saveBookSuccess, error: self.saveError});
                }
            }); 
        }else{
        }
        */

        this.book.save(null, {success: self.saveBookSuccess, error: self.saveError});
    
    },

    saveBookSuccess: function(book){
        self.$('.modal-footer').css('background-color', 'lightgreen');
        self.saveOfferParse(book);
    },
    
    saveOfferParse: function(book){
        // e.preventDefault();
        var offer = new Offer();
        offer.set('price', Number(this.$price.val()));
        offer.set('stocks', Number(this.$stocks.val()));
        offer.set('book', book);
        offer.set("user", Parse.User.current());
        offer.setACL(new Parse.ACL(Parse.User.current()));

        self = this;
        /*Si hubieran otros tipos de oferta
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
        */
        offer.save(null, {success: function(offer){
            console.log(offer);
            self.hide();
        }, error: self.saveError});
    },

    renderOld: function() {
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
    saveError: function(model, error){
        console.log(error);
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