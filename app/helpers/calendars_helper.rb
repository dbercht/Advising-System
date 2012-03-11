module CalendarsHelper
	def user_history
		if(!!params[:user_id])
			html = link_to( "Back", user_path(params[:user_id]))
		else
			html = link_to( "Back", advisor_path(params[:advisor_id]))
		end
		return html
	end
end
