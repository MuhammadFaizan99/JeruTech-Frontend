import { FiMail, FiMapPin, FiPhone, FiUser } from "react-icons/fi";
import DashboardPanelSkeleton from "../../components/DashboardPanelSkeleton";
import { useAppSelector } from "../../redux/hooks";

const PersonalInfo = () => {
  const user = useAppSelector((state) => state.auth.user);
  const profileLoading = useAppSelector((state) => state.auth.profileLoading);

  if (profileLoading && !user) {
    return <DashboardPanelSkeleton variant="info" />;
  }

  const details = [
    { icon: FiUser, label: "Full Name", value: user?.customerName },
    { icon: FiMail, label: "Email", value: user?.email },
    { icon: FiPhone, label: "Phone", value: user?.phoneNumber },
    { icon: FiMapPin, label: "Address", value: user?.address },
  ];

  return (
    <div className="dashboard-panel">
      <p className="dashboard-panel__intro">
        Review your personal details below. You can update them from the Settings
        section.
      </p>

      <ul className="dashboard-panel__info-list">
        {details.map(({ icon: Icon, label, value }) => (
          <li key={label} className="dashboard-panel__info-item">
            <span className="dashboard-panel__info-icon" aria-hidden="true">
              <Icon />
            </span>
            <div className="dashboard-panel__info-copy">
              <span className="dashboard-panel__info-label">{label}</span>
              <span className="dashboard-panel__info-value">
                {value || "Not provided"}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PersonalInfo;
