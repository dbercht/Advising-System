# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
Admin.create(:email => 'admin@advising_system.com', :password => 'advising_system', :password_confirmation => 'advising_system', :first_name => 'Admin', :last_name => 'Admin')
