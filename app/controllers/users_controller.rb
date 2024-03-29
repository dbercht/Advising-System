class UsersController < ApplicationController
	load_and_authorize_resource
	skip_before_filter :login_required, :only=>[:new, :create]

  def index
  end
  
	def show
		@user = User.find(params[:id])
		if !@user.role?(:admin)
			redirect_to :controller => @user.type.downcase.pluralize.to_sym, :action => 'show', :id => params[:id]
		else
			redirect_to :action => 'index'
		end
	end

  def new
    @user = User.new
  end
  
  def create
    @user = User.new(params[:user])
		if(current_user.role?(:admin))
			@user.update_attribute(:type, params[:role][:type])
		end
    if @user.save
      flash[:notice] = "Successfully created User." 
      redirect_to root_path
    else
      render :action => 'new'
    end
  end
  
  def edit
    @user = User.find(params[:id])
  end
  
  def update
    @user = User.find(params[:id])
    params[:user].delete(:password) if params[:user][:password].blank?
    params[:user].delete(:password_confirmation) if params[:user][:password].blank? and params[:user][:password_confirmation].blank?
    if @user.update_attributes(params[:user])
      flash[:notice] = "Successfully updated User."
      redirect_to :action => 'index'
    else
      render :action => 'edit'
    end
  end
  
  def destroy
    @user = User.find(params[:id])
    if @user.destroy
      flash[:notice] = "Successfully deleted User."
      redirect_to users_path
    end
  end


end
