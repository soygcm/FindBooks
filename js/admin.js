AdminView = Parse.View.extend({

	el: "#admin",

    events: {

        'click .edit':'editBook'

    },

	template:_.template($("#admin-template").html()),

	render: function() {
        this.$el.html(this.template());

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