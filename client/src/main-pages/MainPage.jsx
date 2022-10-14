import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import collectionsService from "../shared/api/collections.service";
import itemsService from "../shared/api/items.service";
import tagsService from "../shared/api/tags.service";
import CollectionsTable from "./components/CollectionsTable";
import ItemsTable from "./components/ItemsTable";
import "./main.css";

function MainPage({ currentUser }) {
  const [biggestCollections, setBiggestCollections] = useState([]);
  const [lastItems, setLastItems] = useState([]);
  const [tags, setTags] = useState([]);

  const collectionColumns = [
    "#",
    "Name",
    "Topic",
    "Author",
    "Items count",
    "Created",
    "Link",
  ];

  // TODO: try to deal with firebase on client side

  useEffect(() => {
    collectionsService
      .getTopBiggestCollections()
      .then(res => setBiggestCollections(res.data.collections))
      .catch(err => console.log(err));

    itemsService
      .getLastAddedItems()
      .then(res => setLastItems(res.data.items))
      .catch(err => console.log(err));

    tagsService
      .getTags()
      .then(res => setTags(res.data.tags))
      .catch(err => console.log(err));
  }, []);

  return (
    <>
      <section className="biggest-collections">
        <h2>Top 5 biggest collections</h2>
        <div>
          { biggestCollections?.length ? (
            <CollectionsTable columns={collectionColumns} collections={biggestCollections} readOnly={true} />
          ) : (
            <p>There are no items.</p>
          )}
        </div>
      </section>

      <section className="last-items">
        <h2>Last added items</h2>
        <div>
          { lastItems?.length ? (
            <ItemsTable items={lastItems} />
          ) : (
            <p>There are no items.</p>
          )}
        </div>
      </section>

      <section className="tags">
        <h2>Tags</h2>
        <div>
          { tags?.length ? (
            tags.map((tag, index) => (
              <Button size="small" key={index} color="info" variant="outlined" sx={{ mr: 1, mb: 1, borderRadius: 40 }}>
                {tag.name}
              </Button>
            ))
          ) : (
            <p>There are no items.</p>
          )}
        </div>
      </section>
    </>
  );
}

export default MainPage;
