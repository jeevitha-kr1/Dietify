export default function FeatureCard({ icon, title, description }) {
  return (
    <article className="feature-card">
      <div className="feature-card__icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}