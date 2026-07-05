import { FiFileText } from "react-icons/fi";
import FooterInfoPage from "../components/FooterInfoPage";
import "../styles/FooterInfoPage.scss";

const sections = [
  {
    title:"Terms of use",
    body: [
      "By using JeruTech, you agree to use our platform responsibly and for lawful purposes.",
      "Product availability, pricing, and promotions may change without prior notice.",
    ],
  },
  {
    title:"Order and account responsibility",
    body: [
      "Customers are responsible for providing accurate delivery information and account details.",
      "JeruTech may suspend or limit access if misuse or fraud is detected.",
    ],
  },
];

const TermsAndConditionsPage = () => (
  <FooterInfoPage
    title="Terms & Conditions"
    description="These terms outline how you may use JeruTech services and what to expect from our platform."
    eyebrow="Policies"
    icon={FiFileText}
    sections={sections}
  />
);

export default TermsAndConditionsPage;
