BookResult = Parse.View.extend({
    tagName: "a",
    className: "list-group-item",
    events:{
        "click" : "setBookResult"
    },

    template:_.template($("#book-result-template").html()),
    
    render: function() {
        var modelJson = this.model.toJSON();
        modelJson.authors = modelJson.authors || [];
        modelJson.imageLinks = modelJson.imageLinks || [];
        modelJson.subtitle = modelJson.subtitle || "";
        modelJson.title = modelJson.title || "";
        modelJson.authors = modelJson.authors.join(", ");
        this.$el.html(this.template(modelJson));
        if(typeof(modelJson.idGBook) != 'undefined'){
            this.$el.css('background-color', 'tomato');
        }
        return this;
    },
    setBookResult: function(){
        
        this.options.parent.empty();
        appView.showNewBook(this.model);

    }
});