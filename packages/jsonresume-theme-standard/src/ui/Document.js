const Document = ({ body, styles }) => {
  return (
    <html>
      <head>{styles}</head>
      <body>{body}</body>
    </html>
  );
};

export default Document;
