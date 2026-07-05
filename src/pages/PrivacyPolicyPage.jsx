import { FiShield } from "react-icons/fi";
import FooterInfoPage from "../components/FooterInfoPage";
import "../styles/FooterInfoPage.scss";

const sections = [
  {
    title: "What we collect",
    body: [
      "We collect account details, order information, and browsing data needed to provide a smooth shopping experience.",
      "This data helps us improve personalization, order handling, and customer support.",
    ],
  },
  {
    title: "How we use it",
    body: [
      "Your information is used to process orders, communicate updates, protect account security, and improve service quality.",
      "We do not sell your personal data to third parties for marketing purposes.",
    ],
  },
];

const PrivacyPolicyPage = () => (
  <FooterInfoPage
    title="Privacy Policy"
    description="We take your privacy seriously and handle your personal information with care and transparency."
    eyebrow="Policy"
    icon={FiShield}
    sections={sections}
  />
);

export default PrivacyPolicyPage;
