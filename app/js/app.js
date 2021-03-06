AppView = Parse.View.extend({

	el: "#app",

	login 		: new LoginView(),
	admin 		: new AdminView(),
	mainnav 	: new MainNavView(),

	loggedClass: 'logged',

	render: function () {

		this.$body = this.$el.parent();

		if ( Parse.User.current() ) {

			this.mainnav.render().$el.show()
			this.showAdmin()

    	}else{

    		this.showLogIn();
 
    	}

	},

	showAdmin: function () {

		// if (this.admin) {
		// 	this.admin.remove()
		// }

		if ( Parse.User.current() ) {

			this.$body.addClass(this.loggedClass)

			this.login.$el.html('')

			this.admin.render().$el.show()

		}
	},

	showImportDB: function(data) {

		appRouter.navigate('import');

		this.admin.hide();

		if (this.importDB) {
			this.importDB.remove()
		}

		this.importDB 			= new ImportDBView()
		this.importDB.data 		= data

		this.$el.append(this.importDB.render().el)
	},

	browserSupportFileUpload: function () {
        var isCompatible = false;
        if (window.File && window.FileReader && window.FileList && window.Blob) {
        isCompatible = true;
        }
        return isCompatible;
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

		if (this.editImage) {
			this.editImage.remove()
		}

		this.editImage 				= new EditImageView()
		this.editImage.model 		= bookTr.model.get('book')
		this.editImage.callerView 	= bookTr

		this.$el.append(this.editImage.render().el)

	},

	showUploadDB: function () {

		if ( !this.uploadDB ){
			this.uploadDB = new UploadDBView()
			this.$el.append(this.uploadDB.render().el)
		}else{
			this.uploadDB.show()
		}
		
	},

});