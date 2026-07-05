import Loader from "./Loader";
import "../styles/Loader.scss";

const PageLoader = ({ message = "Loading..." }) => (
  <div className="page-loader">
    <Loader size="lg" label={message} centered />
  </div>
);

export default PageLoader;
