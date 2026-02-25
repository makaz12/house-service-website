export default function AboutPage() {
  return (
    <section className="page">
      <div className="hero animate-rise">
        <div className="hero-glow" />
        <h1>A propos de FixNow</h1>
        <p>
          Nous mettons en relation les foyers avec des specialistes fiables pour
          les depannages urgents et les travaux planifies. Notre objectif :
          ponctualite, prix justes et communication claire.
        </p>
      </div>

      <section className="feature-strip">
        <article className="animate-fade">
          <h3>Specialistes verifies</h3>
          <p>Chaque intervenant est valide pour ses competences et sa fiabilite.</p>
        </article>
        <article className="animate-fade">
          <h3>Planification claire</h3>
          <p>Horaires, localisation et historique sont centralises.</p>
        </article>
        <article className="animate-fade">
          <h3>Client prioritaire</h3>
          <p>Reservation autonome ou assistee par telephone selon votre choix.</p>
        </article>
      </section>

      <article className="card animate-rise">
        <h2>Notre mission</h2>
        <p>
          Rendre l'entretien de la maison simple et rapide grace a des outils de
          reservation modernes, une geolocalisation precise et un support humain.
        </p>
      </article>
    </section>
  );
}
