class EventsController < ApplicationController
	load_and_authorize_resource :calendar
	load_and_authorize_resource :event, :through => :calendar
	
	respond_to :json

  def index
		@calendar = Calendar.find(params[:calendar_id])
		@events = @calendar.events
		render :json => @events.as_json(:include => [:user])
  end


	def create
		@calendar = Calendar.find(params[:calendar_id])
		@event = @calendar.events.create(params[:event])
		logger.info params
		render :json => @event.as_json
  end

  def edit
		@calendar = Calendar.find(params[:calendar_id])
		@event = @calendar.events.find(params[:id])
		@user = @calendar.advisor
  end

	def update
		@calendar = Calendar.find(params[:calendar_id])
		@event = @calendar.events.find(params[:event_id])
		if((params[:event][:registration_ability_id].to_i == 0))
			params[:event][:registration_ability_id] = nil
		end
		if @event.update_attributes(params[:event])
			render :json => @event.as_json(:include => [:user])
		else
			render :json => @event.errors.as_json
		end
  end

	def destroy
		@calendar = Calendar.find(params[:calendar_id])
		@event = @calendar.events.find(params[:event_id])
		@event.delete
		render :json => {:status => 200}
	end

end
