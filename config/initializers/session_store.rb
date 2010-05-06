# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_schedule_app_session',
  :secret      => 'f953354078db50b55f705d239c4e0b9d31dae891eb3c9fb9476a74bdc9d3129151d85757142f975456c6a935911caf43791b833e9da1abbf741674ec1677ec40'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
