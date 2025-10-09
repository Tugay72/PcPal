import { useEffect, useState } from 'react';
import componentData from './price_multipliers_data.js'


const fileNames = ['cpu', 'video-card', 'memory', 'motherboard', 'internal-hard-drive', 'case', 'power-supply'];
const tableNames = ['CPU', 'GPU', 'Ram', 'Motherboard', 'Hard Drive', 'Case', 'Power Supply'];
var data = [];
var priceRange = 0;

//Load datasets
const loadJsonFile = (fileName) => {
    return import(`../datasets/pc_parts/${fileName}.json`);
};

// Find one item by condition (for example: by price)
const findOneByCondition = (data, condition, fileName, storage, cpuBrand, gpuBrand, microATX) => {

    //Find the price closest to the price data received
    for (var i = condition; i >= 0; i -= 10) {
        var foundIndex = data.findIndex((item) => item.price <= condition && item.price >= i);
        if (foundIndex !== -1) {
            var foundPart = data[foundIndex];

            //FIX: Finding 250GB is not working well!
            if (fileName == 'internal-hard-drive') {
                var numericStorage = parseInt(storage);
                if (foundPart.capacity <= (numericStorage + 50) && foundPart.capacity >= (numericStorage - 100)) {
                    return foundPart;
                }
                else {
                    data.splice(foundIndex, 1);
                    continue;
                }
            }
            else if (fileName == 'cpu' && cpuBrand != 'Either') {
                // Intel CPU's
                if (cpuBrand == 'Intel' && foundPart.name.includes('Intel')) {
                    return foundPart;
                }
                // AMD CPU's
                else if (cpuBrand == 'AMD' && foundPart.name.includes('AMD')) {
                    return foundPart;
                }
                else {
                    continue;
                }
            }
            else if (fileName == 'video-card' && gpuBrand != 'Either') {
                // Nvidia GPU's
                if (gpuBrand == 'Nvidia' && foundPart.chipset.includes('GeForce')) {

                    return foundPart;
                }
                // AMD GPU's
                else if (gpuBrand == 'AMD' && foundPart.chipset.includes('Radeon')) {
                    return foundPart;
                }
                else {
                    continue;
                }
            }
            else if (fileName == 'motherboard') {
                if (microATX) {
                    console.log(foundPart.form_factor)
                    if (foundPart.form_factor.includes('MicroATX')) {
                        console.log(foundPart.form_factor)
                        return foundPart;
                    }
                    else {
                        data.splice(foundIndex, 1);
                        continue
                    }
                }
                else {
                    return foundPart;
                }
            }
            else if (fileName == 'case') {
                if (microATX) {
                    if (foundPart.type.includes('MicroATX')) {
                        return foundPart;
                    }
                    else {
                        data.splice(foundIndex, 1);
                        continue
                    }
                }
                else {
                    return foundPart;
                }
            }

            return foundPart;
        }
    }
    console.log('No Match!');
    foundPart = data.find((item) => item.price <= 100);
    return foundPart

};

// Set the price range and push the found item into the data array
export const findPcPart = async (price, purpose, storage, cpuBrand, gpuBrand, includeOS, microATX) => {
    data = [];
    var index = 0;
    //var leftMoney = price
    for (let fileName of fileNames) {
        const fileData = await loadJsonFile(fileName);

        // Set the price scale for each part according to the total budget
        if (price < 500) {
            priceRange = 0
        }
        else if (price < 1000) {
            priceRange = 1
        }
        else if (price < 2000) {
            priceRange = 2
        }
        else {
            priceRange = 3
        }

        const compData = componentData.components[priceRange][fileName];
        if (!compData) {
            throw new Error(`Component not found: ${fileName}`);
        }

        var minPrice = compData.minPrice;
        var priceMultiplier = compData[purpose];
        const calculatedPrice = Math.max(price * priceMultiplier, minPrice);

        const foundItem = findOneByCondition(fileData.default, calculatedPrice, fileName, storage, cpuBrand, gpuBrand, microATX);
        if (foundItem) {
            // leftMoney -= foundItem.price
            let name;

            if (fileName == 'video-card') {
                name = `${foundItem.name} ${foundItem.chipset}`;
            }
            else if (fileName == 'internal-hard-drive') {
                name = `${foundItem.name} ${foundItem.capacity}GB`;
            }
            else {
                name = foundItem.name
            }

            //Push found parts into table
            data.push({
                key: `${fileName}-${foundItem.name}`,
                part: tableNames[index],
                brand: name,
                price: foundItem.price,
            });
            index += 1;
            console.log(index)
        }
    }
    // Add windows 11
    if (includeOS) {
        data.push({
            key: 'os',
            part: 'OS',
            brand: 'Windows 11 Home',
            price: 119.99
        })
    }

    // Calculate the total price
    var totalPrice = 0;
    for (const object of data) {
        totalPrice += object.price
    }
    data.push({
        key: 'Total',
        part: 'Total Price',
        brand: '',
        price: totalPrice.toFixed(2) + '$'
    })

    return data;
};