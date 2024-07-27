import { Grid } from "@mui/material"
import { IMapData } from "../services/trackmaniaApi";

interface INewComponentProps {
  selectedMap?: IMapData;
}

function NewComponent({ selectedMap }: INewComponentProps) {




  if(!selectedMap) return null;

  return (
    <Grid container spacing={2} sx={{
      bgcolor: 'lightgrey',
      height: '400px',
      padding: '20px',
      paddingLeft: '50px',
      mt: 2
    }}>
      <Grid item sx={{
        bgcolor: 'lightblue',
        height: '350px',
        width: '350px',
        transform: 'skewX(-10deg)',
        border: '4px solid white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 20,
      }}>
        <img
            src={selectedMap.thumbnailUrl}
            alt="thumbnail"
            style={{
              width: "100%",
              // position: "relative",
            }}
          />
        </Grid>



    </Grid>
  )
}

export default NewComponent
