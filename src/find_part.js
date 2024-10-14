import { useEffect, useState } from 'react';
import componentData from './price_multipliers_data.js'


const fileNames = ['cpu','video-card', 'memory', 'motherboard', 'internal-hard-drive', 'case', 'power-supply'];
var data = [];
var priceRange = 0;


const loadJsonFile = (fileName) => {
    return import(`./datasets/pc_parts/${fileName}.json`);
  };

  // Find one item by condition (for example: by price)
  const findOneByCondition = (data, condition, fileName, storage, cpuBrand, gpuBrand, microATX) => {
    for (var i = condition; i >= 0; i -= 10) {
        var foundIndex = data.findIndex((item) => item.price <= condition && item.price >= i);
        if (foundIndex !== -1) {
            var foundPart = data[foundIndex];

            //FIX
            if (fileName == 'internal-hard-drive' ){
                var numericStorage = parseInt(storage);
                if(foundPart.capacity <= (numericStorage + 50) && foundPart.capacity >= (numericStorage - 100)){
                    return foundPart;    
                }
                else{
                    data.splice(foundIndex, 1);
                    continue;
                }
            }
            else if (fileName == 'cpu' && cpuBrand != 'Either'){
                if(cpuBrand == 'Intel' && foundPart.name.includes('Intel')){ // Intel Cpu's
                    return foundPart;
                }
                else if(cpuBrand == 'AMD' && foundPart.name.includes('AMD')){ // AMD Cpu's
                    return foundPart;
                }
                else{
                    continue;
                }
            }
            else if (fileName == 'video-card' && gpuBrand != 'Either'){
                if(gpuBrand == 'Nvidia' && foundPart.chipset.includes('GeForce')){ // Intel Cpu's
                    return foundPart;
                }
                else if(gpuBrand == 'AMD' && foundPart.chipset.includes('Radeon')){ // AMD Cpu's
                    return foundPart;
                }
                else{
                    continue;
                }
            }
            else if (fileName == 'motherboard'){
                if(microATX){
                    console.log(foundPart.form_factor)
                    if(foundPart.form_factor.includes('MicroATX')){
                        console.log(foundPart.form_factor)
                        return foundPart;
                    }
                    else{
                        data.splice(foundIndex, 1);
                        continue
                    }
                }
                else{
                    return foundPart;
                }
            }
            else if (fileName == 'case'){
                if(microATX){
                    if(foundPart.type.includes('MicroATX')){
                        return foundPart;
                    }
                    else{
                        data.splice(foundIndex, 1);
                        continue
                    }
                }
                else{
                    return foundPart;
                }
            }

            return foundPart;
        }
    }
    //Do something to prevent getting null data for storage cause there are too many null objects in internal-hard-drive file
    console.log('No Match!');
    foundPart = data.find((item) => item.price <= 100);
    return foundPart
    
};

// Set the price range and push the found item into the data array
export const findPcPart = async (price, purpose, storage, cpuBrand, gpuBrand, includeOS, microATX) => {
    data = [];
    //var leftMoney = price
    for (let fileName of fileNames) {
        const fileData = await loadJsonFile(fileName);

        
        // Set the price scale for each part according to the total budget
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
        const foundItem = findOneByCondition(fileData.default, calculatedPrice, fileName, storage, cpuBrand, gpuBrand, microATX); // ADD Brand filtering from here to other function 
        if (foundItem){

            // leftMoney -= foundItem.price
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
    if(includeOS){
    data.push({
        key: 'os',
        part: 'OS',
        brand : 'Windows 11 Home',
        price : 119.99
        })
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

    return data;
};