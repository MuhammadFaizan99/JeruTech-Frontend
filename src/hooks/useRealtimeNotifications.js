import { useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import { useAppSelector } from "../redux/hooks";
import { toast } from "sonner";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const useRealtimeNotifications = ({ onNotification } = {}) => {
  const { user, isAuthenticated, token } = useAppSelector((state) => state.auth);

  const socket = useMemo(() => {
    if (!isAuthenticated || !user?._id) {
      return null;
    }

    return io(SOCKET_URL, {
      transports: ["websocket"],
      auth: { token },
    });
  }, [isAuthenticated, token, user?._id]);

  useEffect(() => {
    if (!socket || !user?._id) {
      return undefined;
    }

    socket.emit("join:user", user._id);

    const playNotificationSound = () => {
      try {
        const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextCtor) {
          return;
        }

        const audioContext = new AudioContextCtor();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = 880;
        gainNode.gain.value = 0.04;
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.35);
        oscillator.stop(audioContext.currentTime + 0.35);
      } catch (_error) {
        // no-op
      }
    };

    const handleNotification = (payload) => {
      playNotificationSound();
      onNotification?.(payload);
      toast(payload.title, {
        description: payload.message,
        action: payload.link ? { label: "Open", onClick: () => window.location.assign(payload.link) } : undefined,
      });
    };

    socket.on("notification:new", handleNotification);
    socket.on("notification:toast", handleNotification);

    return () => {
      socket.off("notification:new", handleNotification);
      socket.off("notification:toast", handleNotification);
      socket.disconnect();
    };
  }, [socket, user?._id]);

  return socket;
};
