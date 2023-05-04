export default function Card({ title, children }) {
  return (
    <>
      <h1 className={Card.title}>{title}</h1>
      <p>{children}</p>
    </>
  );
}
