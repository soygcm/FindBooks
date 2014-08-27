AppView = Parse.View.extend({

	el: "#app",

	login 		: new LoginView(),
	admin 		: new AdminView(),
	mainnav 	: new MainNavView(),

	loggedClass: 'logged',

	render: function () {

		this.$body = this.$el.parent();

		if ( Parse.User.current() ) {

			this.showAdmin();

    	}else{

    		this.showLogIn();
 
    	}

	},

	showAdmin: function () {

		if ( Parse.User.current() ) {

			this.mainnav.render().$el.show();
			this.$body.addClass(this.loggedClass);

			this.login.$el.html('');

			this.admin.render();

		}
	},

	showImportDB: function() {

		appRouter.navigate('import');

		this.admin.$el.hide();


		if (!this.importDB || this.importDB.$el.html() == '') {
			this.importDB = new ImportDBView();
			this.admin.$el.hide();
			this.importDB.render();
		}else{
			this.importDB.$el.show();
		}
	},

	showLogIn: function () {
		this.$body.removeClass(this.loggedClass);
		this.login.render();
		this.admin.$el.html('');
		
		// this.importDB.$el.html('');
		this.mainnav.$el.html('').hide();
	},

	navHome: function(){
		appRouter.navigate('');
	},

	home: function(){
		this.navHome();

		this.admin.$el.show();

		if (this.editBook) {
			this.editBook.hide();
		}

		if (this.importDB) {
			this.importDB.$el.hide();
		}

	},

	showNewBook: function(model) {

		appRouter.navigate('new');

		if (!this.editBook){
			this.editBook = new EditBookView();
		}
		if (this.editBook.$el.html() == '') {
			this.editBook.book = model;
			this.editBook.render();
		}

		console.log('new ' + model.get('idGBook'));
	},

	showEditBook: function(bookTr) {

		appRouter.navigate('edit/'+bookTr.model.id);

		if (!this.editBook){
			this.editBook = new EditBookView();
		}
		if(this.editBook.$el.html() == '') {
			this.editBook.model = bookTr.model;
			this.editBook.callerView = bookTr;
			this.editBook.render();
		}

		// console.log('new ' + model.get('idGBook'));
	},

	showEditImage: function(bookTr) {

		if (!this.editImage){
			this.editImage = new EditImageView();
		}

		if(this.editImage.$el.html() == '') {
			this.editImage.model = bookTr.model.get('book');
			this.editImage.callerView = bookTr;
			this.editImage.render();
		}

	},

	// showEditBook: function(id) {

	// 	appRouter.navigate('edit/'+id);

	// 	console.log('edit book: '+id);

	// }

});