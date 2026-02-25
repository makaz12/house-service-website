const labels = {
  en: {
    services: "Services",
    allServices: "Tous les services",
    callAgent: "Contacter agent",
    book: "Reserver",
    dashboard: "Tableau de bord",
    blog: "Blog",
    feedback: "Avis",
    about: "A propos",
    settings: "Parametres",
    login: "Connexion",
    register: "Inscription",
    logout: "Deconnexion",
  },
  fr: {
    services: "Services",
    allServices: "Tous les services",
    callAgent: "Contacter agent",
    book: "Reserver",
    dashboard: "Tableau de bord",
    blog: "Blog",
    feedback: "Avis",
    about: "A propos",
    settings: "Parametres",
    login: "Connexion",
    register: "Inscription",
    logout: "Deconnexion",
  },
  es: {
    services: "Services",
    allServices: "Tous les services",
    callAgent: "Contacter agent",
    book: "Reserver",
    dashboard: "Tableau de bord",
    blog: "Blog",
    feedback: "Avis",
    about: "A propos",
    settings: "Parametres",
    login: "Connexion",
    register: "Inscription",
    logout: "Deconnexion",
  },
};

export function t(language, key) {
  return labels[language]?.[key] || labels.fr[key] || key;
}
