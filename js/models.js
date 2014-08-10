var Book = Parse.Object.extend("Book");
var Offer = Parse.Object.extend("Offer");

var BookCollection = Parse.Collection.extend({
    model: Book,
    query: '',
    successParse: false,
    successGoogle: false,
    initialize: function() {
        _.bindAll(this, 'url', 'fetch', 'fetchCallback');
    },
    fetch: function(options) {
        var self = this;
        self.reset();
        var options = options || {};
        $.getJSON(this.url(),{q: this.query, maxResults: 5}, 
            function(response) {
                self.fetchCallback(response, options); 
            },'jsonp');

        console.log(this.query, makePattern(this.query));
        var query = new Parse.Query(Book);
        query.matches("title", makePattern(this.query));
        query.find({
          success: function(results) {

            results = orderResults(results, self.query);
            results.splice(5,results.length);
            self.add(results, {silent: true});
            self.successParse = true;
            self.success(options);
          },
          error: function(error) {
            alert("Error: " + error.code + " " + error.message);
          }
        });
    },
    success: function(options){

        if(this.successParse && this.successGoogle){

            this.trigger('change');
            options.success(this);
        }
        
    },
    fetchCallback: function(response, options) {
        var self = this;
        // self.reset();



        _.each(response.items, function(book, i) {
            newBook = new Book();
            if (typeof(book.volumeInfo.title) != "undefined"){
                newBook.set('title', book.volumeInfo.title);
            }
            if (typeof(book.volumeInfo.subtitle) != "undefined"){
                newBook.set('subtitle', book.volumeInfo.subtitle);
            }
            if (typeof(book.volumeInfo.authors) != "undefined"){
                newBook.set('authors', book.volumeInfo.authors);
            }
            if (typeof(book.volumeInfo.imageLinks) != "undefined"){
                newBook.set('thumbnails', book.volumeInfo.imageLinks);
            }
            if (typeof(book.id) != "undefined"){
                newBook.set('idGBook',  book.id);
            }
            self.add(newBook,{ silent: true }); 
        });
        
        // options.success(self);
        this.successGoogle = true;
        this.success(options);

        
    },
    url: function() {
        return "https://www.googleapis.com/books/v1/volumes";
         // + this.query;
    }
});