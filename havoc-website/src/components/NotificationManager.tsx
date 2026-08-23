"use client";

import { useEffect, useRef } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

import { toast } from "sonner";

export default function NotificationManager() {
  const { user, havocUser, loading } = useAuth();
  const pathname = usePathname();
  const isFirstLoad = useRef(true);
  const notificationPermission = useRef("default");

  useEffect(() => {
    // Only ask if logged in and approved
    if (loading || !user || (!havocUser?.chatAccess && !havocUser?.isAdmin)) return;

    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        toast('Enable Notifications', {
          description: 'Get alerted when a new message arrives in the War Room.',
          duration: 10000,
          action: {
            label: 'Allow',
            onClick: () => {
              Notification.requestPermission().then((perm) => {
                notificationPermission.current = perm;
                if (perm === 'granted') {
                  toast.success('Notifications enabled successfully!');
                } else {
                  toast.error('Notifications were denied.');
                }
              });
            },
          },
        });
      } else {
        notificationPermission.current = Notification.permission;
      }
    }
  }, [user, havocUser, loading]);

  useEffect(() => {
    if (loading || !user || (!havocUser?.chatAccess && !havocUser?.isAdmin)) return;

    // Listen to the latest message
    const q = query(collection(db, "groups", "havoc", "messages"), orderBy("createdAt", "desc"), limit(1));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Skip the initial load so we don't spam a notification for an old message
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
        return;
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const msg = change.doc.data();
          
          // Don't notify if the user sent it themselves
          if (msg.senderId === user.uid) return;

          // Don't notify if they are actively looking at the chat room
          const isChatActive = pathname === "/chat" && !document.hidden;
          if (isChatActive) return;

          // Fire Native Browser Notification
          if (typeof window !== "undefined" && "Notification" in window && notificationPermission.current === "granted") {
            const notification = new Notification(`War Room: ${msg.senderName}`, {
              body: msg.text,
              icon: msg.senderPhoto || "/favicon.ico",
              silent: false,
            });

            notification.onclick = () => {
              window.focus();
              // If not on chat, maybe they have to manually navigate or we could use a BroadcastChannel
              // but since they just click it, focusing the window is enough.
            };
          }
        }
      });
    });

    return () => unsubscribe();
  }, [user, havocUser, loading, pathname]);

  return null; // Silent background component
}
