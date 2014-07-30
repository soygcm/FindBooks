AppView = Parse.View.extend({

	el: "#app",

	login: new LoginView(),
	admin: new AdminView(),

	render: function () {

		this.login.render();

		this.admin.render();
		
		if (Parse.User.current()) {

        	this.login.hide();


    	}else{

    		this.admin.hide();


    	}



	},

});