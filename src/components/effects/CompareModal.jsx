import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { FiX } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setCompareOpen, removeCompareProduct, clearCompareProducts } from "../../redux/slices/uiSlice";
import { formatPrice, getEffectivePrice } from "../../utils/productHelpers";

const CompareModal = () => {
  const dispatch = useAppDispatch();
  const { compareItems, compareOpen } = useAppSelector((state) => state.ui);

  const handleClose = () => dispatch(setCompareOpen(false));

  return (
    <Dialog open={compareOpen} onClose={handleClose} PaperProps={{ className: "compare-modal" }}>
      <DialogContent className="compare-modal__content">
        <div className="compare-modal__header">
          <h2>Compare Products</h2>
          <button type="button" onClick={handleClose} aria-label="Close">
            <FiX />
          </button>
        </div>
        {compareItems.length < 2 ? (
          <p className="compare-modal__hint">Select two products to compare side by side.</p>
        ) : (
          <div className="compare-modal__grid">
            {compareItems.map((p) => (
              <div key={p.id} className="compare-modal__col glass-panel">
                <button
                  type="button"
                  className="compare-modal__remove"
                  onClick={() => dispatch(removeCompareProduct(p.id))}
                >
                  Remove
                </button>
                <img src={p.image} alt={p.name} />
                <h3>{p.name}</h3>
                <p>{p.category}</p>
                <strong>{formatPrice(getEffectivePrice(p))}</strong>
                <p className="compare-modal__desc">{p.description}</p>
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          className="compare-modal__clear"
          onClick={() => dispatch(clearCompareProducts())}
        >
          Clear Comparison
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default CompareModal;
