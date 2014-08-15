BookTr = Parse.View.extend({
    tagName: "tr",

    events:{

    },

    template:_.template($("#book-tr-template").html()),
    
    render: function() {

        var offerJson = this.model.toJSON();
        var bookJson = this.model.get('book').toJSON();

        bookJson.thumbnails = bookJson.thumbnails || [];

        if (bookJson.authors) {
            bookJson.authors = bookJson.authors.join(", ");
        }

        var datos =  {
            'book'  : bookJson,
            'offer' : offerJson
        };

        // modelJson.authors = modelJson.authors || [];
        // modelJson.thumbnails = modelJson.thumbnails || [];

        // modelJson.authors = modelJson.authors.join(", ");

        this.$el.html(this.template(datos));

        // if(typeof(modelJson.objectId) != 'undefined'){
        //     this.$el.css('background-color', 'tomato');
        // }

        return this;
    },
    setBookResult: function(){
        
        this.options.parent.empty();
        appView.showNewBook(this.model);

        // if(this.id != "book-result"){
            // this.options.parent.setBookResult(this.model);
        // }
    }
});