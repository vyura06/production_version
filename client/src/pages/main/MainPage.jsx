import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import collectionsService from "../../service/collections.service";
import itemsService from "../../service/items.service";
import tagsService from "../../service/tags.service";
import CollectionsTable from "../table/CollectionsTable";
import ItemsTable from "../table/ItemsTable";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import "./main.css";

import { useTranslation } from "react-i18next";
import "../../tranlations/i18next";

function MainPage({ currentUser }) {
  const [biggestCollections, setBiggestCollections] = useState([]);
  const [lastItems, setLastItems] = useState([]);
  const [tags, setTags] = useState([]);

  const { t } = useTranslation();

  const collectionColumns = [
    "#",
    t("columns.name"),
    t("columns.topic"),
    t("columns.author"),
    t("columns.itemsCount"),
    t("columns.created"),
    t("columns.link"),
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
      <div>
        <section className="biggest-collections">
          <Accordion style={{ backgroundColor: "#BCCEF8" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>{t("main.top5")}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <div>
                  {biggestCollections?.length ? (
                    <CollectionsTable columns={collectionColumns} collections={biggestCollections} readOnly={true} />
                  ) : (
                    <p>{t("main.nodata")}</p>
                  )}
                </div>
              </Typography>
            </AccordionDetails>
          </Accordion>
        </section>

        <section className="last-items">
          <Accordion style={{ backgroundColor: "#BCCEF8" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>{t("main.lastAdded")}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <div>
                  {lastItems?.length ? (
                    <ItemsTable items={lastItems} />
                  ) : (
                    <p>{t("main.nodata")}</p>
                  )}
                </div>
              </Typography>
            </AccordionDetails>
          </Accordion>
        </section>
      </div>
      <section className="tags">
        <h2>{t("main.tags")}</h2>
        <div>
          {tags?.length ? (
            tags.map((tag, i) => (

              <Accordion style={{backgroundColor:"#BCCEF8"}}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
            size="small" 
            key={i}
          >
            <Typography>{tag.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
            <div>
                  {lastItems?.length ? (
                    <ItemsTable items={lastItems} />
                  ) : (
                    <p>{t("main.nodata")}</p>
                  )}
                </div>
            </Typography>
          </AccordionDetails>
        </Accordion>
              
              
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
