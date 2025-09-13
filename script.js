let input = "(id, name, email, type(id, name, customFields(c1, c2, c3)), externalId)";
const stringParts = input.match(/[a-zA-Z0-9][a-zA-Z0-9]*|\(|\)|,/g);

let formattedOutput1 = formatList1(stringParts);
const resultArray = createList(stringParts);
let formattedOutput2 = sortList(resultArray);

console.log(formattedOutput1);
console.log(formattedOutput2);
document.getElementById("result").innerText = formattedOutput1;
document.getElementById("result2").innerText = formattedOutput2;

//this was going to be my original attempt for both outputs, but I realized soon that for the alphabetized output list I would definitely need to use recursion...
function formatList1(stringParts) {
    let index = 0;
    let indent = -1;
    let outputString = ``;
    
    while (index < stringParts.length) {
        let part = stringParts[index];
        
        if (part === "(") {
            index++;
            indent++;
            continue;
        }

        if (part === ")") {
            index++;
            indent--;
            continue;
        }

        if (part === ",") {
            index++;
            continue;
        }

        if (/[a-zA-Z][a-zA-Z0-9]*/.test(part)) {
            outputString = outputString + `${"  ".repeat(indent)}- ${part}\n`;
            index++;
        }
    }

    return outputString
}

function createList(stringParts) {
    let index = 0;

    function parseList() {
        const resultList = [];
    
        while (index < stringParts.length) {
            let part = stringParts[index];

            //ignore the separator while building the list
            if (part === ",") {
                index++;
                continue;
            }

            if (part === ")") {
                index++;
                break;
            }
    
    
            if (/[a-zA-Z][a-zA-Z0-9]*/.test(part)) {
                const listItem = part;
                index++;
    
                if (stringParts[index] === "(") {
                    // the parentheses needs to be skipped here, but we needed it to check for it in case the list item has children
                    index++;
                    const childItems = parseList(stringParts, index);
                    resultList.push({[listItem]: childItems});
                } else {
                    // if the item doesn't have child items, we just add them to the list. 
                    resultList.push(listItem);
                }
            }
    
            if (part === "(") {
                index++;
                continue;
            }
        }
        return resultList;
    }
    return parseList();
}

function sortList(resultArray, indent = 0) {
    let outputString = ``;

    // I don't fully understand this, I came up with this sorting solution by googling "Sorting nested js array alphabetically" and reading through results
    const sortedArray = resultArray.sort((a, b) => {
        const item1 = typeof a === "string" ? a : Object.keys(a)[0];
        const item2 = typeof b === "string" ? b : Object.keys(b)[0];
        return item1.localeCompare(item2);
    }) 

    for (const listItem of sortedArray) {
        if (typeof listItem === "string") {
            outputString += `${"  ".repeat(indent)}- ${listItem}\n`;
        } else {
            const itemKey = Object.keys(listItem)[0];
            outputString += `${"  ".repeat(indent)}- ${itemKey}\n`;
            outputString += sortList(listItem[itemKey], indent + 1);
        }
    }

    return outputString;
}