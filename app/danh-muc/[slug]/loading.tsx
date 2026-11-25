export default function CategoryLoading() {
  return (
    <main className="page-shell" aria-busy="true" aria-label="Đang tải danh mục sản phẩm">
      <section className="container-shell page-hero">
        <div className="page-hero__copy">
          <div className="cat-skel cat-skel--eyebrow" />
          <div className="cat-skel cat-skel--title" />
          <div className="cat-skel cat-skel--desc" />
          <div className="cat-skel cat-skel--desc-short" />
        </div>
        <div className="page-hero__visual cat-skel cat-skel--visual" />
      </section>
      <section className="container-shell section-pad">
        <div className="sku-list">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="sku-row cat-skel-card" aria-hidden="true">
              <div className="sku-row__media cat-skel" />
              <div className="sku-row__body">
                <div className="cat-skel cat-skel--line-sm" />
                <div className="cat-skel cat-skel--line" />
                <div className="cat-skel cat-skel--btn" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
