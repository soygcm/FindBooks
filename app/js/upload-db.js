UploadDBView = Parse.View.extend({

    // id: "upload-db-view",

    tagName: "section",

    events:{        
        "click    button.import"  : "importFile", 
    },

    template: _.template($("#upload-db-template").html()),

    show: function(){
        this.$modal.modal('show')
    },

    hide: function(){
        this.$modal.modal('hide')
    },

    importFile: function () {

        if (! appView.browserSupportFileUpload()) {
            alert('The File APIs are not fully supported in this browser!')
        } else {
            var data    = null
            var file    = this.$inputFile[0].files[0]
            var reader  = new FileReader()
            var self    = this
            
            reader.onload = function(event) {
                var csvData = event.target.result
                data        = $.csv.toObjects(csvData)

                if (data && data.length > 0) {
                    console.log('Imported -' + data.length + '- rows successfully!')

                    appView.showImportDB(data)
                    self.hide()

                } else {
                    alert('No data to import!')
                }
            }

            reader.onerror = function() {
                alert('Unable to read ' + file.fileName)
            }

            reader.readAsText(file)
        }

    },

    render: function() {

        this.$el.html(this.template())

        this.$modal         = this.$(".modal")
        this.$inputFile     = this.$("input.file")

        this.$inputFile.filestyle({
            buttonText      : "Upload a File",
            buttonBefore    : "true"
        })
        this.show()

        return this
    },
})