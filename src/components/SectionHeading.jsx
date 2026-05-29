export default function SectionHeading({ title, showIcons = true }) {
  return (
    <h2 className="section-heading">
      {showIcons && (
        <img src="/images/mi_icon.gif" alt="" className="section-heading__icon" aria-hidden="true" />
      )}
      <span className="section-heading__text">{title}</span>
      {showIcons && (
        <img src="/images/mo_icon.gif" alt="" className="section-heading__icon" aria-hidden="true" />
      )}
    </h2>
  );
}
