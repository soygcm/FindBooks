BookTr = Parse.View.extend({
    tagName: "tr",

    events:{
        "click .delete-confirm" : "deleteConfirmBook",
        "click .delete"         : "deleteBook",
        "click .no-delete"      : "noDelete",
        "click"                 : "editBook",
        "click img"             : "editImage",
    },

    template:_.template($("#book-tr-template").html()),

    initialize: function () {

        // this.model.on('change', this.render);
        
    },

    deleteConfirmBook: function (e) {

        this.$('.delete-confirm').addClass('delete');
        this.$('.delete-confirm').removeClass('delete-confirm');

        var $noDelete = this.$('.no-delete');
        $noDelete.show().removeClass('hidden');
        var width = $noDelete.outerWidth();
        $noDelete.width(0);
        $noDelete.animate({width: width}, 'fast');
    },

    editImage: function () {

        appView.showEditImage(this);
        
    },

    deleteBook: function (e) {
        // this.$(e.target).button('reset');

        self = this;

        this.$('td').css('background-color', 'FireBrick');
        this.$('td').css('color', 'white');

        this.model.destroy({
          success: function(myObject) {
            self.$('.animate').slideUp( 'fast', function () {
                self.remove();

                //Esto se repite 4 veces
                appView.admin.removeRow(self.$el);

            });
          },
          error: function(myObject, error) {
            
          }
        });

        

        // delete this;
    },

    noDelete: function (e) {
        this.$('.delete').addClass('delete-confirm');
        this.$('.delete').removeClass('delete');

        var $noDelete = this.$('.no-delete');
        $noDelete.animate({
            width: 0, 
            paddingLeft: 0,
            paddingRight: 0,
        }, 'fast', function () {
            $noDelete.removeAttr('style');
            $noDelete.hide();
        });
    },
    
    render: function() {

        var offerJson = this.model.toJSON();
        var bookJson = this.model.get('book').toJSON();

        bookJson.imageLinks = bookJson.imageLinks || [];

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

        return this;
    },

    editBook: function(e){

        var hasClickables = this.$(e.target).closest('.clickable');

        // console.log(e.target, hasClickables);

        if(!hasClickables.length){
            appView.showEditBook(this);
        }

    }
});