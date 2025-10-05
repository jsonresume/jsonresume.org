export default `/* Print */
@media print {
  body {
    font: 10px Arial, Helvetica, sans-serif;
    line-height: 1.4;
    color: #929292 !important;
  }

  .container {
    margin: 0 auto;
    padding: 0;
  }

  #resume {
    overflow: hidden;
    border: none !important;
  }

  section {
    margin-bottom: 2.5rem;
  }

  [class^='section-'] > .title {
    text-transform: uppercase;
    padding: 0.7rem 0;
    margin: 0;
  }

  [class^='section-'] > .title .title-icon,
  [class^='section-'] > .title span {
    display: inline-block;
    vertical-align: middle;
  }

  [class^='section-'] > .title span {
    margin-left: 2px;
  }

  [class^='section-'] > .title .title-icon {
    background-color: whitesmoke;
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    padding: 0.4rem 0.45rem;
  }

  /* Sidebar */
  .sidebar {
    padding: 2rem;
    background: #333438 !important;
    margin-bottom: -99999px;
    padding-bottom: 99999px;
    color: #ffffff !important;
  }

  .sidebar,
  .sidebar h1,
  .sidebar h2 {
    color: #ffffff !important;
  }

  .sidebar h2 {
    text-transform: uppercase;
    text-align: center;
    font-size: 1.5rem;
    letter-spacing: 0.5rem;
    font-weight: bold;
    margin-top: 5rem;
    color: #ffffff !important;
  }

  .sidebar h2.title span {
    color: #ffffff !important;
  }

  .avatar {
    margin: 2rem 0 2rem 1rem;
    text-align: center;
  }

  .avatar img {
    width: 85%;
  }

  .section-education .item {
    margin-bottom: 3rem;
    color: #ffffff !important;
  }

  .section-education .studyTitle span {
    text-transform: uppercase;
    font-weight: bold;
    font-size: 1.1rem;
    color: #ffffff !important;
  }

  .section-education .studyTitle span.badge {
    text-transform: uppercase;
    font-weight: bold;
    font-size: 1rem;
    color: #ffffff !important;
    background: #939393 !important;
  }

  .section-education .courses {
    font-size: 1.1rem;
    color: #ffffff !important;
  }

  .section-education ul.courses {
    list-style-type: none;
    margin: 0.5rem 0 0.5rem 0;
    padding: 0;
  }

  .section-education .ul.courses li {
    margin: 0;
    color: #ffffff !important;
  }

  .section-education .institution {
    font-size: 1rem;
    color: #ffffff !important;
  }

  .section-education .date span {
    font-size: 1rem;
    color: #ffffff !important;
  }

  .sidebar a:link,
  .sidebar a:hover,
  .sidebar a:visited {
    text-decoration: none;
    color: #ffffff !important;
  }

  /* Content */
  .content {
    padding: 3rem 5rem 3rem 2rem;
    background: #ffffff !important;
    margin-bottom: -99999px;
    padding-bottom: 99999px;
  }

  .content h1 {
    color: #3c3c3c !important;
    text-transform: uppercase;
    text-align: center;
    font-size: 2.5rem;
    letter-spacing: 1rem;
    font-weight: bold;
  }

  .content h2 {
    color: #6d6d6d !important;
    text-transform: uppercase;
    text-align: left;
    font-size: 1.2rem;
    letter-spacing: 0.5rem;
    font-weight: bold;
    margin-top: 2rem;
  }

  .content a:link,
  .content a:hover,
  .content a:visited {
    text-decoration: none;
    color: #6d6d6d !important;
  }

  /* Sections */
  .section-name {
    margin: 1rem 0 5rem 0;
  }

  .section-name h2 {
    color: #6d6d6d !important;
    text-transform: uppercase;
    text-align: center;
    font-size: 1.2rem;
    letter-spacing: 0.5rem;
    font-weight: bold;
    margin-top: 3rem;
  }

  .section-summary {
    text-align: justify;
  }

  .section-work .item {
    margin-bottom: 2.5rem;
  }

  .section-work .item .position {
    font-weight: bold;
    color: #333438 !important;
    text-transform: uppercase;
  }

  .section-work .item .company {
    padding: 0.5rem 0 0.5rem 0;
    color: #6d6d6d !important;
    font-weight: bold;
  }

  .section-work .item .summary,
  .section-work .item .highlights {
    font-style: italic;
    text-align: justify;
  }

  .section-volunteer .item {
    margin-bottom: 2.5rem;
  }

  .section-volunteer .item .position {
    font-weight: bold;
    color: #333438 !important;
    text-transform: uppercase;
  }

  .section-volunteer .item .company {
    padding: 0.5rem 0 0.5rem 0;
    color: #6d6d6d !important;
    font-weight: bold;
  }

  .section-volunteer .item .summary,
  .section-volunteer .item .highlights {
    font-style: italic;
    text-align: justify;
  }

  .section-publications .item {
    margin-bottom: 2.5rem;
  }

  .section-publications .item .name {
    font-weight: bold;
    color: #333438 !important;
    text-transform: uppercase;
  }

  .section-publications .item .publication {
    padding: 0.5rem 0 0.5rem 0;
    color: #6d6d6d !important;
    font-weight: bold;
  }

  .section-publications .item .summary,
  .section-publications .item .highlights {
    font-style: italic;
    text-align: justify;
  }

  .section-awards .item .title {
    font-weight: bold;
    color: #333438 !important;
  }

  .section-awards .item .date,
  .section-awards .item .awarder {
    font-weight: normal;
    color: #929292 !important;
  }

  .section-awards .item .summary {
    font-weight: normal;
    font-style: italic;
    text-align: justify;
  }

  .section-languages .item .language {
    font-weight: bold;
    color: #333438 !important;
  }

  .section-languages .item .fluency {
    font-weight: normal;
    color: #929292 !important;
  }

  .section-interests .title {
    font-weight: bold;
  }

  .section-interests .item {
    margin: 0.2rem 0 0rem 0;
    line-height: 1.4rem;
  }

  .section-skills .item {
    margin-bottom: 1rem;
  }

  .section-skills .item .name {
    color: #ffffff !important;
  }

  .section-skills .item .keywords .span {
    color: #ffffff !important;
    background: #929292 !important;
  }

  .section-skills .keywords span.label {
    color: #000 !important;
    background: #929292 !important;
    line-height: 1.7rem;
  }

  .section-contact .fa {
    padding: 0.5rem 0 0 0;
    background: #ffffff !important;
    color: #333438 !important;
    border-radius: 100rem;
    width: 2.2rem;
    height: 2.2rem;
    text-align: center;
    margin: -0.4rem 0.8rem 0.8rem 0.5rem;
    float: left;
  }

  .section-contact ul.contact {
    list-style-type: none;
    margin: 0.2rem 0 0.2rem 0;
    padding: 0;
  }

  .section-contact ul.contact li {
    margin: 0.5rem 0 0.5rem 0;
    color: #ffffff !important;
  }

  .section-contact ul.profiles {
    list-style-type: none;
    margin: 4rem 0 0.5rem 0;
    padding: 0;
  }

  .section-contact ul.profiles li {
    margin: 0.5rem 0 0.5rem 0;
    color: #ffffff !important;
  }

  .section-contact ul.contact li span,
  .section-contact ul.profiles li span {
    word-wrap: break-word;
    white-space: pre-wrap;
    color: #ffffff !important;
  }
}`;
