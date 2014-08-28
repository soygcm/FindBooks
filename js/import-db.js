ImportDBView = Parse.View.extend({
    id          : "import-db",
    tagName     : "section",
    className   : "container-fluid",
    events      : {

    },
    template    : _.template($("#import-db-template").html()),
    hide        : function(){
        
    },
    render      : function() {

        this.$el.html(this.template())

        var columns = new Array()

        for (var key in this.data[0]) {
            columns.push( {data: key, title: key} )
        }

        this.$('table').DataTable({
            data:       this.data,
            columns:    columns
        })

        this.dataTable = this.$('table').DataTable()

        return this
    }
});