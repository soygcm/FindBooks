AppView = Parse.View.extend({

	el: "#app",

	login: new LoginView(),
	admin: new AdminView(),
	mainnav: new MainNavView(),

	loginClass: 'login',

	render: function () {

		this.login.render();

		this.admin.render();
		
		if (Parse.User.current()) {

        	this.login.hide();

        	this.$el.parent().addClass(this.loginClass);

    	}else{

    		this.admin.hide();


    	}



	},

});