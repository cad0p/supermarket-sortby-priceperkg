// ==UserScript==
// @name         SuperValu sort by price per kg
// @namespace    http://tampermonkey.net/
// @version      2024-02-18
// @description  try to take over the world!
// @author       Pier Carlo Cadoppi
// @match        https://shop.supervalu.ie/sm/delivery/rsid/*/results*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=supervalu.ie
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    // Get the divs that contain the product cards
    let productDivs = document.querySelectorAll("#pageMain > div.PageContent--1oxv91x.dBafYq > div > div > div > div > section.FilterData--digkuz.jTBNz > section.Content--ttviix.efTUXH > div.Listing--vkq6wb.dDQkdC > div");

    // Convert the NodeList to an array
    productDivs = Array.from(productDivs);

    // Define a function to extract the price per kilo from the span
    function getPricePerKilo(div) {
        // Get the span that contains the price per kilo
        let span = div.querySelector("div.ProductCardPricing--t1f7no > span.ProductCardPriceInfo--1vvb8df.bKPoZB");

        // Get the text content of the span
        let text = span.textContent;

        // Remove the euro sign and the slash
        text = text.replace("€", "").replace("/", "");

        // Convert the text to a number
        let price = parseFloat(text);

        // Return the price
        return price;
    }

    // Sort the divs by the price per kilo in ascending order
    productDivs.sort((a, b) => getPricePerKilo(a) - getPricePerKilo(b));

    // Get the parent element of the divs
    let parent = productDivs[0].parentElement;

    // Remove the existing divs from the parent
    parent.innerHTML = "";

    // Append the sorted divs to the parent
    for (let div of productDivs) {
        parent.appendChild(div);
    }

})();
