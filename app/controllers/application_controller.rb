class ApplicationController < ActionController::Base
  protect_from_forgery
	before_filter :authenticate_user!
	respond_to :html, :json

	#Rescuing from access denial roles
  rescue_from CanCan::AccessDenied do |exception|	
		logger.info exception.message
		respond_with [:error => 401, :alert => exception.message] do |format|
			format.html {redirect_to root_url}
		end
  end

	rescue_from Exception do |exception|
		logger.error "#{Time.now} : #{exception.message}"
	end

  private

  # Overwriting the sign_out redirect path method
  def after_sign_out_path_for(resource_or_scope)
    new_user_session_path
  end

end
