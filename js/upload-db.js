UploadDBView = Parse.View.extend({

    // id: "upload-db-view",

    tagName: "section",

    events:{        
        "hidden.bs.modal .modal"    : "onHiddenModal",
    },

    template: _.template($("#upload-db-template").html()),

    onHiddenModal: function(){
        
    },

    show: function(){
        this.$modal.modal('show');
    },

    render: function() {
        this.$el.html(this.template())
        this.$modal = this.$(".modal")
        this.$modal.modal('show')
        return this
    },
})