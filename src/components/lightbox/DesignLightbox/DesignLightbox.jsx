import React, { useState, useEffect } from "react";
import { PRODUCTS } from "../../../data/products";
import ShirtMockup from "../../art/ShirtMockup";
import Btn from "../../ui/Btn";
import "./DesignLightbox.css";

export default function DesignLightbox({ startId, onClose, onOrder }) {
  const [index, setIndex] = useState(() => {
    const i = PRODUCTS.findIndex((p) => p.id === startId);
    return i === -1 ? 0 : i;
  });

  const product = PRODUCTS[index];

  function goPrev() {
    setIndex((i) => (i - 1 + PRODUCTS.length) % PRODUCTS.length);
  }
  function goNext() {
    setIndex((i) => (i + 1) % PRODUCTS.length);
  }

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="design-lightbox__overlay" onClick={onClose}>
      <button className="design-lightbox__close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <button
        className="design-lightbox__nav design-lightbox__nav--prev"
        onClick={(e) => { e.stopPropagation(); goPrev(); }}
        aria-label="Previous design"
      >
        ‹
      </button>

      <div className="design-lightbox__card" onClick={(e) => e.stopPropagation()}>
        <ShirtMockup product={product} size={320} />
        <div className="design-lightbox__name">{product.name}</div>
        <div className="design-lightbox__price">${product.price}</div>
        <Btn variant="primary" onClick={() => onOrder(product.id)}>
          Order this design
        </Btn>
      </div>

      <button
        className="design-lightbox__nav design-lightbox__nav--next"
        onClick={(e) => { e.stopPropagation(); goNext(); }}
        aria-label="Next design"
      >
        ›
      </button>
    </div>
  );
}
