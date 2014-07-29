LoginView = Parse.View.extend({

	el: "#login",

	events:{
        "click .login":"logIn",
        "click .signup": "signUp"
    },

	template:_.template($("#login-template").html()),

	render: function() {
        this.$el.html(this.template());

        $error = this.$(".alert-danger");

        $error.hide();

        return this;
    },

    logIn: function(e) {

        e.preventDefault();

        var self = this;
	    var username = this.$(".email").val();
	    var password = this.$(".password").val();

	    $error.html("").hide();
		
	    if((username.trim()=="") || (password.trim()=="")){
			$error.html("Please insert your Username and/or Password to login").show();
	    } else {
	      // appView.loading();
	      Parse.User.logIn(username, password, {
	        success: function(user) {
	          // self.undelegateEvents();
	          // appView.notLoading();
	          self.hide();
	          // appView.show();
	        },
	        error: function(user, error) {
			  // appView.notLoading();
	          $error.html("Invalid username or password. Please try again.").show();
	          self.$("button").removeAttr("disabled");
	        }
	      });

	      this.$("button").attr("disabled", "disabled");
	    }
	    return false;
    },
    
    signUp: function (){
	    
	    var self = this;
	    var username = this.$(".email").val();
	    var password = this.$(".password").val();
	    
	    $error.html("").hide();

	    if((username.trim()=="") || (password.trim()=="")){
	      $error.html("Please insert an Username and a Password to Sign Up").show();
	    } else {

	      Parse.User.signUp(username, password, null, {
	        success: function(user) {
	          // self.undelegateEvents();
	          self.hide();
	        },
	        error: function(user, error) {
	          $error.html(error.message).show();
	          self.$("button").removeAttr("disabled");
	        }
	      });

	      this.$("button").attr("disabled", "disabled");
	    }
	    return false;

    },

    hide: function(){

    	this.$el.hide();

    }

});


