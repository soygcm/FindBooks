EditImageView = Parse.View.extend({
    el: "#edit-image",
    events:{        
        "hidden.bs.modal .modal"    : "onHiddenModal",  
        "click .save"               : 'saveOffer',
        "click .nav-tabs a"         : "showTab",
    },

    template: _.template($("#edit-image-template").html()),

    showTab: function (e) {
        e.preventDefault()
        $(this).tab('show')
    },

    selectType: function(e){
        e.preventDefault();
        this.type = $(e.target).data('value');
        this.$("#values > .form-group").hide();
        this.$("#values ."+this.type).show();
    },

    onHiddenModal: function(){

        this.offerEdited = false;
        this.bookEdited = false;
        delete this.model;
        this.delegateEvents(); //No entiendo, es supuestamente para controlar los eventos
        this.$el.html('');
        delete this.book;
    },

    hide: function(){
        if (this.$modal) {
            this.$modal.modal('hide');
        }
    },

    render: function() {

        this.$el.html(this.template());

        this.$('.nav-tabs a:last').tab('show')

        this.$modal = this.$(".modal");

        this.$modal.modal('show');

        return this;
    },

    saveOffer: function(e){


        // Es una oferta nueva: se crea un libro y se agrega a una oferta.

        if (this.book) {

            e.preventDefault();
            this.$('button').attr("disabled", true);
            // book = this.offerSearch.selectedResult || this.offerSearch.createBook();
            self = this;
            console.log(this.book);

            this.book.save(null, {success: self.saveBookSuccess, error: self.saveError});
        }

        // Solo hay que actualizar la oferta
        else if(this.offerEdited && !this.bookEdited){

            this.updateOffer();

        }

        // Hay que crear un nuevo libro
    },

    saveBookSuccess: function(book){
        self.$('.modal-footer').css('background-color', 'lightgreen');
        self.saveNewOfferParse(book);
    },

    // actualiza la información de la offerta solamente
    updateOffer: function () {

        self = this;
        
        var offer = this.model;
        offer.set('price', Number( this.$price.val() ) );
        offer.set('stocks', Number( this.$stocks.val() ) );

        offer.save(null, {success: function(offer){
            // console.log(self.callerView);
            self.hide();

            if (self.callerView) {
                self.callerView.render();
                appView.admin.updateDataRow( self.callerView.$el );
            }

        }, error: self.saveError});

    },
    
    saveNewOfferParse: function(book){

        // e.preventDefault();
        var offer = new Offer();
        offer.set('price', Number(this.$price.val()));
        offer.set('stocks', Number(this.$stocks.val()));
        offer.set('book', book);
        offer.set("user", Parse.User.current());
        offer.setACL(new Parse.ACL(Parse.User.current()));

        self = this;
        
        offer.save(null, {success: function(offer){
            // console.log(offer);
            self.hide();
            appView.admin.offerList.add(offer);
        }, error: self.saveError});

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