export default {
  // Navigation
  navigation: {
    logo: "Amusement Park",
    welcome: "Welcome",
    profile: "Profile",
    apply_for_position: "Apply for a Position",
    view_application: "View Application",
    admin_area: "Admin Area",
    logout: "Logout",
    login: "Login",
    create_account: "Create Account",
  },

  // Home Page
  home: {
    title: "Welcome to Amusement Park Recruitment!",
    description:
      "Join our team and be part of the excitement! We’re looking for passionate individuals to help create unforgettable experiences for our visitors. Apply today and start your journey with us!",
    apply: "Apply now",
    alert: "Application form is not available yet",
  },

  // Create Account Page
  create_account: {
    title: "Create Your Account",
    subtitle: "Join our team at the Amusement Park",
    fields: {
      first_name: "First Name",
      last_name: "Last Name",
      personal_number: "Personal Number",
      email: "Email",
      password: "Password",
    },
    placeholders: {
      first_name: "John",
      last_name: "Doe",
      personal_number: "YYYYMMDD-XXXX",
      email: "john.doe@example.com",
      password: "••••••••",
    },
    button: {
      submit: "Create Account",
      loading: "Creating Account...",
    },
    error: {
      generic: "An error occurred while creating your account",
    },
    success: {
      title: "Account Created Successfully!",
      message:
        "Thank you for joining our team. You can now log in to your account.",
    },
  },

  // Create Account Validation
  createAccountValidation: {
    name: {
      required: "First name is required",
      min: "First name must be at least 2 characters",
      max: "First name cannot exceed 50 characters",
    },
    surname: {
      required: "Last name is required",
      min: "Last name must be at least 2 characters",
      max: "Last name cannot exceed 50 characters",
    },
    pnr: {
      required: "Personal number is required",
      pattern: "Personal number must be in format YYYYMMDD-XXXX",
    },
    email: {
      required: "Email is required",
      invalid: "Please enter a valid email address",
    },
    password: {
      required: "Password is required",
      min: "Password must be at least 8 characters",
      pattern:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    },
  },

  // Login Page
  login: {
    title: "Login to Your Account",
    subtitle: "Enter your credentials to access your account",
    fields: {
      email: "Email",
      password: "Password",
    },
    placeholders: {
      email: "john.doe@example.com",
      password: "••••••••",
    },
    button: {
      submit: "Login",
      loading: "Logging in...",
    },
    error: {
      generic: "Invalid email or password",
    },
  },

  // Login Validation
  loginValidation: {
    email: {
      required: "Email is required",
      invalid: "Please enter a valid email address",
    },
    password: {
      required: "Password is required",
      min: "Password must be at least 8 characters",
    },
  },

  // Apply Job Page
  applyJob: {
    title: "Apply for a Job",
    subtitle:
      "Fill in your competences and availability to submit your application.",
    button: {
      submit: "Submit Application",
      loading: "Submitting...",
    },
    success: "Your job application has been submitted successfully!",
    error: "Something went wrong. Please try again later.",
    fields: {
      competences: "Your Competences",
      availability: "Your Availability",
    },
    placeholders: {
      select_competence: "Select a competence",
      years_experience: "Years of experience",
    },
    buttons: {
      add_competence: "Add Competence",
      add_availability: "Add Availability",
      remove: "Remove",
    },
    validation: {
      competence_id: "Competence ID must be a valid number",
      competence_required: "At least one competence is required",
      years_experience: "Years of experience must be a number",
      years_experience_min: "Years of experience cannot be negative",
      years_experience_max: "Years of experience cannot exceed 50 years",
      from_date: "From date must be a valid date",
      from_date_required: "From date is required",
      to_date: "To date must be a valid date",
      to_date_required: "To date is required",
      to_date_greater: "To date must be later than From date",
    },
  },

  // Admin Page
  admin: {
    title: "Admin - Job Applications",
    loading: "Loading applications...",
    error_fetching: "Failed to fetch applications.",
    id: "ID",
    applicant: "Applicant",
    email: "Email",
    competences: "Competences (years)",
    availability: "Availability",
    status: "Status",
    actions: "Actions",
    years: "years",
    view_details: "View Details",
    no_applications: "No applications found.",
    application_details: "Details for Application",
    error_fetching_application: "Failed to fetch application.",
  },
};
