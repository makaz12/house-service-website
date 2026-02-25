import { useState } from "react";

const posts = [
  {
    id: 1,
    title: "7 signes qu'une reparation de plomberie est urgente",
    image:
      "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "De la baisse de pression aux fuites cachees, detectez les signaux avant les gros degats.",
    content:
      "Une odeur d'humidite persistante, des traces d'eau au plafond, des bruits inhabituels dans les canalisations ou une facture d'eau qui grimpe sont des alertes majeures. Faites verifier rapidement votre installation pour eviter des travaux plus lourds.",
  },
  {
    id: 2,
    title: "Comment choisir un carrelage durable pour une maison active",
    image:
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "Materiau, finition et resistance a la glisse : les points cles pour allier style et duree de vie.",
    content:
      "Pour les zones de passage, privilegiez un gres cerame avec une bonne classe d'usure et une finition mate antiderapante. Harmonisez les joints avec la teinte des carreaux pour un rendu propre et facile a entretenir au quotidien.",
  },
  {
    id: 3,
    title: "Couleurs de peinture qui augmentent la lumiere naturelle",
    image:
      "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "Des astuces de palette simples pour agrandir visuellement vos pieces et gagner en clarte.",
    content:
      "Les tons cassés (blanc chaud, beige clair, gris perle) renvoient mieux la lumiere que les teintes saturees. Peignez les plafonds dans une nuance legerement plus claire que les murs pour une sensation d'espace plus ouverte.",
  },
];

export default function BlogPage() {
  const [expanded, setExpanded] = useState({});

  return (
    <section className="page">
      <h1>Blog maintenance</h1>
      <p className="muted">
        Conseils de terrain pour garder votre habitat en excellent etat toute l'annee.
      </p>
      <div className="cards-grid">
        {posts.map((post, index) => (
          <article
            key={post.id}
            className="service-card animated-card"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <img src={post.image} alt={post.title} className="service-image" />
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            {expanded[post.id] && <p>{post.content}</p>}
            <button
              className="secondary-btn"
              onClick={() =>
                setExpanded((prev) => ({ ...prev, [post.id]: !prev[post.id] }))
              }
            >
              {expanded[post.id] ? "Lire moins" : "Lire plus"}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
