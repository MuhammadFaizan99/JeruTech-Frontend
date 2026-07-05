import { FiSettings } from "react-icons/fi";
import FooterInfoPage from "../components/FooterInfoPage";
import "../styles/FooterInfoPage.scss";

const sections = [
  {
    title:"What cookies are used",
    body: [
      "We use cookies to remember preferences, keep your cart session active, and improve site performance.",
      "Some cookies are necessary for core functionality, while others help us analyze visitor behavior.",
    ],
  },
  {
    title:"Your choices",
    body: [
      "You can manage or disable cookies through your browser settings, though some parts of the site may function less effectively as a result.",
      "By continuing to use JeruTech, you consent to our use of cookies as described here.",
    ],
  },
];

const CookiePolicyPage = () => (
  <FooterInfoPage
    title="Cookie Policy"
    description="This page explains how JeruTech uses cookies to improve your browsing and shopping experience."
    eyebrow="Policies"
    icon={FiSettings}
    sections={sections}
  />
);

export default CookiePolicyPage;
