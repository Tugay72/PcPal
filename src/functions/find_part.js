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
const findOneByCondition = (data, condition, fileName, purpose, storage, cpuBrand, gpuBrand, microATX) => {

    let currentBudget = condition * 1.2;
    const priceDropStep = 25;

    while (currentBudget > 0) {
        // 1. Filter and find the best candidates
        const candidates = data.filter(part => {
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
                    break;

                case 'video-card':
                    if (gpuBrand === 'Nvidia' && !part.chipset.includes('GeForce')) return false;
                    if (gpuBrand === 'AMD' && !part.chipset.includes('Radeon')) return false;
                    break;

                case 'motherboard':
                    if (microATX && !part.form_factor.includes('Micro-ATX')) {
                        return false;
                    }

                    if (cpuBrand !== 'Either' && (cpuBrand !== part.cpu_type)) {
                        return false;
                    }

                    break;

                case 'case':
                    if (microATX && !part.type.includes('MicroATX')) {
                        return false;
                    }
                    break;

                case 'internal-hard-drive':
                    const requiredCapacity = parseInt(storage) || 0;
                    if (part.capacity < requiredCapacity) {
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
            return candidates[0];
        }

        currentBudget -= priceDropStep;
    }

    // 
    console.log(`Nothing found.`);
    return null;
};

// Set the price range and push the found item into the data array
export const findPcPart = async (price, purpose, storage, cpuBrand, gpuBrand, includeOS, microATX, temperedGlass) => {
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

        const foundItem = findOneByCondition(fileData.default, calculatedPrice, fileName, purpose, storage, cpuBrand, gpuBrand, microATX, temperedGlass);
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