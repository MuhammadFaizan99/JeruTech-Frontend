import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchMyWalletTransactions } from "../../redux/slices/walletSlice";
import { formatPrice } from "../../utils/productHelpers";
import { showErrorToast } from "../../utils/toast";

const Wallet = () => {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((state) => state.wallet.transactions);
  const transactionsLoading = useAppSelector(
    (state) => state.wallet.transactionsLoading
  );
  const transactionsPagination = useAppSelector(
    (state) => state.wallet.transactionsPagination
  );
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    const loadWallet = async () => {
      const transactionsResult = await dispatch(
        fetchMyWalletTransactions({ page, limit: itemsPerPage })
      );

      if (fetchMyWalletTransactions.rejected.match(transactionsResult)) {
        showErrorToast(transactionsResult.payload || "Failed to load transactions");
      }
    };

    loadWallet();
  }, [dispatch, page, itemsPerPage]);

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
  };

  const handleItemsPerPageChange = (nextLimit) => {
    setItemsPerPage(nextLimit);
    setPage(1);
  };

  if (transactionsLoading && transactions.length === 0) {
    return (
      <div className="dashboard-panel">
        <div className="content-loader">
          <Loader size="md" label="Loading transactions..." centered />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-panel dashboard-wallet">
      <section className="dashboard-wallet__transactions">
        <h3>Recent Transactions</h3>

        {transactionsLoading ? (
          <Loader size="sm" label="Loading transactions..." centered />
        ) : transactions.length === 0 ? (
          <p className="dashboard-wallet__empty">No wallet activity yet.</p>
        ) : (
          <ul>
            {transactions.map((transaction) => (
              <li key={transaction._id} className="dashboard-wallet__transaction">
                <div>
                  <strong>{transaction.description}</strong>
                  <span>{new Date(transaction.createdAt).toLocaleString()}</span>
                  <span className="dashboard-wallet__category">{transaction.category}</span>
                </div>
                <div className="dashboard-wallet__amounts">
                  <span
                    className={`dashboard-wallet__amount dashboard-wallet__amount--${transaction.type}`}
                  >
                    {transaction.type === "debit" ? "-" : "+"}
                    {formatPrice(transaction.amount)}
                  </span>
                  {/* Balance not stored on each transaction; compute from API if needed */}
                  <span className="dashboard-wallet__balance-after">
                    
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {transactionsPagination.totalItems > 0 && (
          <Pagination
            currentPage={transactionsPagination.currentPage}
            totalPages={transactionsPagination.totalPages}
            totalItems={transactionsPagination.totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            pageSizeOptions={[6, 8, 12, 24]}
            scrollTarget=".dashboard-wallet"
          />
        )}
      </section>
    </div>
  );
};

export default Wallet;
