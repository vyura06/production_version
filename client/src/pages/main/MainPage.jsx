import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import collectionsService from "../../service/collections.service";
import itemsService from "../../service/items.service";
import tagsService from "../../service/tags.service";
import CollectionsTable from "../table/CollectionsTable";
import ItemsTable from "../table/ItemsTable";
import "./main.css";

import {useTranslation} from "react-i18next";
import "../../tranlations/i18next";

function MainPage({ currentUser }) {
  const [biggestCollections, setBiggestCollections] = useState([]);
  const [lastItems, setLastItems] = useState([]);
  const [tags, setTags] = useState([]);

  const {t} = useTranslation();

  const collectionColumns = [
    "#",
    "Name",
    "Topic",
    "Author",
    "Items count",
    "Created",
    "Link",
  ];

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
        <h2>{t("main.top5")}</h2>
        <div>
          { biggestCollections?.length ? (
            <CollectionsTable columns={collectionColumns} collections={biggestCollections} readOnly={true} />
          ) : (
            <p>{t("main.nodata")}</p>
          )}
        </div>
      </section>

      <section className="last-items">
        <h2> {t("main.lastAdded")}</h2>
        <div>
          { lastItems?.length ? (
            <ItemsTable items={lastItems} />
          ) : (
            <p>{t("main.nodata")}</p>
          )}
        </div>
      </section>

      <section className="tags">
        <h2>{t("main.tags")}</h2>
        <div>
          { tags?.length ? (
            tags.map((tag, index) => (
              <Button size="small" key={index} color="info" variant="outlined" sx={{ mr: 1, mb: 1, borderRadius: 40 }}>
                {tag.name}
              </Button>
            ))
          ) : (
            <p>{t("main.nodata")}</p>
          )}
        </div>
      </section>
    </>
  );
}

export default MainPage;
