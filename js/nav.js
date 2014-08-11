MainNavView = Parse.View.extend({

	el: "#mainnav",

	events: {

		"click .logout" : "logOut"

	}, 

	template:_.template($("#nav-template").html()),
	
	render: function () {

		this.$el.html( this.template( Parse.User.current().toJSON() ) );

		return this;

	},

	logOut: function (e) {

		e.preventDefault();

		Parse.User.logOut();
		appView.showLogIn();

	}

});