import { useEffect, useState } from 'react';
import componentData from './price_multipliers_data.js'


const fileNames = ['cpu', 'video-card', 'memory', 'motherboard', 'internal-hard-drive', 'case', 'power-supply'];
const tableNames = ['CPU', 'GPU', 'Ram', 'Motherboard', 'Hard Drive', 'Case', 'Power Supply'];
var data = [];
var priceRange = 0;

var selectedCPU = null;

//Load datasets
const loadJsonFile = (fileName) => {
    return import(`../datasets/pc_parts/${fileName}.json`);
};

// Find one item by condition (for example: by price)
const findOneByCondition = (data, condition, fileName, purpose, storage, cpuBrand, gpuBrand, ramType, ramStorage, microATX) => {

    let currentBudget = condition * 1.2;
    if (currentBudget < 50) {
        currentBudget = 50
    }
    const priceDropStep = 25;

    while (currentBudget > 0) {
        // 1. Filter and find the best candidates
        var candidates = data.filter(part => {
            // Fiyat kontrolü
            if (part.price > currentBudget) {
                return false;
            }

            // Filter by part
            switch (fileName) {
                case 'cpu':
                    if (cpuBrand !== 'Either' && !part.name.includes(cpuBrand)) {
                        return false;
                    }

                    if (purpose !== 'Gaming' && purpose !== 'Engineer' && part.graphics == null) {
                        return false;
                    }

                    if (ramType !== 'Either' && part.ram_type !== 'Either' && part.ram_type !== ramType) {
                        return false;
                    }

                    break;

                case 'video-card':
                    if (gpuBrand === 'Nvidia' && !part.chipset.includes('GeForce')) {
                        return false;
                    }
                    if (gpuBrand === 'AMD' && !part.chipset.includes('Radeon')) {
                        return false;
                    }

                    break;

                case 'motherboard':
                    if (microATX && !part.form_factor.includes('Micro-ATX')) {
                        return false;
                    }

                    if (cpuBrand !== 'Either' && (cpuBrand !== part.cpu_type)) {
                        return false;
                    }

                    if (selectedCPU !== null && selectedCPU.socket !== part.socket && selectedCPU.ram_type !== part.ram_type) {
                        return false;
                    }

                    break;

                case 'memory':
                    if (ramType !== 'Either' && part.type !== ramType) {
                        return false;
                    }
                    if (ramStorage != part.storage) {
                        return false;
                    }

                    if (ramType !== 'Either' && ((selectedCPU.name.includes('AMD') && part.name.includes('Intel')) || selectedCPU.name.includes('Intel') && part.name.includes('AMD')))
                        return false;
                    break;

                case 'case':
                    if (microATX && !part.type.includes('MicroATX')) {
                        return false;
                    }
                    break;

                case 'internal-hard-drive':

                    const requiredCapacity = parseInt(storage) || 0;
                    if (part.capacity < requiredCapacity || (part.capacity > requiredCapacity && requiredCapacity < 2000)) {
                        return false;
                    }
                    break;
            }

            return true;
        });

        // 2. Select the most suitable candidate
        console.log(candidates)
        if (candidates.length > 0) {

            candidates.sort((a, b) => {
                if (purpose === 'Gaming' && a.gaming_rank !== undefined) {
                    return (a.gaming_rank || 999) - (b.gaming_rank || 999);
                } else {
                    return (a.overall_rank || 999) - (b.overall_rank || 999);
                }
            });

            console.log(`Budget ${currentBudget.toFixed(2)} and found these parts : ${candidates[0].name}`);
            if (candidates[0].gaming_rank !== undefined) {
                selectedCPU = candidates[0];

                candidates = candidates.filter(item => item.socket == selectedCPU.socket)
            }

            return [candidates[0], candidates.slice(1)];
        }

        currentBudget -= priceDropStep;
    }

    // 
    console.log(`Nothing found. Budget was: `, condition);
    return [{
        name: '---',
        chipset: '---',
        capacity: '---',
        rank: '',
        price: 0.00
    }];
};

// Set the price range and push the found item into the data array
export const findPcPart = async (price, purpose, storage, cpuBrand, gpuBrand, ramType, ramStorage, includeOS, microATX, temperedGlass) => {
    data = [];
    var index = 0;
    selectedCPU = null;
    //var leftMoney = price
    for (let fileName of fileNames) {
        const fileData = await loadJsonFile(fileName);

        // Set the price scale for each part according to the total budget
        if (price <= 650) {
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

        // foundItems = [candidate 0, other candidates], most suitable candidate and others
        const foundItems = findOneByCondition(fileData.default, calculatedPrice, fileName, purpose, storage, cpuBrand, gpuBrand, ramType, ramStorage, microATX, temperedGlass);
        const foundItem = foundItems[0]
        var otherSuggestedParts = foundItems[1];

        // Get the best 3 suggestions
        if (otherSuggestedParts !== undefined && otherSuggestedParts.length > 3) {
            otherSuggestedParts = otherSuggestedParts.slice(0, 3);
        }



        if (foundItem) {
            var children = null;

            if (otherSuggestedParts) {
                children = otherSuggestedParts.map(item => ({
                    key: `${fileName}-${item.name}`,
                    part: tableNames[index],
                    brand: item.name,
                    rank: purpose === 'Gaming' && index == 0 ? item.gaming_rank : item.overall_rank,
                    price: item.price,

                }));
            }




            //Push found parts into table
            data.push({
                key: `${fileName}-${foundItem.name}`,
                part: tableNames[index],
                brand: foundItem.name,
                rank: purpose === 'Gaming' && index == 0 ? foundItem.gaming_rank : foundItem.overall_rank,
                price: foundItem.price,
                children:
                    children

            });
            index += 1;
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
        price: totalPrice.toFixed(2) + '$',
    })

    console.log(data);
    return data;
};