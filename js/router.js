var AppRouter = Parse.Router.extend({
    routes:{
        '':'home',
        'admin/p:page': 'admin',
        'edit/:id' : 'edit',
    },
    home:function(action){
    	
    	this.admin();

    },

    admin: function (a){

    	appView.showAdmin();

    },

    edit: function(id){

    	appView.editBook(id);

    }
});