var AppRouter = Parse.Router.extend({
    routes:{
        '':'home',
        // 'admin/p:page': 'admin',
        'edit/:id' : 'edit',
        'new' : 'newBook',
        'import' : 'importDB',
    },

    home: function(){
        appView.home();
    },

    edit: function(id){
    	appView.editBook(id);
    },
    newBook : function(){
        appView.showNewBook(new Book());
    },
    importDB : function(){
        appView.showImportDB();
    }
});