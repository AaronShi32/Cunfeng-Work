import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ fontFamily: 'sans-serif', margin: '2em' }}>
      <h1>Project</h1>
      <ul style={{ lineHeight: 2 }}>
        <li><Link to="/microsoft">Microsoft</Link></li>
      </ul>
    </div>
  );
}
