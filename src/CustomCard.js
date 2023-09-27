import React from 'react';
import { 
    Box,
    Card,
    CardMedia,
    CardContent,
    Typography,
} from '@mui/material';


const CustomCard = ( itemObject ) => {

    console.log(itemObject)

    return (
        <Box sx={{ maxWidth: 400 }}>
            <Card variant="outlined">
                <CardMedia
                    sx={{ height: 140 }}
                    image={itemObject.data.ImageUrl}
                    title={itemObject.data.Name}
                />
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        {itemObject.data.Name}
                    </Typography>
                    <Typography variant="body1">
                        Level: {itemObject.data.Level}<br/>
                        Max Price: {itemObject.data.MaxPrice}<br/>
                        Per Boat Crate: {itemObject.data.PerBoatCrate}<br/>
                        Source: {itemObject.data.Source}<br/>
                        Time: {itemObject.data.Time}<br/>
                        Xp: {itemObject.data.Xp}<br/>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}

export default CustomCard;