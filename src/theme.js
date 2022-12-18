import { createTheme } from "@mui/material";
import "../src/index.scss";
export const theme = createTheme({
  typography: {
    fontFamily: `"Caveat", cursive`,
    fontSize: 18,
    fontWeightLight: 300,
    fontWeightRegular: 500,
    fontWeightBold: 700,
  },
  // components: {
  //   MuiCssBaseline: {
  //     styleOverrides: (themeParam) => `
  //         h1 {
  //           color: ${themeParam.palette.success.main};
  //         }
  //       `,
  //   },
  // },
});
