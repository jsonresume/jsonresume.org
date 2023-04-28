import React from "react";
import type {
  Location as LocationProps,
  Basics as BasicsProps,
  Profile as ProfileProps,
} from "./types";

const Location: React.FC<LocationProps> = ({
  address,
  postalCode,
  city,
  region,
  countryCode,
}) => (
  <span className="location">
    {address && <span className="address">{address},</span>}
    {postalCode && <span className="postalCode">{postalCode},</span>}
    {city && <span className="city">{city},</span>}
    {region && <span className="region">{region},</span>}
    {countryCode && <span className="countryCode">{countryCode},</span>}
  </span>
);

export const Contact: React.FC<BasicsProps> = ({ email, url, phone }) => (
  <div id="contact">
    {url && (
      <div className="website">
        <span className="fas fa-external-link-alt"></span>
        <a className="hide-href-print" target="_blank" href={url}>
          {url}
        </a>
      </div>
    )}
    {email && (
      <div className="email">
        <span className="far fa-envelope"></span>
        <a className="hide-href-print" href={`mailto:${email}`}>
          {email}
        </a>
      </div>
    )}
    {phone && (
      <div className="phone">
        <span className="fas fa-mobile-alt"></span>
        <a className="hide-href-print" href="tel:{{phone}}">
          {phone}
        </a>
      </div>
    )}
  </div>
);

const Profile: React.FC<ProfileProps> = ({ network, username, url }) => (
  <div className="item">
    {network && (
      <div className="username">
        <span className="fab fa-{{spaceToDash network}} {{spaceToDash network}} social"></span>
        {url ? (
          <span className="url">
            <a target="_blank" href="{{url}}">
              {username}
            </a>
          </span>
        ) : (
          <span>{username}</span>
        )}
      </div>
    )}
  </div>
);

export const Basics: React.FC<BasicsProps> = (props) => {
  const { name, label, location, image, profiles, summary } = props;
  return (
    <>
      <header id="header" className="clear">
        {image && <img className="image" src={image} alt="{{name}}" />}
        <div className="middle">
          <h1 className="name">{name}</h1>
          <h2 className="label">{label}</h2>
        </div>
      </header>
      {location && <Location {...location} />}
      <Contact {...props} />
      {profiles && (
        <div id="profiles">
          {profiles.map((profile, index) => (
            <Profile {...profile} key={index} />
          ))}
        </div>
      )}
      {summary && (
        <section className="section">
          <section className="main-summary">
            <div>{summary}</div>
          </section>
        </section>
      )}
    </>
  );
};
