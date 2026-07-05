import { ToastContainer } from "react-toastify";
import { Toaster as HotToaster } from "react-hot-toast";
import { Toaster as SonnerToaster } from "sonner";
import "react-toastify/dist/ReactToastify.css";

const NotificationProvider = () => (
  <>
    <ToastContainer
      position="top-right"
      autoClose={3500}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      toastClassName="jerutech-toast"
      progressClassName="jerutech-toast__progress"
      limit={4}
    />

    <HotToaster
      position="top-center"
      toastOptions={{
        className: "jerutech-hot-toast",
        duration: 4000,
      }}
    />

    <SonnerToaster
      position="bottom-right"
      theme="dark"
      toastOptions={{
        className: "jerutech-sonner-toast",
        style: {
          background: "rgba(15, 23, 42, 0.92)",
          border: "1px solid rgba(59, 130, 246, 0.28)",
          color: "#f8fafc",
          backdropFilter: "blur(16px)",
        },
      }}
      richColors
      closeButton
    />
  </>
);

export default NotificationProvider;
