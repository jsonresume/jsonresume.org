export const componentsLayout = `
  footer {
    color: #555;
    font-size: 0.8rem;
    display: flex;
    gap: 4px;
    margin-top: 8px;
  }

  footer a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #eee;
    padding: 4px;
    height: 32px;
    width: 32px;
    border-radius: 6px;
    transition: all 0.3s ease;
  }

  footer a:hover {
    background: #eee;
    border: 1px solid #ddd;
  }

  @media (width <= 700px) {
    justify-content: center;
  }

  @media print {
    a[href]:after {
      content: " (" attr(href) ")";
    }
  }

  .main-section {
    padding: 5px 10px 10px 10px;
  }

  .main-section ul li {
    margin-bottom: 20px;
  }

  article {
    border-radius: 8px;
    border: 1px solid #f2f2f2;
    gap: 16px;
    display: flex;
    flex-direction: column;
    padding: 16px;
    height: fit-content;
  }

  article h3 {
    font-weight: 500;
    color: #111;
  }

  article h3 span {
    color: rgb(0, 188, 47);
    animation-name: flicker;
    animation-duration: 3s;
    animation-timing-function: ease-in;
    animation-iteration-count: infinite;
  }

  article a {
    color: #777;
  }

  article a:hover {
    text-decoration: underline;
  }

  article .title {
    font-weight: 500;
    color: #111;
  }

  article .organization {
    color: #111;
  }

  article .description {
    margin-top: 10px;
  }

  ul {
    padding-left: 15px;
    list-style-type: disc;
  }

  li::marker {
    color: #555; /* Change bullet color */
    margin-left: 5px;
  }

  @keyframes flicker {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.25;
    }
    100% {
      opacity: 1;
    }
  }

  @media (width <= 700px) {
    ul {
      margin-inline: 0px;
    }

    article {
      border: none;
      box-shadow: 0 1px 1px #f2f2f2;
      padding: 0 0 16px 0;
    }
  }

  @media print {
    article h3 span {
      animation-name: none;
    }
  }
`;
