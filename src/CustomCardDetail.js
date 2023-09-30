import React from 'react';
import { 
    Box,
    Card,
    CardContent,
    CardActionArea,
    Typography,
} from '@mui/material';

const CustomCardDetail = ( props ) => {
    console.log(props)
    const itemObject = props.data;

    return (
        <Card variant="outlined" style={{ maxWidth: 250 }} onClick={props.onClick}>
            <CardActionArea style={{ padding: 4 }}>
                <Box sx={{ display: "flex", flexDirection: "row", maxWidth: 250 }}>
                    <img 
                        src={itemObject.ImageUrl}
                        alt={itemObject.Name}
                        height={40}
                        width={40}
                    />
                    <CardContent style={{ padding: 4, display: "flex", alignItems: "center" }}>
                        <Typography variant="body1">
                            {itemObject.DisplayedName}
                        </Typography>
                    </CardContent>
                </Box>
            </CardActionArea>
        </Card>
    );
}

export default CustomCardDetail;