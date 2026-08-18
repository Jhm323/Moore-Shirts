import React from "react";
import { PRODUCTS } from "../../data/products";
import PosterTile from "../../components/art/PosterTile";
import Card from "../../components/ui/Card/Card";
import Btn from "../../components/ui/Btn/Btn";
import "./Shop.css";

export default function Shop({ liked, toggleLike, onOrder, user, onRequireSignIn }) {
  function handleLike(id) {
    if (!user) { onRequireSignIn(); return; }
    toggleLike(id);
  }

  return (
    <div className="shop">
      <h1 className="shop__title">Shop all</h1>
      <p className="shop__subtitle">Naturalist portraits, printed to order.</p>
      <div className="shop__grid">
        {PRODUCTS.map((p) => (
          <Card key={p.id} className="shop__card">
            <div className="shop__card-header">
              <span onClick={() => handleLike(p.id)} className="shop__like-btn" title="Save">
                {liked.includes(p.id) ? "♥" : "♡"}
              </span>
            </div>
            <div className="shop__card-media">
              <PosterTile product={p} size={110} />
            </div>
            <div className="shop__card-title">{p.name}</div>
            <Btn variant="primary" className="shop__order-btn" onClick={() => onOrder(p.id)}>
              Order this design
            </Btn>
          </Card>
        ))}
      </div>
    </div>
  );
}
