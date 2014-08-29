ImportDBView = Parse.View.extend({
    id          : "import-db",
    tagName     : "section",
    className   : "container-fluid",
    events      :{
        "click    button.import"     : "importData"
    },
    template    : _.template($("#import-db-template").html()),
    hide        : function(){

    },
    importData  : function () {
        
        var newBooks        = new Array()
        var columnHeaders   = this.dataTable.columns().header()
        var columnKeys      = new Array()
        var self            = this

        for (var i = 0, end = columnHeaders.length; i <= end ; i++) {
            columnKeys.push( this.$(columnHeaders[i]).find('select').val() )
        }

        for (var i = this.data.length - 1; i >= 0; i--) {

            var newBook = new Book()

            var j = 0
            for (var key in this.data[i]) {
                var keySelected = columnKeys[j]

                // Cada metadato se trata de forma diferente

                if (keySelected == "authors") {
                    newBook.set(keySelected, this.data[i][key].split(","))
                }else if (keySelected != "none" && keySelected.length > 0) {
                    newBook.set(keySelected, this.data[i][key])
                }

                j++
            }

            newBooks.push(newBook)
        }

        Parse.Object.saveAll(newBooks, {
            success: function(list) {
                console.log("save new books")

                var newOffers = new Array()
                
                _.each(list, function (book, i, list) {

                    var offer = new Offer()
                    
                    offer.set('price', Number(book.get("price")))
                    offer.set('stocks', Number(book.get("stocks")))
                    offer.set('book', book);
                    offer.set("user", Parse.User.current());

                    newOffers.push(offer)
                })

                Parse.Object.saveAll(newOffers, {
                    success: function(list) {
                        console.log("save new offers")
                        appView.showAdmin()
                        appView.navHome()
                        self.remove()
                    }
                })
            },
            error: function(error) {
                
            }
        })
    },
    render      : function() {

        this.$el.html(this.template())

        var columns = new Array()

        var title = "<select class='form-control'>\
                      <option value='title'>Titulo</option>\
                      <option value='subtitle'>Subtitulo</option>\
                      <option value='authors'>Autores</option>\
                      <option value='publisher'>Editorial</option>\
                      <option value='price'>Precio</option>\
                      <option value='isbn-10'>ISBN 10</option>\
                      <option value='none'>Ignorar</option>\
                    </select>"

        for (var key in this.data[0]) {
            columns.push( {data: key, title: title} )
        }

        this.$('table').DataTable({
            data        : this.data,
            columns     : columns,
            ordering    : false
        })

        this.dataTable = this.$('table').DataTable()

        return this
    }
});