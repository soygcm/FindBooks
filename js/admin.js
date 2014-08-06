AdminView = Parse.View.extend({

	el: "#admin",

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
    }

});