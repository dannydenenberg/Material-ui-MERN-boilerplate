import React from "react";
import Button from "@material-ui/core/Button";
import { TextField } from "@material-ui/core";

const HelloWorld = () => (
  <div>
    <p>Hello World</p>
    <Button
      variant="contained"
      color="primary"
      onClick={() => alert("Dude! 👩‍🎨 Audition")}
    >
      TryOut
    </Button>

    <br />
    <TextField id="standard-name" label="Name" margin="normal" />
    <br />
    <TextField
      id="outlined-name"
      label="Name"
      placeholder="Danny"
      margin="normal"
      onChange={event => console.log(event.target.value)}
      variant="outlined"
    />
  </div>
);

export default HelloWorld;
