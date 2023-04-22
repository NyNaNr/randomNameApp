import { useState } from 'react';

function Header({ title }: { title: string }) {
  return <h1>{title ? title : 'Default title'}</h1>;
}

export default function HomePage() {
  const names = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton', 'Katherine Johnson', 'Mae Jemison', 'Annie Easley', 'Barbara McClintock', 'Sally Ride', 'Dorothy Vaughan', 'Caroline Herschel', 'Henrietta Leavitt', 'Chien-Shiung Wu', 'Lise Meitner', 'Rosalind Franklin', 'Jocelyn Bell Burnell', 'Cheryl Hayashi', 'May-Britt Moser', 'Emmanuelle Charpentier', 'Jennifer Doudna', 'Marie Curie'];
  const [likes, setLikes] = useState(0);  //()の中は初期値

  function handleClick() {
    setLikes(likes +1);
  }

  return (
    <div>
      <Header title="Develop. Preview. Ship. 🚀" />
      <ul>
        {names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>

      <button onClick={handleClick}>Like ({likes})</button>
    </div>
  );
}