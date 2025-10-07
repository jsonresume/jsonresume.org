export const globalStyles = `
  html {
    font-family:
      Menlo,
      Monaco,
      Lucida Console,
      "Courier New",
      Courier,
      monospace;
    background: #fff;
    letter-spacing: -0.025rem;
  }

  body,
  figure {
    margin: 0;
    padding: 0;
  }

  a {
    text-decoration: none;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  h1,
  h2,
  h3,
  h4 {
    margin: 0;
    font-family:
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      Oxygen,
      Ubuntu,
      Cantarell,
      "Open Sans",
      "Helvetica Neue",
      sans-serif;
  }

  p {
    color: #666;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0;
    text-wrap: pretty;
  }

  .print {
    display: none !important;
  }

  @media print {
    .no-print {
      display: none !important;
    }

    .print {
      display: block !important;
    }

    astro-dev-toolbar {
      display: none !important;
    }

    article {
      break-inside: avoid;
    }
  }
  /* Hero */
    .container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-right: 32px;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    color: #444;
    font-size: 1.1rem;
    font-weight: 500;
  }

  img {
    aspect-ratio: 1 / 1;
    object-fit: cover;
    width: 128px;
    border-radius: 6px;
  }

  figure {
    flex-direction: column;
    gap: 0.5rem;
  }

  figcaption {
    text-align: center;
  }

  @media (width <= 700px) {
    .container {
      flex-direction: column-reverse;
    }

    .info {
      justify-content: center;
      align-items: center;
      padding-right: 0;
      text-align: center;
    }

    h1 {
      border-bottom: 4px solid #eee;
      padding-bottom: 8px;
    }
  }

`;
