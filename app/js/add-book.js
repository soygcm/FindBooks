AddBooksView = Parse.View.extend({
    searchState: 0,

    // el:"#add-book",

    events: {
        'keyup input.title-isbn'    : 'logKey',
        'submit form.add'           : 'startSearch',
        // 'click button.erase'        : 'eraseResults',
        'click button.add'          : 'addBook',
    },

    countUp: 600,

    template:_.template($("#add-book-template").html()),

    logKey: function(e) {
        // console.log(e.keyCode, this.query);
        if (this.$inputSearch.val() != "" && this.$inputSearch.val() != this.query) {
            if (this.searchState == 1) {
                clearTimeout(this.counting);
            }
            console.log('iniciando conteo hasta '+this.countUp);
            self = this;
            this.counting = setTimeout(function(){
                console.log('buscando...')
                self.startSearch(null);
            },this.countUp);
            this.searchState = 1;
        }
        else if(this.$inputSearch.val() == ""){
            this.$results.modal('hide');
            this.$el.css('z-index', 20);
        }
    },

    addBook: function(){

        appView.showNewBook(null);
        
    },

    startSearch: function(e){
        if (e) {
            e.preventDefault();
        }
        self = this;
        if (e || this.$inputSearch.val() != "" && this.$inputSearch.val() != this.query) {
            
            //Busqueda con el modelo local
            /*
            this.bookCollection.query = this.$inputSearch.val();
            this.bookCollection.fetch({
                success:function(collection){
                    self.$results.empty();

                    self.$results.modal('show');
                    appView.$body.removeClass('modal-open');

                    self.$el.css('z-index', 6000);
                    console.log("Busqueda terminada");
                    _.each(collection.models, function(book, i) {
                        self.addOneResult(book);
                    });
                }
            });
            */

            //Busqueda con el modelo en la nube
            // console.log("Iniciar Busqueda")
            this.query = this.$inputSearch.val()
            Parse.Cloud.run('search', { query: this.query }, {
                success: function(collection) {
                    console.log("Busqueda Terminada")

                    self.printResult(collection)
                },
                error: function(error) {
                    console.log(error)
                }
            })

        }
        else if(this.$inputSearch.val() == ""){
            this.$results.modal('hide');
            this.$el.css('z-index', 20);
        }
    },

    printResult: function (collection) {

        var self = this
        
        this.$results.empty()
        this.$results.modal('show')
        appView.$body.removeClass('modal-open')
        this.$el.css('z-index', 6000)

        _.each(collection.models, function(book, i) {
            self.addOneResult(book)
        });


    },

    addOneResult: function(book){
        console.log(book.get('title'));
        var bookResult = new BookResult({model: book, parent: this});
        this.$results.append(bookResult.render().el);
    },
    
    eraseImage: function () {
        this.$ulImageResults.find('img').show();

        this.$ulImageResults.find('img').each(function(index, el) {
            $(el).attr('src', $(el).data('thumb'));
        }).show();


    },
    createBook:function () {
        newBook = new Book();
        newBook.set('title', this.$inputTitle.val());
        authorsArray = this.$inputAuthors.val().split(",");
        newBook.set('authors', authorsArray);
        thumbnails = new Object();
        thumbnails.thumbnail = this.$('img.imageresult.selected').data('link');
        thumbnails.smallThumbnail = this.$('img.imageresult.selected').data('thumb');
        newBook.set('thumbnails', thumbnails);
        return newBook;
    },
    initialize: function(){
        // this.render();
    },
    render: function(){
        this.$el.html(this.template());

        this.bookCollection = new BookCollection();

        this.$inputSearch = this.$('input.title-isbn');
        this.$results = this.$('.results');

        this.$results.hide();

        this.$inputTitle = this.$('input.title');
        this.$inputAuthors = this.$('input.authors');
        this.$ulImageResults = this.$('ul.imageresults');
        this.$formSearchOffer = this.$('form');
        this.$btnErase = this.$('button.erase');

        return this;
    },


    empty: function(){
        // this.$inputSearch.val('');
        this.$results.hide();
        this.$results.modal('hide');
        this.$el.css('z-index', 20);
    },


    setBookResult: function(book){
        // console.log(book.get('title'));

        /*
        
        this.selectedResult = book;
        this.$formSearchOffer.hide();
        this.$results.hide();
        this.$btnErase.removeClass('hidden').show();
        var bookResult = new BookResult({model: book, parent: this, id: 'book-result', tagName: 'div'});
        this.$el.append(bookResult.render().el);

        */

    },
    eraseResults: function(){
        this.$formSearchOffer.show();
        this.$results.show();
        this.$btnErase.hide();
        this.$('#book-result').remove();
    }
});
