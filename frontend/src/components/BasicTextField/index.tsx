import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
interface IProps {
	onChange: React.Dispatch<React.SetStateAction<string>>;
	value: string;
}

export default function BasicTextField({ value, onChange }: IProps) {
	return (
		<Box
			component="form"
			sx={{
				"& > :not(style)": { m: 1, width: "25ch" },
			}}
			noValidate
			autoComplete="on"
		>
			<TextField
				id="outlined-basic"
				label="room - id"
				variant="outlined"
				value={value}
				onChange={(e) => {
					onChange(e.target.value);
				}}
			/>
		</Box>
	);
}
