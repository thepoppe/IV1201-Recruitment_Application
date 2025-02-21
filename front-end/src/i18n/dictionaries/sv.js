export default {
  // Navigation
  navigation: {
    logo: "Nöjespark",
    login: "Logga in",
    logout: "Logga ut",
    create_account: "Skapa konto",
    welcome: "Välkommen",
    profile: "Profil",
  },

  // Home Page
  home: {
    title: "Välkommen till Nöjesparkens rekrytering!",
    description:
      "Gå med i vårt team och bli en del av spänningen! Vi söker passionerade individer som vill skapa oförglömliga upplevelser för våra besökare. Ansök idag och starta din resa med oss!",
    apply: "Ansök nu",
    alert: "Ansökningsformuläret är inte tillgängligt än",
  },

  // Create Account Page
  create_account: {
    title: "Skapa ditt konto",
    subtitle: "Gå med i vårt team på nöjesparken",
    fields: {
      first_name: "Förnamn",
      last_name: "Efternamn",
      personal_number: "Personnummer",
      email: "E-post",
      password: "Lösenord",
    },
    placeholders: {
      first_name: "Johan",
      last_name: "Svensson",
      personal_number: "ÅÅÅÅMMDD-XXXX",
      email: "johan.svensson@example.com",
      password: "••••••••",
    },
    button: {
      submit: "Skapa konto",
      loading: "Skapar konto...",
    },
    error: {
      generic: "Ett fel uppstod när ditt konto skulle skapas",
    },
    success: {
      title: "Konto skapat framgångsrikt!",
      message:
        "Tack för att du gick med i vårt team. Du kan nu logga in på ditt konto.",
    },
  },

  // Create Account Validation
  createAccountValidation: {
    name: {
      required: "Förnamn är obligatoriskt",
      min: "Förnamn måste vara minst 2 tecken",
      max: "Förnamn får inte överstiga 50 tecken",
    },
    surname: {
      required: "Efternamn är obligatoriskt",
      min: "Efternamn måste vara minst 2 tecken",
      max: "Efternamn får inte överstiga 50 tecken",
    },
    pnr: {
      required: "Personnummer är obligatoriskt",
      pattern: "Personnummer måste vara i formatet ÅÅÅÅMMDD-XXXX",
    },
    email: {
      required: "E-post är obligatoriskt",
      invalid: "Vänligen ange en giltig e-postadress",
    },
    password: {
      required: "Lösenord är obligatoriskt",
      min: "Lösenord måste vara minst 8 tecken",
      pattern:
        "Lösenordet måste innehålla minst en stor bokstav, en liten bokstav och en siffra",
    },
  },

  // Login Page
  login: {
    title: "Logga in på ditt konto",
    subtitle: "Ange dina uppgifter för att logga in",
    fields: {
      email: "E-post",
      password: "Lösenord",
    },
    placeholders: {
      email: "johan.svensson@example.com",
      password: "••••••••",
    },
    button: {
      submit: "Logga in",
      loading: "Loggar in...",
    },
    error: {
      generic: "Ogiltig e-post eller lösenord",
    },
  },

  // Login Validation
  loginValidation: {
    email: {
      required: "E-post är obligatoriskt",
      invalid: "Vänligen ange en giltig e-postadress",
    },
    password: {
      required: "Lösenord är obligatoriskt",
      min: "Lösenord måste vara minst 8 tecken",
    },
  },
};
