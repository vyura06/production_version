import React from 'react';
import { useState } from 'react';
import '../search/search.css';
import { useEffect } from "react";
import itemsService from "../../service/items.service";
import collectionsService from "../../service/collections.service";

function SearchItems() {
    const [searchTerm, setSearchTerm] = useState('')
    const [items, setItems] = useState([]);
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        collectionsService
        .getTopBiggestCollections()
        .then(res => setCollections(res.data.collections))
        .catch(err => console.log(err));

        itemsService
            .getLastAddedItems()
            .then(res => setItems(res.data.items))
            .catch(err => console.log(err));
    }, []);

    return (
        <div className="search">
            <input type="text" placeholder="🔍" onChange={event => {
                setSearchTerm(event.target.value);
            }} />
            {
                //items
                items.filter((item) => {
                    if (searchTerm != ""
                        && (item.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    ) {
                        return item
                    }
                }).map((item, key) => {
                    return (
                        <div className="item" key={key}>
                            <a>{item.name}</a>
                        </div>
                    );
                }).concat(collections.filter((collection) => {
                    if (searchTerm != ""
                        && (collection.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    ) {
                        return collection
                    }
                }).map((collection, k) => {
                    return (
                        <div className="item" key={k}>
                            <a>{collection.name}</a>
                        </div>
                    );
                })
                )
            }

        </div>
    );
}

export default SearchItems;