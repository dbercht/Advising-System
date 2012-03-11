class User < ActiveRecord::Base

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  default_scope :order => 'last_name'

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :first_name, :last_name, :password, :password_confirmation, :remember_me

	validate :last_name, :presence => true
	validate :first_name, :presence => true


# no need
#	has_and_belongs_to_many :advising_calendars, :class_name => "Calendar", :join_table => 'calendars_users'

	has_many :registration_abilities, :include => [:events], :dependent => :delete_all
	has_many :open_calendars, :through => :registration_abilities,  :source => 'calendar'
	



	def role
		return type
	end

	def role?(role)
		return self.type == role.to_s.camelize
	end
	
	def editable_slot_ids
		@a = Array.new
		registration_abilities.each do |r|
			@a << r.editable_slot_ids	
		end
		return @a
	end



end
