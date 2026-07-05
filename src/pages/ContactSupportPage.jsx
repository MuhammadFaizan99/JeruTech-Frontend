import { FiHeadphones, FiMail, FiMessageCircle } from "react-icons/fi";
import FooterInfoPage from "../components/FooterInfoPage";
import "../styles/FooterInfoPage.scss";

const sections = [
  {
    title: "How to reach us",
    body: [
      "Our support team is available to help with orders, product questions, delivery updates, and account issues.",
      "For urgent queries, email us directly and we will respond as quickly as possible.",
    ],
  },
  {
    title: "Preferred channels",
    body: [
      "Email: support@jerutech.com",
      "Live chat: Available on the contact page during business hours.",
    ],
  },
];

const ContactSupportPage = () => (
  <FooterInfoPage
    title="Contact Support"
    description="Get help with product questions, order issues, account support, and everything in between."
    eyebrow="Support"
    icon={FiHeadphones}
    sections={sections}
  />
);

export default ContactSupportPage;
