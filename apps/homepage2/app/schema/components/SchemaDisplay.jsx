import { schemaHtml } from '../data/schemaExample';

export function SchemaDisplay() {
  return (
    <div className="col-sm-9 col-md-7">
      <div className="header">
        <div className="pull-right version">version 1.0.0</div>
        resume.json
      </div>
      <pre
        className="schema"
        dangerouslySetInnerHTML={{
          __html: schemaHtml,
        }}
      ></pre>
    </div>
  );
}
