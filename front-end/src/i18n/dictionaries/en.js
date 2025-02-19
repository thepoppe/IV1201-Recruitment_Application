export default {
  // Navigation
  navigation: {
    logo: "Amusement Park",
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
};
