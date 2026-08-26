import React, { createContext, useContext, useState, useCallback } from "react";
import { getMyWishlist, toggleWishlist as toggleWishlistApi } from "../api/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlistedIds, setWishlistedIds] = useState(new Set());
  const [items, setItems] = useState([]); // full product objects, for the Wishlist screen itself

  const refreshWishlist = useCallback(() => {
    if (!user) {
      setWishlistedIds(new Set());
      setItems([]);
      return;
    }
    getMyWishlist()
      .then((res) => {
        setItems(res.data);
        setWishlistedIds(new Set(res.data.map((item) => item.product._id)));
      })
      .catch((err) => console.log("Error fetching wishlist:", err.message));
  }, [user]);

  const toggle = async (productId) => {
    // Optimistic update — flip the UI instantly, before the server confirms,
    // since this is a low-stakes action where waiting for a round-trip would
    // feel sluggish. If the request fails, we roll back.
    const wasWishlisted = wishlistedIds.has(productId);
    setWishlistedIds((prev) => {
      const next = new Set(prev);
      if (wasWishlisted) next.delete(productId);
      else next.add(productId);
      return next;
    });

    try {
      await toggleWishlistApi(productId);
      refreshWishlist(); // re-sync the full `items` list in the background
    } catch (error) {
      console.log("Wishlist toggle failed:", error.message);
      // Roll back the optimistic change
      setWishlistedIds((prev) => {
        const next = new Set(prev);
        if (wasWishlisted) next.add(productId);
        else next.delete(productId);
        return next;
      });
    }
  };

  const isWishlisted = (productId) => wishlistedIds.has(productId);

  return (
    <WishlistContext.Provider value={{ items, isWishlisted, toggle, refreshWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);