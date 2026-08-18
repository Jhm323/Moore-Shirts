import React from "react";
import { CAUSES } from "../../data/causes";
import { PRODUCTS } from "../../data/products";
import Card from "../../components/ui/Card";
import Tag from "../../components/ui/Tag";
import Btn from "../../components/ui/Btn";
import PosterTile from "../../components/art/PosterTile";
import "./Landing.css";

export default function Landing({ onOrder, onShop }) {
  return (
    <div>
      <section className="landing__hero">
        <Card className="landing__hero-card">
          <div className="landing__hero-overlay">
            <Card className="landing__hero-card-inner card--overlay">
              <Tag>10% of every order funds a cause you pick</Tag>
              <h1 className="landing__hero-title">
                Portraits of the wild,<br />worn with purpose.
              </h1>
              <p className="landing__hero-copy">
                Painterly wildlife prints, printed to order. No batches, no inventory.
              </p>
              <Btn variant="primary" onClick={onShop}>Shop the collection</Btn>
            </Card>
          </div>
        </Card>
      </section>

      <section className="landing__collection">
        <h2 className="landing__collection-title">The collection</h2>
        <div className="landing__collection-grid">
          {PRODUCTS.slice(0, 4).map((p) => (
            <div key={p.id} onClick={() => onOrder(p.id)} className="landing__collection-item">
              <PosterTile product={p} size={90} />
              <div className="landing__collection-item-name">{p.name}</div>
            </div>
          ))}
        </div>
        <div className="landing__collection-footer">
          <Btn variant="ghost" onClick={onShop}>View all designs</Btn>
        </div>
      </section>

      <section className="landing__causes">
        <div className="landing__causes-inner">
          <h2 className="landing__causes-title">Where your 10% can go</h2>
          <div className="landing__causes-grid">
            {CAUSES.map((c) => (
              <div key={c.id} className="landing__cause-card" style={{ "--cause-color": c.color }}>
                <div className="landing__cause-dot" />
                <div className="landing__cause-name">{c.name}</div>
                <div className="landing__cause-blurb">{c.blurb}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
