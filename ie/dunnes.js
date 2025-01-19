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

  // Define a function to extract the price per kilo from the span
  function getPricePerKilo(div) {
      // Get the span that contains the price per kilo
      let span = div.querySelector("article > div.ProductCardPricing--t1f7no > div > span");

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

  // Save the sorted divs to a variable
  let sortedDivs = productDivs;

  // Define a function to append the sorted divs to the parent element
  function appendSortedDivs() {
      // Get the parent element of the divs
      let parent = sortedDivs[0].parentElement;

      // Remove the existing divs from the parent
      parent.innerHTML = "";

      // Append the sorted divs to the parent
      for (let div of sortedDivs) {
          parent.appendChild(div);
      }
  }

  // Add an event listener to the window object to run the append function when the page is loaded
  window.addEventListener("load", appendSortedDivs);

})();
