var AppRouter = Parse.Router.extend({
    routes:{
        // '':'home',
        // 'admin/p:page': 'admin',
        'edit/:id' : 'edit',
    },

    edit: function(id){

    	appView.editBook(id);

    }
});