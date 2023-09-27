import React, { useState } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
} from 'reactflow';
import { TextField } from '@mui/material';

import 'reactflow/dist/style.css';
import CustomNode from "./CustomNode.js";
import CustomEdge from "./CustomEdge.js";
import CustomCard from "./CustomCard.js";
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
	const [textVieldValue, setTextFieldValue] = useState(dynamicNodes[0].data.itemName);

	const handleKeyDown = (event) => {
        if (event.keyCode === 13) {
			var requestedItem = event.target.value.trim();
			var requestedItemObject = Utils.getItemObject(requestedItem);
			tieredList = Utils.getTieredList(requestedItem);
			if (tieredList) {
				dynamicNodes = createNode(tieredList);
				dynamicEdges = createEdge(tieredList);
				
				setNodes(dynamicNodes);
				setEdges(dynamicEdges);
				setCardItemObject(requestedItemObject);
			} else {
				console.log("There is no such item");
			}
        }
	}

	const handleNodeClick = (event) => {
		const itemName = event.target.alt;
		const itemObject = Utils.getItemObject(itemName);
		setCardItemObject(itemObject);
	}

	// const handleErrorTextFieldValue = (event) => {
	// 	const textFieldValue = event.target.value.trim();
	// 	if 
	// }

  	return (
		<div style={{display: "flex", flexDirection: "row"}}>
			<div style={{ width: "70vw", height: "100vh" }} >
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
			</div>
			<div style={{ width: "30vw", height: "100vh" }}>
				<TextField 
					variant="outlined"
					value={textVieldValue}
					size="small"
					margin="normal"
					onChange={(e) => setTextFieldValue(e.target.value)}
					onKeyDown={handleKeyDown}
				/>

				<CustomCard data={cardItemObject} />
			</div>
		</div>
	);
}