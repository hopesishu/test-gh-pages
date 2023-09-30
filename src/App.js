import React, { useState } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
} from 'reactflow';
import { 
	TextField,
	Grid,
	Autocomplete,
	Typography
} from '@mui/material';

import 'reactflow/dist/style.css';
import CustomNode from "./CustomNode.js";
import CustomEdge from "./CustomEdge.js";
import CustomCard from "./CustomCard.js";
import CustomCardDetail from "./CustomCardDetail.js";
import * as Utils from "./utils.js"

const nodeTypes = { customNode: CustomNode };
const edgeTypes = { customEdge: CustomEdge };

const createNode = (list) => {
	let dynamicNodes = [];

	for (var i = 0; i < list.length; i++) {
		const nodeAttributes = {};

		var itemObject = list[i]; 
		var itemName = itemObject.Name;
		var itemTier = itemObject.Tier;
		var itemImageUrl = itemObject.ImageUrl;

		var numberOfItemsInTier = Utils.getNumberOfItemsInTier(list, itemTier);
		var itemSameTierIndex = itemObject.SameTierIndex;
		var positionX = itemSameTierIndex * (window.innerWidth / (numberOfItemsInTier + 1));
		var positionY = 100 + 200 * itemTier; 

		var isStartNode = itemTier === 0 ? true : false;
		var isEndNode = Utils.isCyclical(itemObject) ? true : false;

		nodeAttributes["id"] = itemName;
		nodeAttributes["type"] = "customNode";
		nodeAttributes["position"] = { x: positionX, y: positionY }; 
		nodeAttributes["data"] = {
			itemName: itemName,
			itemImageUrl: itemImageUrl, 
			startNode: isStartNode,
			endNode: isEndNode
		};

		dynamicNodes.push(nodeAttributes);
	}

	return dynamicNodes;
}

const createEdge = (list) => {
	let dynamicEdges = [];

	for (var i = 0; i < list.length; i++) {
		var itemObject = list[i];
		var sourceItem = itemObject.Name;
		var itemTime = itemObject.Time[0];
		var itemNeeds = itemObject.Needs;

		for (var j = 0; j < itemNeeds.length; j++) {
			var targetItem = itemNeeds[j];
			var id = "e" + sourceItem + "-" + targetItem;
			if (Utils.isCyclical(itemObject) || Utils.hasDuplicateId(dynamicEdges, id)) {
				continue;
			}

			const edgeAttributes = {};
			edgeAttributes["id"] = id;
			edgeAttributes["type"] = "customEdge";
			edgeAttributes["source"] = sourceItem;
			edgeAttributes["target"] = targetItem;
			edgeAttributes["data"] = {
				time: itemTime,
			};

			dynamicEdges.push(edgeAttributes);
		}
	}

	return dynamicEdges;
}


export default function App() {
	var tieredList = Utils.getTieredList("Fish_Burger");
	var dynamicNodes = createNode(tieredList);
	var dynamicEdges = createEdge(tieredList);

	const [nodes, setNodes, onNodesChange] = useNodesState(dynamicNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(dynamicEdges);
	const [cardItemObject, setCardItemObject] = useState(Utils.getItemObject(nodes[0].data.itemName));
	const [selectedOption, setSelectedOption] = useState({});
	const [itemsItCanBeBuiltInto, setItemsItCanBeBuiltInto] = useState([]);

	const handleNodeClick = (event) => {
		const itemName = event.target.alt;
		const itemObject = Utils.getItemObject(itemName);
		setCardItemObject(itemObject);
		setSelectedOption(itemObject);

		const listOfItemsItCanBeBuiltInto = Utils.getItemObjectsBuiltFrom(itemObject);
		setItemsItCanBeBuiltInto(listOfItemsItCanBeBuiltInto);
	}

	const handleAutocompleteOnChange = (event, value) => {
		setSelectedOption(value);

		if (event.key === "Enter" || event.type === "click") {
			var requestedItemObject = value;
			var requestItemName = value.Name;
			var listOfItemsItCanBeBuiltInto = Utils.getItemObjectsBuiltFrom(requestedItemObject);
			tieredList = Utils.getTieredList(requestItemName);
			if (tieredList) {
				dynamicNodes = createNode(tieredList);
				dynamicEdges = createEdge(tieredList);
				
				setNodes(dynamicNodes);
				setEdges(dynamicEdges);
				setCardItemObject(requestedItemObject);
				setItemsItCanBeBuiltInto(listOfItemsItCanBeBuiltInto);
			}
		}
	}

	const handleCardDetailOnClick = (itemObject) => {
		setSelectedOption(itemObject);

		var requestedItemObject = itemObject;
		var requestItemName = itemObject.Name;
		var listOfItemsItCanBeBuiltInto = Utils.getItemObjectsBuiltFrom(requestedItemObject);
		tieredList = Utils.getTieredList(requestItemName);
		if (tieredList) {
			dynamicNodes = createNode(tieredList);
			dynamicEdges = createEdge(tieredList);
			
			setNodes(dynamicNodes);
			setEdges(dynamicEdges);
			setCardItemObject(requestedItemObject);
			setItemsItCanBeBuiltInto(listOfItemsItCanBeBuiltInto);
		}
	}

  	return (
		<Grid container spacing={2}>
			<Grid item xs={12} md={8} style={{ height: "100vh" }}>
				<ReactFlow
					onNodeClick={handleNodeClick}
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					nodeTypes={nodeTypes}
					edgeTypes={edgeTypes}
					fitView
				>
					<Controls />
					<MiniMap />
					<Background variant="dots" gap={12} size={1} color={"grey"}/>
				</ReactFlow>
			</Grid>
			<Grid item xs={12} md={4} style={{ height: "100vh" }}>
				<Autocomplete
					style={{ maxWidth: 400 }}
					disableClearable
					fullWidth
					autoSelect
					autoHighlight
					blurOnSelect
					options={Utils.getAllItemObjects()}
					getOptionLabel={(option) => option.DisplayedName}
					onChange={handleAutocompleteOnChange}
					renderInput={(params) => (
						<TextField
							{...params}
							label="Search items"
							variant="outlined"
							size="medium"
							margin="normal"
						/>
					)}
				/>
				<CustomCard data={cardItemObject} />
				{ itemsItCanBeBuiltInto.length > 0 &&
					<Typography variant="body1">
						Items {selectedOption.DisplayedName.toLowerCase()} can be built into:
					</Typography> 
				}

				{itemsItCanBeBuiltInto.length > 0 && 
					itemsItCanBeBuiltInto.map((item, key) =>
					<CustomCardDetail key={key} data={item} onClick={() => { handleCardDetailOnClick(item) }}> 	
						{item.DisplayedName}
					</CustomCardDetail> 
				)}
			</Grid>
		</Grid>
	);
}