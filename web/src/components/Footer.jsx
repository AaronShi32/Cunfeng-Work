import React from 'react';

const footerStyle = {
  marginTop: '60px',
  paddingTop: '24px',
  borderTop: '1px solid var(--color-beige, #d3d5d9)',
  textAlign: 'center',
};

const linkStyle = {
  color: '#51555d',
  textDecoration: 'none',
  fontSize: '13px',
  transition: 'color 0.2s ease',
};

const linksWrapStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '18px',
  flexWrap: 'wrap',
};

export default function Footer() {
  const links = [
    { href: `${import.meta.env.BASE_URL}blog/index.html`, label: 'Blog' },
    { href: 'https://www.linkedin.com/in/cfshi', label: 'LinkedIn', external: true },
    { href: 'https://github.com/AaronShi32', label: 'GitHub', external: true },
  ];

  return (
    <footer style={footerStyle}>
      <div style={linksWrapStyle}>
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener noreferrer' : undefined}
            style={linkStyle}
            onMouseEnter={(e) => (e.target.style.color = '#292b30')}
            onMouseLeave={(e) => (e.target.style.color = '#51555d')}
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
