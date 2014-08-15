ImportDBView = Parse.View.extend({
    el: "#import-db",
    events:{

    },

    template: _.template($("#import-db-template").html()),

    hide: function(){
        
    },

    render: function() {

        this.$el.html(this.template());


        return this;
    }
});