import { Handle, Position } from 'reactflow';

const CustomNode = ({ data }) => {

    return (
        <>
            <div>
                <img src={data.itemImageUrl} height={"100px"} alt={data.label} />
            </div>
            { !data.startNode ? 
                <Handle  
                    type="target" 
                    position={Position.Top} 
                    style={{backgroundColor: "#784be8"}} 
                    isConnectable={false}
                /> : null
            }
            {
                !data.endNode ? 
                <Handle 
                    type="source" 
                    position={Position.Bottom} 
                    style={{backgroundColor: "#784be8"}} 
                    isConnectable={false}
                /> : null
            }
        </>
    );
}

export default CustomNode;