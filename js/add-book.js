AddBooksView = Parse.View.extend({
    searchState: 0,

    // el:"#add-book",

    events: {
        'keyup input.title-isbn'    : 'logKey',
        // 'keyup input.title'         : 'searchImages',
        'submit form.add'           : 'startSearch',
        // 'click button.erase'        : 'eraseResults',
        // 'click button.eraseimage'   : 'eraseImage',
        'click button.add'          : 'addBook',
        // 'click img.imageresult'     :'selectImage',
    },

    countUp: 600,

    template:_.template($("#add-book-template").html()),

    logKey: function(e) {
        // console.log(e.keyCode);
        if (this.$inputSearch.val() != "" && this.$inputSearch.val() != this.bookCollection.query) {
            if (this.searchState == 1) {
                clearTimeout(this.counting);
            }
            // console.log('iniciando conteo hasta '+this.countUp);
            self = this;
            this.counting = setTimeout(function(){
                console.log('buscando...')
                self.startSearch(e);
            },this.countUp);
            this.searchState = 1;
        }
        else if(this.$inputSearch.val() == ""){
            this.$results.hide();
        }
    },

    addBook: function(){
        console.log('addbook');
    },

    startSearch: function(e){
        e.preventDefault();
        self = this;
        if (this.$inputSearch.val() != "" && this.$inputSearch.val() != this.bookCollection.query) {
            this.bookCollection.query = this.$inputSearch.val();
            this.bookCollection.fetch({
                success:function(collection){
                    self.$results.empty();
                    self.$results.show();
                    console.log("Busqueda terminada");
                    _.each(collection.models, function(book, i) {
                        self.addOneResult(book);
                    });
                }
            });
        }
        else if(this.$inputSearch.val() == ""){
            this.$results.hide();
        }
    },
    addOneResult: function(book){
        console.log(book.get('title'));
        var bookResult = new BookResult({model: book, parent: this});
        this.$results.append(bookResult.render().el);
    },
    searchImagesState: 0,
    searchImages: function(e){
            if (this.searchImagesState == 1) {
                clearTimeout(this.countingImages);
            }
            // console.log('iniciando conteo hasta '+this.countUp);
            self = this;
            this.countingImages = setTimeout(function(){
                console.log('buscando...')
                self.startSearchImages();

            },this.countUp);
            this.searchImagesState = 1;
    },
    startSearchImages: function () {
        self = this;

        $.getJSON('https://www.googleapis.com/customsearch/v1', 
            {
                key: 'AIzaSyBG4Ajg_18bLW2a5Im0V8BrydLrKVCA0jE',
                cx: '009812348751333104389:4ld9qfojt_y',
                q: this.$inputTitle.val(),
                searchType: 'image'
            }, 
            function(json, textStatus) {
                self.$ulImageResults.empty();
                _.each(json.items, function(image, key, list){
                    $('<img/>',{
                        src: image.image.thumbnailLink,
                        class: 'imageresult',
                        'data-link': image.link,
                        'data-thumb': image.image.thumbnailLink
                    }).appendTo($('<li>'))
                    .appendTo(self.$ulImageResults);
                });
        });
    },
    selectImage:function (e) {
        this.$ulImageResults.find('img').hide();
        this.$ulImageResults.find(e.target).attr('src', this.$(e.target).data('link')).addClass('selected').show();
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
        this.$inputSearch.val('');
        this.$results.hide();
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
