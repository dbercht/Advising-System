class StaticsController < ApplicationController
	before_filter :defer_user, :only => 'home'

	def home
	end

	private
	#re-routes user if he is logged in
	def defer_user
		if(current_user)
			redirect_to(user_path(current_user))
		end
	end
end
