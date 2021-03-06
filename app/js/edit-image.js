EditImageView = Parse.View.extend({
    tagName: "section",
    events:{        
        "click          .save"              : 'saveImage',
        "click          .nav-tabs a"        : "showTab",
        'keyup          input.search'       : 'searchImages',
        // 'click button.eraseimage'   : 'eraseImage',
        'click          img.imageresult'    : 'selectImage',
        "shown.bs.tab   .nav-tabs a"        : "shownTab",
        "show.bs.tab    .nav-tabs a"        : "onShowTab",
        "change         input.file"         : "filePreview",
    },

    template: _.template($("#edit-image-template").html()),

    filePreview: function (e) {
        
        if (e.target.files && e.target.files[0]) {
            
            var reader = new FileReader()

            self = this

            reader.onload = function (e) {
                self.$previewFile.attr('src', e.target.result).show()
            }

            reader.readAsDataURL(e.target.files[0])
        }

    },

    onShowTab: function (e) {
        
        var idTab       = this.$(e.target).attr('href')
        var newHeight   = this.$(idTab).outerHeight()

        this.$tabContent.animate({height: newHeight}, function () {
            $(this).removeAttr('style');
        })

    },

    showTab: function (e) {
        e.preventDefault()
        this.$(e.target).tab('show')
    },

    shownTab: function (e) {
        this.currentTab = $(e.target).attr('href')
        console.log(this.currentTab)
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
        this.$inputFile         = this.$("input.file")
        this.$previewFile       = this.$(".preview>img")
        this.$tabContent        = this.$(".tab-content")

        this.$inputFile.filestyle()
        this.$previewFile.hide()
        this.$modal.modal('show')

        return this
    },

    saveImage: function(e){

        console.log(this.model)

        var fileUploadControl = this.$inputFile[0] || []

        self = this

        if (this.currentTab == "#upload" &&  fileUploadControl.files.length > 0) {
            
            this.$footer.find('button').attr("disabled", true)

            var file    = fileUploadControl.files[0]
            var picture = new Parse.File(file.name, file)

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