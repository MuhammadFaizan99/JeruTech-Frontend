const DashboardPanelSkeleton = ({ variant = "info" }) => {
  if (variant === "form") {
    return (
      <div className="dashboard-panel dashboard-panel-skeleton" aria-hidden="true">
        <div className="dashboard-panel-skeleton__intro skeleton-block" />
        <div className="dashboard-panel-skeleton__form">
          {[...Array(6)].map((_, index) => (
            <div key={`field-${index}`} className="dashboard-panel-skeleton__field">
              <span className="skeleton-block dashboard-panel-skeleton__label" />
              <span className="skeleton-block dashboard-panel-skeleton__input" />
            </div>
          ))}
          <span className="skeleton-block dashboard-panel-skeleton__button" />
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="dashboard-panel dashboard-panel-skeleton" aria-hidden="true">
        <div className="dashboard-panel-skeleton__intro skeleton-block" />
        <div className="dashboard-panel-skeleton__list">
          {[...Array(3)].map((_, index) => (
            <div key={`item-${index}`} className="dashboard-panel-skeleton__list-item">
              <span className="skeleton-block dashboard-panel-skeleton__thumb" />
              <div className="dashboard-panel-skeleton__list-copy">
                <span className="skeleton-block" />
                <span className="skeleton-block dashboard-panel-skeleton__line--short" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-panel dashboard-panel-skeleton" aria-hidden="true">
      <div className="dashboard-panel-skeleton__intro skeleton-block" />
      <div className="dashboard-panel-skeleton__info">
        {[...Array(4)].map((_, index) => (
          <div key={`info-${index}`} className="dashboard-panel-skeleton__info-item">
            <span className="skeleton-block dashboard-panel-skeleton__icon" />
            <div className="dashboard-panel-skeleton__info-copy">
              <span className="skeleton-block dashboard-panel-skeleton__line--short" />
              <span className="skeleton-block" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPanelSkeleton;
