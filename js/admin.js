AdminView = Parse.View.extend({

	el: "#admin",

    events: {
        'click .edit':'editBook'
    },

    addBooks: new AddBooksView(),

    offerList: new OfferList(),

	template:_.template($("#admin-template").html()),

	render: function() {

        this.$el.html(this.template());

        this.addBooks.setElement(this.$("#add-book")).render();

        this.$table = this.$('table');

        this.getBookList();

        return this;
    },

    hide: function(){
    	this.$el.hide();
    },
    
    show: function(){
    	this.$el.show();
    },

    editBook: function(){

        appView.showEditBook('7g884as8f8R');

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

            },
            error: function(){

            }
        });

    },

    addOneOffer: function (offer) {
        
        var bookTr = new BookTr({model: offer});
        this.$table.append(bookTr.render().el);

    },

});