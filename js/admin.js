AdminView = Parse.View.extend({

	el: "#admin",

    events: {
        'click .edit':'editBook'
    },

    addBooks: new AddBooksView(),

	template:_.template($("#admin-template").html()),

	render: function() {

        this.$el.html(this.template());

        this.$addBook = this.$("#add-book");

        this.$addBook.html(this.addBooks.render().el);

        return this;
    },

    hide: function(){
    	this.$el.hide();
    },
    
    show: function(){
    	this.$el.show();
    },

    editBook: function(){

        appView.editBook('7g884as8f8R');

    }

});