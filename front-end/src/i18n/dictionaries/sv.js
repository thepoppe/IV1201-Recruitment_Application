export default {
  // Navigation
  navigation: {
    logo: "Nöjespark",
    welcome: "Välkommen",
    profile: "Profil",
    apply_for_position: "Ansök om en tjänst",
    view_application: "Visa ansökan",
    admin_area: "Adminområde",
    logout: "Logga ut",
    login: "Logga in",
    create_account: "Skapa konto",
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

  // Apply Job Page
  applyJob: {
    title: "Ansök om ett jobb",
    subtitle:
      "Fyll i dina kompetenser och tillgänglighet för att skicka in din ansökan.",
    button: {
      submit: "Skicka ansökan",
      loading: "Skickar...",
    },
    success: "Din jobbansökan har skickats in framgångsrikt!",
    error: "Något gick fel. Vänligen försök igen senare.",
    fields: {
      competences: "Dina kompetenser",
      availability: "Din tillgänglighet",
    },
    placeholders: {
      select_competence: "Välj en kompetens",
      years_experience: "Antal års erfarenhet",
    },
    buttons: {
      add_competence: "Lägg till kompetens",
      add_availability: "Lägg till tillgänglighet",
      remove: "Ta bort",
    },
    validation: {
      competence_id: "Kompetens-ID måste vara ett giltigt nummer",
      competence_required: "Minst en kompetens krävs",
      years_experience: "Erfarenhet måste vara ett nummer",
      years_experience_min: "Erfarenhet kan inte vara negativ",
      years_experience_max: "Erfarenhet kan inte överstiga 50 år",
      from_date: "Från datum måste vara ett giltigt datum",
      from_date_required: "Från datum krävs",
      to_date: "Till datum måste vara ett giltigt datum",
      to_date_required: "Till datum krävs",
      to_date_greater: "Till datum måste vara senare än Från datum",
    },
  },

  // Admin Page
  admin: {
    title: "Admin - Jobbansökningar",
    loading: "Laddar ansökningar...",
    error_fetching: "Misslyckades med att hämta ansökningar.",
    id: "ID",
    applicant: "Sökande",
    email: "E-post",
    competences: "Kompetenser (år)",
    availability: "Tillgänglighet",
    status: "Status",
    actions: "Åtgärder",
    years: "år",
    view_details: "Visa detaljer",
    no_applications: "Inga ansökningar hittades.",
  },
};
