EditImageView = Parse.View.extend({
    el: "#edit-image",
    events:{        
        "hidden.bs.modal .modal"    : "onHiddenModal",  
        "click .save"               : 'saveImage',
        "click .nav-tabs a"         : "showTab",
        'keyup input.search'        : 'searchImages',
        // 'click button.eraseimage'   : 'eraseImage',
        'click img.imageresult'     : 'selectImage',
        "shown.bs.tab .nav-tabs a"  : "shownTab",
    },

    template: _.template($("#edit-image-template").html()),

    showTab: function (e) {
        e.preventDefault()
        $(this).tab('show')
    },

    shownTab: function (e) {
        this.currentTab = $(e.target).attr('href')
        console.log(this.currentTab)
    },

    onHiddenModal: function(){

        this.offerEdited = false;
        this.bookEdited = false;
        delete this.model;
        this.delegateEvents(); //No entiendo, es supuestamente para controlar los eventos
        this.$el.html('');
        delete this.book;
    },

    hide: function(){
        if (this.$modal) {
            this.$modal.modal('hide');
        }
    },

    render: function() {

        var bookJson = ''

        if (this.model) {
            bookJson = this.model.toJSON()
        }

        var datos =  {
            'book'  :  bookJson,
        }

        this.$el.html(this.template(datos))

        this.currentTab = "#upload"

        this.$modal             = this.$(".modal")
        this.$ulImageResults    = this.$(".result")
        this.$inputTitle        = this.$("input.search")
        this.$footer            = this.$(".modal-footer")

        this.$modal.modal('show')

        return this
    },

    saveImage: function(e){

        var fileUploadControl = $("#upload .file")[0]

        self = this;

        if (this.currentTab == "#upload" &&  fileUploadControl.files.length > 0) {
            
            this.$footer.find('button').attr("disabled", true)

            var file = fileUploadControl.files[0]
            var name = "photo.jpg"
            var picture = new Parse.File(name, file)
            picture.save().then(function() {
                
                self.model.set("picture", picture)
                return self.model.save()

            }).then(function (model, success) {

                console.log(success);
                
                self.$footer.css('background-color', 'lightgreen')
                self.$footer.find('button').attr("disabled", false)

            }, self.saveError)

        }
        
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
        this.$ulImageResults.find(e.target).css("max-width", "100%");
    },
    

    saveError: function(model, error){
        console.log(error)
        appView.editImage.$footer.find('button').attr("disabled", false)
    },

    uploadImageBook: function(book, success){
        $.post('http://localhost/parse-services/upload-images.php',
            {   appid: appId,
                url: book.get('thumbnails').thumbnail,
                apikey: rApiKey,
                name: book.get('idGBook') || 'googleimages'
        },function(data, textStatus, xhr){
            success(data, textStatus, xhr);
        }, 'json').error(function( jqXHR, textStatus, errorThrown) {
            console.log( jqXHR, textStatus, errorThrown);
        });
    }
});