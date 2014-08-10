BookResult = Parse.View.extend({
    tagName: "li",
    className: "book-result",
    events:{
        "click":"setBookResult"
    },
    template:_.template($("#book-result-template").html()),
    render: function() {
        var modelJson = this.model.toJSON();
        modelJson.authors = modelJson.authors || [];
        modelJson.thumbnails = modelJson.thumbnails || [];
        modelJson.authors = modelJson.authors.join(", ");
        this.$el.html(this.template(modelJson));
        if(typeof(modelJson.objectId) != 'undefined'){
            this.$el.css('background-color', 'tomato');
        }
        return this;
    },
    setBookResult: function(){
        if(this.id != "book-result"){
            this.options.parent.setBookResult(this.model);
        }
    }
});