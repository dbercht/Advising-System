class RegistrationsController < ApplicationController
  load_and_authorize_resource

	def index
		@calendar = Calendar.find(params[:calendar_id])
		@registration_abilities = @calendar.registration_abilities
		respond_to do |format|
			format.json { render :json => @registration_abilities.as_json(:include => [:user, :events])}
			format.html
		end
	end

	def new
		@calendar = Calendar.find(params[:calendar_id])
		@registration_ability = @calendar.registration_abilities.build
	end

  #CREATE MULTIPLE CREATES
	def create
		@calendar = Calendar.find(params[:calendar_id])
		@registration_ability = @calendar.registration_abilities.build(params[:registration_ability])
		@registration_ability.calendar = @advising_period
		if @registration_ability.save
			redirect_to user_advising_period_path(@user, @advising_period)
		else
			render action: 'new'
		end
	end

	def edit
		@calendar = Calendar.find(params[:calendar_id])
		@registration_ability = RegistrationAbility.find(params[:id])
	end

	def update
		@advising_period = Calendar.find(params[:calendar_id])
		@registration_ability = RegistrationAbility.find(params[:id])
		if @registration_ability.update_attributes(params[:registration_ability])
			redirect_to user_advising_period_path(current_user, @advising_period)
		else
			render action: 'edit'
		end
	end


	def destroy
		@calendar = Calendar.find(params[:advising_period_id])
		@advisor = @calendar.advisor
		@registration_ability = RegistrationAbility.find(params[:user_id], params[:advising_period_id])
		@registration_ability.destroy
		redirect_to advisor_calendar_path(@advisor, @calendar)
	end
end
