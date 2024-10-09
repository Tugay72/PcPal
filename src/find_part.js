import { useEffect, useState } from 'react';
import componentData from './price_multipliers_data.js'


const fileNames = ['cpu','video-card', 'memory', 'motherboard', 'internal-hard-drive', 'case', 'power-supply'];
var data = [];
var priceRange = 0;


const loadJsonFile = (fileName) => {
    return import(`./datasets/pc_parts/${fileName}.json`);
  };

  // Find one item by condition (for example: by price)
  const findOneByCondition = (data, condition, fileName, storage) => {
    for (var i = condition; i >= 0; i -= 10) {
        console.log(fileName, condition, i)
        var foundPart = data.find((item) => item.price <= condition && item.price >= i);
        if (foundPart) {
            if (fileName == 'internal-hard-drive'){
                console.log(foundPart.capacity)
                if (foundPart.capacity <= storage + 50){
                    return foundPart;
                }
                continue;
            }
            return foundPart;
        }
    }
    //Do something to prevent getting null data for storage cause there are too many null objects in internal-hard-drive file
    console.log('No Match!');
    return null;
};

export const findPcPart = async (price, purpose, storage) => {
    data = [];
    var leftMoney = price
    for (let fileName of fileNames) {
        const fileData = await loadJsonFile(fileName);

        
        if (price < 500){
            priceRange = 0    
        }
        else if (price < 1000){
            priceRange = 1    
        }
        else if (price < 2000){
            priceRange = 2    
        }
        else{
            priceRange = 3
        }

        const compData = componentData.components[priceRange][fileName];
        if (!compData) {
            throw new Error(`Component not found: ${fileName}`);
        }

        var minPrice = compData.minPrice;
        var priceMultiplier = compData[purpose];
        

        const calculatedPrice = Math.max(price * priceMultiplier, minPrice);
        const foundItem = findOneByCondition(fileData.default, calculatedPrice, fileName, storage); // ADD Brand filtering from here to other function 
        if (foundItem){

            leftMoney -= foundItem.price
            let name;
            if (fileName == 'video-card'){
            name = `${foundItem.name} ${foundItem.chipset}`;
            }
            else if(fileName == 'internal-hard-drive'){
            name = `${foundItem.name} ${foundItem.capacity}GB`;
            }
            else{
            name = foundItem.name
            }

            data.push({
            key: `${fileName}-${foundItem.name}`,
            part: fileName,
            brand: name,
            price: foundItem.price,
            });
        }
    }
    var totalPrice = 0;
      for (const object of data){
        totalPrice += object.price
      }
      data.push({
        key: 'Total',
        part: 'Total Price',
        brand : '',
        price : totalPrice.toFixed(2) + '$'
      })

    return data
};