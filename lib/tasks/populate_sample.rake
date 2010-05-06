namespace :schedule do
    desc "Add sample data to the database"
    task :populate_sample => :environment do
      
      ##########################################################################
      puts 'Creating store...'
      Store.destroy_all
      store = Store.create(
                      :name => 'Good Eats',
                      :city => 'Detroit',
                      :state => 'MI',
                      :zip => '48226',
                      :url => 'http://www.goodeats.com')
    
      
      ##########################################################################
      puts 'Creating roles...'
      Role.destroy_all
      Role.create(:name => 'Admin')
      Role.create(:name => 'Staff')
      Role.create(:name => 'Manager')
      
      
      ##########################################################################
      puts 'Creating positions...'
      Position.destroy_all
      Position.create(:name => 'Cashier',
                      :store_id => Store.find(:first).id,
                      :open_time => '12',
                      :close_time => '22')
      Position.create(:name => 'Kitchen',
                      :store_id => Store.find(:first).id,
                      :open_time => '12',
                      :close_time => '22')
      Position.create(:name => 'Waiter',
                      :store_id => Store.find(:first).id,
                      :open_time => '12',
                      :close_time => '22')
      
      
      ##########################################################################
      puts 'Creating users...'
      User.destroy_all
      user1 = User.new({:first_name=>'Admin',
                          :last_name=>'User',
                          :email => 'test1@test.com',
                          :login => 'admin',
                          :phone_cell => '',
                          :phone_home => '',
                          :preferred_contact => '',
                          :password => '12345678',
                          :password_confirmation => '12345678'})
      user1.save
      
      user2 = User.new({:first_name=>'Manager',
                          :last_name=>'User',
                          :email => 'test2@test.com',
                          :login => 'manager1',
                          :phone_cell => '',
                          :phone_home => '',
                          :preferred_contact => '',
                          :password => '12345678',
                          :password_confirmation => '12345678'})
     user2.save
      
      user3 = User.new({:first_name=>'Manager2',
                          :last_name=>'User',
                          :email => 'test3@test.com',
                          :login => 'manager2',
                          :phone_cell => '',
                          :phone_home => '',
                          :preferred_contact => '',
                          :password => '12345678',
                          :password_confirmation => '12345678'})
      user3.save
      
      (1..12).each do |num|
        user = User.new({:first_name=>"User#{num}",
                            :last_name=>'User',
                            :email => "test#{(3+num).to_s}@test.com",
                            :login => "user#{num}",
                            :phone_cell => '',
                            :phone_home => '',
                            :preferred_contact => '',
                            :password => '12345678',
                            :password_confirmation => '12345678'})
        user.save
      end


      ##########################################################################
      puts 'Creating employees...'
      Employee.destroy_all
      users = User.find(:all)
      users.each do |user|
        Employee.create(:store_id => Store.find(:first).id,
                        :user_id => user.id,
                        :full_time => true,
                        :target_hours => 40,
                        :employeeid => user.id)
      end
      
      
      ##########################################################################
      puts 'Creating employee roles...'
      EmployeeRole.destroy_all   
      employees = Employee.find(:all)
      EmployeeRole.create(:employee_id => employees[0],
                          :role_id => Role.find_by_name('Admin').id)
      EmployeeRole.create(:employee_id => employees[1],
                          :role_id => Role.find_by_name('Manager').id)
      EmployeeRole.create(:employee_id => employees[2],
                          :role_id => Role.find_by_name('Manager').id)
                         
      (3..14).each do |num|                  
        EmployeeRole.create(:employee_id => employees[num],
                           :role_id => Role.find_by_name('Staff').id)
      end
      
      
      ##########################################################################
      puts 'Creating employee positions...'
      EmployeePosition.destroy_all
      (0..3).each do |num|
        position = Position.find_by_name("Cashier")
        EmployeePosition.create(:employee_id => employees[num].id,
                                :position_id => position.id,
                                :role_id => Role.find_by_name('Staff').id)
      end
      
      (4..7).each do |num|
        position = Position.find_by_name("Kitchen")
        EmployeePosition.create(:employee_id => employees[num].id,
                                :position_id => position.id,
                                :role_id => Role.find_by_name('Staff').id)
      end
      
      (8..11).each do |num|
        position = Position.find_by_name("Waiter")
        EmployeePosition.create(:employee_id => employees[num].id,
                                :position_id => position.id,
                                :role_id => Role.find_by_name('Staff').id)
      end
      
      
      ##########################################################################
      puts 'Creating schedules...'
      Schedule.destroy_all
      Schedule.create(:week_number => 1,
                      :position_id => Position.find_by_name("Cashier").id,
                      :published => true)
                      
      Schedule.create(:week_number => 1,
                      :position_id => Position.find_by_name("Kitchen").id,
                      :published => true)
                      
      Schedule.create(:week_number => 1,
                      :position_id => Position.find_by_name("Waiter").id,
                      :published => true)

      
      ##########################################################################
      puts 'Creating shifts...'
      Shift.destroy_all
      schedules = Schedule.find(:all)
      Shift.create(:start_time => Time.parse("12:30"),
                   :end_time => Time.parse("16:30"),
                   :employee_id => employees[0].id,
                   :schedule_id => schedules[0].id)
      Shift.create(:start_time => Time.parse("12:30"),
                   :end_time => Time.parse("16:30"),
                   :employee_id => employees[4].id,
                   :schedule_id => schedules[1].id)
      Shift.create(:start_time => Time.parse("12:30"),
                   :end_time => Time.parse("16:30"),
                   :employee_id => employees[8].id,
                   :schedule_id => schedules[2].id)

      ##########################################################################
      puts 'Creating announcements...'
      Announcement.destroy_all
      Announcement.create(:message => 'Please remember to check your schedules on Friday',
                          :emergency => false,
                          :user_id => 1,
                          :store_id => Store.find(:first).id)
                          
      
      puts 'Database population done!'
    end
end
