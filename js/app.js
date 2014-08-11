AppView = Parse.View.extend({

	el: "#app",

	login: new LoginView(),
	admin: new AdminView(),
	mainnav: new MainNavView(),
	
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

	showLogIn: function () {
		this.$body.removeClass(this.loggedClass);
		this.login.render();
		this.admin.$el.html('');
		this.mainnav.$el.html('').hide();
	},

	editBook: function(id) {
		appRouter.navigate('edit/'+id);
		console.log('edit book: '+id);
	}

});