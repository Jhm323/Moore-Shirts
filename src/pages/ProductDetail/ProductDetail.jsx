import React, { useState } from "react";
import { SIZES } from "../../data/products";
import Card from "../../components/ui/Card/Card";
import Tag from "../../components/ui/Tag";
import Btn from "../../components/ui/Btn/Btn";
import PosterTile from "../../components/art/PosterTile";
import "./ProductDetail.css";

/* ---------------- Product Detail ---------------- */
export default function ProductDetail({ product, liked, toggleLike, onAdd, onBack }) {
  const [size, setSize] = useState("M");
  return (
    <div className="product-detail">
      <span className="product-detail__back" onClick={onBack}>
        {"←"} Back to shop
      </span>
      <div className="product-detail__grid">
        <Card className="product-detail__media">
          <PosterTile product={product} size={240} />
        </Card>
        <div>
          {product.tag && <Tag>{product.tag}</Tag>}
          <h1 className="product-detail__title">{product.name}</h1>
          <div className="product-detail__price">${product.price}</div>
          <p className="product-detail__blurb">{product.blurb} Screen-printed on heavyweight organic cotton, unisex fit.</p>

          <div className="product-detail__size-block">
            <div className="product-detail__size-label">Size</div>
            <div className="product-detail__size-row">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`product-detail__size-chip ${size === s ? "product-detail__size-chip--selected" : ""}`.trim()}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="product-detail__actions">
            <Btn variant="primary" onClick={() => onAdd(size)}>
              Add to cart
            </Btn>
            <Btn variant="ghost" onClick={toggleLike}>
              {liked ? "♥ Saved" : "♡ Save"}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
