AdminView = Parse.View.extend({

	el: "#admin",

    events: {
        
    },

    addBooks: new AddBooksView(),

    offerList: new OfferList(),

	template:_.template($("#admin-template").html()),

	render: function() {

        this.$el.html(this.template());

        this.addBooks.setElement(this.$("#add-book")).render();

        this.$tableBody = this.$('table tbody');
        this.$table = this.$('table');

        this.getBookList();

        // collection.on("reset", resetCallback);

        this.offerList.on('add', this.addOneOffer);

        return this;
    },

    hide: function(){
    	this.$el.hide();
    },
    
    show: function(){
    	this.$el.show();
    },

    getBookList: function() {

        // this.dataTable =

        self = this;

        this.offerList.query = new Parse.Query(Offer);
        this.offerList.query.equalTo("user", Parse.User.current() );
        this.offerList.query.include("book");

        this.offerList.fetch({
            success: function (collection){

                console.log('offer list success');

                _.each(collection.models, function(offer, i) {
                        self.addOfferTr(offer);
                });

                self.drawTable();

            },
            error: function(){

            }
        });

    },

    // Recibe un $row jQuery y actualiza sus datos
    updateDataRow: function ($row) {

        var dataRow = this.dataTable.row( $row ).data();

        var $rowTds = $row.find('td');
            
        $rowTds.each(function(index, el) {

            if ( $(this).data('order') ) {
                dataRow[index] = {
                    "@data-order"   : $(this).data('order'),
                    "display"       : $(this).html()
                };
            }else{
                dataRow[index] = $(this).html();
            }

        });


        // .draw();
        
        this.dataTable.row( $row ).data( dataRow ).draw();

    },

    // Recibe un $row jQuery y lo agrega a los datos de dataTable
    addRow: function ($row) {

        this.dataTable.row.add( $row ).draw();

    },

    // Recibe un $row jQuery y lo elimina de la dataTable
    removeRow: function ($row) {

        console.log($row);
        
        this.dataTable.row( $row ).remove().draw();

    },

    // guarda el DataTable de la $table objeto (esto genera el ordenamiento, busqueda y paginación en el html)
    drawTable: function () {
        
        this.dataTable = this.$table.DataTable( {
          "columnDefs": [ {
              "targets": 3,
              "searchable": false,
              "orderable": false
            } ]
        } );

    },

    addOfferTr: function (offer) {
        
        var bookTr = new BookTr({model: offer});
        var renderTr = bookTr.render().el;
        appView.admin.$tableBody.prepend(renderTr);

        return renderTr;
    },

    addOneOffer: function (offer) {

        self = appView.admin;
        
        var row = this.$(self.addOfferTr(offer));

        self.addRow(row);

    },

});