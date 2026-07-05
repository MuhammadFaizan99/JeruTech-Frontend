import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import LoadingButton from "../../components/LoadingButton";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchAllWallets, fundUserWallet } from "../../redux/slices/walletSlice";
import { formatPrice } from "../../utils/productHelpers";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "../../utils/toast";

const AdminWallet = () => {
  const dispatch = useAppDispatch();
  const wallets = useAppSelector((state) => state.wallet.allWallets);
  const loading = useAppSelector((state) => state.wallet.allWalletsLoading);
  const funding = useAppSelector((state) => state.wallet.funding);
  const myWallet = useAppSelector((state) => state.wallet.wallet);
  const [fundForm, setFundForm] = useState({ userId: "", amount: "", description: "" });

  useEffect(() => {
    dispatch(fetchAllWallets());
  }, [dispatch]);

  const customerWallets = wallets.filter((wallet) => wallet.user?.role === "customer");
  const adminWallet =
    wallets.find((wallet) => wallet.user?.role === "admin") || myWallet;

  const handleFundSubmit = async (event) => {
    event.preventDefault();

    const amount = Number(fundForm.amount);

    if (!fundForm.userId) {
      showWarningToast("Select a customer wallet to fund");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      showWarningToast("Enter a valid amount greater than zero");
      return;
    }

    const result = await dispatch(
      fundUserWallet({
        userId: fundForm.userId,
        amount,
        description: fundForm.description.trim() || undefined,
      })
    );

    if (fundUserWallet.fulfilled.match(result)) {
      showSuccessToast("Customer wallet funded successfully");
      setFundForm({ userId: fundForm.userId, amount: "", description: "" });
      dispatch(fetchAllWallets());
      return;
    }

    showErrorToast(result.payload || "Failed to fund wallet");
  };

  if (loading) {
    return (
      <div className="dashboard-panel">
        <div className="content-loader">
          <Loader size="md" label="Loading wallets..." centered />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-panel admin-wallet">
      <div className="admin-wallet__summary-grid">
        <article className="admin-wallet__card admin-wallet__card--admin">
          <span className="admin-wallet__label">Admin Wallet Balance</span>
          <strong>{formatPrice(adminWallet?.balance ?? 0)}</strong>
          <p>Credits received from customer order payments.</p>
        </article>

        <article className="admin-wallet__card">
          <span className="admin-wallet__label">Customer Wallets</span>
          <strong>{customerWallets.length}</strong>
          <p>Active customer wallet accounts.</p>
        </article>
      </div>

      <form className="admin-wallet__fund-form" onSubmit={handleFundSubmit}>
        <h3>Fund Customer Wallet</h3>
        <div className="admin-wallet__fund-fields">
          <select
            value={fundForm.userId}
            onChange={(event) =>
              setFundForm((current) => ({ ...current, userId: event.target.value }))
            }
            required
          >
            <option value="">Select customer</option>
            {customerWallets.map((wallet) => (
              <option key={wallet.userId} value={wallet.userId}>
                {wallet.user?.customerName} ({wallet.user?.email}) ·{" "}
                {formatPrice(wallet.balance)}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Amount"
            value={fundForm.amount}
            onChange={(event) =>
              setFundForm((current) => ({ ...current, amount: event.target.value }))
            }
            required
          />

          <input
            type="text"
            placeholder="Description (optional)"
            value={fundForm.description}
            onChange={(event) =>
              setFundForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
          />
        </div>

        <LoadingButton type="submit" loading={funding}>
          Add Funds
        </LoadingButton>
      </form>

      <div className="admin-wallet__list">
        <h3>All Wallets</h3>
        <ul>
          {wallets.map((wallet) => (
            <li key={wallet._id} className="admin-wallet__list-item">
              <div>
                <strong>{wallet.user?.customerName || "Unknown user"}</strong>
                <span>{wallet.user?.email}</span>
                <span className="admin-wallet__role">{wallet.user?.role}</span>
              </div>
              <strong>{formatPrice(wallet.balance)}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminWallet;
