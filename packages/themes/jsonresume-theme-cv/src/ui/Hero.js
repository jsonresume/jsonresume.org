import styled from 'styled-components';
import { FaBeer as WorldMap } from 'react-icons/fa';
import { FaBeer as Mail } from 'react-icons/fa';
import { FaBeer as Phone } from 'react-icons/fa';
import Section from './Section';
const Hero = styled.div`
  &.container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  &.info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-right: 32px;
  }

  &h1 {
    font-size: 2rem;
  }

  &h2 {
    color: #444;
    font-weight: 500;
    font-size: 1.1rem;
    text-wrap: balance;
  }

  &img {
    aspect-ratio: 1 / 1;
    object-fit: cover;
    width: 128px;
    border-radius: 16px;
  }

  &span {
    color: #666;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.85rem;
    letter-spacing: -0.05rem;
  }

  &footer {
    color: #555;
    font-size: 0.65rem;
    display: flex;
    gap: 4px;
    margin-top: 8px;
  }

  &footer a {
    color: #777;
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

  &footer a:hover {
    background: #eee;
    border: 1px solid #ddd;
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

    figure {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    h2 {
      text-wrap: balance;
    }

    figure {
      margin: 0 auto;
    }
  }
`;
const HeroComponent = ({ basics }) => {
  const { name, label, image, location, profiles, phone, email } = basics;
  const { city, region } = location;

  // const SOCIAL_ICONS: SocialIcon = {
  //   GitHub,
  //   LinkedIn,
  //   X,
  // }

  const linkedInfo = profiles.find(({ network }) => network === 'LinkedIn');
  const linkedUrl = linkedInfo?.url;

  const printInfo = [email, phone, linkedUrl].filter(Boolean).join(' • ');
  return (
    <Section>
      <Hero>
        <div class="container">
          <div class="info">
            <h1>{name}</h1>
            <h2>{label}</h2>
            <span>
              <WorldMap />
              {city}, {region}
            </span>
            <footer class="print">{printInfo}</footer>
            <footer class="no-print">
              {email && (
                <a
                  href={`mailto:${email}`}
                  title={`Enviar un correo electrónico a ${name} al correo ${email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Mail />
                </a>
              )}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  title={`Llamar por teléfono a ${name} al número ${phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone />
                </a>
              )}
              {/* {profiles.map(({ network, url, username }) => {
              const Icon = SOCIAL_ICONS[network];

              return (
                <a
                  href={url}
                  title={`Visitar el perfil de ${name} en ${network}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon />
                </a>
              );
            })} */}
            </footer>
          </div>
          <figure>
            <img src={image} alt={name} />
          </figure>
        </div>
      </Hero>
    </Section>
  );
};

export default HeroComponent;
