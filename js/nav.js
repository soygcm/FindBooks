MainNavView = Parse.View.extend({

	el: "#mainnav",

	events: {

		"click .logout" : "logOut"

	}, 
	
	render: function () {

	},

	logOut: function (e) {

		e.preventDefault();

		Parse.User.logOut();
		appView.showLogIn();

	}

});