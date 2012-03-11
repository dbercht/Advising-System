class CalendarsController < ApplicationController
	load_and_authorize_resource
	
  def show
		@calendar = Calendar.find(params[:id])
		if current_user.role?(:student)
			@registration_ability = current_user.registration_abilities.where(:calendar_id => params[:id], :user_id => params[:user_id]).first
		end
  end

  def new
		@user = User.find(params[:advisor_id])
		@calendar = @user.calendars.build
  end

	def create
		@user = User.find(params[:advisor_id])
		@calendar = @user.calendars.build(params[:calendar])
		if @calendar.save
			redirect_to @user, :notice => "Calendar was successfully created"
		else
			render action: 'new'
		end
  end

  def edit
		@calendar = Calendar.find(params[:id])
		@registration_abilities = @calendar.registration_abilities(:include => [:users])
		@user = @calendar.advisor
  end

	def update
		@user = User.find(params[:advisor_id])
		@calendar = @user.calendars.find(params[:id])
		@registration_abilities = @calendar
		if @calendar.update_attributes(params[:calendar])
			redirect_to @user, :notice => "Calendar was successfully updated"
		else
			render action: 'edit'
		end
  end

	def destroy
		@user = User.find(params[:advisor_id])
		@calendar = @user.calendars.find(params[:id])
		@calendar.destroy
		redirect_to @user
	end

end
