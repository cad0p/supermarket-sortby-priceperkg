// ==UserScript==
// @name         Dunnes Stores sort by price per kg
// @namespace    http://tampermonkey.net/
// @version      2024-02-18
// @description  try to take over the world!
// @author       Pier Carlo Cadoppi
// @match        https://www.dunnesstoresgrocery.com/sm/delivery/rsid/*/results*
// @match        https://www.dunnesstoresgrocery.com/sm/delivery/rsid/*/categories/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dunnesstoresgrocery.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
  
    // Render the popstate event listener useless by replacing it with a no-op
    // This way going into a product page does not unsort the items
    window.addEventListener("popstate", function(event) {
        event.stopImmediatePropagation();
    }, {
        capture: true,
    });
  
    // Get the divs that contain the product cards
    let productDivs = document.querySelectorAll("#pageMain > div.PageContent--1oxv91x > div > div > div > div > section.FilterData--digkuz > section.Content--ttviix > div.Listing--vkq6wb > div");
  
    // Convert the NodeList to an array
    productDivs = Array.from(productDivs);
  
    function convertToKgPrice(price, unit) {
        switch(unit.toLowerCase()) {
            case 'g': return price * 1000;
            case 'kg': return price;
            default: return price;
        }
    }
  
    // Define a function to extract the price per kilo from the span
    function getPricePerKilo(div) {
        let span = div.querySelector("article > div.ProductCardPricing--t1f7no > div > span");
        let text = span?.textContent || "";
  
        if (!text) return { price: Number.MAX_VALUE, unit: null, originalSpan: null };
  
        // Extract price and unit
        let match = text.match(/€([\d.]+)\/(kg|g)/i);
        if (!match) return { price: Number.MAX_VALUE, unit: null, originalSpan: null };
  
        let price = parseFloat(match[1]);
        let unit = match[2];
        let kgPrice = convertToKgPrice(price, unit);
  
        return { price: kgPrice, unit: unit, originalSpan: span };
    }
  
    // Sort the divs by the price per kilo in ascending order
    productDivs.sort((a, b) => getPricePerKilo(a).price - getPricePerKilo(b).price);
  
    // Save the sorted divs to a variable
    let sortedDivs = productDivs;
  
    // Define a function to append the sorted divs and update display
    function appendSortedDivs() {
        let parent = sortedDivs[0].parentElement;
  
        // First, update all the price displays without touching the DOM structure
        sortedDivs.forEach(div => {
            let priceData = getPricePerKilo(div);
            if (priceData.unit?.toLowerCase() === 'g' && priceData.originalSpan) {
                console.log('Updating price display:', priceData);
                // Use requestAnimationFrame to ensure DOM updates happen after the sort
                requestAnimationFrame(() => {
                    priceData.originalSpan.textContent = `€${priceData.price.toFixed(2)}/kg`;
                });
            }
        });
  
        // Then update the DOM structure
        parent.innerHTML = "";
        for (let div of sortedDivs) {
            parent.appendChild(div);
        }
    }
  
    // Add an event listener to the window object to run the append function when the page is loaded
    window.addEventListener("load", appendSortedDivs);
  
  })();
  