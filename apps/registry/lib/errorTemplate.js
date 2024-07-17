function errorTemplate(errorObject) {
  const generateErrorHTML = (error) => `
        <li>
            <div class="property">Property: ${error.property}</div>
            <div class="message">Message: ${error.message}</div>
            <div class="schema">Schema: ${JSON.stringify(error.schema)}</div>
            <div class="instance">Instance: ${error.instance}</div>
            <div class="stack">Stack: ${error.stack}</div>
        </li>
    `;

  const generateErrorsHTML = (errors) => {
    return errors.map(generateErrorHTML).join('');
  };

  const styles = `
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
            }

            .error-container {
                max-width: 600px;
                margin: 0 auto;
                background: #fff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }

            h1 {
                color: #333;
                text-align: center;
            }

            ul {
                list-style: none;
                padding: 0;
            }

            li {
                background: #ffe0e0;
                color: #b00;
                padding: 10px;
                margin: 10px 0;
                border-left: 5px solid #b00;
                border-radius: 3px;
            }

            li .property, li .message {
                font-weight: bold;
            }

            li .schema, li .instance, li .stack {
                color: #555;
            }
        </style>
    `;

  const errorsHTML = generateErrorsHTML(errorObject.extra.validation);

  return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Validation Errors</title>
            ${styles}
        </head>
        <body>
            <div class="error-container">
                <h1>Validation Errors</h1>
                <ul id="error-list">
                    ${errorsHTML}
                </ul>
            </div>
        </body>
        </html>
    `;
}

export default errorTemplate;
