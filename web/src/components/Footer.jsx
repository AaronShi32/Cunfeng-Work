import React from 'react';

const footerStyle = {
  marginTop: '60px',
  paddingTop: '24px',
  borderTop: '1px solid rgba(255, 255, 255, 0.2)',
  textAlign: 'center',
};

const linkStyle = {
  color: 'rgba(255, 255, 255, 0.7)',
  textDecoration: 'none',
  fontSize: '14px',
  transition: 'color 0.2s ease',
};

export default function Footer() {
  return (
    <footer style={footerStyle}>
      <a
        href="/blog/index.html"
        style={linkStyle}
        onMouseEnter={(e) => (e.target.style.color = '#fff')}
        onMouseLeave={(e) => (e.target.style.color = 'rgba(255, 255, 255, 0.7)')}
      >
        📝 Blog (2016-2018)
      </a>
    </footer>
  );
}
