import jsonData from "./data.json";

export const getTieredList = (requestItemName) => {
	var tierNumber = 0;
	var listToIterate = [];
	var finalListWithTier = [];

	var requestItemObject = getItemObject(requestItemName); 
	if (requestItemObject) {
		requestItemObject.Tier = tierNumber;
		finalListWithTier.push(requestItemObject);
		listToIterate.push(requestItemObject);
	
		while (listToIterate.length !== 0) {
			var itemToInspect = listToIterate.shift();
			if (!isCyclical(itemToInspect)) {
				var itemNeedsList = itemToInspect.Needs;
				var nextTierNumber = itemToInspect.Tier + 1;
	
				for (var i = 0; i < itemNeedsList.length; i++) {
					var itemNeedsObject = getItemObject(itemNeedsList[i]);
					if (itemNeedsObject) {
						itemNeedsObject.Tier = nextTierNumber;
	
						finalListWithTier.push(itemNeedsObject);
						listToIterate.push(itemNeedsObject);
					}
				}
			}
		}

		return finalListWithTier;
	}

	return null;
}

export const getNumberOfItemsInTier = (list, tier) => {
	var numberOfItemsInTier = 0;
	for (var i = 0; i < list.length; i++) {
		var itemTier = list[i].Tier;
		if (itemTier === tier) {
			numberOfItemsInTier++;
			list[i].SameTierIndex = numberOfItemsInTier;
		}
	}
	return numberOfItemsInTier;
}

export const hasDuplicateId = (list, id) => {
    for (var i = 0; i < list.length; i++) {
		var itemId = list[i].id;
		if (id === itemId) {
			return true;
		}
	}
	return false;
}

export const getItemObject = (itemName) => {
	for (var data in jsonData) {
		if (jsonData[data].Name.toLowerCase() === itemName.toLowerCase()) {
			var itemObject = Object.assign({}, jsonData[data]);
			return itemObject;
		}
	}
	return null;
}

export const isCyclical = (itemObject) => {
	var itemName = itemObject.Name;
	var itemNeeds = itemObject.Needs;

	if ((itemNeeds.length === 1 && (itemNeeds[0] === itemName || itemNeeds[0] === "N/A"))
		|| itemNeeds.length === 0) {
		return true;
	}
	return false;
}