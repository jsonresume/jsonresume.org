import Button from 'ui/Button';
import Header from 'ui/Header';

/*
@todo
 - make ui components to reuse with homepage

*/

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header
          left={
            <div>
              <a href="/">JSON Resume Registry</a>
            </div>
          }
          right={
            <div>
              <a href="/logout">About</a>
              <a href="/logout">Logout</a>
            </div>
          }
        />
        <main>{children}</main>
      </body>
    </html>
  );
}
