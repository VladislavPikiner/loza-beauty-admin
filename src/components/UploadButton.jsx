import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

import { Close } from "@mui/icons-material";
import { Alert, FormControl, IconButton } from "@mui/material";
import axios from "../axios.js";
import { backendURL } from "./serviceConfig.js";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function UploadButton({
  prevImage = null,
  image = null,
  setImage = null,
}) {
  const [imageUrl, setImageUrl] = useState(prevImage);
  const [isImage, setIsImage] = useState(false);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const imageFile = event.target.files[0];
      formData.append("image", imageFile);
      const { data } = await axios.post("/uploads", formData);

      setImageUrl(data.url);
      setIsImage(true);
    } catch (error) {
      console.error(error);
      alert("Не удалось загрузить изображение:" + error);
    }
  };

  const deleteFile = async () => {
    await axios.delete("/uploads", {
      data: { imageUrl: "." + imageUrl },
    });
    setIsImage(false);
    setImageUrl("");
  };
  return (
    <>
      <img src={backendURL + imageUrl} width={"250px"} />
      <FormControl
        formEncType="multipart/form-data"
        sx={{
          display: "block",
          padding: "2px",
          marginBlock: "10px",
        }}
      >
        {isImage ? (
          <>
            <Alert severity="success">Фото завантажено успішно!</Alert>
            {!prevImage && (
              <IconButton color="error" size="small" onClick={deleteFile}>
                <Close sx={{ fontSize: "1rem" }} />
              </IconButton>
            )}
          </>
        ) : (
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            type="submit"
            sx={{ fontSize: "1rem" }}
          >
            завантажити фото
            <VisuallyHiddenInput type="file" onChange={handleChangeFile} />
          </Button>
        )}
      </FormControl>
    </>
  );
}
