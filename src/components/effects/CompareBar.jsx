import { FiLayers } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setCompareOpen } from "../../redux/slices/uiSlice";

const CompareBar = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.ui.compareItems);

  if (items.length === 0) return null;

  return (
    <div className="compare-bar">
      <span>
        <FiLayers /> {items.length}/2 selected for compare
      </span>
      <button type="button" onClick={() => dispatch(setCompareOpen(true))}>
        Compare Now
      </button>
    </div>
  );
};

export default CompareBar;
