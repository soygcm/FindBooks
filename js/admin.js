AdminView = Parse.View.extend({

	el: "#admin",

    events: {
        
    },

    addBooks: new AddBooksView(),

    offerList: new OfferList(),

	template:_.template($("#admin-template").html()),

	render: function() {

        this.$el.html(this.template());

        this.addBooks.setElement(this.$("#add-book")).render();

        this.$tableBody = this.$('table tbody');
        this.$table = this.$('table');

        this.getBookList();

        // collection.on("reset", resetCallback);

        this.offerList.on('add', this.addOneOffer);

        return this;
    },

    hide: function(){
    	this.$el.hide();
    },
    
    show: function(){
    	this.$el.show();
    },

    getBookList: function() {

        self = this;

        this.offerList.query = new Parse.Query(Offer);
        this.offerList.query.equalTo("user", Parse.User.current() );
        this.offerList.query.include("book");

        this.offerList.fetch({
            success: function (collection){

                console.log('offer list success');

                _.each(collection.models, function(offer, i) {
                        self.addOneOffer(offer);
                });

                self.$table.dataTable( {
                  "columnDefs": [ {
                      "targets": 3,
                      "searchable": false,
                      "orderable": false
                    } ]
                } );

            },
            error: function(){

            }
        });

    },

    addOneOffer: function (offer) {
        
        var bookTr = new BookTr({model: offer});
        appView.admin.$tableBody.prepend(bookTr.render().el);

    },

});